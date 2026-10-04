import { NextResponse } from 'next/server';
import { authenticateRequestUser } from '@/lib/api-auth';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

const MAX_AVATAR_LENGTH = 400_000;
const ALLOWED_PREFIX = /^data:image\/(png|jpeg|jpg|webp);base64,/;

function sanitizeAvatar(value: unknown): string | null | undefined {
  if (value === null) {
    return null;
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return null;
  }

  if (!ALLOWED_PREFIX.test(trimmed)) {
    throw new Error('Please choose a PNG, JPEG or WebP image.');
  }

  if (trimmed.length > MAX_AVATAR_LENGTH) {
    throw new Error('That image is too large. Please choose a smaller one.');
  }

  return trimmed;
}

export async function GET(request: Request) {
  const firebaseId = new URL(request.url).searchParams.get('uid');
  if (firebaseId) {
    if (!/^[A-Za-z0-9_-]{1,128}$/.test(firebaseId)) {
      return NextResponse.json({ error: 'Invalid user.' }, { status: 400 });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { firebaseId },
        select: { avatarUrl: true },
      });
      return NextResponse.json({ avatarUrl: user?.avatarUrl ?? null });
    } catch (error) {
      console.error('Public avatar loading error:', error);
      return NextResponse.json(
        { error: 'Unable to load profile picture.' },
        { status: 500 }
      );
    }
  }

  const authentication = await authenticateRequestUser(request);
  if (!authentication.user) return authentication.response;

  return NextResponse.json({ avatarUrl: authentication.user.avatarUrl });
}

export async function POST(request: Request) {
  const authentication = await authenticateRequestUser(request);
  if (!authentication.user) return authentication.response;

  let avatarUrl: string | null;

  try {
    const body = (await request.json()) as { avatarUrl?: unknown };
    const sanitized = sanitizeAvatar(body.avatarUrl);

    if (sanitized === undefined) {
      return NextResponse.json({ error: 'Invalid image.' }, { status: 400 });
    }

    avatarUrl = sanitized;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid image.';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    const updated = await prisma.user.update({
      where: { id: authentication.user.id },
      data: { avatarUrl },
      select: { avatarUrl: true },
    });

    return NextResponse.json({ avatarUrl: updated.avatarUrl });
  } catch (error) {
    console.error('Avatar update error:', error);
    return NextResponse.json(
      { error: 'Unable to save your profile picture.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const authentication = await authenticateRequestUser(request);
  if (!authentication.user) return authentication.response;

  try {
    await prisma.user.update({
      where: { id: authentication.user.id },
      data: { avatarUrl: null },
    });

    return NextResponse.json({ avatarUrl: null });
  } catch (error) {
    console.error('Avatar removal error:', error);
    return NextResponse.json(
      { error: 'Unable to remove your profile picture.' },
      { status: 500 }
    );
  }
}
