export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ModuleType = 'GENERAL' | 'SALES' | 'MARKETING' | 'SUPPORT';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskComment {
  id: string;
  author: string;
  text: string;
  time: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  moduleType: ModuleType;
  assigneeId?: string;
  projectId?: string;
  projectName?: string;
  tags?: string[];
  subtasks?: Subtask[];
  comments?: TaskComment[];
  estimatedHours?: number;
  loggedHours?: number;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  { id: 'u1', name: 'Muhammad Hamza', initials: 'MH', color: 'bg-blue-500' },
  { id: 'u2', name: 'Ali Raza',        initials: 'AR', color: 'bg-emerald-500' },
  { id: 'u3', name: 'Sara Ahmed',      initials: 'SA', color: 'bg-violet-500' },
  { id: 'u4', name: 'Usman Khan',      initials: 'UK', color: 'bg-amber-500' },
  { id: 'u5', name: 'Fatima Malik',    initials: 'FM', color: 'bg-rose-500' },
];

export const getMember = (id?: string) => TEAM_MEMBERS.find((m) => m.id === id);

export const STATUS_COLUMNS: { key: TaskStatus; label: string; badgeBg: string; dot: string }[] = [
  { key: 'TODO',        label: 'To Do',      badgeBg: 'bg-slate-100 text-slate-600 border-slate-200',     dot: 'bg-slate-400' },
  { key: 'IN_PROGRESS', label: 'In Progress', badgeBg: 'bg-blue-50 text-blue-600 border-blue-200',        dot: 'bg-blue-500' },
  { key: 'IN_REVIEW',  label: 'In Review',   badgeBg: 'bg-violet-50 text-violet-600 border-violet-200',  dot: 'bg-violet-500' },
  { key: 'DONE',       label: 'Done',        badgeBg: 'bg-emerald-50 text-emerald-600 border-emerald-200', dot: 'bg-emerald-500' },
];

export const PRIORITY_OPTIONS: { key: TaskPriority; label: string; className: string }[] = [
  { key: 'LOW',    label: 'Low',    className: 'bg-slate-50 text-slate-500 border-slate-200' },
  { key: 'MEDIUM', label: 'Medium', className: 'bg-amber-50 text-amber-600 border-amber-200' },
  { key: 'HIGH',   label: 'High',   className: 'bg-orange-50 text-orange-600 border-orange-200' },
  { key: 'URGENT', label: 'Urgent', className: 'bg-red-50 text-red-600 border-red-200' },
];

export function getPriorityConfig(priority: TaskPriority) {
  return PRIORITY_OPTIONS.find((p) => p.key === priority) ?? PRIORITY_OPTIONS[0];
}

export function getStatusConfig(status: TaskStatus) {
  return STATUS_COLUMNS.find((s) => s.key === status) ?? STATUS_COLUMNS[0];
}

