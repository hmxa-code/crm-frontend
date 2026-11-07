import { apiRequest } from '@/src/api/client';

export type ID = string;

export interface SequenceStep {
  id: string;
  order: number;
  channel: 'email' | 'sms' | 'call' | 'task';
  delayDays: number;
  delayHours?: number;
  contentTemplateId?: string;
  stepTitle: string;
}

export interface Sequence {
  id: ID;
  sequence_id: string; // Document contract identifier (e.g., SEQ-SALES-01)
  sequence_name: string;
  description?: string;
  status: 'Active' | 'Paused';
  trigger_event: string; // e.g., 'Lead_SQL_Entered'
  trigger_condition?: Record<string, any>;
  steps: SequenceStep[];
  stop_conditions: string[]; // e.g., ['Meeting_Booked', 'Lead_Converted']
  createdAt: string;
  updatedAt: string;
}

const BASE = '/sales/sequences';

// CRUD Service Implementations — ab backend API se connected

export async function listSequences(): Promise<Sequence[]> {
  return apiRequest.get<Sequence[]>(BASE);
}

export async function getSequence(id: ID): Promise<Sequence> {
  return apiRequest.get<Sequence>(`${BASE}/${id}`);
}

export async function createSequence(
  input: Omit<Sequence, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Sequence> {
  return apiRequest.post<Sequence>(BASE, input);
}

export async function updateSequence(
  id: ID,
  patch: Partial<Omit<Sequence, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Sequence | null> {
  return apiRequest.put<Sequence>(`${BASE}/${id}`, patch);
}

export async function deleteSequence(id: ID): Promise<boolean> {
  await apiRequest.delete(`${BASE}/${id}`);
  return true;
}

// ─── Pause / Start Actions (frontend "Action" column ke liye) ───

// Sequence ko Paused karna — automation rukk jayega
export async function pauseSequence(id: ID): Promise<Sequence | null> {
  return updateSequence(id, { status: 'Paused' });
}

// Sequence ko wapas Active/Start karna
export async function startSequence(id: ID): Promise<Sequence | null> {
  return updateSequence(id, { status: 'Active' });
}

// Ek hi function se dono handle karna ho to ye bhi use kar sakte ho
export async function toggleSequenceStatus(id: ID, currentStatus: Sequence['status']): Promise<Sequence | null> {
  return currentStatus === 'Active' ? pauseSequence(id) : startSequence(id);
}

// ─── Step management ───
// Backend mein step ka alag endpoint nahi hai, isliye current sequence fetch
// karke steps array modify karte hain, phir poori sequence update karte hain.
export async function upsertStep(sequenceId: ID, step: SequenceStep): Promise<Sequence | null> {
  const seq = await getSequence(sequenceId);
  if (!seq) return null;

  const steps = [...seq.steps];
  const idx = steps.findIndex((st) => st.id === step.id);
  if (idx === -1) {
    steps.push(step);
  } else {
    steps[idx] = step;
  }

  steps.sort((a, b) => a.order - b.order);
  return updateSequence(sequenceId, { steps });
}