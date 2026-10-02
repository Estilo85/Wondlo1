import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

/**
 * Public profile behind the author names on posts and comments. Everything it
 * returns is already visible elsewhere in the community, so no email address,
 * plan or billing field is exposed.
 *
 * Deliberately unauthenticated: a profile is a shared page, and requiring a
 * sign in to read one would only discourage people from checking who wrote a
 * warning.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
        suspendedUntil: true,
        _count: { select: { communityPosts: true, communityComments: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Member not found.' }, { status: 404 });
    }

    const posts = await prisma.communityPost.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        title: true,
        body: true,
        category: true,
        country: true,
        activity: true,
        tags: true,
        createdAt: true,
        resolvedAt: true,
        _count: { select: { likes: true, comments: true } },
      },
    });

    return NextResponse.json({
      member: {
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        joinedAt: user.createdAt.toISOString(),
        /*
         * A suspension is public information: it explains why an account's
         * content stopped appearing, and it is only exposed as a boolean.
         */
        suspended: Boolean(user.suspendedUntil && user.suspendedUntil > new Date()),
        posts: user._count.communityPosts,
        comments: user._count.communityComments,
      },
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
        excerpt: post.body.slice(0, 220),
        category: post.category,
        country: post.country,
        activity: post.activity,
        tags: post.tags,
        likes: post._count.likes,
        comments: post._count.comments,
        resolved: Boolean(post.resolvedAt),
        createdAt: post.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Community profile error:', error);
    return NextResponse.json(
      { error: 'Unable to load this profile.' },
      { status: 500 }
    );
  }
}