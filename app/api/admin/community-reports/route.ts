import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateCommunityAdmin } from '@/lib/community-api';
import {
  isCommunityReportDecision,
  isCommunityReportStatus,
  MAX_MODERATOR_NOTE_LENGTH,
} from '@/lib/community-reports';
import { createCommunityNotification } from '@/lib/community-notifications';

export const runtime = 'nodejs';

/*
 * How long a suspension lasts. Long enough to stop a spam run, short enough
 * that a mistaken decision does not need a database edit to undo.
 */
const SUSPENSION_LENGTH_MS = 7 * 24 * 60 * 60 * 1000;

export async function GET(request: Request): Promise<NextResponse> {
  const authentication = await authenticateCommunityAdmin(request);
  if (!authentication.user) {
    return authentication.response as NextResponse;
  }

  try {
    const status = new URL(request.url).searchParams.get('status');
    const reports = await prisma.communityReport.findMany({
      where: isCommunityReportStatus(status) ? { status } : {},
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: {
        reporter: { select: { name: true } },
        post: {
          select: {
            id: true,
            title: true,
            body: true,
            category: true,
            country: true,
            activity: true,
            createdAt: true,
            user: { select: { id: true, name: true } },
          },
        },
        comment: {
          select: {
            id: true,
            text: true,
            createdAt: true,
            postId: true,
            post: { select: { title: true } },
            user: { select: { id: true, name: true } },
          },
        },
        reportedUser: {
          select: {
            id: true,
            name: true,
            bio: true,
            suspendedUntil: true,
            _count: { select: { communityPosts: true, communityReports: true } },
          },
        },
      },
    });

    return NextResponse.json({
      reports: reports.map((report) => ({
        id: report.id,
        reason: report.reason,
        details: report.details,
        status: report.status,
        resolution: report.resolution,
        moderatorNote: report.moderatorNote,
        moderatedBy: report.moderatedBy,
        appealNote: report.appealNote,
        appealStatus: report.appealStatus,
        createdAt: report.createdAt,
        resolvedAt: report.resolvedAt,
        reporter: report.reporter.name,
        kind: report.comment
          ? 'comment'
          : report.reportedUser
            ? 'member'
            : 'post',
        target: report.post
          ? {
              id: report.post.id,
              title: report.post.title,
              body: report.post.body,
              meta: `${report.post.category} · ${report.post.country} · ${report.post.activity}`,
              author: report.post.user.name,
              createdAt: report.post.createdAt,
            }
          : report.comment
            ? {
                id: report.comment.id,
                title: report.comment.post.title,
                body: report.comment.text,
                meta: 'Comment',
                author: report.comment.user.name,
                createdAt: report.comment.createdAt,
              }
            : report.reportedUser
              ? {
                  id: report.reportedUser.id,
                  title: report.reportedUser.name,
                  body: report.reportedUser.bio ?? '',
                  meta: `Member · ${report.reportedUser._count.communityPosts} posts`,
                  author: report.reportedUser.name,
                  createdAt: report.createdAt,
                  suspendedUntil: report.reportedUser.suspendedUntil,
                }
              : null,
      })),
    });
  } catch (error) {
    console.error('Community report list error:', error);
    return NextResponse.json(
      { error: 'Unable to load community reports.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request): Promise<NextResponse> {
  const authentication = await authenticateCommunityAdmin(request);
  if (!authentication.user) {
    return authentication.response as NextResponse;
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const id = typeof body.id === 'string' ? body.id : '';
    const decision = body.status;

    if (!id || !isCommunityReportDecision(decision)) {
      return NextResponse.json(
        { error: 'Choose a valid outcome for this report.' },
        { status: 400 }
      );
    }

    const moderatorNote =
      typeof body.moderatorNote === 'string'
        ? body.moderatorNote.trim()
        : '';

    if (moderatorNote.length > MAX_MODERATOR_NOTE_LENGTH) {
      return NextResponse.json(
        { error: 'Please keep the moderator note under 2,000 characters.' },
        { status: 400 }
      );
    }

    const report = await prisma.communityReport.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        reason: true,
        postId: true,
        commentId: true,
        reportedUserId: true,
        post: { select: { userId: true, title: true } },
        comment: { select: { userId: true, postId: true } },
      },
    });

    if (!report) {
      return NextResponse.json({ error: 'Report not found.' }, { status: 404 });
    }

    if (report.status !== 'open' && report.status !== 'appealed') {
      return NextResponse.json(
        { error: 'This report has already been reviewed.' },
        { status: 409 }
      );
    }

    /*
     * Whoever is responsible for the thing being reported is the one a decision
     * lands on: the author of the post, of the comment, or the reported member.
     */
    const subjectId =
      report.post?.userId ??
      report.comment?.userId ??
      report.reportedUserId ??
      null;

    if (decision === 'removed') {
      if (report.postId) {
        await prisma.communityPost.delete({ where: { id: report.postId } });
      } else if (report.commentId) {
        await prisma.communityComment.delete({
          where: { id: report.commentId },
        });
      }
    }

    if (decision === 'suspended' && subjectId) {
      await prisma.user.update({
        where: { id: subjectId },
        data: {
          suspendedUntil: new Date(Date.now() + SUSPENSION_LENGTH_MS),
          suspensionReason: moderatorNote || report.reason,
        },
      });
    }

    const resolution =
      decision === 'dismissed'
        ? 'dismissed'
        : decision === 'removed'
          ? 'content_removed'
          : 'author_suspended';

    /*
     * Clearing openKey releases the one-report-per-person slot, so the member
     * can report the same thing again if it happens once more.
     */
    await prisma.communityReport.update({
      where: { id },
      data: {
        status: decision,
        resolution,
        resolvedAt: new Date(),
        openKey: null,
        moderatorNote: moderatorNote || null,
        moderatedBy: authentication.user.name,
      },
    });

    if (subjectId) {
      await createCommunityNotification({
        userId: subjectId,
        type: 'moderation',
        message:
          decision === 'dismissed'
            ? 'A report about your community content was reviewed and dismissed.'
            : decision === 'removed'
              ? 'Content of yours was removed after a moderator review.'
              : 'Your account has been suspended after a moderator review.',
        postId: report.postId ?? report.comment?.postId ?? null,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Community report resolution error:', error);
    return NextResponse.json(
      { error: 'Unable to update this report.' },
      { status: 500 }
    );
  }
}