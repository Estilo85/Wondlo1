import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
    }

    const user = await adminAuth.getUserByEmail(email);
    await adminAuth.updateUser(user.uid, { password: newPassword });

    return NextResponse.json({ message: 'Password updated successfully.' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update password.' }, { status: 500 });
  }
}