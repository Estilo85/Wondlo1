import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
export const runtime = 'nodejs';
import { adminAuth } from '@/lib/firebase-admin';
import { resend } from '@/lib/resend';

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

    const firebaseUser = await adminAuth.createUser({ email, displayName: name });

    await prisma.user.create({
      data: {
        id: firebaseUser.uid,
        firebaseId: firebaseUser.uid,
        name,
        email,
      },
    });

    const resetLink = await adminAuth.generatePasswordResetLink(email, {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/set-password`,
    });

    // Clean transactional email without emojis or icons
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'partnerships@zagotours.com',
      to: email,
      subject: 'Welcome to Wondlo - Set Your Password',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #2B2740;">
          <h2>Welcome to Wondlo, ${name}.</h2>
          <p>Thank you for creating an account with us. Please complete your registration by setting your password using the secure link below.</p>
          <p><a href="${resetLink}" style="background-color: #7E6BB3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Set Account Password</a></p>
          <p>If you did not sign up for this account, please ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Signup successful.' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error.' }, { status: 500 });
  }
}