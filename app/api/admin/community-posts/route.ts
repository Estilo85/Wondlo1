import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateCommunityAdmin } from '@/lib/community-api';

export const runtime = 'nodejs';

const MODERATION_FIELDS = ['pinned', 'verified'] as const;

/**
 * Lists recent posts so a moderator can pin the ones that matter and verify the
 * warnings that check out. Verification is the part that carries weight: it is
 * what tells a reader that somebody has looked at a safety claim, so it is
 * moderator only and never settable by an author through the community API.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const authentication = await authenticateCommunityAdmin(request);
  if (!authentication.user) {
    return authentication.response as NextResponse;
  }

  try {
    const category = new URL(request.url).searchParams.get('category');
    const take = 50;

    const posts = await prisma.communityPost.findMany({
      where:
        category === 'Trip Experience' || category === 'Safety Warning'
          ? { category }
          : {},
      orderBy: [{ pinnedAt: 'desc' }, { createdAt: 'desc' }],
      take,
      select: {
        id: true,
        title: true,
        body: true,
        category: true,
        country: true,
        activity: true,
        tags: true,
        pinnedAt: true,
        verifiedAt: true,
        resolvedAt: true,
        createdAt: true,
        user: { select: { id: true, name: true } },
        _count: { select: { likes: true, comments: true, reports: true } },
      },
    });

    return NextResponse.json({
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
        excerpt: post.body.slice(0, 240),
        category: post.category,
        country: post.country,
        activity: post.activity,
        tags: post.tags,
        pinned: Boolean(post.pinnedAt),
        verified: Boolean(post.verifiedAt),
        resolved: Boolean(post.resolvedAt),
        createdAt: post.createdAt.toISOString(),
        author: post.user.name,
        authorId: post.user.id,
        likes: post._count.likes,
        comments: post._count.comments,
        reports: post._count.reports,
      })),
    });
  } catch (error) {
    console.error('Community moderation list error:', error);
    return NextResponse.json(
      { error: 'Unable to load posts for moderation.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request): Promise<NextResponse> {
  const authentication = await authenticateCommunityAdmin(request);
  if (!authentication.user) {
    return authentication.response as NextResponse;
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const id = typeof body.id === 'string' ? body.id : '';

    if (!id) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 400 });
    }

    const data: { pinnedAt?: Date | null; verifiedAt?: Date | null } = {};

    /*
     * Only the two toggles a moderator owns are writable here. resolvedAt is
     * set by the post's own author through /api/community/[postId]/resolve, so
     * that "this warning is out of date" is never decided by a third party.
     */
    for (const field of MODERATION_FIELDS) {
      if (typeof body[field] !== 'boolean') {
        continue;
      }

      data[field === 'pinned' ? 'pinnedAt' : 'verifiedAt'] = body[field]
        ? new Date()
        : null;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: 'Choose something to change on this post.' },
        { status: 400 }
      );
    }

    const post = await prisma.communityPost.findUnique({
      where: { id },
      select: { id: true, category: true },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

    if (data.verifiedAt !== undefined && post.category !== 'Safety Warning') {
      return NextResponse.json(
        { error: 'Only a safety warning can be verified.' },
        { status: 400 }
      );
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: 'Choose something to change on this post.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Community moderation update error:', error);
    return NextResponse.json(
      { error: 'Unable to update this post.' },
      { status: 500 }
    );
  }
}