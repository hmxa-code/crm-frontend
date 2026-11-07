'use client';

import { create } from 'zustand';
import { Task, TaskStatus, TaskPriority, ModuleType, SEED_TASKS, TEAM_MEMBERS, TeamMember } from '../task-workstation/data/taskHelpers';

// -------------------------------------------------------------
// PROJECT TYPES & INTERFACES
// -------------------------------------------------------------
export type ProjectHealth = 'ON_TRACK' | 'AT_RISK' | 'CRITICAL' | 'COMPLETED';
export type ProjectPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ProjectMilestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface ProjectTeamAllocation {
  userId: string;
  role: string;
  allocatedHours: number;
}

export interface EnterpriseProject {
  id: string;
  name: string;
  code: string;
  client: string;
  description: string;
  category: ModuleType;
  health: ProjectHealth;
  priority: ProjectPriority;
  status: 'ACTIVE' | 'PLANNING' | 'ON_HOLD' | 'COMPLETED';
  progress: number; // 0 - 100
  startDate: string;
  dueDate: string;
  budgetTotal: number;
  budgetSpent: number;
  totalEstimatedHours: number;
  loggedHours: number;
  team: ProjectTeamAllocation[];
  milestones: ProjectMilestone[];
  techStack: string[];
}

// -------------------------------------------------------------
// TIME TRACKING TYPES
// -------------------------------------------------------------
export interface TimeLogEntry {
  id: string;
  projectId: string;
  projectName: string;
  taskId?: string;
  taskTitle?: string;
  description: string;
  startTime: string; // ISO
  endTime: string;   // ISO
  durationSeconds: number;
  isBillable: boolean;
  hourlyRate: number;
  userName: string;
  date: string; // YYYY-MM-DD
}

export interface ActiveTimerState {
  isRunning: boolean;
  isPaused: boolean;
  projectId: string;
  projectName: string;
  taskId?: string;
  taskTitle?: string;
  description: string;
  isBillable: boolean;
  startTime: number | null; // Date.now() timestamp
  elapsedSeconds: number;
  shadowModeActive: boolean; // OS Desktop Shadow Monitoring state
}

// -------------------------------------------------------------
// ACTIVITY & BEHAVIOR TRACKING TYPES
// -------------------------------------------------------------
export type AppCategory = 'DEVELOPMENT' | 'DESIGN' | 'COMMUNICATION' | 'RESEARCH' | 'MEETINGS' | 'OTHER';
export type ProductivityRating = 'HIGHLY_PRODUCTIVE' | 'PRODUCTIVE' | 'NEUTRAL' | 'DISTRACTED';

export interface AppActivityLog {
  id: string;
  projectId: string;
  projectName: string;
  appName: string;
  windowTitle: string;
  category: AppCategory;
  durationMinutes: number;
  activePercentage: number;
  keystrokes: number;
  mouseClicks: number;
  timestamp: string;
  iconName: string;
}

export interface BrowsingLog {
  id: string;
  projectId: string;
  domain: string;
  urlTitle: string;
  fullUrl: string;
  timeSpentSeconds: number;
  rating: ProductivityRating;
  visitTime: string;
  visitsCount: number;
}

export interface KeypressLogItem {
  id: string;
  timestamp: string;
  keyCombo: string;
  appName: string;
  category: 'CODE' | 'HOTKEY' | 'COMMAND' | 'NAVIGATION' | 'TEXT';
  wpm: number;
  keystrokeCount: number;
}

export interface TenMinuteSummary {
  id: string;
  projectId: string;
  projectName: string;
  date: string;
  timeSlot: string; // e.g. "16:00 - 16:10"
  startTimestamp: string;
  productivityScore: number; // 0 - 100
  dominantApp: string;
  appDistribution: { app: string; percentage: number; color: string }[];
  keystrokes: number;
  clicks: number;
  hotkeysCount: number;
  status: ProductivityRating;
  summaryNote: string;
  typedSummary: string; // Exact typing / code buffer description
  hotkeysSample: string[]; // e.g. ["Ctrl + S", "Alt + Tab"]
  screenshotThumb?: string;
  activeWindowTitle: string;
}

