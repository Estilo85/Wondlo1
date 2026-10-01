import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateCommunityUser } from '@/lib/community-api';
import {
  isCommunityReportReason,
  MAX_REPORT_DETAILS_LENGTH,
} from '@/lib/community-reports';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const authentication = await authenticateCommunityUser(request);
  if (!authentication.user) return authentication.response;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const postId = typeof body.postId === 'string' ? body.postId : '';
    const commentId = typeof body.commentId === 'string' ? body.commentId : '';

    /*
     * A report points at exactly one thing. Accepting both or neither would
     * leave rows nothing can act on, so the pair is validated up front.
     */
    if ((postId && commentId) || (!postId && !commentId)) {
      return NextResponse.json(
        { error: 'Choose a post or a comment to report.' },
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

      /*
       * One open report per person per post is enough to flag something. The
       * unique constraint backs this up, so a double click cannot queue the
       * same complaint twice.
       */
      const existing = await prisma.communityReport.findFirst({
        where: {
          postId,
          reporterId: authentication.user.id,
          status: 'open',
        },
        select: { id: true },
      });

      if (existing) {
        return NextResponse.json(
          { error: 'You have already reported this post.' },
          { status: 409 }
        );
      }

      const report = await prisma.communityReport.create({
        data: {
          reporterId: authentication.user.id,
          postId,
          reason: body.reason,
          details: details || null,
        },
      });

      return NextResponse.json({ id: report.id }, { status: 201 });
    }

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

    const existingCommentReport = await prisma.communityReport.findFirst({
      where: {
        commentId,
        reporterId: authentication.user.id,
        status: 'open',
      },
      select: { id: true },
    });

    if (existingCommentReport) {
      return NextResponse.json(
        { error: 'You have already reported this comment.' },
        { status: 409 }
      );
    }

    const report = await prisma.communityReport.create({
      data: {
        reporterId: authentication.user.id,
        commentId,
        reason: body.reason,
        details: details || null,
      },
    });

    return NextResponse.json({ id: report.id }, { status: 201 });
  } catch (error) {
    console.error('Community report error:', error);
    return NextResponse.json(
      { error: 'Unable to send your report. Please try again.' },
      { status: 500 }
    );
  }
}
