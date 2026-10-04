import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateCommunityUser } from '@/lib/community-api';
import { MAX_REPORT_DETAILS_LENGTH } from '@/lib/community-reports';

export const runtime = 'nodejs';

/*
 * A decision that removed content or suspended an account is contestable. The
 * appeal reopens the report for a second look rather than reversing anything on
 * its own: the moderator sees the appeal next to the original report and makes
 * the call again.
 */
export async function POST(request: Request) {
  const authentication = await authenticateCommunityUser(request);
  if (!authentication.user) return authentication.response;

  try {
    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const reportId = typeof body.reportId === 'string' ? body.reportId : '';
    const note = typeof body.note === 'string' ? body.note.trim() : '';

    if (!reportId) {
      return NextResponse.json({ error: 'Report not found.' }, { status: 400 });
    }

    if (!note) {
      return NextResponse.json(
        { error: 'Tell the moderators why you are appealing.' },
        { status: 400 }
      );
    }

    if (note.length > MAX_REPORT_DETAILS_LENGTH) {
      return NextResponse.json(
        { error: 'Please keep your appeal under 2,000 characters.' },
        { status: 400 }
      );
    }

    const report = await prisma.communityReport.findUnique({
      where: { id: reportId },
      select: {
        id: true,
        status: true,
        appealStatus: true,
        reporterId: true,
        postId: true,
        commentId: true,
        reportedUserId: true,
        post: { select: { userId: true } },
        comment: { select: { userId: true } },
      },
    });

    if (!report) {
      return NextResponse.json({ error: 'Report not found.' }, { status: 404 });
    }

    /*
     * Both sides of a report can appeal: the member whose content was acted on,
     * and the member who reported it.
     */
    const involvedIds = [
      report.reporterId,
      report.post?.userId,
      report.comment?.userId,
      report.reportedUserId,
    ].filter((id): id is string => Boolean(id));

    if (!involvedIds.includes(authentication.user.id)) {
      return NextResponse.json(
        { error: 'This report is not yours to appeal.' },
        { status: 403 }
      );
    }

    if (report.status !== 'removed' && report.status !== 'suspended') {
      return NextResponse.json(
        { error: 'Only a removal or suspension can be appealed.' },
        { status: 400 }
      );
    }

    if (report.appealStatus === 'pending') {
      return NextResponse.json(
        { error: 'This report is already being re-reviewed.' },
        { status: 409 }
      );
    }

    await prisma.communityReport.update({
      where: { id: reportId },
      data: {
        status: 'appealed',
        appealNote: note,
        appealStatus: 'pending',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Community appeal error:', error);
    return NextResponse.json(
      { error: 'Unable to send your appeal.' },
      { status: 500 }
    );
  }
}