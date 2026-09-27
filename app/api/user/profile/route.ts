import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { adminAuth } from '@/lib/firebase-admin';
import { resend } from '@/lib/resend';

export const runtime = 'nodejs';

const FREE_SEARCH_LIMIT = 3;
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 80;
const EMAIL_MAX_LENGTH = 254;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/*
 * Changing an email address is a sensitive operation. The client proves
 * ownership of the account by re-authenticating with the current password,
 * which refreshes the `auth_time` claim on the ID token. We then require that
 * claim to be recent, mirroring the 5 minute window Firebase itself applies
 * to updateEmail and updatePassword.
 */
const RECENT_AUTH_WINDOW_MS = 5 * 60 * 1000;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(req: Request) {
  try {
    const { token, action } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = await adminAuth.verifyIdToken(token);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { firebaseId: decoded.uid },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (action === 'consume') {
      if (user.freeSearchesUsed >= FREE_SEARCH_LIMIT) {
        return NextResponse.json({
          name: user.name,
          freeSearchesUsed: user.freeSearchesUsed,
          freeSearchesLeft: 0,
          limited: true,
        });
      }

      const updated = await prisma.user.update({
        where: { id: user.id },
        data: { freeSearchesUsed: { increment: 1 } },
      });

      return NextResponse.json({
        name: updated.name,
        freeSearchesUsed: updated.freeSearchesUsed,
        freeSearchesLeft: Math.max(0, FREE_SEARCH_LIMIT - updated.freeSearchesUsed),
        limited: updated.freeSearchesUsed >= FREE_SEARCH_LIMIT,
      });
    }

    return NextResponse.json({
      name: user.name,
      freeSearchesUsed: user.freeSearchesUsed,
      freeSearchesLeft: Math.max(0, FREE_SEARCH_LIMIT - user.freeSearchesUsed),
      limited: user.freeSearchesUsed >= FREE_SEARCH_LIMIT,
    });
  } catch (error: unknown) {
    console.error('Profile route error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

async function sendEmailChangeNotifications(params: {
  name: string;
  oldEmail: string;
  newEmail: string;
}): Promise<'sent' | 'failed'> {
  const { name, oldEmail, newEmail } = params;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'partnership@joinwondlo.com';
  const fromName = process.env.RESEND_FROM_NAME || 'Wondlo';
  const safeName = escapeHtml(name);
  const safeOldEmail = escapeHtml(oldEmail);
  const safeNewEmail = escapeHtml(newEmail);

  try {
    await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [newEmail],
      subject: 'Your Wondlo email address has been updated',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #2B2740;">
          <h2>Hi ${safeName},</h2>
          <p>The email address on your Wondlo account has been changed to <b>${safeNewEmail}</b>.</p>
          <p>You will now sign in and receive receipts at this address. Your plan, searches and saved reports are unchanged.</p>
          <p>If this wasn't you, reset your password immediately and contact us at ${escapeHtml(fromEmail)}.</p>
          <p style="color: #666; font-size: 14px;">Wondlo &mdash; Safety as a System</p>
        </div>
      `,
    });

    await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [oldEmail],
      subject: 'Your Wondlo email address has been updated',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #2B2740;">
          <h2>Hi ${safeName},</h2>
          <p>The email address on your Wondlo account was changed from <b>${safeOldEmail}</b> to <b>${safeNewEmail}</b>.</p>
          <p>We are letting you know so that a change you did not make does not go unnoticed.</p>
          <p>If this wasn't you, reset your password immediately and contact us at ${escapeHtml(fromEmail)}.</p>
          <p style="color: #666; font-size: 14px;">Wondlo &mdash; Safety as a System</p>
        </div>
      `,
    });

    return 'sent';
  } catch (emailError: unknown) {
    console.error('Email change notification failed:', emailError);
    return 'failed';
  }
}

export async function PATCH(req: Request) {
  try {
    const { token, name, email } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = await adminAuth.verifyIdToken(token);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { firebaseId: decoded.uid },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const nextName = typeof name === 'string' ? name.trim().slice(0, NAME_MAX_LENGTH) : user.name;
    const nextEmail = typeof email === 'string' ? email.trim().toLowerCase() : user.email;

    if (nextName.length < NAME_MIN_LENGTH) {
      return NextResponse.json(
        { error: 'Please enter your full name.' },
        { status: 400 }
      );
    }

    if (nextEmail.length > EMAIL_MAX_LENGTH || !EMAIL_PATTERN.test(nextEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const nameChanged = nextName !== user.name;
    const emailChanged = nextEmail !== user.email;

    if (!nameChanged && !emailChanged) {
      return NextResponse.json({
        name: user.name,
        email: user.email,
        nameChanged: false,
        emailChanged: false,
      });
    }

    if (emailChanged) {
      const authTime = decoded.auth_time ?? 0;
      const authenticatedAgo = Date.now() - authTime * 1000;

      if (!authTime || authenticatedAgo > RECENT_AUTH_WINDOW_MS) {
        return NextResponse.json(
          {
            error:
              'For your security, please confirm your current password to change your email address.',
            code: 'reauth-required',
          },
          { status: 401 }
        );
      }

      const emailOwner = await prisma.user.findUnique({ where: { email: nextEmail } });

      if (emailOwner && emailOwner.id !== user.id) {
        return NextResponse.json(
          { error: 'That email address is already in use.' },
          { status: 409 }
        );
      }
    }

    /*
     * Firebase Auth is updated first so that a rejected change (duplicate
     * email, invalid address) leaves the database untouched.
     */
    const authUpdates: { displayName?: string; email?: string; emailVerified?: boolean } = {};

    if (nameChanged) {
      authUpdates.displayName = nextName;
    }

    if (emailChanged) {
      authUpdates.email = nextEmail;
      authUpdates.emailVerified = false;
    }

    try {
      await adminAuth.updateUser(decoded.uid, authUpdates);
    } catch (authError: unknown) {
      const code = (authError as { code?: string })?.code;

      if (code === 'auth/email-already-exists') {
        return NextResponse.json(
          { error: 'That email address is already in use.' },
          { status: 409 }
        );
      }

      if (code === 'auth/invalid-email') {
        return NextResponse.json(
          { error: 'Please enter a valid email address.' },
          { status: 400 }
        );
      }

      throw authError;
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: nextName,
        email: nextEmail,
      },
    });

    const notificationStatus = emailChanged
      ? await sendEmailChangeNotifications({
          name: updated.name,
          oldEmail: user.email,
          newEmail: updated.email,
        })
      : 'skipped';

    return NextResponse.json({
      name: updated.name,
      email: updated.email,
      nameChanged,
      emailChanged,
      notificationStatus,
    });
  } catch (error: unknown) {
    console.error('Profile update error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}