import { NextResponse } from 'next/server';
import { authenticateRequestUser } from '@/lib/api-auth';
import { prisma } from '@/lib/db';
import { parseSafetyReview } from '@/lib/safety-reviews';

export const runtime = 'nodejs';

type RouteContext = { params: Promise<{ reviewId: string }> };

export async function PUT(request: Request, { params }: RouteContext) {
  const authentication = await authenticateRequestUser(request);
  if (!authentication.user) return authentication.response;

  const reviewData = parseSafetyReview(await request.json().catch(() => null));
  if (!reviewData) {
    return NextResponse.json(
      { error: 'Complete the required safety review fields and try again.' },
      { status: 400 }
    );
  }

  try {
    const { reviewId } = await params;
    const result = await prisma.safetyReview.updateMany({
      where: { id: reviewId, userId: authentication.user.id },
      data: reviewData,
    });

    if (result.count === 0) {
      return NextResponse.json({ error: 'Safety review not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Safety review update error:', error);
    return NextResponse.json(
      { error: 'Unable to update your safety review.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const authentication = await authenticateRequestUser(request);
  if (!authentication.user) return authentication.response;

  try {
    const { reviewId } = await params;
    const result = await prisma.safetyReview.deleteMany({
      where: { id: reviewId, userId: authentication.user.id },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: 'Safety review not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Safety review deletion error:', error);
    return NextResponse.json(
      { error: 'Unable to delete your safety review.' },
      { status: 500 }
    );
  }
}
