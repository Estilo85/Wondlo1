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
    const body = (await request.json()) as { liked?: unknown };
    if (typeof body.liked !== 'boolean') {
      return NextResponse.json({ error: 'Invalid like action.' }, { status: 400 });
    }

    const postExists = await prisma.communityPost.findUnique({
      where: { id: postId },
      select: { id: true },
    });
    if (!postExists) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

    if (body.liked) {
      await prisma.communityLike.upsert({
        where: {
          postId_userId: { postId, userId: authentication.user.id },
        },
        create: { postId, userId: authentication.user.id },
        update: {},
      });
    } else {
      await prisma.communityLike.deleteMany({
        where: { postId, userId: authentication.user.id },
      });
    }

    const likes = await prisma.communityLike.count({ where: { postId } });
    return NextResponse.json({ liked: body.liked, likes });
  } catch (error) {
    console.error('Community like error:', error);
    return NextResponse.json(
      { error: 'Unable to update this like.' },
      { status: 500 }
    );
  }
}
