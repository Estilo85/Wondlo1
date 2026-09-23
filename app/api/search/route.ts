import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { adminAuth } from '@/lib/firebase-admin';
import { generateMockAnalysis } from '@/lib/mock-analysis';

export const runtime = 'nodejs';

const FREE_SEARCH_LIMIT = 3;
const PAID_SEARCH_LIMIT = 7;

function monthStart() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

async function clearPreviousMonthSearches(userId: string) {
  await prisma.search.deleteMany({
    where: {
      userId,
      createdAt: { lt: monthStart() },
    },
  });
}

async function getUser(token: string) {
  const decoded = await adminAuth.verifyIdToken(token);
  return prisma.user.findUnique({
    where: { firebaseId: decoded.uid },
  });
}

function responseForUser(
  user: { name: string; isPaid: boolean },
  searchesUsed: number
) {
  const searchLimit = user.isPaid ? PAID_SEARCH_LIMIT : FREE_SEARCH_LIMIT;

  return {
    name: user.name,
    isPaid: user.isPaid,
    searchesUsed,
    searchesLeft: Math.max(0, searchLimit - searchesUsed),
    freeSearchesUsed: searchesUsed,
    freeSearchesLeft: Math.max(0, FREE_SEARCH_LIMIT - searchesUsed),
    paidSearchesLeft: Math.max(0, PAID_SEARCH_LIMIT - searchesUsed),
    limited: searchesUsed >= searchLimit,
  };
}

export async function GET(req: Request) {
  try {
    const token = new URL(req.url).searchParams.get('token');
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const user = await getUser(token);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    await clearPreviousMonthSearches(user.id);

    const searches = await prisma.search.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: user.isPaid ? PAID_SEARCH_LIMIT : FREE_SEARCH_LIMIT,
    });
    const searchesUsed = searches.length;

    return NextResponse.json({
      ...responseForUser(user, searchesUsed),
      searches: searches.map((search) => ({
        id: search.id,
        query: search.query,
        analysis: search.analysis,
        createdAt: search.createdAt,
      })),
    });
  } catch (error) {
    console.error('Search history error:', error);
    return NextResponse.json({ error: 'Unable to load search history' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { token, query } = await req.json();
    const normalizedQuery = typeof query === 'string' ? query.trim() : '';
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    if (!normalizedQuery) return NextResponse.json({ error: 'Search query is required' }, { status: 400 });

    const user = await getUser(token);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    await clearPreviousMonthSearches(user.id);

    const queryKey = normalizedQuery.toLowerCase();
    const existing = await prisma.search.findUnique({
      where: { userId_queryKey: { userId: user.id, queryKey } },
    });
    if (existing) {
      const searchesUsed = await prisma.search.count({ where: { userId: user.id } });
      return NextResponse.json({
        ...responseForUser(user, searchesUsed),
        created: false,
        search: { id: existing.id, query: existing.query, analysis: existing.analysis },
      });
    }

    const searchesUsed = await prisma.search.count({ where: { userId: user.id } });
    const searchLimit = user.isPaid ? PAID_SEARCH_LIMIT : FREE_SEARCH_LIMIT;
    if (searchesUsed >= searchLimit) {
      return NextResponse.json({ ...responseForUser(user, searchesUsed), error: 'Search limit reached' }, { status: 403 });
    }

    const analysis = generateMockAnalysis(normalizedQuery);
    const result = await prisma.$transaction(async (transaction) => {
      const updatedUser = await transaction.user.updateMany({
        where: { id: user.id },
        data: { freeSearchesUsed: searchesUsed + 1 },
      });
      if (updatedUser.count !== 1) throw new Error('Search limit reached');

      const search = await transaction.search.create({
        data: {
          userId: user.id,
          query: normalizedQuery,
          queryKey,
          analysis: JSON.parse(JSON.stringify(analysis)),
        },
      });
      const updatedProfile = await transaction.user.findUniqueOrThrow({ where: { id: user.id } });
      return { search, updatedProfile };
    });

    return NextResponse.json({
      ...responseForUser(result.updatedProfile, searchesUsed + 1),
      created: true,
      search: { id: result.search.id, query: result.search.query, analysis: result.search.analysis },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create search';
    if (message === 'Search limit reached') {
      return NextResponse.json({ error: message, freeSearchesLeft: 0, limited: true }, { status: 403 });
    }
    console.error('Search creation error:', error);
    return NextResponse.json({ error: 'Unable to create search' }, { status: 500 });
  }
}