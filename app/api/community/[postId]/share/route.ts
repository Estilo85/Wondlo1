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

    const post = await prisma.communityPost.update({
      where: { id: postId },
      data: { shareCount: { increment: 1 } },
      select: { shareCount: true },
    });

    return NextResponse.json({ shares: post.shareCount });
  } catch (error) {
    const code = (error as { code?: string })?.code;

    if (code === 'P2025') {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

    console.error('Community share error:', error);
    return NextResponse.json(
      { error: 'Unable to record this share.' },
      { status: 500 }
    );
  }
}
