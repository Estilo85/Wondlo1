import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateCommunityUser } from '@/lib/community-api';

export const runtime = 'nodejs';

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
    if (!text || text.length > 5_000) {
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
    });
    const comments = await prisma.communityComment.count({ where: { postId } });

    return NextResponse.json(
      {
        comment: {
          id: comment.id,
          text: comment.text,
          author: authentication.user.name,
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
