import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  authenticateCommunityUser,
  getOptionalCommunityUserId,
} from '@/lib/community-api';
import { readImageList } from '@/lib/community-images';
import { readTagList } from '@/lib/community-tags';

export const runtime = 'nodejs';

const POST_CATEGORIES = ['Trip Experience', 'Safety Warning'] as const;

/*
 * A client can fire the same submission more than once (double click, retry,
 * flaky connection). Treating an identical post from the same author within a
 * short window as a duplicate keeps one intent to one post.
 */
const DUPLICATE_WINDOW_MS = 60_000;

function validatePost(body: Record<string, unknown>) {
  const category = POST_CATEGORIES.find((option) => option === body.category);
  const country = typeof body.country === 'string' ? body.country.trim() : '';
  const activity = typeof body.activity === 'string' ? body.activity.trim() : '';
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const text = typeof body.body === 'string' ? body.body.trim() : '';

  /*
   * The composer sends an array. `image` is still accepted so an older client,
   * or a draft restored from sessionStorage before this field existed, keeps
   * working instead of silently losing its picture. null means something was
   * sent that is not a usable image.
   */
  const images = readImageList(body.images ?? body.image);

  if (!category) {
    return { error: 'Choose a valid post type.' };
  }
  if (!country || country.length > 100 || !activity || activity.length > 100) {
    return { error: 'Choose a valid country and activity.' };
  }
  if (!title || title.length > 120 || !text || text.length > 10_000) {
    return { error: 'Enter a title and description within the allowed length.' };
  }
  if (images === null) {
    return { error: 'One of your images is too large. Please choose a smaller one.' };
  }

  return {
    data: {
      category,
      country,
      activity,
      title,
      body: text,
      /*
       * `image` stays populated with the first picture so any reader that still
       * expects a single image column keeps working.
       */
      image: images[0]?.dataUrl ?? null,
      tags: readTagList(body.tags),
    },
    images,
  };
}

export async function GET(request: Request) {
  try {
    const viewerId = await getOptionalCommunityUserId(request);
    const posts = await prisma.communityPost.findMany({
      orderBy: [{ pinnedAt: 'desc' }, { likes: { _count: 'desc' } }, { createdAt: 'desc' }],
      take: 100,
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        likes: viewerId ? { where: { userId: viewerId }, select: { id: true } } : false,
        images: { orderBy: { position: 'asc' } },
        comments: {
          /*
           * Only top level comments are fetched; their replies come back in one
           * more hop. Doing it this way means the feed query stays flat and the
           * client never has to stitch a tree together.
           */
          where: { parentId: null },
          orderBy: { createdAt: 'asc' },
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
            replies: {
              orderBy: { createdAt: 'asc' },
              include: {
                user: { select: { id: true, name: true, avatarUrl: true } },
              },
            },
          },
        },
        _count: { select: { likes: true, comments: true } },
      },
    });

    return NextResponse.json({
      posts: posts.map((post) => ({
        id: post.id,
        author: post.user.name,
        authorId: post.user.id,
        authorAvatarUrl: post.user.avatarUrl,
        country: post.country,
        activity: post.activity,
        category: post.category,
        timestamp: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        title: post.title,
        body: post.body,
        likes: post._count.likes,
        comments: post._count.comments,
        shares: post.shareCount,
        likedByMe: viewerId ? post.likes.length > 0 : false,
        ownedByMe: viewerId === post.userId,
        pinned: Boolean(post.pinnedAt),
        verified: Boolean(post.verifiedAt),
        resolved: Boolean(post.resolvedAt),
        tags: post.tags,
        images: post.images.map((image) => ({
          src: image.data,
          alt: image.alt ?? post.title,
        })),
        image: post.image,
        commentsList: post.comments.map((comment) => ({
          id: comment.id,
          text: comment.text,
          author: comment.user.name,
          authorId: comment.user.id,
          authorAvatarUrl: comment.user.avatarUrl,
          ownedByMe: viewerId === comment.userId,
          createdAt: comment.createdAt.toISOString(),
          editedAt: comment.editedAt?.toISOString() ?? null,
          replies: comment.replies.map((reply) => ({
            id: reply.id,
            text: reply.text,
            author: reply.user.name,
            authorId: reply.user.id,
            authorAvatarUrl: reply.user.avatarUrl,
            ownedByMe: viewerId === reply.userId,
            createdAt: reply.createdAt.toISOString(),
            editedAt: reply.editedAt?.toISOString() ?? null,
            replies: [],
          })),
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
    if (!validation.data || !validation.images) {
      return NextResponse.json(
        { error: validation.error ?? 'Post not found.' },
        { status: 400 }
      );
    }

    const { data, images } = validation;

    const recentDuplicate = await prisma.communityPost.findFirst({
      where: {
        userId: authentication.user.id,
        title: data.title,
        body: data.body,
        country: data.country,
        activity: data.activity,
        createdAt: { gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) },
      },
      select: { id: true },
    });

    if (recentDuplicate) {
      return NextResponse.json({ id: recentDuplicate.id }, { status: 200 });
    }

    const post = await prisma.communityPost.create({
      data: {
        ...data,
        userId: authentication.user.id,
        images: {
          create: images.map((image, index) => ({
            data: image.dataUrl,
            alt: image.alt,
            position: index,
          })),
        },
      },
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
    if (!id || !validation.data || !validation.images) {
      return NextResponse.json(
        { error: validation.error ?? 'Post not found.' },
        { status: 400 }
      );
    }

    const { data, images } = validation;

    const result = await prisma.communityPost.updateMany({
      where: { id, userId: authentication.user.id },
      data,
    });

    if (result.count === 0) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

    /*
     * Images are replaced rather than diffed: the author has just told us the
     * full set they want on this post, and reconciling positions against the
     * previous rows buys nothing for at most MAX_POST_IMAGES entries.
     */
    await prisma.$transaction([
      prisma.communityPostImage.deleteMany({ where: { postId: id } }),
      prisma.communityPostImage.createMany({
        data: images.map((image, index) => ({
          postId: id,
          data: image.dataUrl,
          alt: image.alt,
          position: index,
        })),
      }),
    ]);

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