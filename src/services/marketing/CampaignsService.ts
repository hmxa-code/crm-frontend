import { Campaign, CampaignMetricsSummary } from '@/src/types/marketing/campaign';

// Re-export types so they can be imported from this service file too
export type { Campaign, CampaignMetricsSummary };

/**
 * Enterprise Level Professional Hardcoded Campaign Repository
 * Strictly decoupled from in-feature automations.
 * All automated execution is delegated to the central Workflow Automation Engine (/workflows).
 */
export const ENTERPRISE_HARDCODED_CAMPAIGNS: Campaign[] = [
  {
    _id: 'cmp_ent_001',
    campaign_name: 'Enterprise Clinical Trial Expansion 2026',
    campaign_type: 'Email',
    status: 'Active',
    start_date: '2026-10-15',
    end_date: '2026-12-31',
    target_audience: 'Chief Medical Officers & Clinical Research Directors',
    target_count: 14200,
    budget: 8500,
    notes: 'Outreach focused on multi-center clinical diagnostics adoption. Automated cadences linked via Central Workflow Engine.',
    utm_source: 'crm_marketing',
    utm_medium: 'executive_outreach',
    utm_campaign: 'clinical_expansion_q4',
    recipient_count: 11450,
    open_rate: 52.4,
    click_rate: 21.8,
    conversion_rate: 8.6,
    bounced_count: 24,
    unsubscribed_count: 8,
    created_by: 'Alex Rivera (VP Growth)',
    createdAt: '2026-10-14T08:30:00Z',
    updatedAt: '2026-10-29T10:00:00Z',
  },
  {
    _id: 'cmp_ent_002',
    campaign_name: 'Diagnostic AI Hardware Showcase & In-Person Tasting Tour',
    campaign_type: 'Multi-Channel',
    status: 'Active',
    start_date: '2026-10-20',
    end_date: '2026-11-25',
    target_audience: 'Hospital Operations Directors & Diagnostic Labs',
    target_count: 9800,
    budget: 12400,
    notes: 'Synchronized field invitations with targeted LinkedIn InMail. Follow-up automated in Workflow Engine.',
    utm_source: 'linkedin_abm',
    utm_medium: 'paid_event',
    utm_campaign: 'hardware_showcase_2026',
    recipient_count: 7340,
    open_rate: 61.2,
    click_rate: 28.5,
    conversion_rate: 11.4,
    bounced_count: 18,
    unsubscribed_count: 5,
    created_by: 'Elena Rostova',
    createdAt: '2026-10-19T11:15:00Z',
    updatedAt: '2026-10-28T16:20:00Z',
  },
  {
    _id: 'cmp_ent_003',
    campaign_name: 'Urgent Care Seasonal Supplies Bulk Procurement Flash Blast',
    campaign_type: 'SMS',
    status: 'Active',
    start_date: '2026-10-25',
    end_date: '2026-11-05',
    target_audience: 'Urgent Care Center Branch Managers',
    target_count: 16500,
    budget: 3200,
    notes: 'Direct priority SMS alerts with one-click portal reorder links.',
    utm_source: 'sms_gateway',
    utm_medium: 'direct_sms',
    utm_campaign: 'urgent_care_q4_flash',
    recipient_count: 15800,
    open_rate: 91.5,
    click_rate: 34.2,
    conversion_rate: 14.8,
    bounced_count: 42,
    unsubscribed_count: 12,
    created_by: 'Sarah Jenkins',
    createdAt: '2026-10-24T09:00:00Z',
    updatedAt: '2026-10-29T14:45:00Z',
  },
  {
    _id: 'cmp_ent_004',
    campaign_name: 'Telemedicine Regulatory & Compliance Whitepaper Push',
    campaign_type: 'Social',
    status: 'Scheduled',
    start_date: '2026-11-02',
    end_date: '2026-11-30',
    target_audience: 'Telehealth General Counsels & Compliance Officers',
    target_count: 22000,
    budget: 5400,
    notes: 'Sponsored industry report addressing cross-state licensure and HIPAA compliance.',
    utm_source: 'linkedin_ads',
    utm_medium: 'sponsored_content',
    utm_campaign: 'telehealth_compliance_guide',
    recipient_count: 0,
    open_rate: 0,
    click_rate: 0,
    conversion_rate: 0,
    bounced_count: 0,
    unsubscribed_count: 0,
    created_by: 'David Chen',
    createdAt: '2026-10-27T14:20:00Z',
    updatedAt: '2026-10-29T08:10:00Z',
  },
  {
    _id: 'cmp_ent_005',
    campaign_name: 'Post-Symposium Executive Q&A Re-Engagement',
    campaign_type: 'Email',
    status: 'Completed',
    start_date: '2026-09-10',
    end_date: '2026-10-15',
    target_audience: 'Registered Global Healthcare Symposium Attendees',
    target_count: 18400,
    budget: 6800,
    notes: 'High conversion follow-up delivering recorded sessions and custom proposal links.',
    utm_source: 'symposium_events',
    utm_medium: 'event_nurture',
    utm_campaign: 'annual_summit_recap',
    recipient_count: 18400,
    open_rate: 56.8,
    click_rate: 24.3,
    conversion_rate: 9.7,
    bounced_count: 38,
    unsubscribed_count: 14,
    created_by: 'Elena Rostova',
    createdAt: '2026-09-08T12:00:00Z',
    updatedAt: '2026-10-16T18:00:00Z',
  },
  {
    _id: 'cmp_ent_006',
    campaign_name: 'Pediatric Care Clinical Inactive Re-Activation Push',
    campaign_type: 'Push',
    status: 'Paused',
    start_date: '2026-10-01',
    end_date: '2026-10-28',
    target_audience: 'Dormant Clinic Software Accounts (> 30 days inactive)',
    target_count: 4200,
    budget: 950,
    notes: 'In-app notification prompt offering annual re-enrollment discount.',
    utm_source: 'portal_push',
    utm_medium: 'mobile_notification',
    utm_campaign: 'dormant_reactivation',
    recipient_count: 2400,
    open_rate: 32.1,
    click_rate: 8.4,
    conversion_rate: 3.2,
    bounced_count: 12,
    unsubscribed_count: 3,
    created_by: 'Sarah Jenkins',
    createdAt: '2026-09-29T15:40:00Z',
    updatedAt: '2026-10-28T09:30:00Z',
  },
  {
    _id: 'cmp_ent_007',
    campaign_name: 'Cardiology Equipment Q4 Fiscal Year-End Incentive Package',
    campaign_type: 'Multi-Channel',
    status: 'Active',
    start_date: '2026-10-18',
    end_date: '2026-12-15',
    target_audience: 'Cardiology Clinic Owners & Hospital Procurement Heads',
    target_count: 7500,
    budget: 9800,
    notes: 'Capital medical hardware leasing incentives combined with dedicated sales rep assignment.',
    utm_source: 'direct_mail_email',
    utm_medium: 'omnichannel',
    utm_campaign: 'cardio_q4_leasing',
    recipient_count: 5120,
    open_rate: 49.6,
    click_rate: 19.4,
    conversion_rate: 7.8,
    bounced_count: 21,
    unsubscribed_count: 6,
    created_by: 'Alex Rivera',
    createdAt: '2026-10-17T10:00:00Z',
    updatedAt: '2026-10-29T11:20:00Z',
  },
  {
    _id: 'cmp_ent_008',
    campaign_name: 'Self-Serve Clinical Trial Onboarding Pathway',
    campaign_type: 'Email',
    status: 'Active',
    start_date: '2026-10-05',
    end_date: '2026-12-31',
    target_audience: 'Inbound Portal Registered Medical Practitioners',
    target_count: 15200,
    budget: 1800,
    notes: 'Core onboarding sequence guiding doctors from initial setup to first clinical batch run.',
    utm_source: 'portal_signup',
    utm_medium: 'lifecycle_email',
    utm_campaign: 'inbound_activation',
    recipient_count: 13900,
    open_rate: 68.4,
    click_rate: 31.2,
    conversion_rate: 15.6,
    bounced_count: 29,
    unsubscribed_count: 9,
    created_by: 'David Chen',
    createdAt: '2026-10-04T13:30:00Z',
    updatedAt: '2026-10-29T15:00:00Z',
  },
  {
    _id: 'cmp_ent_009',
    campaign_name: 'Pharmaceutical Co-Marketing & Research Grant Partner Search',
    campaign_type: 'Social',
    status: 'Draft',
    start_date: '2026-11-15',
    end_date: '2026-12-20',
    target_audience: 'Tier-1 Biotech & Research Institute Executives',
    target_count: 6400,
    budget: 4500,
    notes: 'Co-grant application invitation for joint AI clinical methodology testing.',
    utm_source: 'linkedin_corporate',
    utm_medium: 'partnership_ads',
    utm_campaign: 'grant_partnership_2026',
    recipient_count: 0,
    open_rate: 0,
    click_rate: 0,
    conversion_rate: 0,
    bounced_count: 0,
    unsubscribed_count: 0,
    created_by: 'Alex Rivera',
    createdAt: '2026-10-28T16:00:00Z',
    updatedAt: '2026-10-29T09:15:00Z',
  },
  {
    _id: 'cmp_ent_010',
    campaign_name: 'Regional Radiology Clinic Network Software Upgrade Briefing',
    campaign_type: 'Email',
    status: 'Active',
    start_date: '2026-10-22',
    end_date: '2026-11-20',
    target_audience: 'Independent Imaging & Radiology Practice Partners',
    target_count: 8100,
    budget: 2900,
    notes: 'Highlighting cloud DICOM viewer upgrades and automated appointment reminder features.',
    utm_source: 'radiology_directory',
    utm_medium: 'targeted_newsletter',
    utm_campaign: 'radiology_v2_launch',
    recipient_count: 6450,
    open_rate: 44.8,
    click_rate: 16.7,
    conversion_rate: 6.2,
    bounced_count: 15,
    unsubscribed_count: 4,
    created_by: 'Elena Rostova',
    createdAt: '2026-10-21T11:45:00Z',
    updatedAt: '2026-10-29T12:30:00Z',
  },
];