export const SEED_TASKS: Task[] = [
  {
    _id: 'task-001',
    title: 'Set up CRM lead import pipeline',
    description: 'Configure the CSV import module to auto-map fields and validate data before insertion.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    moduleType: 'SALES',
    assigneeId: 'u1',
    tags: ['CRM', 'Import', 'Pipeline'],
    estimatedHours: 8,
    subtasks: [
      { id: 'st-1', title: 'Design field mapping schema', completed: true },
      { id: 'st-2', title: 'Build validation rules', completed: false },
      { id: 'st-3', title: 'Test with sample data', completed: false },
    ],
    dueDate: '2026-11-05T00:00:00Z',
    createdAt: '2026-10-20T08:00:00Z',
    updatedAt: '2026-10-28T14:00:00Z',
  },
  {
    _id: 'task-002',
    title: 'Design Q4 marketing email templates',
    description: 'Create responsive email templates for the Q4 drip campaign targeting enterprise leads.',
    status: 'TODO',
    priority: 'MEDIUM',
    moduleType: 'MARKETING',
    assigneeId: 'u3',
    tags: ['Email', 'Campaign', 'Design'],
    estimatedHours: 6,
    subtasks: [
      { id: 'st-4', title: 'Wireframe layouts', completed: false },
      { id: 'st-5', title: 'Write copy', completed: false },
    ],
    dueDate: '2026-11-10T00:00:00Z',
    createdAt: '2026-10-22T09:00:00Z',
    updatedAt: '2026-10-22T09:00:00Z',
  },
  {
    _id: 'task-003',
    title: 'Fix ticket assignment bug in support module',
    description: 'When reassigning tickets, the original agent receives duplicate notifications. Investigate and resolve.',
    status: 'IN_REVIEW',
    priority: 'URGENT',
    moduleType: 'SUPPORT',
    assigneeId: 'u2',
    tags: ['Bug', 'Notifications', 'Support'],
    estimatedHours: 3,
    subtasks: [
      { id: 'st-6', title: 'Reproduce the bug', completed: true },
      { id: 'st-7', title: 'Trace notification service', completed: true },
      { id: 'st-8', title: 'Deploy fix', completed: false },
    ],
    dueDate: '2026-11-01T00:00:00Z',
    createdAt: '2026-10-25T10:00:00Z',
    updatedAt: '2026-10-29T11:00:00Z',
  },
  {
    _id: 'task-004',
    title: 'Onboard new enterprise client — Zeta Corp',
    description: 'Complete account setup, role assignments, and initial training session for Zeta Corp team.',
    status: 'TODO',
    priority: 'HIGH',
    moduleType: 'SALES',
    assigneeId: 'u4',
    tags: ['Onboarding', 'Enterprise', 'Client'],
    estimatedHours: 12,
    dueDate: '2026-11-08T00:00:00Z',
    createdAt: '2026-10-26T08:30:00Z',
    updatedAt: '2026-10-26T08:30:00Z',
  },
  {
    _id: 'task-005',
    title: 'Publish October performance report',
    description: 'Compile all KPIs from the analytics dashboard and prepare the monthly report for leadership.',
    status: 'DONE',
    priority: 'MEDIUM',
    moduleType: 'GENERAL',
    assigneeId: 'u5',
    tags: ['Report', 'Analytics', 'Monthly'],
    estimatedHours: 4,
    dueDate: '2026-10-31T00:00:00Z',
    createdAt: '2026-10-15T07:00:00Z',
    updatedAt: '2026-10-30T16:00:00Z',
  },
  {
    _id: 'task-006',
    title: 'Integrate Slack notifications for deal updates',
    description: 'Use the Slack API to push real-time deal stage updates to the #sales-updates channel.',
    status: 'TODO',
    priority: 'LOW',
    moduleType: 'SALES',
    assigneeId: 'u1',
    tags: ['Slack', 'Integration', 'Notifications'],
    estimatedHours: 5,
    dueDate: '2026-11-15T00:00:00Z',
    createdAt: '2026-10-28T09:00:00Z',
    updatedAt: '2026-10-28T09:00:00Z',
  },
  {
    _id: 'task-007',
    title: 'A/B test landing page hero section',
    description: 'Run a 2-week A/B test comparing two CTA copy variants on the main landing page.',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    moduleType: 'MARKETING',
    assigneeId: 'u3',
    tags: ['A/B Test', 'Landing Page', 'CRO'],
    estimatedHours: 10,
    dueDate: '2026-11-14T00:00:00Z',
    createdAt: '2026-10-20T11:00:00Z',
    updatedAt: '2026-10-27T15:00:00Z',
  },
  {
    _id: 'task-008',
    title: 'Review and update user permission matrix',
    description: 'Audit all roles and permissions against the latest security policy and update documentation.',
    status: 'DONE',
    priority: 'HIGH',
    moduleType: 'GENERAL',
    assigneeId: 'u2',
    tags: ['Security', 'Permissions', 'Audit'],
    estimatedHours: 6,
    dueDate: '2026-10-28T00:00:00Z',
    createdAt: '2026-10-10T08:00:00Z',
    updatedAt: '2026-10-28T17:00:00Z',
  },
];
