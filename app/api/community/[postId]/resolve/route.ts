import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  authenticateCommunityAdmin,
  authenticateCommunityUser,
} from '@/lib/community-api';

export const runtime = 'nodejs';

/*
 * A Safety Warning goes out of date: the trail reopens, the operator changes,
 * the hazard is gone. Marking it resolved says so without deleting the post, so
 * the thread that led to it stays readable. Only the author of the post can do
 * this, and only on a Safety Warning, because a resolved trip report would be
 * meaningless.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const authentication = await authenticateCommunityUser(request);
  if (!authentication.user) return authentication.response;

  try {
    const { postId } = await params;
    const body = (await request.json()) as Record<string, unknown>;

    if (typeof body.resolved !== 'boolean') {
      return NextResponse.json(
        { error: 'Choose whether this warning is resolved.' },
        { status: 400 }
      );
    }

    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
      select: { id: true, userId: true, category: true },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

    if (post.userId !== authentication.user.id) {
      return NextResponse.json(
        { error: 'Only the author can update this warning.' },
        { status: 403 }
      );
    }

    if (post.category !== 'Safety Warning') {
      return NextResponse.json(
        { error: 'Only a safety warning can be marked resolved.' },
        { status: 400 }
      );
    }

    const updated = await prisma.communityPost.update({
      where: { id: postId },
      data: { resolvedAt: body.resolved ? new Date() : null },
      select: { resolvedAt: true },
    });

    return NextResponse.json({ resolved: Boolean(updated.resolvedAt) });
  } catch (error) {
    console.error('Community warning resolve error:', error);
    return NextResponse.json(
      { error: 'Unable to update this warning.' },
      { status: 500 }
    );
  }
}

/*
 * Moderators can resolve a warning on the author's behalf, which is how a
 * warning from an account that has since been suspended still gets closed off.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const authentication = await authenticateCommunityAdmin(request);
  if (!authentication.user) {
    return authentication.response as NextResponse;
  }

  try {
    const { postId } = await params;
    const body = (await request.json()) as Record<string, unknown>;

    if (typeof body.resolved !== 'boolean') {
      return NextResponse.json(
        { error: 'Choose whether this warning is resolved.' },
        { status: 400 }
      );
    }

    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
      select: { id: true, category: true },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

    if (post.category !== 'Safety Warning') {
      return NextResponse.json(
        { error: 'Only a safety warning can be marked resolved.' },
        { status: 400 }
      );
    }

    await prisma.communityPost.update({
      where: { id: postId },
      data: { resolvedAt: body.resolved ? new Date() : null },
    });

    return NextResponse.json({ resolved: body.resolved });
  } catch (error) {
    console.error('Community warning moderation error:', error);
    return NextResponse.json(
      { error: 'Unable to update this warning.' },
      { status: 500 }
    );
  }
}