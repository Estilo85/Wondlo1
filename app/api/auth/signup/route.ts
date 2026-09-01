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

    // Send professional welcome email with password setup link using Resend
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const setPasswordLink = `${baseUrl}/set-password?email=${encodeURIComponent(email)}`;

    try {
      await resend.emails.send({
        from: 'partnership@joinwondlo.com',
        to: [email],
        subject: 'Welcome to Wondlo — Secure Your Account',
        html: `
          <div style="font-family: 'Inter', Arial, sans-serif; padding: 30px; color: #2B2740; background-color: #FAF9FE; max-width: 600px; margin: 0 auto; border-radius: 12px; border: 1px solid #EDE7FB;">
            <h2 style="color: #7E6BB3; margin-top: 0; font-size: 24px;">Welcome to Wondlo, ${name}!</h2>
            <p style="font-size: 16px; line-height: 1.5; color: #4A4560;">Thank you for registering with us. We are thrilled to welcome you to our travel safety platform built around our core philosophy: <strong>Safety as a System™</strong>.</p>
            <p style="font-size: 16px; line-height: 1.5; color: #4A4560;">To finalize your registration and secure your profile, please establish your password by clicking the secure link below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${setPasswordLink}" style="background-color: #7E6BB3; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(126, 107, 179, 0.2);">Set Your Password</a>
            </div>
            <p style="font-size: 14px; line-height: 1.5; color: #6E6B80;">If you did not request this registration, please disregard this email or contact our support team immediately.</p>
            <hr style="border: none; border-top: 1px solid #EDE7FB; margin: 25px 0;" />
            <p style="font-size: 12px; color: #9A95B0; text-align: center;">Wondlo • Safety as a System™ • 71–75 Shelton Street, United Kingdom</p>
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