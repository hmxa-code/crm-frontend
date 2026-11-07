import { apiRequest } from '@/src/api/client';

export type ID = string;

export interface LeadScoreModel {
  id: ID;
  scoring_model_id: string; // Contract identifier (e.g., SCORE-SALES-01)
  model_name: string;
  description?: string;
  status: 'Active' | 'Inactive';
  scoring_rules: string[]; // Logic representations or rule keys
  lead_source_weights: Record<string, number>;
  engagement_weights: Record<string, number>;
  behavioral_weights: Record<string, number>;
  demographic_weights: Record<string, number>;
  total_possible_score: number;
  sales_ready_threshold: number;
  createdAt: string;
  updatedAt: string;
}

const BASE = '/sales/lead-scoring';

// CRUD Service Implementations — ab backend API se connected

export async function listLeadScoringModels(): Promise<LeadScoreModel[]> {
  return apiRequest.get<LeadScoreModel[]>(BASE);
}

export async function getLeadScoringModel(id: ID): Promise<LeadScoreModel> {
  return apiRequest.get<LeadScoreModel>(`${BASE}/${id}`);
}

export async function createLeadScoringModel(
  input: Omit<LeadScoreModel, 'id' | 'createdAt' | 'updatedAt'>
): Promise<LeadScoreModel> {
  return apiRequest.post<LeadScoreModel>(BASE, input);
}

export async function updateLeadScoringModel(
  id: ID,
  patch: Partial<Omit<LeadScoreModel, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<LeadScoreModel | null> {
  return apiRequest.put<LeadScoreModel>(`${BASE}/${id}`, patch);
}

export async function deleteLeadScoringModel(id: ID): Promise<boolean> {
  await apiRequest.delete(`${BASE}/${id}`);
  return true;
}