// -------------------------------------------------------------
// INITIAL SEED DATA
// -------------------------------------------------------------
export const INITIAL_PROJECTS: EnterpriseProject[] = [
  {
    id: 'proj-001',
    name: 'Wholcure CRM Enterprise',
    code: 'WHC-CRM',
    client: 'Wholcure Healthcare Solutions',
    description: 'Next-gen enterprise patient and customer relationship management system with unified workflows, compliance, and billing engine.',
    category: 'SALES',
    health: 'ON_TRACK',
    priority: 'HIGH',
    status: 'ACTIVE',
    progress: 74,
    startDate: '2026-09-01',
    dueDate: '2026-12-15',
    budgetTotal: 54000,
    budgetSpent: 38200,
    totalEstimatedHours: 480,
    loggedHours: 356,
    team: [
      { userId: 'u1', role: 'Lead Architect', allocatedHours: 160 },
      { userId: 'u2', role: 'Backend Engineer', allocatedHours: 140 },
      { userId: 'u3', role: 'UI/UX Designer', allocatedHours: 90 },
      { userId: 'u4', role: 'QA & Security', allocatedHours: 90 },
    ],
    milestones: [
      { id: 'm1', title: 'HIPAA & Compliance Architecture', dueDate: '2026-09-25', completed: true },
      { id: 'm2', title: 'Custom Leads & Patient Pipeline', dueDate: '2026-10-20', completed: true },
      { id: 'm3', title: 'Automated Billing & Invoice Webhooks', dueDate: '2026-11-15', completed: false },
      { id: 'm4', title: 'Enterprise Launch & Multi-tenancy', dueDate: '2026-12-10', completed: false },
    ],
    techStack: ['Next.js 16', 'TypeScript', 'TailwindCSS v4', 'PostgreSQL', 'Redis', 'Docker'],
  },
  {
    id: 'proj-002',
    name: 'Comketra Real-Time Workspace',
    code: 'CKT-WRK',
    client: 'Comketra Global Network',
    description: 'High-concurrency collaborative workspace with drag-and-drop task workstations, multi-channel messaging, and screen tracking.',
    category: 'GENERAL',
    health: 'AT_RISK',
    priority: 'CRITICAL',
    status: 'ACTIVE',
    progress: 42,
    startDate: '2026-10-01',
    dueDate: '2027-01-30',
    budgetTotal: 42000,
    budgetSpent: 26500,
    totalEstimatedHours: 380,
    loggedHours: 215,
    team: [
      { userId: 'u1', role: 'Full Stack Dev', allocatedHours: 120 },
      { userId: 'u2', role: 'Systems Lead', allocatedHours: 140 },
      { userId: 'u5', role: 'Frontend Specialist', allocatedHours: 120 },
    ],
    milestones: [
      { id: 'm5', title: 'WebSocket Pub/Sub Engine', dueDate: '2026-10-28', completed: true },
      { id: 'm6', title: 'Live Kanban & Board Synchronization', dueDate: '2026-11-20', completed: false },
      { id: 'm7', title: 'High-Volume File Vault', dueDate: '2026-12-25', completed: false },
    ],
    techStack: ['React 19', 'Zustand', 'Socket.io', 'Node.js', 'PostgreSQL'],
  },
  {
    id: 'proj-003',
    name: 'NashPay Digital Wallet Gateway',
    code: 'NPY-GWY',
    client: 'NashPay Fintech Corp',
    description: 'Secure multi-currency digital wallet and payment orchestrator with merchant sandbox and automated reconciliation.',
    category: 'GENERAL',
    health: 'COMPLETED',
    priority: 'HIGH',
    status: 'COMPLETED',
    progress: 100,
    startDate: '2026-06-15',
    dueDate: '2026-10-30',
    budgetTotal: 72000,
    budgetSpent: 69400,
    totalEstimatedHours: 600,
    loggedHours: 588,
    team: [
      { userId: 'u1', role: 'Fintech Specialist', allocatedHours: 180 },
      { userId: 'u3', role: 'Product Lead', allocatedHours: 150 },
      { userId: 'u4', role: 'DevOps & PCI DSS', allocatedHours: 150 },
      { userId: 'u5', role: 'Compliance Auditor', allocatedHours: 120 },
    ],
    milestones: [
      { id: 'm8', title: 'PCI-DSS Tier 1 Certification Audit', dueDate: '2026-07-20', completed: true },
      { id: 'm9', title: 'Card Tokenization & Vault', dueDate: '2026-08-30', completed: true },
      { id: 'm10', title: 'Automated Merchant Settlement', dueDate: '2026-10-15', completed: true },
    ],
    techStack: ['Node.js', 'Go Microservices', 'Next.js', 'AWS KMS', 'MongoDB'],
  },
  {
    id: 'proj-004',
    name: 'Apex Omnichannel Marketing Cloud',
    code: 'APX-MKT',
    client: 'Apex Retail Brands',
    description: 'AI-driven content generation, campaign orchestrator, A/B testing suite, and customer segmentation matrix.',
    category: 'MARKETING',
    health: 'ON_TRACK',
    priority: 'MEDIUM',
    status: 'ACTIVE',
    progress: 58,
    startDate: '2026-09-15',
    dueDate: '2026-12-31',
    budgetTotal: 38000,
    budgetSpent: 19800,
    totalEstimatedHours: 320,
    loggedHours: 184,
    team: [
      { userId: 'u3', role: 'Campaign Lead', allocatedHours: 130 },
      { userId: 'u1', role: 'Automation Eng', allocatedHours: 100 },
      { userId: 'u5', role: 'Data Analyst', allocatedHours: 90 },
    ],
    milestones: [
      { id: 'm11', title: 'Drip Email Engine Integration', dueDate: '2026-10-15', completed: true },
      { id: 'm12', title: 'Dynamic Template Builder', dueDate: '2026-11-12', completed: false },
      { id: 'm13', title: 'Predictive Audience Scoring', dueDate: '2026-12-15', completed: false },
    ],
    techStack: ['Next.js', 'OpenAI API', 'SendGrid', 'TailwindCSS', 'Python FastAPI'],
  },
];

