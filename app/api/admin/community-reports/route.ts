import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateCommunityAdmin } from '@/lib/community-api';
import { isCommunityReportStatus } from '@/lib/community-reports';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const authentication = await authenticateCommunityAdmin(request);
  if (!authentication.user) return authentication.response;

  try {
    const status =import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateCommunityAdmin } from '@/lib/community-api';
import { isCommunityReportStatus } from '@/lib/community-reports';

export const runtime = 'nodejs';

export async function GET(request: Request): Promise<NextResponse> {
  const authentication = await authenticateCommunityAdmin(request);
  if (!authentication.user) {
    return authentication.response as NextResponse;
  }

  try {
    const status = new URL(request.url).searchParams.get('status');
    const reports = await prisma.communityReport.findMany({
      where: status === 'open' || status === 'dismissed' || status === 'removed'
        ? { status }
        : {},
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
      },
    });

    return NextResponse.json({
      reports: reports.map((report) => ({
        id: report.id,
        reason: report.reason,
        details: report.details,
        status: report.status,
        resolution: report.resolution,
        createdAt: report.createdAt,
        resolvedAt: report.resolvedAt,
        reporter: report.reporter.name,
        kind: report.comment ? 'comment' : 'post',
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
    const status = body.status;

    if (!id || !isCommunityReportStatus(status) || status === 'open') {
      return NextResponse.json(
        { error: 'Choose a valid outcome for this report.' },
        { status: 400 }
      );
    }

    const report = await prisma.communityReport.findUnique({
      where: { id },
      select: { id: true, status: true, postId: true, commentId: true },
    });

    if (!report) {
      return NextResponse.json({ error: 'Report not found.' }, { status: 404 });
    }

    if (report.status !== 'open') {
      return NextResponse.json(
        { error: 'This report has already been reviewed.' },
        { status: 409 }
      );
    }

    if (status === 'removed') {
      if (report.postId) {
        await prisma.communityPost.delete({ where: { id: report.postId } });
      } else if (report.commentId) {
        await prisma.communityComment.delete({
          where: { id: report.commentId },
        });
      }
    }

    await prisma.communityReport.update({
      where: { id },
      data: {
        status,
        resolution: status === 'removed' ? 'content_removed' : 'dismissed',
        resolvedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Community report resolution error:', error);
    return NextResponse.json(
      { error: 'Unable to update this report.' },
      { status: 500 }
    );
  }
} new URL(request.url).searchParams.get('status');
    const reports = await prisma.communityReport.findMany({
      where: status === 'open' || status === 'dismissed' || status === 'removed'
        ? { status }
        : {},
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
      },
    });

    return NextResponse.json({
      reports: reports.map((report) => ({
        id: report.id,
        reason: report.reason,
        details: report.details,
        status: report.status,
        resolution: report.resolution,
        createdAt: report.createdAt,
        resolvedAt: report.resolvedAt,
        reporter: report.reporter.name,
        kind: report.comment ? 'comment' : 'post',
        /*
         * A resolved report can point at content that has since been removed,
         * which is why the target is optional here.
         */
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

export async function PATCH(request: Request) {
  const authentication = await authenticateCommunityAdmin(request);
  if (!authentication.user) return authentication.response;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const id = typeof body.id === 'string' ? body.id : '';
    const status = body.status;

    if (!id || !isCommunityReportStatus(status) || status === 'open') {
      return NextResponse.json(
        { error: 'Choose a valid outcome for this report.' },
        { status: 400 }
      );
    }

    const report = await prisma.communityReport.findUnique({
      where: { id },
      select: { id: true, status: true, postId: true, commentId: true },
    });

    if (!report) {
      return NextResponse.json({ error: 'Report not found.' }, { status: 404 });
    }

    if (report.status !== 'open') {
      return NextResponse.json(
        { error: 'This report has already been reviewed.' },
        { status: 409 }
      );
    }

    if (status === 'removed') {
      if (report.postId) {
        await prisma.communityPost.delete({ where: { id: report.postId } });
      } else if (report.commentId) {
        await prisma.communityComment.delete({
          where: { id: report.commentId },
        });
      }
    }

    await prisma.communityReport.update({
      where: { id },
      data: {
        status,
        resolution: status === 'removed' ? 'content_removed' : 'dismissed',
        resolvedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Community report resolution error:', error);
    return NextResponse.json(
      { error: 'Unable to update this report.' },
      { status: 500 }
    );
  }
}
