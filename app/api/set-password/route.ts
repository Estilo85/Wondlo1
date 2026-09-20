import { NextResponse } from 'next/server';
import { updateFirebasePassword } from '@/lib/firebase-admin';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // Update the password in Firebase Auth via REST API
    await updateFirebasePassword(email, password);

    return NextResponse.json({ success: true, message: 'Password successfully updated.' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Set password error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}