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

export const MAX_MODERATOR_NOTE_LENGTH = 2_000;

/*
 * A member can contest a decision that removed their content. An appeal reopens
 * the report for a second look, which is why `appealed` is a status a moderator
 * has to clear rather than a flag that sits alongside the outcome.
 */
export const COMMUNITY_REPORT_STATUSES = [
  'open',
  'dismissed',
  'removed',
  'suspended',
  'appealed',
] as const;

export type CommunityReportStatus = (typeof COMMUNITY_REPORT_STATUSES)[number];

export function isCommunityReportStatus(
  value: unknown
): value is CommunityReportStatus {
  return (
    typeof value === 'string' &&
    COMMUNITY_REPORT_STATUSES.includes(value as CommunityReportStatus)
  );
}

/*
 * Outcomes a moderator can set from the queue. `appealed` is reachable only
 * through the appeal endpoint, so it is not offered here as a decision.
 */
export const COMMUNITY_REPORT_DECISIONS = [
  'dismissed',
  'removed',
  'suspended',
] as const;

export type CommunityReportDecision =
  (typeof COMMUNITY_REPORT_DECISIONS)[number];

export function isCommunityReportDecision(
  value: unknown
): value is CommunityReportDecision {
  return (
    typeof value === 'string' &&
    COMMUNITY_REPORT_DECISIONS.includes(value as CommunityReportDecision)
  );
}

/*
 * `removed` deletes the content. `suspended` leaves it in place but blocks the
 * author from posting, which is the right call for a pattern rather than one
 * bad post. The label is what the admin queue shows on the button.
 */
export const COMMUNITY_REPORT_DECISION_LABELS: Record<
  CommunityReportDecision,
  string
> = {
  dismissed: 'Dismiss',
  removed: 'Remove content',
  suspended: 'Suspend author',
};
