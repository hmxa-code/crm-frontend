export type CampaignChannelType = 'Email' | 'SMS' | 'Social' | 'Push' | 'Multi-Channel';

export type CampaignStatus = 'Draft' | 'Scheduled' | 'Active' | 'Paused' | 'Completed';

/**
 * Editable payload for creating/updating a marketing campaign
 * Manual metrics like open_rate, click_rate, and recipient_count are strictly excluded
 */
export interface CampaignEditablePayload {
  campaign_name: string;
  campaign_type: CampaignChannelType;
  status: CampaignStatus;
  start_date: number | string;
  end_date?: number | string;
  target_audience: string;
  target_count: number;
  budget?: number;
  notes?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

/**
 * Complete Campaign interface including read-only backend telemetry metrics
 */
export interface Campaign extends CampaignEditablePayload {
  _id: string;
  // Read-only Telemetry (calculated automatically by backend webhooks)
  recipient_count: number;
  open_rate: number;
  click_rate: number;
  conversion_rate: number;
  conversation_rate?: number;
  bounced_count?: number;
  unsubscribed_count?: number;
  created_by: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CampaignMetricsSummary {
  totalCampaigns: number;
  activeCampaigns: number;
  totalAudienceReached: number;
  averageOpenRate: number;
  averageClickRate: number;
  averageConversionRate: number;
  totalBudgetAllocated: number;
}
