export type StepChannel = 'Email' | 'Call Task' | 'WhatsApp' | 'Manual Touchpoint' | 'LinkedIn InMail';

export interface SequenceStep {
  id: string;
  order: number;
  channel: StepChannel;
  title: string;
  delayDays: number;
  templateSnippet?: string;
  isAutomated: boolean;
  completionRate?: number;
}

export interface OutreachSequence {
  id: string;
  sequenceCode: string;
  title: string;
  description: string;
  owner: string;
  status: 'Active' | 'Draft' | 'Paused';
  targetAudience: string;
  totalSteps: number;
  enrolledCount: number;
  openRate: number;
  replyRate: number;
  bookingConversionRate: number;
  steps: SequenceStep[];
  createdAt: string;
}

export interface SequenceEnrolment {
  id: string;
  leadName: string;
  company: string;
  email: string;
  sequenceId: string;
  sequenceName: string;
  currentStepIndex: number;
  totalSteps: number;
  assignedRep: string;
  status: 'In Progress' | 'Replied' | 'Booked' | 'Paused' | 'Unsubscribed' | 'Bounced';
  lastActivity: string;
  nextStepDue: string;
}

export interface OutreachTelemetryLog {
  id: string;
  timestamp: string;
  leadName: string;
  sequenceName: string;
  channel: StepChannel;
  event: 'Delivered' | 'Opened' | 'Clicked' | 'Replied' | 'Meeting Booked' | 'Bounced' | 'Call Completed';
  details: string;
  rep: string;
}
