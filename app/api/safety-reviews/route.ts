import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateCommunityUser } from '@/lib/community-api';

export const runtime = 'nodejs';

const ANSWER_KEYS = [
  'operatorAssessment',
  'adventurePreparation',
  'riskAwareness',
  'safetyQuestions',
  'realWorldAccuracy',
] as const;

function isScore(value: unknown): value is number {
  return Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 5;
}

export async function GET() {
  try {
    const reviews = await prisma.safetyReview.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
      include: {
        user: { select: { name: true, avatarUrl: true } },
      },
    });

    return NextResponse.json({
      reviews: reviews.map((review) => ({
        id: review.id,
        quote: review.experience,
        improvement: review.improvement,
        operatorName: review.operatorName,
        activity: review.activity,
        name: review.user.name,
        location: review.country,
        avatar: review.user.avatarUrl,
        createdAt: review.createdAt.toISOString(),
        answers: {
          operatorAssessment: review.operatorAssessment,
          adventurePreparation: review.adventurePreparation,
          riskAwareness: review.riskAwareness,
          safetyQuestions: review.safetyQuestions,
          realWorldAccuracy: review.realWorldAccuracy,
        },
        rating: Math.round(
          (review.operatorAssessment +
            review.adventurePreparation +
            review.riskAwareness +
            review.safetyQuestions +
            review.realWorldAccuracy) /
            ANSWER_KEYS.length
        ),
      })),
    });
  } catch (error) {
    console.error('Safety review loading error:', error);
    return NextResponse.json(
      { error: 'Unable to load safety reviews.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authentication = await authenticateCommunityUser(request);
  if (!authentication.user) return authentication.response;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const operatorName =
      typeof body.operatorName === 'string' ? body.operatorName.trim() : '';
    const country = typeof body.country === 'string' ? body.country.trim() : '';
    const activity =
      typeof body.activity === 'string' ? body.activity.trim() : '';
    const experience =
      typeof body.experience === 'string' ? body.experience.trim() : '';
    const improvement =
      typeof body.improvement === 'string' ? body.improvement.trim() : '';
    const answers = body.answers;

    if (
      !operatorName || operatorName.length > 120 ||
      !country || country.length > 100 ||
      !activity || activity.length > 100 ||
      experience.length < 20 || experience.length > 1500 ||
      improvement.length > 1200 ||
      !answers || typeof answers !== 'object' || Array.isArray(answers) ||
      !ANSWER_KEYS.every((key) => isScore((answers as Record<string, unknown>)[key]))
    ) {
      return NextResponse.json(
        { error: 'Complete the required safety review fields and try again.' },
        { status: 400 }
      );
    }

    const scores = answers as Record<(typeof ANSWER_KEYS)[number], number>;
    const review = await prisma.safetyReview.create({
      data: {
        userId: authentication.user.id,
        operatorName,
        country,
        activity,
        operatorAssessment: scores.operatorAssessment,
        adventurePreparation: scores.adventurePreparation,
        riskAwareness: scores.riskAwareness,
        safetyQuestions: scores.safetyQuestions,
        realWorldAccuracy: scores.realWorldAccuracy,
        experience,
        improvement: improvement || null,
      },
      select: { id: true },
    });

    return NextResponse.json({ id: review.id }, { status: 201 });
  } catch (error) {
    console.error('Safety review submission error:', error);
    return NextResponse.json(
      { error: 'Unable to submit your safety review.' },
      { status: 500 }
    );
  }
}