// Enrich SEED_TASKS with project references
export const ENRICHED_SEED_TASKS: Task[] = SEED_TASKS.map((task, idx) => {
  const projectMap: Record<number, { projectId: string; projectName: string }> = {
    0: { projectId: 'proj-001', projectName: 'Wholcure CRM Enterprise' },
    1: { projectId: 'proj-004', projectName: 'Apex Omnichannel Marketing Cloud' },
    2: { projectId: 'proj-001', projectName: 'Wholcure CRM Enterprise' },
    3: { projectId: 'proj-001', projectName: 'Wholcure CRM Enterprise' },
    4: { projectId: 'proj-002', projectName: 'Comketra Real-Time Workspace' },
    5: { projectId: 'proj-001', projectName: 'Wholcure CRM Enterprise' },
    6: { projectId: 'proj-004', projectName: 'Apex Omnichannel Marketing Cloud' },
    7: { projectId: 'proj-002', projectName: 'Comketra Real-Time Workspace' },
  };
  const proj = projectMap[idx] || { projectId: 'proj-001', projectName: 'Wholcure CRM Enterprise' };
  return {
    ...task,
    projectId: proj.projectId,
    projectName: proj.projectName,
    loggedHours: (task.estimatedHours || 4) * 0.65,
  } as Task & { projectId: string; projectName: string; loggedHours: number };
});

export const INITIAL_TIME_LOGS: TimeLogEntry[] = [
  {
    id: 'log-101',
    projectId: 'proj-001',
    projectName: 'Wholcure CRM Enterprise',
    taskId: 'task-001',
    taskTitle: 'Set up CRM lead import pipeline',
    description: 'Built data sanitization and CSV schema mapping validator.',
    startTime: '2026-11-04T09:00:00Z',
    endTime: '2026-11-04T11:30:00Z',
    durationSeconds: 9000,
    isBillable: true,
    hourlyRate: 65,
    userName: 'Muhammad Hamza',
    date: '2026-11-04',
  },
  {
    id: 'log-102',
    projectId: 'proj-001',
    projectName: 'Wholcure CRM Enterprise',
    taskId: 'task-001',
    taskTitle: 'Set up CRM lead import pipeline',
    description: 'Unit testing on edge cases with 50,000 lead batch import.',
    startTime: '2026-11-04T12:15:00Z',
    endTime: '2026-11-04T14:45:00Z',
    durationSeconds: 9000,
    isBillable: true,
    hourlyRate: 65,
    userName: 'Muhammad Hamza',
    date: '2026-11-04',
  },
  {
    id: 'log-103',
    projectId: 'proj-002',
    projectName: 'Comketra Real-Time Workspace',
    taskId: 'task-005',
    taskTitle: 'Publish October performance report',
    description: 'Reviewing real-time WebSocket connection heartbeat and redis pub/sub latency.',
    startTime: '2026-11-04T15:00:00Z',
    endTime: '2026-11-04T16:30:00Z',
    durationSeconds: 5400,
    isBillable: true,
    hourlyRate: 60,
    userName: 'Muhammad Hamza',
    date: '2026-11-04',
  },
  {
    id: 'log-104',
    projectId: 'proj-004',
    projectName: 'Apex Omnichannel Marketing Cloud',
    taskId: 'task-007',
    taskTitle: 'A/B test landing page hero section',
    description: 'Refactoring React components and analyzing conversion event telemetry.',
    startTime: '2026-11-03T10:00:00Z',
    endTime: '2026-11-03T13:00:00Z',
    durationSeconds: 10800,
    isBillable: false,
    hourlyRate: 55,
    userName: 'Muhammad Hamza',
    date: '2026-11-03',
  },
];

