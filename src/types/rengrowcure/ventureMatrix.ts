export type DealStage = 
  | 'Discovery' 
  | 'Value Prop' 
  | 'Proposal' 
  | 'Contract' 
  | 'Closed Won' 
  | 'Closed Lost';

export interface VentureDeal {
  id: string;
  dealCode: string;
  accountName: string;
  dealTitle: string;
  ownerName: string;
  ownerAvatar?: string;
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

export interface StagnationRiskMetric {
  stage: DealStage;
  avgDaysInStage: number;
  maxSlaAllowedDays: number;
  atRiskDealsCount: number;
  totalValueAtRisk: number;
}
