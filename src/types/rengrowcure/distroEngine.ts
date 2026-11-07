export interface RoutingRule {
  id: string;
  ruleId: string;
  ruleName: string;
  assignmentMode: 'Round Robin' | 'Weighted' | 'Load Balanced' | 'Geographic';
  targetEntity: string;
  conditionCriteria: string;
  priority: number;
  slaMinutes: number;
  fallbackRep: string;
  status: 'Active' | 'Paused' | 'Archived';
  leadsAssignedToday: number;
}

export interface SalesRepCapacity {
  id: string;
  repName: string;
  avatar: string;
  role: string;
  region: string;
  currentActiveLeads: number;
  maxLeadCap: number;
  shiftSchedule: '08:00 - 16:00' | '10:00 - 18:00' | '13:00 - 21:00' | 'Flexible';
  status: 'Available' | 'At Capacity' | 'On Break' | 'Out of Office';
  conversionRate: number;
  avgResponseMins: number;
  autoPauseOnSlaBreach: boolean;
}

export interface DistributionTraceLog {
  id: string;
  timestamp: string;
  leadId: string;
  leadName: string;
  assignedRep: string;
  team: string;
  routingRuleMatched: string;
  algorithmUsed: string;
  decisionLatencyMs: number;
  status: 'Success' | 'Fallback Route' | 'Queue Overflow' | 'Manual Override';
}
