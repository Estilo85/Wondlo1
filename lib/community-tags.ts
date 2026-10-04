export const MAX_POST_TAGS = 5;
export const MAX_TAG_LENGTH = 24;

/*
 * Tags are free text typed by the author rather than a fixed list, so the
 * normalisation below is the only thing standing between the composer and a
 * mess of "#Kayaking", "kayaking" and "  KAYAKING  ". Everything is folded to
 * lowercase and stripped of the marker so that filtering is a plain equality
 * check on the client as well as on the server.
 */
export function normaliseTag(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value
    .trim()
    .replace(/^#+/, '')
    .replace(/\s+/g, ' ')
    .toLowerCase();

  if (!trimmed) {
    return null;
  }

  return trimmed.slice(0, MAX_TAG_LENGTH);
}

/*
 * Accepts whatever the composer sends (a comma separated string, a single tag,
 * or an array) and returns a de-duplicated list in the order the author typed
 * them, capped at MAX_POST_TAGS. Callers treat an empty list as "no tags",
 * which is a valid answer rather than an error.
 */
export function readTagList(value: unknown): string[] {
  const candidates = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(',')
      : [];

  const seen = new Set<string>();
  const tags: string[] = [];

  for (const candidate of candidates) {
    const tag = normaliseTag(candidate);

    if (!tag || seen.has(tag)) {
      continue;
    }

    seen.add(tag);
    tags.push(tag);

    if (tags.length === MAX_POST_TAGS) {
      break;
    }
  }

  return tags;
}

/*
 * The composer shows a hashtag as the author typed it, so this turns the stored
 * lowercase value back into the "#tag" form used in the UI.
 */
export function formatTag(tag: string): string {
  return `#${tag}`;
}