import { apiRequest } from '@/src/api/client';

export type ID = string;
export type TaskStatus = 'Open' | 'Done' | 'Cancelled' | 'paused';

export interface SalesTask {
  id: ID;
  task_id: string; // Document contract identifier (e.g., TASK-88)
  opportunity_id?: string;
  lead_id?: string;
  assigned_to: string; // User ID (e.g., USER-9)
  task_title: string;
  due_date: string;
  status: TaskStatus;
  priority: 'Low' | 'Med' | 'High';
  createdAt: string;
  updatedAt: string;
}

const BASE = '/sales/tasks';

const normalizeTask = (
  task: SalesTask | (Partial<SalesTask> & Record<string, unknown>)
): SalesTask => {
  const raw = task as Partial<SalesTask> & Record<string, unknown>;

  return {
    id: (task.id as string | undefined) ?? (raw._id as string | undefined) ?? (task.task_id as string | undefined) ?? '',
    task_id: (task.task_id as string | undefined) ?? (task.id as string | undefined) ?? (raw._id as string | undefined) ?? '',
    opportunity_id: (task.opportunity_id as string | undefined) ?? undefined,
    lead_id: (task.lead_id as string | undefined) ?? undefined,
    assigned_to: (task.assigned_to as string | undefined) ?? '',
    task_title: (task.task_title as string | undefined) ?? '',
    due_date: (task.due_date as string | undefined) ?? '',
    status: (task.status as TaskStatus | undefined) ?? 'Open',
    priority: (task.priority as SalesTask['priority'] | undefined) ?? 'Low',
    createdAt: (task.createdAt as string | undefined) ?? '',
    updatedAt: (task.updatedAt as string | undefined) ?? '',
  } as SalesTask;
};

// CRUD Service Implementations — ab backend API se connected

export async function listTasks(): Promise<SalesTask[]> {
  const tasks = await apiRequest.get<SalesTask[]>(BASE);
  return Array.isArray(tasks) ? tasks.map(normalizeTask) : [];
}

export async function getTask(id: ID): Promise<SalesTask> {
  const task = await apiRequest.get<SalesTask>(`${BASE}/${id}`);
  return normalizeTask(task as Partial<SalesTask> & Record<string, unknown>);
}

export async function createTask(
  input: Omit<SalesTask, 'id' | 'createdAt' | 'updatedAt'>
): Promise<SalesTask> {
  return apiRequest.post<SalesTask>(BASE, input);
}

export async function updateTask(
  id: ID,
  patch: Partial<Omit<SalesTask, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<SalesTask | null> {
  return apiRequest.put<SalesTask>(`${BASE}/${id}`, patch);
}

export async function updateTaskStatus(id: ID, status: TaskStatus): Promise<SalesTask | null> {
  return apiRequest.patch<SalesTask>(`${BASE}/${id}/status`, { status });
}

export async function deleteTask(id: ID): Promise<boolean> {
  await apiRequest.delete(`${BASE}/${id}`);
  return true;
}

// ─── Pause / Start Actions (frontend "Action" column ke liye) ───

// Task ko Pause karna
export async function pauseTask(id: ID): Promise<SalesTask | null> {
  return updateTaskStatus(id, 'paused');
}

// Task ko wapas Start/Resume karna (Open state mein le aana)
export async function startTask(id: ID): Promise<SalesTask | null> {
  return updateTaskStatus(id, 'Open');
}

// Ek hi function se dono handle karna ho to ye bhi use kar sakte ho
export async function toggleTaskStatus(id: ID, currentStatus: TaskStatus): Promise<SalesTask | null> {
  return currentStatus === 'paused' ? startTask(id) : pauseTask(id);
}

// Task complete/cancel marking ke liye extra helpers
export async function completeTask(id: ID): Promise<SalesTask | null> {
  return updateTaskStatus(id, 'Done');
}

export async function cancelTask(id: ID): Promise<SalesTask | null> {
  return updateTaskStatus(id, 'Cancelled');
}