export const INITIAL_KEYPRESS_LOGS: KeypressLogItem[] = [
  {
    id: 'kp-1',
    timestamp: '16:28:45',
    keyCombo: 'const [tasks, setTasks] = useState<Task[]>([]);',
    appName: 'Visual Studio Code',
    category: 'CODE',
    wpm: 84,
    keystrokeCount: 46,
  },
  {
    id: 'kp-2',
    timestamp: '16:28:30',
    keyCombo: 'Ctrl + S',
    appName: 'Visual Studio Code',
    category: 'HOTKEY',
    wpm: 76,
    keystrokeCount: 2,
  },
  {
    id: 'kp-3',
    timestamp: '16:27:10',
    keyCombo: 'git commit -m "feat(telemetry): add background OS shadow monitoring hooks"',
    appName: 'Windows Terminal / PowerShell',
    category: 'COMMAND',
    wpm: 92,
    keystrokeCount: 74,
  },
  {
    id: 'kp-4',
    timestamp: '16:25:50',
    keyCombo: 'Alt + Tab  (VS Code → Google Chrome)',
    appName: 'OS Window Manager',
    category: 'HOTKEY',
    wpm: 70,
    keystrokeCount: 2,
  },
  {
    id: 'kp-5',
    timestamp: '16:24:20',
    keyCombo: 'export const useTaskSuiteStore = create<TaskSuiteStoreState>((set) => ({',
    appName: 'Visual Studio Code',
    category: 'CODE',
    wpm: 88,
    keystrokeCount: 72,
  },
  {
    id: 'kp-6',
    timestamp: '16:22:15',
    keyCombo: 'Ctrl + Shift + P  >  Format Document (Prettier)',
    appName: 'Visual Studio Code',
    category: 'HOTKEY',
    wpm: 64,
    keystrokeCount: 3,
  },
  {
    id: 'kp-7',
    timestamp: '16:20:00',
    keyCombo: 'interface DesktopShadowState { isMonitoring: boolean; activeProcess: string; }',
    appName: 'Visual Studio Code',
    category: 'CODE',
    wpm: 78,
    keystrokeCount: 78,
  },
];

export const INITIAL_APP_ACTIVITIES: AppActivityLog[] = [
  {
    id: 'app-1',
    projectId: 'proj-001',
    projectName: 'Wholcure CRM Enterprise',
    appName: 'Visual Studio Code',
    windowTitle: 'Wholcure CRM - frontend/src/components/ui/tasks/taskStore.ts',
    category: 'DEVELOPMENT',
    durationMinutes: 185,
    activePercentage: 94,
    keystrokes: 8420,
    mouseClicks: 1420,
    timestamp: '2026-11-04T16:45:00Z',
    iconName: 'vscode',
  },
  {
    id: 'app-2',
    projectId: 'proj-001',
    projectName: 'Wholcure CRM Enterprise',
    appName: 'Google Chrome',
    windowTitle: 'CRM Lead Import API Specs - Swagger Docs & localhost:3000',
    category: 'RESEARCH',
    durationMinutes: 75,
    activePercentage: 88,
    keystrokes: 1140,
    mouseClicks: 890,
    timestamp: '2026-11-04T16:30:00Z',
    iconName: 'chrome',
  },
  {
    id: 'app-3',
    projectId: 'proj-002',
    projectName: 'Comketra Real-Time Workspace',
    appName: 'Figma Desktop',
    windowTitle: 'Comketra Design System 2.4 - Task Workstation & Matrix Grid',
    category: 'DESIGN',
    durationMinutes: 52,
    activePercentage: 91,
    keystrokes: 380,
    mouseClicks: 1650,
    timestamp: '2026-11-04T14:20:00Z',
    iconName: 'figma',
  },
  {
    id: 'app-4',
    projectId: 'proj-001',
    projectName: 'Wholcure CRM Enterprise',
    appName: 'Postman Client',
    windowTitle: 'Wholcure CRM API Collection - [POST] /v1/leads/batch-import',
    category: 'DEVELOPMENT',
    durationMinutes: 44,
    activePercentage: 86,
    keystrokes: 920,
    mouseClicks: 410,
    timestamp: '2026-11-04T13:40:00Z',
    iconName: 'postman',
  },
  {
    id: 'app-5',
    projectId: 'proj-001',
    projectName: 'Wholcure CRM Enterprise',
    appName: 'Slack Enterprise',
    windowTitle: '#wholcure-crm-sprint-q4 - Standup Updates & Thread review',
    category: 'COMMUNICATION',
    durationMinutes: 24,
    activePercentage: 78,
    keystrokes: 890,
    mouseClicks: 180,
    timestamp: '2026-11-04T11:15:00Z',
    iconName: 'slack',
  },
  {
    id: 'app-6',
    projectId: 'proj-004',
    projectName: 'Apex Omnichannel Marketing Cloud',
    appName: 'Windows Terminal / PowerShell',
    windowTitle: 'npm run test:e2e -- --watch - Apex Marketing Suite',
    category: 'DEVELOPMENT',
    durationMinutes: 38,
    activePercentage: 82,
    keystrokes: 1450,
    mouseClicks: 90,
    timestamp: '2026-11-04T10:30:00Z',
    iconName: 'terminal',
  },
];

