export interface MonthlyRevenueData {
  month: string;
  actualArr: number;
  projectedArr: number;
  pipelineValue: number;
  closedWon: number;
}

export interface FunnelMetric {
  stage: string;
  count: number;
  conversionRate: number;
  value: number;
}

export interface RepPerformanceLeaderboard {
  id: string;
  repName: string;
  avatar?: string;
  quotaTarget: number;
  achievement: number;
  quotaPercent: number;
  dealsClosed: number;
  avgVelocityDays: number;
  touchpointsLogged: number;
  winRatePercent: number;
  rank: number;
}

export interface ChannelAttributionCohort {
  channel: string;
  leadsGenerated: number;
  sqlsConverted: number;
  dealsWon: number;
  revenueGenerated: number;
  cac: number;
  roiMultiplier: number;
  avgDaysToClose: number;
}
