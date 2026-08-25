import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminAuth } from '@/lib/firebase-admin';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists.' }, { status: 400 });
    }

    const adminAuth = await getAdminAuth();
    const firebaseUser = await adminAuth.createUser({ email, displayName: name });

    return NextResponse.json({ success: true, user: firebaseUser });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}