export const INITIAL_BROWSING_LOGS: BrowsingLog[] = [
  {
    id: 'b-1',
    projectId: 'proj-001',
    domain: 'github.com',
    urlTitle: 'Pull Request #84: Refactor Lead Validation & Zustand Store - Wholcure/crm-frontend',
    fullUrl: 'https://github.com/wholcure/crm-frontend/pull/84',
    timeSpentSeconds: 1680,
    rating: 'HIGHLY_PRODUCTIVE',
    visitTime: '16:15 PM',
    visitsCount: 14,
  },
  {
    id: 'b-2',
    projectId: 'proj-001',
    domain: 'nextjs.org',
    urlTitle: 'App Router: Routing and State Management Best Practices',
    fullUrl: 'https://nextjs.org/docs/app/building-your-application/routing',
    timeSpentSeconds: 940,
    rating: 'PRODUCTIVE',
    visitTime: '15:40 PM',
    visitsCount: 6,
  },
  {
    id: 'b-3',
    projectId: 'proj-001',
    domain: 'zustand.docs.pmnd.rs',
    urlTitle: 'Zustand v5 Guide: Direct State Updates & Selector Patterns',
    fullUrl: 'https://zustand.docs.pmnd.rs/guides/flux-inspired-practice',
    timeSpentSeconds: 820,
    rating: 'PRODUCTIVE',
    visitTime: '14:55 PM',
    visitsCount: 8,
  },
  {
    id: 'b-4',
    projectId: 'proj-002',
    domain: 'figma.com',
    urlTitle: 'Comketra Workstation Spec & Enterprise Layout Prototype',
    fullUrl: 'https://figma.com/file/comketra-workspace-proto-v2',
    timeSpentSeconds: 2100,
    rating: 'HIGHLY_PRODUCTIVE',
    visitTime: '13:20 PM',
    visitsCount: 22,
  },
  {
    id: 'b-5',
    projectId: 'proj-001',
    domain: 'stackoverflow.com',
    urlTitle: 'Efficient array search and reordering in TypeScript models',
    fullUrl: 'https://stackoverflow.com/questions/efficient-array-mutation-ts',
    timeSpentSeconds: 410,
    rating: 'PRODUCTIVE',
    visitTime: '11:45 AM',
    visitsCount: 3,
  },
];

