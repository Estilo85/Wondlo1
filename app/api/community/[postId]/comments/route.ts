import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateCommunityUser } from '@/lib/community-api';

export const runtime = 'nodejs';

const MAX_COMMENT_LENGTH = 5_000;

function readCommentText(body: Record<string, unknown>) {
  const text = typeof body.text === 'string' ? body.text.trim() : '';

  if (!text || text.length > MAX_COMMENT_LENGTH) {
    return null;
  }

  return text;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const authentication = await authenticateCommunityUser(request);
  if (!authentication.user) return authentication.response;

  try {
    const { postId } = await params;
    const body = (await request.json()) as { text?: unknown };
    const text = typeof body.text === 'string' ? body.text.trim() : '';
    if (!text || text.length > MAX_COMMENT_LENGTH) {
      return NextResponse.json(
        { error: 'Enter a comment up to 5,000 characters.' },
        { status: 400 }
      );
    }

    const postExists = await prisma.communityPost.findUnique({
      where: { id: postId },
      select: { id: true },
    });
    if (!postExists) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

    const comment = await prisma.communityComment.create({
      data: {
        postId,
        userId: authentication.user.id,
        text,
      },
      include: { user: { select: { name: true, avatarUrl: true } } },
    });
    const comments = await prisma.communityComment.count({ where: { postId } });

    return NextResponse.json(
      {
        comment: {
          id: comment.id,
          text: comment.text,
          author: comment.user.name,
          authorAvatarUrl: comment.user.avatarUrl,
        },
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
     * they do not own by guessing its id.
     */
    const result = await prisma.communityComment.updateMany({
      where: { id: commentId, postId, userId: authentication.user.id },
      data: { text },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: 'Comment not found.' }, { status: 404 });
    }

    const comment = await prisma.communityComment.findUnique({
      where: { id: commentId },
      include: { user: { select: { name: true, avatarUrl: true } } },
    });

    return NextResponse.json({
      comment: comment
        ? {
            id: comment.id,
            text: comment.text,
            author: comment.user.name,
            authorAvatarUrl: comment.user.avatarUrl,
            ownedByMe: true,
          }
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
