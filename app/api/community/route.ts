import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  authenticateCommunityUser,
  getOptionalCommunityUserId,
} from '@/lib/community-api';

export const runtime = 'nodejs';

const POST_CATEGORIES = ['Trip Experience', 'Safety Warning'] as const;
const MAX_IMAGE_LENGTH = 2_200_000;

function validatePost(body: Record<string, unknown>) {
  const category = POST_CATEGORIES.find((option) => option === body.category);
  const country = typeof body.country === 'string' ? body.country.trim() : '';
  const activity = typeof body.activity === 'string' ? body.activity.trim() : '';
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const text = typeof body.body === 'string' ? body.body.trim() : '';
  const image = body.image;

  if (!category) {
    return { error: 'Choose a valid post type.' };
  }
  if (!country || country.length > 100 || !activity || activity.length > 100) {
    return { error: 'Choose a valid country and activity.' };
  }
  if (!title || title.length > 120 || !text || text.length > 10_000) {
    return { error: 'Enter a title and description within the allowed length.' };
  }
  if (
    image !== undefined &&
    image !== null &&
    (typeof image !== 'string' ||
      !image.startsWith('data:image/') ||
      image.length > MAX_IMAGE_LENGTH)
  ) {
    return { error: 'Choose an image smaller than 1.5 MB.' };
  }

  return {
    data: {
      category,
      country,
      activity,
      title,
      body: text,
      image: typeof image === 'string' ? image : null,
    },
  };
}

export async function GET(request: Request) {
  try {
    const viewerId = await getOptionalCommunityUserId(request);
    const posts = await prisma.communityPost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        user: { select: { name: true } },
        likes: viewerId ? { where: { userId: viewerId }, select: { id: true } } : false,
        comments: {
          orderBy: { createdAt: 'asc' },
          include: { user: { select: { name: true } } },
        },
        _count: { select: { likes: true, comments: true } },
      },
    });

    return NextResponse.json({
      posts: posts.map((post) => ({
        id: post.id,
        author: post.user.name,
        country: post.country,
        activity: post.activity,
        category: post.category,
        timestamp: post.createdAt.toISOString(),
        title: post.title,
        body: post.body,
        likes: post._count.likes,
        comments: post._count.comments,
        likedByMe: viewerId ? post.likes.length > 0 : false,
        ownedByMe: viewerId === post.userId,
        image: post.image,
        commentsList: post.comments.map((comment) => ({
          id: comment.id,
          text: comment.text,
          author: comment.user.name,
        })),
      })),
    });
  } catch (error) {
    console.error('Community feed error:', error);
    return NextResponse.json(
      { error: 'Unable to load community posts.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authentication = await authenticateCommunityUser(request);
  if (!authentication.user) return authentication.response;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const validation = validatePost(body);
    if (!validation.data) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const post = await prisma.communityPost.create({
      data: { ...validation.data, userId: authentication.user.id },
    });

    return NextResponse.json({ id: post.id }, { status: 201 });
  } catch (error) {
    console.error('Community post creation error:', error);
    return NextResponse.json(
      { error: 'Unable to publish your post.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const authentication = await authenticateCommunityUser(request);
  if (!authentication.user) return authentication.response;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const id = typeof body.id === 'string' ? body.id : '';
    const validation = validatePost(body);
    if (!id || !validation.data) {
      return NextResponse.json(
        { error: validation.error ?? 'Post not found.' },
        { status: 400 }
      );
    }

    const result = await prisma.communityPost.updateMany({
      where: { id, userId: authentication.user.id },
      data: validation.data,
    });

    if (result.count === 0) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Community post update error:', error);
    return NextResponse.json(
      { error: 'Unable to update your post.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const authentication = await authenticateCommunityUser(request);
  if (!authentication.user) return authentication.response;

  try {
    const body = (await request.json()) as { id?: unknown };
    const id = typeof body.id === 'string' ? body.id : '';
    if (!id) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 400 });
    }

    const result = await prisma.communityPost.deleteMany({
      where: { id, userId: authentication.user.id },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Community post deletion error:', error);
    return NextResponse.json(
      { error: 'Unable to delete your post.' },
      { status: 500 }
    );
  }
}
