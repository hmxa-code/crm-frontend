export type DealStage =
  | 'Discovery'
  | 'Value Prop'
  | 'Proposal'
  | 'Negotiation'
  | 'Contract'
  | 'Closed Won'
  | 'Closed Lost';

export interface Opportunity {
  id: string;
  dealCode: string;
  accountName: string;
  dealTitle: string;
  ownerName: string;
  ownerAvatar: string;
  stage: DealStage;
  amount: number;
  mrr: number;
  arr: number;
  closeProbability: number;
  expectedCloseDate: string;
  stagnationDays: number;
  slaBreachRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  healthScore: number;
  lastTouchpoint: string;
  primaryContact: string;
  industry: string;
  notes?: string;
}

// dealFlowService.ts mein VentureDeal import ho raha hai, jo Opportunity ka hi shape hai
export type VentureDeal = Opportunity;

export interface PipelineStageStats {
  stage: DealStage;
  count: number;
  totalValue: number;
  weightedValue: number;
}

export interface StagnationRiskMetric {
  stage: DealStage;
  avgDaysInStage: number;
  maxSlaAllowedDays: number;
  atRiskDealsCount: number;
  totalValueAtRisk: number;
}