export const MOCK_FALLBACK_CAMPAIGNS = ENTERPRISE_HARDCODED_CAMPAIGNS;

const LOCAL_STORAGE_KEY = 'wholcure_enterprise_campaigns_store_v1';

const getStore = (): Campaign[] => {
  if (typeof window === 'undefined') return ENTERPRISE_HARDCODED_CAMPAIGNS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ENTERPRISE_HARDCODED_CAMPAIGNS));
      return ENTERPRISE_HARDCODED_CAMPAIGNS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : ENTERPRISE_HARDCODED_CAMPAIGNS;
  } catch {
    return ENTERPRISE_HARDCODED_CAMPAIGNS;
  }
};

const saveStore = (data: Campaign[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }
};

export const CampaignsService = {
  /**
   * Fetch all professional enterprise campaigns (Hardcoded & Local Isolated State)
   */
  getAllCampaigns: async (): Promise<Campaign[]> => {
    return getStore();
  },

  /**
   * Fetch single campaign by ID
   */
  getCampaignById: async (id: string): Promise<Campaign | null> => {
    return getStore().find((c) => c._id === id) || null;
  },

  /**
   * Deploy new marketing campaign
   */
  createCampaign: async (payload: any): Promise<Campaign> => {
    const newRecord: Campaign = {
      ...payload,
      _id: `cmp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      recipient_count: 0,
      open_rate: 0,
      click_rate: 0,
      conversion_rate: 0,
      bounced_count: 0,
      unsubscribed_count: 0,
      created_by: 'Enterprise User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const current = getStore();
    const updated = [newRecord, ...current];
    saveStore(updated);
    return newRecord;
  },

  /**
   * Update existing campaign
   */
  updateCampaign: async (id: string, updates: Partial<any>): Promise<Campaign | null> => {
    const current = getStore();
    let updatedRecord: Campaign | null = null;
    const updated = current.map((c) => {
      if (c._id === id) {
        updatedRecord = { ...c, ...updates, updatedAt: new Date().toISOString() };
        return updatedRecord;
      }
      return c;
    });
    saveStore(updated);
    return updatedRecord;
  },

  /**
   * Status change
   */
  updateCampaignStatus: async (id: string, status: any): Promise<boolean> => {
    const current = getStore();
    const updated = current.map((c) =>
      c._id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c,
    );
    saveStore(updated);
    return true;
  },

  /**
   * Delete single campaign
   */
  deleteCampaign: async (id: string): Promise<boolean> => {
    const current = getStore();
    const updated = current.filter((c) => c._id !== id);
    saveStore(updated);
    return true;
  },

  /**
   * Bulk delete selected campaigns
   */
  bulkDeleteCampaigns: async (ids: string[]): Promise<boolean> => {
    const current = getStore();
    const updated = current.filter((c) => !ids.includes(c._id));
    saveStore(updated);
    return true;
  },

  /**
   * Reset to pristine enterprise seed list
   */
  resetToDefaultEnterpriseSeed: async (): Promise<Campaign[]> => {
    saveStore(ENTERPRISE_HARDCODED_CAMPAIGNS);
    return ENTERPRISE_HARDCODED_CAMPAIGNS;
  },

  seedDynamicCampaigns: async (): Promise<boolean> => {
    return true;
  },
};