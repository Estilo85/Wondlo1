import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateCommunityUser } from '@/lib/community-api';

export const runtime = 'nodejs';

/*
 * The bell opens a page rather than a dropdown, so this returns enough for the
 * unread badge as well as the list: the badge needs the count, the page needs
 * the rows, and asking twice would race with a new comment arriving.
 */
export async function GET(request: Request) {
  const authentication = await authenticateCommunityUser(request);
  if (!authentication.user) return authentication.response;

  try {
    const url = new URL(request.url);
    const unreadOnly = url.searchParams.get('unread') === '1';
    const take = Math.min(
      50,
      Math.max(1, Number(url.searchParams.get('take')) || 30)
    );

    const [notifications, unreadCount] = await Promise.all([
      prisma.communityNotification.findMany({
        where: {
          userId: authentication.user.id,
          ...(unreadOnly ? { readAt: null } : {}),
        },
        orderBy: { createdAt: 'desc' },
        take,
      }),
      prisma.communityNotification.count({
        where: { userId: authentication.user.id, readAt: null },
      }),
    ]);

    return NextResponse.json({
      unreadCount,
      notifications: notifications.map((notification) => ({
        id: notification.id,
        type: notification.type,
        message: notification.message,
        postId: notification.postId,
        commentId: notification.commentId,
        read: Boolean(notification.readAt),
        createdAt: notification.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Community notification list error:', error);
    return NextResponse.json(
      { error: 'Unable to load your notifications.' },
      { status: 500 }
    );
  }
}

/*
 * Marks notifications read. Called with a single id to dismiss one, with
 * { all: true } for the "mark all read" button, and with nothing at all to
 * clear the badge when the bell is opened, which is the common case: opening
 * the list and leaving every row marked unread behind is worse than useless.
 */
export async function PATCH(request: Request) {
  const authentication = await authenticateCommunityUser(request);
  if (!authentication.user) return authentication.response;

  try {
    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const id = typeof body.id === 'string' ? body.id : '';
    const markAll = body.all === true;

    if (!id && !markAll) {
      return NextResponse.json(
        { error: 'Choose a notification to mark read.' },
        { status: 400 }
      );
    }

    await prisma.communityNotification.updateMany({
      where: {
        userId: authentication.user.id,
        readAt: null,
        ...(markAll ? {} : { id }),
      },
      data: { readAt: new Date() },
    });

    const unreadCount = await prisma.communityNotification.count({
      where: { userId: authentication.user.id, readAt: null },
    });

    return NextResponse.json({ success: true, unreadCount });
  } catch (error) {
    console.error('Community notification update error:', error);
    return NextResponse.json(
      { error: 'Unable to update your notifications.' },
      { status: 500 }
    );
  }
}

/*
 * Deletes one notification. A plain dismissal is a PATCH to read, but a user
 * asking for something to be gone from their list gets a way to say so.
 */
export async function DELETE(request: Request) {
  const authentication = await authenticateCommunityUser(request);
  if (!authentication.user) return authentication.response;

  try {
    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const id = typeof body.id === 'string' ? body.id : '';

    if (!id) {
      return NextResponse.json(
        { error: 'Choose a notification to remove.' },
        { status: 400 }
      );
    }

    await prisma.communityNotification.deleteMany({
      where: { id, userId: authentication.user.id },
    });

    const unreadCount = await prisma.communityNotification.count({
      where: { userId: authentication.user.id, readAt: null },
    });

    return NextResponse.json({ success: true, unreadCount });
  } catch (error) {
    console.error('Community notification deletion error:', error);
    return NextResponse.json(
      { error: 'Unable to remove this notification.' },
      { status: 500 }
    );
  }
}