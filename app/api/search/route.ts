import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { adminAuth } from '@/lib/firebase-admin';
import { generateMockAnalysis } from '@/lib/mock-analysis';
import { FREE_TRIAL_SEARCHES, isPaidPlan, type BillingUser } from '@/lib/billing';

export const runtime = 'nodejs';

async function getUser(token: string) {
  const decoded = await adminAuth.verifyIdToken(token);
  return prisma.user.findUnique({
    where: { firebaseId: decoded.uid },
  });
}

function usageForUser(user: BillingUser) {
  const paid = isPaidPlan(user.plan);
  const allowance = paid ? user.searchAllowance : FREE_TRIAL_SEARCHES;
  const used = paid ? user.searchAllowanceUsed : user.freeSearchesUsed;
  return { paid, allowance, used, left: Math.max(0, allowance - used), limited: used >= allowance };
}

function responseForUser(user: BillingUser & { name: string }) {
  const { paid, allowance, used, left, limited } = usageForUser(user);
  return {
    name: user.name,
    plan: user.plan,
    searchAllowance: allowance,
    searchAllowanceUsed: paid ? used : user.freeSearchesUsed,
    renewalAt: user.cycleEndsAt ?? null,
    freeSearchesUsed: used,
    freeSearchesLeft: left,
    limited,
  };
}

export async function GET(req: Request) {
  try {
    const token = new URL(req.url).searchParams.get('token');
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const user = await getUser(token);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const searches = await prisma.search.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: FREE_TRIAL_SEARCHES,
    });

    return NextResponse.json({
      ...responseForUser(user),
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

    const queryKey = normalizedQuery.toLowerCase();
    const existing = await prisma.search.findUnique({
      where: { userId_queryKey: { userId: user.id, queryKey } },
    });
    if (existing) {
      return NextResponse.json({
        ...responseForUser(user),
        created: false,
        search: { id: existing.id, query: existing.query, analysis: existing.analysis },
      });
    }

    const usage = usageForUser(user);
    if (usage.limited) {
      const message = usage.paid
        ? 'Your search allowance for this plan is used up. Add more searches to analyse another adventure.'
        : 'Free search limit reached';
      return NextResponse.json(
        { ...responseForUser(user), error: message },
        { status: 403 }
      );
    }

    const analysis = generateMockAnalysis(normalizedQuery);
    const result = await prisma.$transaction(async (transaction) => {
      if (usage.paid) {
        const updatedUser = await transaction.user.update({
          where: { id: user.id },
          data: { searchAllowanceUsed: { increment: 1 } },
          select: { name: true, plan: true, searchAllowance: true, searchAllowanceUsed: true, freeSearchesUsed: true, cycleEndsAt: true },
        });
        const search = await transaction.search.create({
          data: {
            userId: user.id,
            query: normalizedQuery,
            queryKey,
            analysis: JSON.parse(JSON.stringify(analysis)),
          },
        });
        return { search, updatedProfile: updatedUser };
      }

      const updatedUser = await transaction.user.updateMany({
        where: { id: user.id },
        data: { freeSearchesUsed: usage.used + 1 },
      });
      if (updatedUser.count !== 1) throw new Error('Free search limit reached');

      const search = await transaction.search.create({
        data: {
          userId: user.id,
          query: normalizedQuery,
          queryKey,
          analysis: JSON.parse(JSON.stringify(analysis)),
        },
      });
      const freshProfile = await transaction.user.findUniqueOrThrow({
        where: { id: user.id },
        select: { name: true, plan: true, searchAllowance: true, searchAllowanceUsed: true, freeSearchesUsed: true, cycleEndsAt: true },
      });
      return { search, updatedProfile: freshProfile };
    });

    return NextResponse.json({
      ...responseForUser(result.updatedProfile),
      created: true,
      search: { id: result.search.id, query: result.search.query, analysis: result.search.analysis },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create search';
    if (message === 'Free search limit reached') {
      return NextResponse.json({ error: message, freeSearchesLeft: 0, limited: true }, { status: 403 });
    }
    console.error('Search creation error:', error);
    return NextResponse.json({ error: 'Unable to create search' }, { status: 500 });
  }
}