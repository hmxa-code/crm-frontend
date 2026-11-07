import { CalendarEvent } from '@/src/types/index';

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();
const currentDay = now.getDate();

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Lead Follow-up Call (Hot Inbound)',
    startDate: new Date(currentYear, currentMonth, currentDay, 10, 0),
    endDate: new Date(currentYear, currentMonth, currentDay, 11, 0),
    color: 'blue',
    description: 'Call back hot leads from the organic inbound campaign and qualify deal budget.'
  },
  {
    id: 'evt-2',
    title: 'CRM Workspace & Feature Sync',
    startDate: new Date(currentYear, currentMonth, currentDay, 14, 0),
    endDate: new Date(currentYear, currentMonth, currentDay, 15, 30),
    color: 'purple',
    description: 'Weekly team sprint sync covering chat workspace, task boards, and calendar features.'
  },
  {
    id: 'evt-3',
    title: 'Corporate Client Product Demo',
    startDate: new Date(currentYear, currentMonth, currentDay + 1, 11, 0),
    endDate: new Date(currentYear, currentMonth, currentDay + 1, 12, 30),
    color: 'green',
    description: 'Presenting live CRM dashboard and communication hub prototype to enterprise stakeholders.'
  },
  {
    id: 'evt-4',
    title: 'Growth & Marketing Strategy Review',
    startDate: new Date(currentYear, currentMonth, currentDay + 2, 16, 0),
    endDate: new Date(currentYear, currentMonth, currentDay + 2, 17, 0),
    color: 'orange',
    description: 'Evaluate Q4 ad spend velocity, ROAS performance metrics, and landing conversion funnels.'
  },
  {
    id: 'evt-5',
    title: 'Executive Leadership Huddle',
    startDate: new Date(currentYear, currentMonth, currentDay + 4, 9, 30),
    endDate: new Date(currentYear, currentMonth, currentDay + 4, 10, 30),
    color: 'red',
    description: 'High-level business review, pipeline projections, and cross-department resource planning.'
  },
  {
    id: 'evt-6',
    title: 'Sales Pipeline & Deal Review',
    startDate: new Date(currentYear, currentMonth, currentDay + 6, 15, 0),
    endDate: new Date(currentYear, currentMonth, currentDay + 6, 16, 0),
    color: 'blue',
    description: 'Review high-value opportunities in negotiation stage and unblock closing bottlenecks.'
  }
];