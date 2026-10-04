import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateCommunityUser } from '@/lib/community-api';
import { createCommunityNotification } from '@/lib/community-notifications';

export const runtime = 'nodejs';

const MAX_COMMENT_LENGTH = 5_000;

function readCommentText(body: Record<string, unknown>) {
  const text = typeof body.text === 'string' ? body.text.trim() : '';

  if (!text || text.length > MAX_COMMENT_LENGTH) {
    return null;
  }

  return text;
}

function toCommentResponse(
  comment: {
    id: string;
    text: string;
    createdAt: Date;
    editedAt: Date | null;
    userId: string;
    user: { id: string; name: string; avatarUrl: string | null };
  },
  viewerId: string
) {
  return {
    id: comment.id,
    text: comment.text,
    author: comment.user.name,
    authorId: comment.user.id,
    authorAvatarUrl: comment.user.avatarUrl,
    ownedByMe: comment.userId === viewerId,
    createdAt: comment.createdAt.toISOString(),
    editedAt: comment.editedAt?.toISOString() ?? null,
  };
}

const commentInclude = {
  user: { select: { id: true, name: true, avatarUrl: true } },
} as const;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const authentication = await authenticateCommunityUser(request);
  if (!authentication.user) return authentication.response;

  try {
    const { postId } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    const text = readCommentText(body);
    const parentId = typeof body.parentId === 'string' ? body.parentId : '';

    if (text === null) {
      return NextResponse.json(
        { error: 'Enter a comment up to 5,000 characters.' },
        { status: 400 }
      );
    }

    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
      select: { id: true, title: true, userId: true },
    });
    if (!post) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

    let parentComment:
      | { id: string; userId: string; parentId: string | null; postId: string }
      | null = null;

    if (parentId) {
      parentComment = await prisma.communityComment.findUnique({
        where: { id: parentId },
        select: { id: true, userId: true, parentId: true, postId: true },
      });

      if (!parentComment || parentComment.postId !== postId) {
        return NextResponse.json(
          { error: 'That comment could not be found.' },
          { status: 404 }
        );
      }

      /*
       * Threads stay two levels deep. Replying to a reply attaches to the root
       * of that thread instead of opening a third level, so every reply always
       * has somewhere to hang and a parent is never left orphaned.
       */
      if (parentComment.parentId) {
        parentComment = await prisma.communityComment.findUnique({
          where: { id: parentComment.parentId },
          select: { id: true, userId: true, parentId: true, postId: true },
        });
      }
    }

    const comment = await prisma.communityComment.create({
      data: {
        postId,
        userId: authentication.user.id,
        text,
        parentId: parentComment?.id ?? null,
      },
      include: commentInclude,
    });

    const comments = await prisma.communityComment.count({ where: { postId } });

    /*
     * A reply goes to whoever wrote the comment being answered, otherwise the
     * post author hears about it. Neither is told about their own comment.
     */
    const recipientId = parentComment?.userId ?? post.userId;

    if (recipientId !== authentication.user.id) {
      await createCommunityNotification({
        userId: recipientId,
        type: parentComment ? 'comment_reply' : 'comment_on_post',
        message: parentComment
          ? 'replied to a comment on your post.'
          : `commented on your post "${post.title}".`,
        postId,
        commentId: comment.id,
      });
    }

    return NextResponse.json(
      {
        comment: toCommentResponse(comment, authentication.user.id),
        parentId: parentComment?.id ?? null,
        comments,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Community comment error:', error);
    return NextResponse.json(
      { error: 'Unable to post your comment.' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const authentication = await authenticateCommunityUser(request);
  if (!authentication.user) return authentication.response;

  try {
    const { postId } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    const commentId = typeof body.commentId === 'string' ? body.commentId : '';
    const text = readCommentText(body);

    if (!commentId) {
      return NextResponse.json({ error: 'Comment not found.' }, { status: 400 });
    }

    if (text === null) {
      return NextResponse.json(
        { error: 'Enter a comment up to 5,000 characters.' },
        { status: 400 }
      );
    }

    /*
     * Scoping the update to the author means someone cannot edit a comment
     * they do not own by guessing its id. editedAt is what the UI shows as an
     * "edited" badge, so it is written on every successful save.
     */
    const result = await prisma.communityComment.updateMany({
      where: { id: commentId, postId, userId: authentication.user.id },
      data: { text, editedAt: new Date() },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: 'Comment not found.' }, { status: 404 });
    }

    const comment = await prisma.communityComment.findUnique({
      where: { id: commentId },
      include: commentInclude,
    });

    return NextResponse.json({
      comment: comment
        ? toCommentResponse(comment, authentication.user.id)
        : null,
    });
  } catch (error) {
    console.error('Community comment update error:', error);
    return NextResponse.json(
      { error: 'Unable to update your comment.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const authentication = await authenticateCommunityUser(request);
  if (!authentication.user) return authentication.response;

  try {
    const { postId } = await params;
    const body = (await request.json()) as { commentId?: unknown };
    const commentId = typeof body.commentId === 'string' ? body.commentId : '';

    if (!commentId) {
      return NextResponse.json({ error: 'Comment not found.' }, { status: 400 });
    }

    /*
     * Deleting a top level comment takes its replies with it through the
     * onDelete cascade on parentId, which is why no reply count is subtracted
     * by hand here.
     */
    const result = await prisma.communityComment.deleteMany({
      where: { id: commentId, postId, userId: authentication.user.id },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: 'Comment not found.' }, { status: 404 });
    }

    const comments = await prisma.communityComment.count({ where: { postId } });

    return NextResponse.json({ success: true, comments });
  } catch (error) {
    console.error('Community comment deletion error:', error);
    return NextResponse.json(
      { error: 'Unable to delete your comment.' },
      { status: 500 }
    );
  }
}