export const INITIAL_TEN_MINUTE_SUMMARIES: TenMinuteSummary[] = [
  {
    id: 'sum-01',
    projectId: 'proj-001',
    projectName: 'Wholcure CRM Enterprise',
    date: '2026-11-04',
    timeSlot: '16:00 - 16:10',
    startTimestamp: '2026-11-04T16:00:00Z',
    productivityScore: 96,
    dominantApp: 'Visual Studio Code',
    appDistribution: [
      { app: 'Visual Studio Code', percentage: 75, color: '#0284c7' },
      { app: 'Google Chrome', percentage: 20, color: '#f59e0b' },
      { app: 'Terminal', percentage: 5, color: '#10b981' },
    ],
    keystrokes: 680,
    clicks: 74,
    hotkeysCount: 12,
    status: 'HIGHLY_PRODUCTIVE',
    summaryNote: 'Coded batch CSV import validation loop; resolved null check bug on customer address payload.',
    typedSummary: 'Typed 680 characters in VS Code (TypeScript loop definitions, try/catch handlers, object schemas). Keys pressed: a-z, =, =>, {, }, [].',
    hotkeysSample: ['Ctrl + S (6x)', 'Alt + Tab (4x)', 'Ctrl + C (2x)'],
    activeWindowTitle: 'Wholcure CRM - src/components/ui/tasks/taskStore.ts',
  },
  {
    id: 'sum-02',
    projectId: 'proj-001',
    projectName: 'Wholcure CRM Enterprise',
    date: '2026-11-04',
    timeSlot: '15:50 - 16:00',
    startTimestamp: '2026-11-04T15:50:00Z',
    productivityScore: 92,
    dominantApp: 'Visual Studio Code',
    appDistribution: [
      { app: 'Visual Studio Code', percentage: 85, color: '#0284c7' },
      { app: 'Postman', percentage: 15, color: '#ea580c' },
    ],
    keystrokes: 540,
    clicks: 48,
    hotkeysCount: 9,
    status: 'HIGHLY_PRODUCTIVE',
    summaryNote: 'Built schema definitions and tested payload responses against mock enterprise API.',
    typedSummary: 'Payload JSON schema modeling & status code checks. Keypresses: brackets, string literals, interface keys.',
    hotkeysSample: ['Ctrl + Enter in Postman', 'Ctrl + S', 'Alt + Tab'],
    activeWindowTitle: 'Wholcure CRM - src/components/ui/tasks/taskHelpers.ts',
  },
  {
    id: 'sum-03',
    projectId: 'proj-001',
    projectName: 'Wholcure CRM Enterprise',
    date: '2026-11-04',
    timeSlot: '15:40 - 15:50',
    startTimestamp: '2026-11-04T15:40:00Z',
    productivityScore: 88,
    dominantApp: 'Google Chrome',
    appDistribution: [
      { app: 'Google Chrome', percentage: 65, color: '#f59e0b' },
      { app: 'Visual Studio Code', percentage: 35, color: '#0284c7' },
    ],
    keystrokes: 240,
    clicks: 112,
    hotkeysCount: 8,
    status: 'PRODUCTIVE',
    summaryNote: 'Inspected browser console logs for dynamic filter events and evaluated render performance.',
    typedSummary: 'Console inspection commands, filter text query testing: "Wholcure", "leads batch".',
    hotkeysSample: ['F12 (DevTools)', 'Ctrl + R', 'Ctrl + F'],
    activeWindowTitle: 'localhost:3000/tasks/my-tasks - DevTools Inspect',
  },
  {
    id: 'sum-04',
    projectId: 'proj-002',
    projectName: 'Comketra Real-Time Workspace',
    date: '2026-11-04',
    timeSlot: '15:30 - 15:40',
    startTimestamp: '2026-11-04T15:30:00Z',
    productivityScore: 94,
    dominantApp: 'Figma Desktop',
    appDistribution: [
      { app: 'Figma Desktop', percentage: 70, color: '#8b5cf6' },
      { app: 'Visual Studio Code', percentage: 30, color: '#0284c7' },
    ],
    keystrokes: 190,
    clicks: 210,
    hotkeysCount: 18,
    status: 'HIGHLY_PRODUCTIVE',
    summaryNote: 'Aligned component auto-layout spacing tokens with Tailwind v4 theme specifications.',
    typedSummary: 'Design token labels: "gap-4", "p-6", "rounded-2xl", hex colors #0284c7, #0f172a.',
    hotkeysSample: ['Shift + A (AutoLayout)', 'Ctrl + D (Duplicate)', 'V (Move Tool)'],
    activeWindowTitle: 'Comketra Design System 2.4 - Figma',
  },
  {
    id: 'sum-05',
    projectId: 'proj-001',
    projectName: 'Wholcure CRM Enterprise',
    date: '2026-11-04',
    timeSlot: '15:20 - 15:30',
    startTimestamp: '2026-11-04T15:20:00Z',
    productivityScore: 85,
    dominantApp: 'Slack Enterprise',
    appDistribution: [
      { app: 'Slack Enterprise', percentage: 55, color: '#ec4899' },
      { app: 'Visual Studio Code', percentage: 45, color: '#0284c7' },
    ],
    keystrokes: 420,
    clicks: 35,
    hotkeysCount: 6,
    status: 'PRODUCTIVE',
    summaryNote: 'Coordinated deployment schedule with backend team in #wholcure-crm-sprint channel.',
    typedSummary: 'Drafted update message: "CSV pipeline validation merged to staging branch. Ready for QA test run."',
    hotkeysSample: ['Enter (Send)', 'Ctrl + K (Quick Switch)', 'Alt + Tab'],
    activeWindowTitle: '#wholcure-crm-sprint-q4 - Slack',
  },
  {
    id: 'sum-06',
    projectId: 'proj-001',
    projectName: 'Wholcure CRM Enterprise',
    date: '2026-11-04',
    timeSlot: '15:10 - 15:20',
    startTimestamp: '2026-11-04T15:10:00Z',
    productivityScore: 98,
    dominantApp: 'Visual Studio Code',
    appDistribution: [
      { app: 'Visual Studio Code', percentage: 90, color: '#0284c7' },
      { app: 'Terminal', percentage: 10, color: '#10b981' },
    ],
    keystrokes: 790,
    clicks: 52,
    hotkeysCount: 14,
    status: 'HIGHLY_PRODUCTIVE',
    summaryNote: 'Wrote unit tests for CSV lead transformer; verified edge cases with international telephone formats.',
    typedSummary: 'describe("LeadTransformer", () => { it("validates international E.164 formats", expect(...)) });',
    hotkeysSample: ['Ctrl + S (8x)', 'Ctrl + ` (Terminal)', 'npm test'],
    activeWindowTitle: 'Wholcure CRM - tests/leadTransformer.test.ts',
  },
  {
    id: 'sum-07',
    projectId: 'proj-004',
    projectName: 'Apex Omnichannel Marketing Cloud',
    date: '2026-11-04',
    timeSlot: '15:00 - 15:10',
    startTimestamp: '2026-11-04T15:00:00Z',
    productivityScore: 80,
    dominantApp: 'Google Chrome',
    appDistribution: [
      { app: 'Google Chrome', percentage: 60, color: '#f59e0b' },
      { app: 'Visual Studio Code', percentage: 40, color: '#0284c7' },
    ],
    keystrokes: 310,
    clicks: 86,
    hotkeysCount: 7,
    status: 'PRODUCTIVE',
    summaryNote: 'Researched A/B testing multi-armed bandit algorithms for automated audience dispatch.',
    typedSummary: 'Search queries: "multi armed bandit exploration vs exploitation thompson sampling react hooks"',
    hotkeysSample: ['Ctrl + T', 'Ctrl + W', 'Ctrl + L'],
    activeWindowTitle: 'A/B Testing Optimization Algorithms - arXiv / ResearchGate',
  },
];

