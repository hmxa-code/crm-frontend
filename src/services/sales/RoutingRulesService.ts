import { apiRequest } from '@/src/api/client';

export type ID = string;

export interface RoutingCondition {
  field: string;      // e.g., 'current_score', 'industry', 'lead_source'
  operator: 'gt' | 'lt' | 'eq' | 'contains';
  value: any;
}

export interface RoutingRule {
  id: ID;
  routingRuleId: string; // Document contract tracking identifier
  ruleName: string;
  conditions: RoutingCondition[];
  action: 'assign_to_user' | 'assign_to_team';
  targetUserId?: string;
  targetTeamId?: string;
  assignmentMode: 'round_robin' | 'least_busy';
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

const BASE = '/sales/routing-rules';

// CRUD Service Implementations — ab backend API se connected

export async function listRoutingRules(): Promise<RoutingRule[]> {
  return apiRequest.get<RoutingRule[]>(BASE);
}

// Sirf Active status wali rules (backend ka /active endpoint)
export async function listActiveRoutingRules(): Promise<RoutingRule[]> {
  return apiRequest.get<RoutingRule[]>(`${BASE}/active`);
}

export async function getRoutingRule(id: ID): Promise<RoutingRule> {
  return apiRequest.get<RoutingRule>(`${BASE}/${id}`);
}

export async function createRoutingRule(
  input: Omit<RoutingRule, 'id' | 'createdAt' | 'updatedAt'>
): Promise<RoutingRule> {
  return apiRequest.post<RoutingRule>(BASE, input);
}

export async function updateRoutingRule(
  id: ID,
  patch: Partial<Omit<RoutingRule, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<RoutingRule | null> {
  return apiRequest.put<RoutingRule>(`${BASE}/${id}`, patch);
}

export async function deleteRoutingRule(id: ID): Promise<boolean> {
  await apiRequest.delete(`${BASE}/${id}`);
  return true;
}

// Quick toggle helpers — rule ko Active/Inactive karne ke liye
export async function activateRoutingRule(id: ID): Promise<RoutingRule | null> {
  return updateRoutingRule(id, { status: 'Active' });
}

export async function deactivateRoutingRule(id: ID): Promise<RoutingRule | null> {
  return updateRoutingRule(id, { status: 'Inactive' });
}