const RECENT_SEARCH_KEY_PREFIX = 'wondlo:recent-search:';

export function readRecentSearch(firebaseUid: string): string | null {
  try {
    const query = window.localStorage.getItem(`${RECENT_SEARCH_KEY_PREFIX}${firebaseUid}`)?.trim();
    return query || null;
  } catch {
    return null;
  }
}

export function saveRecentSearch(firebaseUid: string, query: string): void {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return;

  try {
    window.localStorage.setItem(
      `${RECENT_SEARCH_KEY_PREFIX}${firebaseUid}`,
      normalizedQuery
    );
  } catch {
    // Search results remain usable when browser storage is unavailable.
  }
}
