import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createFirebaseUser } from '@/lib/firebase-admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required.' },
        { status: 400 }
      );
    }

    // Check if user already exists in Neon database
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'This email is already registered.' },
        { status: 400 }
      );
    }

    // Create user in Firebase via REST API
    let firebaseUser;
    try {
      firebaseUser = await createFirebaseUser(email, name);
    } catch (fbError: any) {
      console.error('Firebase creation failed:', fbError);
      return NextResponse.json(
        { error: fbError.message || 'Failed to create user in Firebase.' },
        { status: 400 }
      );
    }

    // Save user record to Neon PostgreSQL via Prisma
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        firebaseId: firebaseUser.uid,
      },
    });

    // Send welcome email with password setup link using Resend
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const setPasswordLink = `${baseUrl}/set-password?email=${encodeURIComponent(email)}`;

    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'partnership@joinwondlo.com',
        to: [email],
        subject: 'Welcome to Wondlo - Set Your Password',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #2B2740;">
            <h2>Welcome to Wondlo, ${name}!</h2>
            <p>Thank you for signing up. To secure your account, please click the button below to set your password:</p>
            <a href="${setPasswordLink}" style="background-color: #9B88ED; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 15px; font-weight: bold;">Set Your Password</a>
            <p style="margin-top: 20px; color: #666; font-size: 14px;">Once your password is set, you can sign in to access our community.</p>
          </div>
        `,
      });
    } catch (emailError: any) {
      console.error('Resend email failed:', emailError);
    }

    return NextResponse.json({ success: true, user: newUser }, { status: 200 });
  } catch (error: any) {
    console.error('Signup route crashed:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}