export type TouchpointChannel = 'Calls' | 'Meetings' | 'Emails' | 'WhatsApp' | 'System Override' | 'Security';

export interface ChronosEvent {
  id: string;
  timestamp: string;
  leadOrAccount: string;
  leadId?: string;
  repName: string;
  repAvatar?: string;
  channel: TouchpointChannel;
  actionTitle: string;
  summary: string;
  outcome?: 'Connected' | 'Voicemail' | 'Replied' | 'No Answer' | 'Agreed to Demo' | 'Contract Sent';
  durationMins?: number;
  sentiment?: 'Positive' | 'Neutral' | 'Hesitant' | 'Urgent';
  isComplianceLog?: boolean;
  metadata?: Record<string, string | number>;
}

export interface ComplianceAuditRecord {
  id: string;
  timestamp: string;
  actor: string;
  actionType: 'RECORD_DELETED' | 'RULE_OVERRIDE' | 'LEAD_REASSIGN' | 'EXPORT_DATA' | 'ACCESS_REVOKED';
  targetResource: string;
  ipAddress: string;
  reason: string;
  severity: 'Info' | 'Warning' | 'Critical';
}
