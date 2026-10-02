/*
 * Posts hold their pictures as data URLs in the database, so the number of them
 * is what bounds a feed payload. Four is enough to tell a story without turning
 * a single post into the heaviest thing in the response.
 */
export const MAX_POST_IMAGES = 4;

/*
 * resizePostImage caps a single picture at 700,000 characters of data URL, so
 * this ceiling is deliberately the same number the client resizes to. The two
 * used to disagree, which left the server limit unreachable and its error
 * message describing a file size that was never enforced.
 */
export const MAX_IMAGE_LENGTH = 700_000;

export type PostImageInput = {
  dataUrl: string;
  alt: string | null;
};

/**
 * Reads the images out of a create or update payload. Accepts an array of data
 * URLs, an array of `{ src, alt }` objects, or a single data URL string for
 * backwards compatibility with older drafts.
 *
 * Returns an empty array when the post has no images, which is valid, and null
 * when something was sent that is not a usable image.
 */
export function readImageList(value: unknown): PostImageInput[] | null {
  const raw = Array.isArray(value)
    ? value
    : typeof value === 'string' && value
      ? [value]
      : [];

  const images: PostImageInput[] = [];

  for (const entry of raw) {
    if (images.length >= MAX_POST_IMAGES) {
      break;
    }

    const dataUrl = typeof entry === 'string' ? entry : readImageSource(entry);
    const alt = typeof entry === 'string' ? null : readImageAlt(entry);

    if (!dataUrl) {
      continue;
    }

    if (
      !dataUrl.startsWith('data:image/') ||
      dataUrl.length > MAX_IMAGE_LENGTH
    ) {
      return null;
    }

    images.push({ dataUrl, alt });
  }

  return images;
}

function readImageSource(value: unknown): string | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const source = value as { src?: unknown; dataUrl?: unknown; data?: unknown };
  const candidate = source.src ?? source.dataUrl ?? source.data;

  return typeof candidate === 'string' ? candidate : null;
}

function readImageAlt(value: unknown): string | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const alt = (value as { alt?: unknown }).alt;

  if (typeof alt !== 'string') {
    return null;
  }

  const trimmed = alt.trim().slice(0, 200);

  return trimmed || null;
}