import { apiRequest } from '@/src/api/client';

export type ID = string;

export interface LeadActivity {
  id: ID;
  leadId: string;
  channel: 'email' | 'sms' | 'call' | 'task';
  actionType: 'send' | 'open' | 'click' | 'queued' | 'completed';
  contentTemplateId?: string;
  scheduledFor?: string;
  sentAt?: string;
  result?: 'success' | 'failed' | 'pending';
  notes?: string;
  createdAt: string;
}

const BASE = '/sales/activity-logs';

const normalizeActivity = (
  activity: LeadActivity | (Partial<LeadActivity> & Record<string, unknown>)
): LeadActivity => {
  const raw = activity as Partial<LeadActivity> & Record<string, unknown>;

  return {
    id: (activity.id as string | undefined) ?? (raw._id as string | undefined) ?? '',
    leadId: (activity.leadId as string | undefined) ?? (raw.lead_id as string | undefined) ?? '',
    channel: (activity.channel as LeadActivity['channel'] | undefined) ?? 'email',
    actionType: (activity.actionType as LeadActivity['actionType'] | undefined) ?? 'queued',
    contentTemplateId: activity.contentTemplateId as string | undefined,
    scheduledFor: activity.scheduledFor as string | undefined,
    sentAt: activity.sentAt as string | undefined,
    result: activity.result as LeadActivity['result'] | undefined,
    notes: activity.notes as string | undefined,
    createdAt: (activity.createdAt as string | undefined) ?? '',
  } as LeadActivity;
};

// CRUD Service Implementations — ab backend API se connected

export async function listActivities(filters?: Record<string, string>): Promise<LeadActivity[]> {
  const query = filters ? `?${new URLSearchParams(filters).toString()}` : '';
  const activities = await apiRequest.get<LeadActivity[]>(`${BASE}${query}`);
  return Array.isArray(activities) ? activities.map(normalizeActivity) : [];
}

export async function getActivity(id: ID): Promise<LeadActivity> {
  const activity = await apiRequest.get<LeadActivity>(`${BASE}/${id}`);
  return normalizeActivity(activity as Partial<LeadActivity> & Record<string, unknown>);
}

export async function addActivity(
  input: Omit<LeadActivity, 'id' | 'createdAt'>
): Promise<LeadActivity> {
  return apiRequest.post<LeadActivity>(BASE, input);
}

export async function updateActivity(
  id: ID,
  patch: Partial<Omit<LeadActivity, 'id' | 'createdAt'>>
): Promise<LeadActivity | null> {
  return apiRequest.put<LeadActivity>(`${BASE}/${id}`, patch);
}

export async function deleteActivity(id: ID): Promise<boolean> {
  await apiRequest.delete(`${BASE}/${id}`);
  return true;
}