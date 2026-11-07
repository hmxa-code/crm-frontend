import { 
  MonthlyRevenueData, 
  FunnelMetric, 
  RepPerformanceLeaderboard, 
  ChannelAttributionCohort 
} from '@/src/types/rengrowcure/reportsCure';

export const mockMonthlyRevenue: MonthlyRevenueData[] = [
  { month: 'May 2026', actualArr: 420000, projectedArr: 400000, pipelineValue: 1250000, closedWon: 380000 },
  { month: 'Jun 2026', actualArr: 485000, projectedArr: 460000, pipelineValue: 1420000, closedWon: 450000 },
  { month: 'Jul 2026', actualArr: 530000, projectedArr: 520000, pipelineValue: 1680000, closedWon: 510000 },
  { month: 'Aug 2026', actualArr: 610000, projectedArr: 580000, pipelineValue: 1950000, closedWon: 590000 },
  { month: 'Sep 2026', actualArr: 695000, projectedArr: 670000, pipelineValue: 2280000, closedWon: 670000 },
  { month: 'Oct 2026', actualArr: 780000, projectedArr: 750000, pipelineValue: 2640000, closedWon: 745000 },
];

export const mockFunnelMetrics: FunnelMetric[] = [
  { stage: 'Prospects (Cold)', count: 3240, conversionRate: 100, value: 5800000 },
  { stage: 'MQLs Evaluated', count: 1420, conversionRate: 43.8, value: 3950000 },
  { stage: 'SQLs Qualified', count: 680, conversionRate: 47.8, value: 2420000 },
  { stage: 'Proposal / Solution', count: 240, conversionRate: 35.2, value: 1650000 },
  { stage: 'Contract & Legal', count: 96, conversionRate: 40.0, value: 980000 },
  { stage: 'Closed Won', count: 72, conversionRate: 75.0, value: 745000 },
];

export const mockLeaderboard: RepPerformanceLeaderboard[] = [
  {
    id: 'lead-1',
    repName: 'Marcus Vance',
    avatar: 'MV',
    quotaTarget: 250000,
    achievement: 310000,
    quotaPercent: 124,
    dealsClosed: 8,
    avgVelocityDays: 24.5,
    touchpointsLogged: 342,
    winRatePercent: 42.1,
    rank: 1,
  },
  {
    id: 'lead-2',
    repName: 'Elena Rostova',
    avatar: 'ER',
    quotaTarget: 200000,
    achievement: 228000,
    quotaPercent: 114,
    dealsClosed: 6,
    avgVelocityDays: 21.0,
    touchpointsLogged: 295,
    winRatePercent: 38.5,
    rank: 2,
  },
  {
    id: 'lead-3',
    repName: 'Liam Davies',
    avatar: 'LD',
    quotaTarget: 180000,
    achievement: 162000,
    quotaPercent: 90,
    dealsClosed: 4,
    avgVelocityDays: 32.4,
    touchpointsLogged: 210,
    winRatePercent: 29.8,
    rank: 3,
  },
  {
    id: 'lead-4',
    repName: 'Aisha Al-Mansoor',
    avatar: 'AA',
    quotaTarget: 120000,
    achievement: 135000,
    quotaPercent: 112.5,
    dealsClosed: 5,
    avgVelocityDays: 16.2,
    touchpointsLogged: 412,
    winRatePercent: 34.0,
    rank: 4,
  },
];

export const mockCohorts: ChannelAttributionCohort[] = [
  {
    channel: 'LinkedIn Outbound & InMail',
    leadsGenerated: 1450,
    sqlsConverted: 310,
    dealsWon: 28,
    revenueGenerated: 410000,
    cac: 1250,
    roiMultiplier: 6.4,
    avgDaysToClose: 26,
  },
  {
    channel: 'Healthcare Webinars & Events',
    leadsGenerated: 820,
    sqlsConverted: 240,
    dealsWon: 24,
    revenueGenerated: 325000,
    cac: 1850,
    roiMultiplier: 5.1,
    avgDaysToClose: 21,
  },
  {
    channel: 'Organic SEO & Clinical Whitepapers',
    leadsGenerated: 2100,
    sqlsConverted: 290,
    dealsWon: 22,
    revenueGenerated: 285000,
    cac: 620,
    roiMultiplier: 9.2,
    avgDaysToClose: 34,
  },
  {
    channel: 'Paid Search (Google MedTech)',
    leadsGenerated: 940,
    sqlsConverted: 160,
    dealsWon: 12,
    revenueGenerated: 145000,
    cac: 2400,
    roiMultiplier: 3.2,
    avgDaysToClose: 29,
  },
];

export const reportsCureService = {
  getRevenueData: () => Promise.resolve([...mockMonthlyRevenue]),
  getFunnelMetrics: () => Promise.resolve([...mockFunnelMetrics]),
  getLeaderboard: () => Promise.resolve([...mockLeaderboard]),
  getCohorts: () => Promise.resolve([...mockCohorts]),
};
