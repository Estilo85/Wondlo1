import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  authenticateCommunityUser,
  getOptionalCommunityUserId,
} from '@/lib/community-api';
import { parseSafetyReview } from '@/lib/safety-reviews';

export const runtime = 'nodejs';
const ANSWER_KEYS = [
  'operatorAssessment',
  'adventurePreparation',
  'riskAwareness',
  'safetyQuestions',
  'realWorldAccuracy',
] as const;

export async function GET(request: Request) {
  try {
    const viewerId = await getOptionalCommunityUserId(request);
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
        isOwner: viewerId === review.userId,
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
    const reviewData = parseSafetyReview(await request.json());
    if (!reviewData) {
      return NextResponse.json(
        { error: 'Complete the required safety review fields and try again.' },
        { status: 400 }
      );
    }

    const review = await prisma.safetyReview.create({
      data: {
        userId: authentication.user.id,
        ...reviewData,
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