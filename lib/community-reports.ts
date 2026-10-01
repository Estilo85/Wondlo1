export const COMMUNITY_REPORT_REASONS = [
  { value: 'dangerous misinformation', label: 'Dangerous misinformation' },
  { value: 'harassment or abuse', label: 'Harassment or abuse' },
  { value: 'spam or advertising', label: 'Spam or advertising' },
  { value: 'not a real experience', label: 'Not a real experience' },
  { value: 'off topic', label: 'Off topic' },
  { value: 'other', label: 'Something else' },
] as const;

export type CommunityReportReason =
  (typeof COMMUNITY_REPORT_REASONS)[number]['value'];

export const COMMUNITY_REPORT_REASON_VALUES =
  COMMUNITY_REPORT_REASONS.map((reason) => reason.value);

export function isCommunityReportReason(
  value: unknown
): value is CommunityReportReason {
  return (
    typeof value === 'string' &&
    COMMUNITY_REPORT_REASON_VALUES.includes(value as CommunityReportReason)
  );
}

export const MAX_REPORT_DETAILS_LENGTH = 2_000;

export const COMMUNITY_REPORT_STATUSES = ['open', 'dismissed', 'removed'] as const;

export type CommunityReportStatus = (typeof COMMUNITY_REPORT_STATUSES)[number];

export function isCommunityReportStatus(
  value: unknown
): value is CommunityReportStatus {
  return (
    typeof value === 'string' &&
    COMMUNITY_REPORT_STATUSES.includes(value as CommunityReportStatus)
  );
}
