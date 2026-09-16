export interface DimensionScores {
  qualityOfExperience: number;
  qualityOfRegulation: number;
  incidentHistory: number;
  businessInformation: number;
  riskAssessment: number;
  equipmentAssessment: number;
  safetySentiment: number;
}

export interface IncidentData {
  date: string;
  severity: string;
  title: string;
  description: string;
  source: string;
}

export interface AnalysisReport {
  operatorName: string;
  verified: boolean;
  location: string;
  activityType: string;
  reportGeneratedDate: string;
  dataCollectedUpTo: string;
  overallSafetyScore: number;
  riskLevel: string;
  confidenceScore: number;
  summary: string;
  dimensions: DimensionScores;
  incidents: IncidentData[];
  assessmentConclusion: string;
  images: string[];
}

function hashString(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DIMENSIONS: {
  key: keyof DimensionScores;
  weight: number;
}[] = [
  { key: 'qualityOfExperience', weight: 0.1 },
  { key: 'qualityOfRegulation', weight: 0.15 },
  { key: 'incidentHistory', weight: 0.2 },
  { key: 'businessInformation', weight: 0.1 },
  { key: 'riskAssessment', weight: 0.15 },
  { key: 'equipmentAssessment', weight: 0.15 },
  { key: 'safetySentiment', weight: 0.15 },
];

const INCIDENT_POOL: {
  severity: string;
  titles: string[];
  descriptions: string[];
  sources: string[];
}[] = [
  {
    severity: 'Minor',
    titles: [
      'Mild altitude sickness reported',
      'Minor guidebook mishap on trek',
      'Short delay during gear fitting',
    ],
    descriptions: [
      'Trekking group experienced mild altitude sickness. Managed on site, no evacuation required.',
      'A small harness fitting error was corrected immediately. No injuries were recorded.',
      'Departure delayed 20 minutes due to misplaced climbing gear. No safety impact.',
    ],
    sources: ['Instagram', 'TripAdvisor', 'Company Website'],
  },
  {
    severity: 'Moderate',
    titles: [
      'Rescue delayed due to weather',
      'Equipment wear flagged mid-expedition',
      'Client required evacuation assistance',
    ],
    descriptions: [
      'Bad weather delayed rescue response by approximately 2 hours. No injuries were reported.',
      'A rope was found frayed and replaced before use. Expedition continued after a 40-minute pause.',
      'One client required assisted descent after fatigue. Guide team handled it without medical treatment.',
    ],
    sources: ['News Article', 'Instagram', 'Rescue Log'],
  },
  {
    severity: 'Major',
    titles: [
      'Emergency evacuation during storm',
      'Serious fall on exposed ridge',
      'Aborted summit due to medical issue',
    ],
    descriptions: [
      'A storm forced an emergency evacuation. Weather led to delays but all clients returned safely.',
      'A client slipped on an exposed section and sustained injuries. Airlift was arranged promptly.',
      'Summit attempt aborted after a client showed signs of severe altitude illness. Treated at base camp.',
    ],
    sources: ['News Article', 'Incident Report', 'Rescue Log'],
  },
  {
    severity: 'None',
    titles: ['No incidents reported'],
    descriptions: ['No safety incidents found during this period.'],
    sources: ['Company Website'],
  },
];

const LOCATIONS = [
  'Kathmandu, Nepal',
  'Aoraki, New Zealand',
  'Chamonix, France',
  'Queenstown, New Zealand',
  'Lima, Peru',
  'Reykjavik, Iceland',
];

const ACTIVITIES = [
  'Adventure Trekking, Climbing',
  'Himalayan Trekking, Mountaineering',
  'Alpine Climbing, Glacier Hiking',
  'Multi-day Trekking, Camping',
  'Trail Running, Peak Summiting',
];

export function generateMockAnalysis(query: string): AnalysisReport {
  const seed = hashString(query.trim().toLowerCase());
  const rand = mulberry32(seed);

  const weakIndex = Math.floor(rand() * DIMENSIONS.length);
  const strongIndex = Math.floor(rand() * DIMENSIONS.length);

  const dimensions = {} as DimensionScores;
  let weightedSum = 0;

  DIMENSIONS.forEach(({ key, weight }, index) => {
    const randScore = 60 + Math.floor(rand() * 38);
    let score: number;
    if (index === weakIndex) {
      score = 42 + Math.floor(rand() * 26);
    } else if (index === strongIndex) {
      score = 88 + Math.floor(rand() * 11);
    } else {
      score = randScore;
    }
    score = Math.max(38, Math.min(99, score));
    dimensions[key] = score;
    weightedSum += score * weight;
  });

  const overallSafetyScore = Math.round(weightedSum);
  const riskLevel =
    overallSafetyScore >= 85
      ? 'Low Risk'
      : overallSafetyScore >= 68
        ? 'Medium Risk'
        : 'High Risk';

  const lowScores = DIMENSIONS.filter(
    ({ key }) => dimensions[key] < 70
  ).length;
  const confidenceScore = Math.max(
    70,
    Math.min(98, Math.round(96 - lowScores * 5 + rand() * 4))
  );

  const incidentHistory = dimensions.incidentHistory;
  const incidentLimit =
    incidentHistory >= 90 ? 1 : incidentHistory >= 75 ? 2 : 3;

  const incidents: IncidentData[] = [];
  const pool = INCIDENT_POOL.filter(
    (p) => p.severity !== 'None' || incidentLimit < 2
  );

  for (let i = 0; i < incidentLimit; i++) {
    const brand = rand();
    const entry =
      brand < 0.55
        ? pool.find((p) => p.severity === 'Minor')
        : brand < 0.85
          ? pool.find((p) => p.severity === 'Moderate')
          : pool.find((p) => p.severity === 'Major');
    if (!entry) continue;

    const monthsAgo = Math.floor(rand() * 24) + 2 + i * 14;
    const d = new Date();
    d.setMonth(d.getMonth() - monthsAgo);
    const date = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    incidents.push({
      date,
      severity: entry.severity,
      title: entry.titles[Math.floor(rand() * entry.titles.length)],
      description:
        entry.descriptions[Math.floor(rand() * entry.descriptions.length)],
      source: entry.sources[Math.floor(rand() * entry.sources.length)],
    });
  }

  if (incidents.length === 0) {
    incidents.push({
      date: 'No incidents reported',
      severity: 'None',
      title: 'No incidents reported',
      description: 'No safety incidents found during this period.',
      source: 'Company Website',
    });
  }

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const separator = query.trim().endsWith('.') ? '' : '.';
  const summary =
    `${query}${separator} Our review found a ${riskLevel.toLowerCase()} safety profile ` +
    `with an overall score of ${overallSafetyScore}/100. The strongest areas were ` +
    `${dimensions.safetySentiment >= 78 ? 'safety sentiment' : 'regulatory coverage'}, ` +
    `while ${dimensions.incidentHistory < 70 ? 'incident history' : 'equipment assessment'} ` +
    `needs closer attention based on the latest available data.`;

  return {
    operatorName: query,
    verified: true,
    location: LOCATIONS[Math.floor(rand() * LOCATIONS.length)],
    activityType: ACTIVITIES[Math.floor(rand() * ACTIVITIES.length)],
    reportGeneratedDate: today.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    dataCollectedUpTo: yesterday.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    overallSafetyScore,
    riskLevel,
    confidenceScore,
    summary,
    dimensions,
    incidents,
    assessmentConclusion:
      riskLevel === 'Low Risk'
        ? `The operator satisfies our safety framework for ${ACTIVITIES[Math.floor(rand() * ACTIVITIES.length)].toLowerCase()}.`
        : 'The operator requires closer monitoring before full approval for adventure trips.',
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    ],
  };
}