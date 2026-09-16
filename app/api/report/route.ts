import { NextResponse } from 'next/server';
import { resend } from '@/lib/resend';

export const runtime = 'nodejs';

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
    const body = await req.json();
    const { name, email, message, type, category, priority, attachmentName, attachmentBase64 } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const isFeature = type === 'feature';
    const isSafetyHelp = type === 'safety-help';
    const typeLabel = isFeature
      ? 'Feature Request'
      : isSafetyHelp
        ? 'Safety Help Request'
        : 'Bug Report';
    const typeLabelLower = typeLabel.toLowerCase();
    const categoryLabel = category || 'General';
    const priorityLabel = priority || 'Medium';
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'partnership@joinwondlo.com';
    const fromName = process.env.RESEND_FROM_NAME || 'Wondlo';
    const teamInbox = process.env.REPORT_INBOX_EMAIL || 'partnership@joinwondlo.com';

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);
    const safeCategory = escapeHtml(categoryLabel);
    const safePriority = escapeHtml(priorityLabel);
    const attachmentNote = attachmentName
      ? `<p><b>Attachment:</b> ${escapeHtml(attachmentName)}</p>`
      : '';

    const attachments = [];
    if (attachmentName && attachmentBase64) {
      const buffer = Buffer.from(attachmentBase64, 'base64');
      if (buffer.length <= 2 * 1024 * 1024) {
        attachments.push({
          filename: attachmentName,
          content: buffer,
        });
      }
    }

    let emailStatus = 'sent';

    try {
      await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: [teamInbox],
        replyTo: safeEmail,
        subject: `${typeLabel} from ${safeName}`,
        attachments,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #2B2740;">
            <h2>${typeLabel}</h2>
            <table style="border-collapse: collapse; margin-bottom: 15px;">
              <tr>
                <td style="padding: 4px 12px 4px 0;"><b>Name:</b></td>
                <td style="padding: 4px 0;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 4px 12px 4px 0;"><b>Email:</b></td>
                <td style="padding: 4px 0;">${safeEmail}</td>
              </tr>
              <tr>
                <td style="padding: 4px 12px 4px 0;"><b>Category:</b></td>
                <td style="padding: 4px 0;">${safeCategory}</td>
              </tr>
              <tr>
                <td style="padding: 4px 12px 4px 0;"><b>Priority:</b></td>
                <td style="padding: 4px 0;">${safePriority}</td>
              </tr>
            </table>
            <p><b>Details:</b></p>
            <p style="background: #F6F4FE; padding: 12px; border-radius: 6px;">${safeMessage}</p>
            ${attachmentNote}
          </div>
        `,
      });

      await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: [safeEmail],
        subject: `We received your ${typeLabelLower}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #2B2740;">
            <h2>Thanks, ${safeName}!</h2>
            <p>We've received your ${typeLabelLower} and our team will review it. If we need more information, we'll reach out to you at ${safeEmail}.</p>
            <p style="background: #F6F4FE; padding: 12px; border-radius: 6px;">${safeMessage}</p>
            <p style="color: #666; font-size: 14px;">Wondlo &mdash; Safety as a System</p>
          </div>
        `,
      });
    } catch (emailError: any) {
      console.error('Resend email failed:', emailError);
      emailStatus = 'failed';
    }

    return NextResponse.json({ success: true, emailStatus }, { status: 200 });
  } catch (error: any) {
    console.error('Report route crashed:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}