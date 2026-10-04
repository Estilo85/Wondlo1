import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { authenticateCommunityUser } from '@/lib/community-api';
import {
  isCommunityReportReason,
  MAX_REPORT_DETAILS_LENGTH,
} from '@/lib/community-reports';

export const runtime = 'nodejs';

type ReportKind = 'post' | 'comment' | 'user';

/*
 * One open report per person per target. The key is enforced by a unique
 * constraint on CommunityReport.openKey, so the check below is a courtesy that
 * produces a readable message rather than the thing standing between a double
 * click and a duplicate queue entry.
 */
function readOpenKey(reporterId: string, kind: ReportKind, targetId: string) {
  return `${reporterId}:${kind}:${targetId}`;
}

export async function POST(request: Request) {
  const authentication = await authenticateCommunityUser(request);
  if (!authentication.user) return authentication.response;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const postId = typeof body.postId === 'string' ? body.postId : '';
    const commentId = typeof body.commentId === 'string' ? body.commentId : '';
    const userId = typeof body.userId === 'string' ? body.userId : '';

    /*
     * A report points at exactly one thing. Accepting more than one, or none,
     * would leave rows nothing can act on, so the set is validated up front.
     */
    const targets = [postId, commentId, userId].filter(Boolean);

    if (targets.length !== 1) {
      return NextResponse.json(
        { error: 'Choose a post, comment or member to report.' },
        { status: 400 }
      );
    }

    if (!isCommunityReportReason(body.reason)) {
      return NextResponse.json(
        { error: 'Choose a reason for your report.' },
        { status: 400 }
      );
    }

    const details =
      typeof body.details === 'string' ? body.details.trim() : '';

    if (details.length > MAX_REPORT_DETAILS_LENGTH) {
      return NextResponse.json(
        { error: 'Please keep your note under 2,000 characters.' },
        { status: 400 }
      );
    }

    if (postId) {
      const post = await prisma.communityPost.findUnique({
        where: { id: postId },
        select: { id: true, userId: true },
      });

      if (!post) {
        return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
      }

      if (post.userId === authentication.user.id) {
        return NextResponse.json(
          { error: 'You cannot report your own post.' },
          { status: 400 }
        );
      }

      const report = await prisma.communityReport.create({
        data: {
          reporterId: authentication.user.id,
          postId,
          reason: body.reason,
          details: details || null,
          openKey: readOpenKey(authentication.user.id, 'post', postId),
        },
      });

      return NextResponse.json({ id: report.id }, { status: 201 });
    }

    if (commentId) {
      const comment = await prisma.communityComment.findUnique({
        where: { id: commentId },
        select: { id: true, userId: true },
      });

      if (!comment) {
        return NextResponse.json({ error: 'Comment not found.' }, { status: 404 });
      }

      if (comment.userId === authentication.user.id) {
        return NextResponse.json(
          { error: 'You cannot report your own comment.' },
          { status: 400 }
        );
      }

      const report = await prisma.communityReport.create({
        data: {
          reporterId: authentication.user.id,
          commentId,
          reason: body.reason,
          details: details || null,
          openKey: readOpenKey(authentication.user.id, 'comment', commentId),
        },
      });

      return NextResponse.json({ id: report.id }, { status: 201 });
    }

    const member = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found.' }, { status: 404 });
    }

    if (member.id === authentication.user.id) {
      return NextResponse.json(
        { error: 'You cannot report yourself.' },
        { status: 400 }
      );
    }

    const report = await prisma.communityReport.create({
      data: {
        reporterId: authentication.user.id,
        reportedUserId: member.id,
        reason: body.reason,
        details: details || null,
        openKey: readOpenKey(authentication.user.id, 'user', member.id),
      },
    });

    return NextResponse.json({ id: report.id }, { status: 201 });
  } catch (error) {
    /*
     * The unique constraint on openKey is the real guard against a duplicated
     * report. Catching it here turns a 500 into the same 409 the pre-check
     * would have produced, whichever request loses the race.
     */
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'You have already reported this.' },
        { status: 409 }
      );
    }

    console.error('Community report error:', error);
    return NextResponse.json(
      { error: 'Unable to send your report. Please try again.' },
      { status: 500 }
    );
  }
}