const ANSWER_KEYS = [
  'operatorAssessment',
  'adventurePreparation',
  'riskAwareness',
  'safetyQuestions',
  'realWorldAccuracy',
] as const;

type SafetyReviewAnswers = Record<(typeof ANSWER_KEYS)[number], number>;

export type SafetyReviewData = {
  operatorName: string;
  country: string;
  activity: string;
  operatorAssessment: number;
  adventurePreparation: number;
  riskAwareness: number;
  safetyQuestions: number;
  realWorldAccuracy: number;
  experience: string;
  improvement: string | null;
};

function isScore(value: unknown): value is number {
  return Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 5;
}

export function parseSafetyReview(value: unknown): SafetyReviewData | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;

  const body = value as Record<string, unknown>;
  const operatorName = typeof body.operatorName === 'string' ? body.operatorName.trim() : '';
  const country = typeof body.country === 'string' ? body.country.trim() : '';
  const activity = typeof body.activity === 'string' ? body.activity.trim() : '';
  const experience = typeof body.experience === 'string' ? body.experience.trim() : '';
  const improvement = typeof body.improvement === 'string' ? body.improvement.trim() : '';
  const answers = body.answers;

  if (
    !operatorName || operatorName.length > 120 ||
    !country || country.length > 100 ||
    !activity || activity.length > 100 ||
    experience.length < 20 || experience.length > 1500 ||
    improvement.length > 1200 ||
    !answers || typeof answers !== 'object' || Array.isArray(answers) ||
    !ANSWER_KEYS.every((key) => isScore((answers as Record<string, unknown>)[key]))
  ) {
    return null;
  }

  const scores = answers as SafetyReviewAnswers;
  return {
    operatorName,
    country,
    activity,
    operatorAssessment: scores.operatorAssessment,
    adventurePreparation: scores.adventurePreparation,
    riskAwareness: scores.riskAwareness,
    safetyQuestions: scores.safetyQuestions,
    realWorldAccuracy: scores.realWorldAccuracy,
    experience,
    improvement: improvement || null,
  };
}
