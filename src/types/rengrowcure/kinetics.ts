export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
export type TaskCategory = 'Follow-up Call' | 'Demo Presentation' | 'Proposal Draft' | 'Contract Review' | 'Security Due Diligence';

export interface KineticTask {
  id: string;
  taskCode: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  assignee: string;
  assigneeAvatar?: string;
  associatedDealOrLead: string;
  dueDate: string;
  slaTargetHours: number;
  slaHoursRemaining: number;
  isBreached: boolean;
  autoCreatedByTrigger?: string;
  notes?: string;
}

export interface SlaTriggerRule {
  id: string;
  ruleCode: string;
  title: string;
  triggerEvent: 'Lead Inactivity 48h' | 'Stage Stagnation 7d' | 'Score Upgrade to SQL' | 'Quote Viewed 3x' | 'Demo Completed';
  actionToExecute: 'Generate Follow-Up Task' | 'Escalate to Sales Director' | 'Assign Strategic SDR' | 'Send Alert Notification';
  assignedQueue: string;
  dueWithinHours: number;
  priority: TaskPriority;
  isActive: boolean;
}

export interface SlaExecutionTelemetry {
  id: string;
  timestamp: string;
  taskTitle: string;
  repName: string;
  turnaroundHours: number;
  slaTargetHours: number;
  breached: boolean;
  resolutionStatus: 'Resolved On-Time' | 'Breached & Escalated' | 'Resolved Post-Breach';
}