// -------------------------------------------------------------
// ZUSTAND MASTER STORE
// -------------------------------------------------------------
export interface TaskSuiteStoreState {
  // TASKS
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  deleteTask: (taskId: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  
  // PROJECTS
  projects: EnterpriseProject[];
  addProject: (project: EnterpriseProject) => void;
  updateProject: (projectId: string, updates: Partial<EnterpriseProject>) => void;
  deleteProject: (projectId: string) => void;
  
  // TIME TRACKING
  activeTimer: ActiveTimerState;
  timeLogs: TimeLogEntry[];
  dailyTargetSeconds: number;
  startTimer: (projectId: string, taskId?: string, taskTitle?: string, desc?: string, billable?: boolean) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: (notes?: string) => void;
  tickTimer: () => void;
  toggleShadowMode: (forcedState?: boolean) => void;
  addManualLog: (log: Omit<TimeLogEntry, 'id'>) => void;
  deleteTimeLog: (id: string) => void;
  
  // ACTIVITY & BEHAVIOR
  appActivities: AppActivityLog[];
  browsingLogs: BrowsingLog[];
  keypressLogs: KeypressLogItem[];
  tenMinuteSummaries: TenMinuteSummary[];
  currentActiveApp: { name: string; title: string; wpm: number; status: ProductivityRating };
  updateCurrentActiveApp: (name: string, title: string, wpm: number) => void;
  simulateKeypressEvent: (keyCombo: string, appName: string, category: 'CODE' | 'HOTKEY' | 'COMMAND') => void;
  
  // SYSTEM DEMO RESET
  resetToSeed: () => void;
}

export const useTaskSuiteStore = create<TaskSuiteStoreState>((set, get) => ({
  tasks: ENRICHED_SEED_TASKS,
  projects: INITIAL_PROJECTS,
  timeLogs: INITIAL_TIME_LOGS,
  appActivities: INITIAL_APP_ACTIVITIES,
  browsingLogs: INITIAL_BROWSING_LOGS,
  keypressLogs: INITIAL_KEYPRESS_LOGS,
  tenMinuteSummaries: INITIAL_TEN_MINUTE_SUMMARIES,
  dailyTargetSeconds: 8 * 3600, // 8 hours
  
  currentActiveApp: {
    name: 'Visual Studio Code',
    title: 'frontend/src/components/ui/tasks/taskSuiteStore.ts - CRM Workstation',
    wpm: 78,
    status: 'HIGHLY_PRODUCTIVE',
  },
  
  activeTimer: {
    isRunning: true,
    isPaused: false,
    projectId: 'proj-001',
    projectName: 'Wholcure CRM Enterprise',
    taskId: 'task-001',
    taskTitle: 'Set up CRM lead import pipeline',
    description: 'Developing data schema validation and CSV pipeline parser',
    isBillable: true,
    startTime: Date.now() - 3840 * 1000,
    elapsedSeconds: 3840, // 1h 4m
    shadowModeActive: true,
  },

  // Task Actions
  addTask: (task) =>
    set((state) => ({
      tasks: [
        {
          ...task,
          createdAt: task.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...state.tasks,
      ],
    })),

  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t._id === taskId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      ),
    })),

