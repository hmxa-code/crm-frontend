import { CalendarEvent } from '@/src/types/index';
import { SEED_TASKS, TEAM_MEMBERS, getMember, TaskPriority } from '@/src/components/ui/tasks/task-workstation/data/taskHelpers';

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();
const currentDay = now.getDate();

// Helper to map TaskPriority to calendar color
export const getTaskEventColor = (priority: TaskPriority, status: string): CalendarEvent['color'] => {
  if (status === 'DONE') return 'green';
  switch (priority) {
    case 'URGENT':
      return 'red';
    case 'HIGH':
      return 'orange';
    case 'MEDIUM':
      return 'blue';
    case 'LOW':
    default:
      return 'purple';
  }
};

/**
 * Convert a Task from Task Management into a CalendarEvent
 */
export const convertTaskToCalendarEvent = (task: typeof SEED_TASKS[0]): CalendarEvent => {
  let startDate = new Date();
  if (task.dueDate) {
    const parsed = new Date(task.dueDate);
    if (!isNaN(parsed.getTime())) {
      startDate = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), 10, 0);
    }
  }

  const endDate = new Date(startDate.getTime() + (task.estimatedHours ? task.estimatedHours * 3600 * 1000 : 3600 * 1000));
  const assigneeMember = getMember(task.assigneeId);

  return {
    id: `evt-task-${task._id}`,
    taskId: task._id,
    title: `[${task.moduleType}] ${task.title}`,
    description: `${task.description || 'Task scheduled in CRM Task Management'}\n\n• Priority: ${task.priority}\n• Status: ${task.status}\n• Assignee: ${assigneeMember?.name || 'Assigned Agent'}\n• Estimated Hours: ${task.estimatedHours || 0} hrs`,
    startDate,
    endDate,
    color: getTaskEventColor(task.priority, task.status),
    status: task.status,
    priority: task.priority,
    assignee: assigneeMember?.name,
    category: task.moduleType,
    estimatedHours: task.estimatedHours,
  };
};

// Generate Synced Events from Hardcoded Task Management SEED_TASKS
const TASK_EVENTS: CalendarEvent[] = SEED_TASKS.map(convertTaskToCalendarEvent);

// Enterprise Project Milestones from INITIAL_PROJECTS
const MILESTONE_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-m1',
    title: '🎯 [Milestone] HIPAA & Compliance Architecture Signoff',
    description: 'Final security compliance signoff and architectural documentation audit for Wholcure CRM Enterprise.',
    startDate: new Date(currentYear, currentMonth, 4, 14, 0),
    endDate: new Date(currentYear, currentMonth, 4, 16, 0),
    color: 'green',
    category: 'SALES',
    priority: 'HIGH',
    status: 'DONE',
    assignee: 'Muhammad Hamza (Lead Architect)',
  },
  {
    id: 'evt-m2',
    title: '🎯 [Milestone] Custom Leads & Patient Pipeline Delivery',
    description: 'Production release of custom pipeline stages, lead scoring triggers, and field mapping schemas.',
    startDate: new Date(currentYear, currentMonth, 12, 11, 0),
    endDate: new Date(currentYear, currentMonth, 12, 13, 0),
    color: 'orange',
    category: 'SALES',
    priority: 'URGENT',
    status: 'IN_PROGRESS',
    assignee: 'Ali Raza (Backend Engineer)',
  },
  {
    id: 'evt-m3',
    title: '🎯 [Milestone] Automated Billing & Invoice Webhooks Integration',
    description: 'Payment gateway webhooks, automated subscription renewals, and invoice PDF generation test.',
    startDate: new Date(currentYear, currentMonth, 18, 15, 0),
    endDate: new Date(currentYear, currentMonth, 18, 17, 0),
    color: 'purple',
    category: 'GENERAL',
    priority: 'HIGH',
    status: 'TODO',
    assignee: 'Sara Ahmed (UI/UX & Billing)',
  },
];

// Operational CRM Meetings & Strategy Sessions
const OPERATIONAL_MEETINGS: CalendarEvent[] = [
  {
    id: 'evt-call-1',
    title: '📞 Lead Follow-up Call (Hot Inbound Leads)',
    startDate: new Date(currentYear, currentMonth, currentDay, 10, 0),
    endDate: new Date(currentYear, currentMonth, currentDay, 11, 0),
    color: 'blue',
    category: 'SALES',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    assignee: 'Ali Raza',
    description: 'Call back hot leads from the organic inbound campaign and qualify enterprise deal budget.',
  },
  {
    id: 'evt-call-2',
    title: '💼 Corporate Client Product Demo (Zeta Corp)',
    startDate: new Date(currentYear, currentMonth, currentDay + 1, 11, 0),
    endDate: new Date(currentYear, currentMonth, currentDay + 1, 12, 30),
    color: 'green',
    category: 'SALES',
    priority: 'URGENT',
    status: 'TODO',
    assignee: 'Usman Khan',
    description: 'Presenting live CRM dashboard, automated sequences, and communication hub to enterprise stakeholders.',
  },
  {
    id: 'evt-call-3',
    title: '📊 Q4 Marketing Velocity & ROAS Strategy Review',
    startDate: new Date(currentYear, currentMonth, currentDay + 3, 16, 0),
    endDate: new Date(currentYear, currentMonth, currentDay + 3, 17, 0),
    color: 'orange',
    category: 'MARKETING',
    priority: 'MEDIUM',
    status: 'TODO',
    assignee: 'Sara Ahmed',
    description: 'Evaluate Q4 ad spend velocity, ROAS performance metrics, and landing conversion funnels.',
  },
  {
    id: 'evt-call-4',
    title: '🛡️ Executive Security & User Permissions Huddle',
    startDate: new Date(currentYear, currentMonth, currentDay + 5, 9, 30),
    endDate: new Date(currentYear, currentMonth, currentDay + 5, 10, 30),
    color: 'red',
    category: 'GENERAL',
    priority: 'HIGH',
    status: 'TODO',
    assignee: 'Muhammad Hamza',
    description: 'Cross-module role-based access control audit, sub-account boundary checks, and API rate limits.',
  },
];

// Master Synced Dataset: Tasks + Milestones + Operational Meetings
export const INITIAL_EVENTS: CalendarEvent[] = [
  ...TASK_EVENTS,
  ...MILESTONE_EVENTS,
  ...OPERATIONAL_MEETINGS,
];

export const getCalendarEvents = (): CalendarEvent[] => INITIAL_EVENTS;
