import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

/**
 * Feeds the three stat cards on the community page. These were hardcoded
 * strings before, so the numbers could drift from reality indefinitely.
 *
 * Public and uncached on purpose: the counts are cheap, aggregate queries and
 * a stale figure is worse than a slightly slower one.
 */
export async function GET() {
  try {
    const [members, posts, activeWarnings] = await Promise.all([
      prisma.user.count(),
      prisma.communityPost.count(),
      prisma.communityPost.count({
        where: { category: 'Safety Warning', resolvedAt: null },
      }),
    ]);

    return NextResponse.json({ members, posts, activeWarnings });
  } catch (error) {
    console.error('Community stats error:', error);
    return NextResponse.json(
      { error: 'Unable to load community stats.' },
      { status: 500 }
    );
  }
}