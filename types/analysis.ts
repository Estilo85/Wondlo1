export interface SafetyDimensions {
  qualityOfExperience: number; // 10%
  qualityOfRegulation: number; // 15%
  incidentHistory: number;     // 20%
  businessInformation: number; // 10%
  riskAssessment: number;      // 15%
  equipmentAssessment: number; // 15%
  safetySentiment: number;     // 15%
}

export interface Incident {
  date: string;
  severity: 'Minor' | 'None' | 'Moderate' | 'Severe';
  title: string;
  description: string;
  source: string;
}

export interface OperatorAnalysis {
  operatorName: string;
  verified: boolean;
  location: string;
  activityType: string;
  reportGeneratedDate: string;
  dataCollectedUpTo: string;
  overallSafetyScore: number;
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk';
  confidenceScore: number;
  summary: string;
  dimensions: SafetyDimensions;
  incidents: Incident[];
  assessmentConclusion: string;
  images: string[];
}