  updateTaskStatus: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t._id === taskId ? { ...t, status, updatedAt: new Date().toISOString() } : t
      ),
    })),

  deleteTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t._id !== taskId),
    })),

  toggleSubtask: (taskId, subtaskId) =>
    set((state) => ({
      tasks: state.tasks.map((t) => {
        if (t._id !== taskId || !t.subtasks) return t;
        const updatedSubs = t.subtasks.map((s) =>
          s.id === subtaskId ? { ...s, completed: !s.completed } : s
        );
        return { ...t, subtasks: updatedSubs, updatedAt: new Date().toISOString() };
      }),
    })),

  // Project Actions
  addProject: (project) =>
    set((state) => ({ projects: [project, ...state.projects] })),

  updateProject: (projectId, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, ...updates } : p
      ),
    })),

  deleteProject: (projectId) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== projectId),
    })),

  // Timer Actions
  startTimer: (projectId, taskId, taskTitle, desc, billable) => {
    const project = get().projects.find((p) => p.id === projectId);
    const projectName = project ? project.name : 'General Operations';
    set({
      activeTimer: {
        isRunning: true,
        isPaused: false,
        projectId,
        projectName,
        taskId: taskId || '',
        taskTitle: taskTitle || '',
        description: desc || `Sprint on ${projectName}`,
        isBillable: billable !== undefined ? billable : true,
        startTime: Date.now(),
        elapsedSeconds: 0,
        shadowModeActive: true,
      },
    });
  },

  pauseTimer: () =>
    set((state) => ({
      activeTimer: { ...state.activeTimer, isPaused: true },
    })),

  resumeTimer: () =>
    set((state) => ({
      activeTimer: { ...state.activeTimer, isPaused: false },
    })),

  stopTimer: (notes) => {
    const { activeTimer, timeLogs } = get();
    if (activeTimer.elapsedSeconds > 10) {
      const newEntry: TimeLogEntry = {
        id: `log-${Date.now()}`,
        projectId: activeTimer.projectId,
        projectName: activeTimer.projectName,
        taskId: activeTimer.taskId,
        taskTitle: activeTimer.taskTitle,
        description: notes || activeTimer.description,
        startTime: new Date(Date.now() - activeTimer.elapsedSeconds * 1000).toISOString(),
        endTime: new Date().toISOString(),
        durationSeconds: activeTimer.elapsedSeconds,
        isBillable: activeTimer.isBillable,
        hourlyRate: 65,
        userName: 'Muhammad Hamza',
        date: new Date().toISOString().split('T')[0],
      };
      set({
        timeLogs: [newEntry, ...timeLogs],
        activeTimer: {
          ...activeTimer,
          isRunning: false,
          isPaused: false,
          startTime: null,
          elapsedSeconds: 0,
        },
      });
    } else {
      set({
        activeTimer: {
          ...activeTimer,
          isRunning: false,
          isPaused: false,
          startTime: null,
          elapsedSeconds: 0,
        },
      });
    }
  },

  tickTimer: () =>
    set((state) => {
      if (!state.activeTimer.isRunning || state.activeTimer.isPaused) return state;
      return {
        activeTimer: {
          ...state.activeTimer,
          elapsedSeconds: state.activeTimer.elapsedSeconds + 1,
        },
      };
    }),

  toggleShadowMode: (forcedState) =>
    set((state) => ({
      activeTimer: {
        ...state.activeTimer,
        shadowModeActive: forcedState !== undefined ? forcedState : !state.activeTimer.shadowModeActive,
      },
    })),

  addManualLog: (log) =>
    set((state) => ({
      timeLogs: [
        { ...log, id: `log-${Date.now()}` },
        ...state.timeLogs,
      ],
    })),

  deleteTimeLog: (id) =>
    set((state) => ({
      timeLogs: state.timeLogs.filter((l) => l.id !== id),
    })),

  // Activity Actions
  updateCurrentActiveApp: (name, title, wpm) =>
    set({
      currentActiveApp: {
        name,
        title,
        wpm,
        status: wpm > 40 ? 'HIGHLY_PRODUCTIVE' : 'PRODUCTIVE',
      },
    }),

  simulateKeypressEvent: (keyCombo, appName, category) => {
    const item: KeypressLogItem = {
      id: `kp-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      keyCombo,
      appName,
      category,
      wpm: Math.floor(70 + Math.random() * 30),
      keystrokeCount: keyCombo.length,
    };
    set((state) => ({
      keypressLogs: [item, ...state.keypressLogs.slice(0, 25)],
    }));
  },

  resetToSeed: () =>
    set({
      tasks: ENRICHED_SEED_TASKS,
      projects: INITIAL_PROJECTS,
      timeLogs: INITIAL_TIME_LOGS,
      appActivities: INITIAL_APP_ACTIVITIES,
      browsingLogs: INITIAL_BROWSING_LOGS,
      keypressLogs: INITIAL_KEYPRESS_LOGS,
      tenMinuteSummaries: INITIAL_TEN_MINUTE_SUMMARIES,
      activeTimer: {
        isRunning: true,
        isPaused: false,
        projectId: 'proj-001',
        projectName: 'Wholcure CRM Enterprise',
        taskId: 'task-001',
        taskTitle: 'Set up CRM lead import pipeline',
        description: 'Developing data schema validation and CSV pipeline parser',
        isBillable: true,
        startTime: Date.now() - 3840 * 1000,
        elapsedSeconds: 3840,
        shadowModeActive: true,
      },
    }),
}));
