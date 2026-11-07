export interface LeadIntelWeightConfig {
  fb: number;
  linkedin: number;
  demo: number;
  email: number;
  webinar: number;
  websiteVisits: number;
}

export interface ScoringProfile {
  id: string;
  modelId: string;
  profileName: string;
  targetTier: 'Enterprise' | 'Mid-Market' | 'SMB' | 'Strategic';
  weights: LeadIntelWeightConfig;
  mqlThreshold: number;
  sqlThreshold: number;
  maxScore: number;
  status: 'Active' | 'Draft' | 'Deprecated';
  evaluationCount: number;
  conversionRate: number;
  lastUpdated: string;
}

export interface QualificationRule {
  id: string;
  ruleCode: string;
  name: string;
  fromStage: 'Cold' | 'Warm' | 'MQL';
  toStage: 'Warm' | 'MQL' | 'SQL';
  conditionField: string;
  operator: 'greater_than' | 'equals' | 'contains' | 'in_range';
  value: string | number;
  autoAction: string;
  isActive: boolean;
  priority: number;
}

export interface ScoringTelemetryEvent {
  id: string;
  timestamp: string;
  leadName: string;
  leadCompany: string;
  eventType: 'Form Submit' | 'Demo Booked' | 'LinkedIn Click' | 'Page Visit' | 'Whitepaper Download';
  scoreDelta: number;
  resultingScore: number;
  appliedModel: string;
  status: 'Qualified' | 'Evaluating' | 'Nurturing' | 'Auto-Promoted';
  latencyMs: number;
}
