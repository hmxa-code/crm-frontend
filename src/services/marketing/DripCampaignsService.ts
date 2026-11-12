import { apiRequest } from '@/src/api/client';
import {
  DripCampaign,
  DripCampaignEditablePayload,
  DripCampaignStatus,
  computeCampaignTelemetryFromSteps,
  emptyCampaignTelemetry,
} from '@/src/types/marketing/drip-campaign';

/**
 * DripCampaignEditablePayload does not declare `steps`, so we extend it here
 * to allow callers to optionally pass steps when creating a campaign.
 */
type DripCampaignCreatePayload = DripCampaignEditablePayload & {
  steps?: DripCampaign['steps'];
};

const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

export const MOCK_DRIP_CAMPAIGNS: DripCampaign[] = [
  {
    _id: 'drip_nutrition_food',
    title: 'Nutrition Food Sequence',
    description:
      'Seven-touch education journey for clinic dietitians evaluating wholesale meal programs.',
    triggerType: 'Event-Based',
    triggerDetail: 'Form submitted: Nutrition wholesale inquiry',
    targetPersona: 'Clinic Nutrition Buyers',
    enrollmentRules: [
      { id: 'r1', field: 'Lead source', operator: 'equals', value: 'Nutrition landing page' },
      { id: 'r2', field: 'Job function', operator: 'contains', value: 'Dietitian / CMO' },
      { id: 'r3', field: 'Do Not Contact', operator: 'is_false', value: 'false' },
    ],
    goal: 'Book a tasting + procurement call within 21 days',
    notes: 'Exclude accounts already on an active wholesale contract.',
    status: 'Active',
    owner: 'Maya Patel (Demand Gen)',
    createdAt: daysAgo(42),
    updatedAt: daysAgo(1),
    lastRunAt: daysAgo(0),
    steps: [
      {
        id: 'nf_1',
        order: 1,
        delayLabel: 'Immediately',
        delayHours: 0,
        actionType: 'Send Email',
        title: 'Welcome + clinical evidence pack',
        description: 'Introduce the program and attach micronutrient whitepaper.',
        subject: 'Your clinic nutrition kit is ready',
        telemetry: { delivered: 1840, opened: 1124, clicked: 486, converted: 62, skipped: 18, failed: 9 },
      },
      {
        id: 'nf_2',
        order: 2,
        delayLabel: 'Wait 2 Days',
        delayHours: 48,
        actionType: 'Send Email',
        title: 'Menu science & allergen matrix',
        description: 'Break down macros, allergens, and hospital kitchen constraints.',
        subject: 'How 40 clinics plate this menu',
        telemetry: { delivered: 1712, opened: 894, clicked: 318, converted: 81, skipped: 96, failed: 12 },
      },
      {
        id: 'nf_3',
        order: 3,
        delayLabel: 'Wait 3 Days',
        delayHours: 72,
        actionType: 'Add Tag',
        title: 'Tag engaged nutrition buyers',
        description: 'Apply Nutrition-Warm when email 2 is opened.',
        tagName: 'Nutrition-Warm',
        telemetry: { delivered: 894, opened: 0, clicked: 0, converted: 0, skipped: 22, failed: 0 },
      },
      {
        id: 'nf_4',
        order: 4,
        delayLabel: 'Wait 4 Days',
        delayHours: 96,
        actionType: 'Send SMS',
        title: 'Tasting-day reminder',
        description: 'Short SMS with calendar hold for on-site tasting.',
        subject: 'Reserve a tasting slot this week',
        telemetry: { delivered: 640, opened: 512, clicked: 198, converted: 74, skipped: 184, failed: 6 },
      },
      {
        id: 'nf_5',
        order: 5,
        delayLabel: 'Wait 5 Days',
        delayHours: 120,
        actionType: 'Notify Owner',
        title: 'Route hot leads to AE',
        description: 'Slack + CRM task when tasting CTA is clicked.',
        telemetry: { delivered: 198, opened: 0, clicked: 0, converted: 41, skipped: 8, failed: 1 },
      },
    ],
    telemetry: computeCampaignTelemetryFromSteps(1867, [], {
      activeLeads: 1124,
      completedLeads: 612,
      unsubscribedLeads: 41,
      bounced: 18,
    }),
  },
  {
    _id: 'drip_lead_nurture',
    title: 'Lead Nurturing Sequence',
    description: 'Score-aware nurture for inbound healthcare SaaS MQLs that have not booked a demo.',
    triggerType: 'Behavior-Based',
    triggerDetail: 'Lead score ≥ 55 and no demo in last 14 days',
    targetPersona: 'Inbound MQLs — Healthcare SaaS',
    enrollmentRules: [
      { id: 'r1', field: 'Lead score', operator: 'greater_than', value: '55' },
      { id: 'r2', field: 'Lifecycle stage', operator: 'equals', value: 'MQL' },
      { id: 'r3', field: 'Demo booked', operator: 'is_false', value: 'false' },
    ],
    goal: 'Lift demo booking rate among stalled MQLs',
    status: 'Active',
    owner: 'Alex Rivera (VP Growth)',
    createdAt: daysAgo(28),
    updatedAt: daysAgo(0),
    lastRunAt: daysAgo(0),
    steps: [
      {
        id: 'ln_1',
        order: 1,
        delayLabel: 'Wait 1 Day',
        delayHours: 24,
        actionType: 'Send Email',
        title: 'Problem framing case study',
        description: 'Share a 4-minute case study on intake-to-claim cycle time.',
        subject: 'How St. Helix cut intake by 31%',
        telemetry: { delivered: 4120, opened: 2218, clicked: 704, converted: 96, skipped: 40, failed: 22 },
      },
      {
        id: 'ln_2',
        order: 2,
        delayLabel: 'Wait 2 Days',
        delayHours: 48,
        actionType: 'Update Score',
        title: 'Boost score on click',
        description: '+12 points when pricing page is viewed from this sequence.',
        telemetry: { delivered: 704, opened: 0, clicked: 0, converted: 0, skipped: 12, failed: 0 },
      },
      {
        id: 'ln_3',
        order: 3,
        delayLabel: 'Wait 3 Days',
        delayHours: 72,
        actionType: 'Send Email',
        title: 'ROI calculator + peer quote',
        description: 'Interactive calculator plus CMO quote from a 200-bed hospital.',
        subject: 'Your 90-day ROI snapshot',
        telemetry: { delivered: 3688, opened: 1742, clicked: 612, converted: 148, skipped: 210, failed: 18 },
      },
      {
        id: 'ln_4',
        order: 4,
        delayLabel: 'Wait 4 Days',
        delayHours: 96,
        actionType: 'Send SMS',
        title: 'Same-week demo nudge',
        description: 'Two-line SMS from assigned AE with Calendly deep link.',
        subject: '15 minutes this week?',
        telemetry: { delivered: 980, opened: 812, clicked: 266, converted: 91, skipped: 340, failed: 7 },
      },
      {
        id: 'ln_5',
        order: 5,
        delayLabel: 'Wait 7 Days',
        delayHours: 168,
        actionType: 'Add Tag',
        title: 'Mark nurture-exhausted',
        description: 'Tag Nurture-Complete if still unbooked after day 17.',
        tagName: 'Nurture-Complete',
        telemetry: { delivered: 2210, opened: 0, clicked: 0, converted: 0, skipped: 44, failed: 0 },
      },
    ],
    telemetry: computeCampaignTelemetryFromSteps(4162, [], {
      activeLeads: 2488,
      completedLeads: 1540,
      unsubscribedLeads: 86,
      bounced: 48,
    }),
  },
  {
    _id: 'drip_saas_onboarding',
    title: 'SaaS Onboarding Flow',
    description: 'Product-led onboarding for trial workspaces during the first 14 days.',
    triggerType: 'Time-Based',
    triggerDetail: 'Workspace created — Day 0 clock starts immediately',
    targetPersona: 'Trial Users (Days 0–14)',
    enrollmentRules: [
      { id: 'r1', field: 'Plan', operator: 'equals', value: 'Trial' },
      { id: 'r2', field: 'Workspace created', operator: 'is_true', value: 'true' },
      { id: 'r3', field: 'Admin seats', operator: 'greater_than', value: '0' },
    ],
    goal: 'Reach activation (3 modules configured) before trial day 10',
    status: 'Active',
    owner: 'Priya Shah (Lifecycle)',
    createdAt: daysAgo(60),
    updatedAt: daysAgo(2),
    lastRunAt: daysAgo(0),
    steps: [
      {
        id: 'so_1',
        order: 1,
        delayLabel: 'Immediately',
        delayHours: 0,
        actionType: 'Send Email',
        title: 'Day 0 — setup checklist',
        description: 'Welcome email with 4-step activation checklist.',
        subject: 'Your first 15 minutes in Wholcure',
        telemetry: { delivered: 980, opened: 742, clicked: 418, converted: 210, skipped: 6, failed: 4 },
      },
      {
        id: 'so_2',
        order: 2,
        delayLabel: 'Wait 1 Day',
        delayHours: 24,
        actionType: 'Send Email',
        title: 'Invite teammates',
        description: 'Prompt to invite billing + clinical ops owners.',
        subject: 'Onboarding is faster with your team',
        telemetry: { delivered: 922, opened: 510, clicked: 266, converted: 144, skipped: 48, failed: 5 },
      },
      {
        id: 'so_3',
        order: 3,
        delayLabel: 'Wait 3 Days',
        delayHours: 72,
        actionType: 'Send SMS',
        title: 'In-product tour reminder',
        description: 'SMS if modules configured < 2.',
        subject: 'Finish your clinical intake tour',
        telemetry: { delivered: 410, opened: 338, clicked: 121, converted: 64, skipped: 190, failed: 3 },
      },
      {
        id: 'so_4',
        order: 4,
        delayLabel: 'Wait 5 Days',
        delayHours: 120,
        actionType: 'Notify Owner',
        title: 'CSM intervention',
        description: 'Create CSM task when activation score < 40.',
        telemetry: { delivered: 188, opened: 0, clicked: 0, converted: 52, skipped: 12, failed: 0 },
      },
      {
        id: 'so_5',
        order: 5,
        delayLabel: 'Wait 10 Days',
        delayHours: 240,
        actionType: 'Send Email',
        title: 'Upgrade path before trial ends',
        description: 'Compare Team vs Enterprise with usage snapshot.',
        subject: 'Your trial ends in 4 days — here is a plan',
        telemetry: { delivered: 760, opened: 428, clicked: 196, converted: 88, skipped: 70, failed: 6 },
      },
    ],
    telemetry: computeCampaignTelemetryFromSteps(986, [], {
      activeLeads: 412,
      completedLeads: 538,
      unsubscribedLeads: 22,
      bounced: 8,
    }),
  },
  {
    _id: 'drip_hospital_rfp',
    title: 'Hospital RFP Acceleration',
    description: 'Time-boxed sequence for procurement leads who downloaded the RFP kit.',
    triggerType: 'Event-Based',
    triggerDetail: 'Asset download: Hospital RFP template pack',
    targetPersona: 'Hospital Procurement Leads',
    enrollmentRules: [
      { id: 'r1', field: 'Company type', operator: 'contains', value: 'Hospital / Health System' },
      { id: 'r2', field: 'Employee count', operator: 'greater_than', value: '500' },
    ],
    goal: 'Secure a scoped discovery workshop',
    status: 'Paused',
    owner: 'Elena Rostova',
    createdAt: daysAgo(18),
    updatedAt: daysAgo(3),
    lastRunAt: daysAgo(4),
    notes: 'Paused while legal reviews HIPAA language in email 2.',
    steps: [
      {
        id: 'hr_1',
        order: 1,
        delayLabel: 'Wait 4 Hours',
        delayHours: 4,
        actionType: 'Send Email',
        title: 'RFP checklist recap',
        description: 'Confirm download and outline evaluation criteria.',
        subject: 'Your RFP kit — next 3 decisions',
        telemetry: { delivered: 640, opened: 318, clicked: 94, converted: 18, skipped: 12, failed: 8 },
      },
      {
        id: 'hr_2',
        order: 2,
        delayLabel: 'Wait 2 Days',
        delayHours: 48,
        actionType: 'Send Email',
        title: 'Security & BAA overview',
        description: 'SOC2, BAA, and data residency one-pager.',
        subject: 'Security packet for your IT reviewers',
        telemetry: { delivered: 510, opened: 246, clicked: 71, converted: 22, skipped: 80, failed: 4 },
      },
      {
        id: 'hr_3',
        order: 3,
        delayLabel: 'Wait 5 Days',
        delayHours: 120,
        actionType: 'Notify Owner',
        title: 'Enterprise AE follow-up',
        description: 'Assign AE if security packet is opened.',
        telemetry: { delivered: 246, opened: 0, clicked: 0, converted: 16, skipped: 9, failed: 1 },
      },
    ],
    telemetry: computeCampaignTelemetryFromSteps(652, [], {
      activeLeads: 410,
      completedLeads: 198,
      unsubscribedLeads: 19,
      bounced: 25,
    }),
  },
  {
    _id: 'drip_churn_save',
    title: 'Churn-Risk Save Sequence',
    description: 'Behavior-based rescue for accounts with declining weekly active seats.',
    triggerType: 'Behavior-Based',
    triggerDetail: 'WAU down ≥ 35% week-over-week for 2 weeks',
    targetPersona: 'Churn-Risk Accounts',
    enrollmentRules: [
      { id: 'r1', field: 'WAU change', operator: 'less_than', value: '-35%' },
      { id: 'r2', field: 'Contract remaining', operator: 'greater_than', value: '30 days' },
    ],
    goal: 'Recover usage or book a save call',
    status: 'Draft',
    owner: 'Jordan Lee (CS Ops)',
    createdAt: daysAgo(6),
    updatedAt: daysAgo(1),
    steps: [
      {
        id: 'cs_1',
        order: 1,
        delayLabel: 'Immediately',
        delayHours: 0,
        actionType: 'Add Tag',
        title: 'Flag churn-risk',
        description: 'Apply Churn-Watch for reporting dashboards.',
        tagName: 'Churn-Watch',
        telemetry: { delivered: 0, opened: 0, clicked: 0, converted: 0, skipped: 0, failed: 0 },
      },
      {
        id: 'cs_2',
        order: 2,
        delayLabel: 'Wait 1 Day',
        delayHours: 24,
        actionType: 'Send Email',
        title: 'Usage snapshot + enablement',
        description: 'Show unused modules and 20-minute enablement offer.',
        subject: 'We noticed a drop — here is a recovery plan',
        telemetry: { delivered: 0, opened: 0, clicked: 0, converted: 0, skipped: 0, failed: 0 },
      },
      {
        id: 'cs_3',
        order: 3,
        delayLabel: 'Wait 3 Days',
        delayHours: 72,
        actionType: 'Notify Owner',
        title: 'CSM save-play task',
        description: 'Create high-priority task if email unopened.',
        telemetry: { delivered: 0, opened: 0, clicked: 0, converted: 0, skipped: 0, failed: 0 },
      },
    ],
    telemetry: emptyCampaignTelemetry(),
  },
  {
    _id: 'drip_webinar_followup',
    title: 'Summit Webinar Follow-up',
    description: 'Post-event nurture for 2026 Healthcare Innovation Summit registrants.',
    triggerType: 'Time-Based',
    triggerDetail: 'Starts 2 hours after webinar end timestamp',
    targetPersona: 'Event Registrants',
    enrollmentRules: [
      { id: 'r1', field: 'Event', operator: 'equals', value: 'Innovation Summit 2026' },
      { id: 'r2', field: 'Attendance status', operator: 'equals', value: 'Attended or No-show' },
    ],
    goal: 'Drive recording views and proposal meetings',
    status: 'Completed',
    owner: 'Sarah Jenkins',
    createdAt: daysAgo(48),
    updatedAt: daysAgo(8),
    lastRunAt: daysAgo(8),
    steps: [
      {
        id: 'wf_1',
        order: 1,
        delayLabel: 'Wait 2 Hours',
        delayHours: 2,
        actionType: 'Send Email',
        title: 'Recording + slides',
        description: 'Send on-demand recording to attendees and no-shows.',
        subject: 'Your summit recording is live',
        telemetry: { delivered: 6240, opened: 3890, clicked: 2144, converted: 410, skipped: 80, failed: 22 },
      },
      {
        id: 'wf_2',
        order: 2,
        delayLabel: 'Wait 2 Days',
        delayHours: 48,
        actionType: 'Send Email',
        title: 'Breakout recap by persona',
        description: 'Segmented recap for CMOs vs ops directors.',
        subject: 'The 3 takeaways for your role',
        telemetry: { delivered: 5880, opened: 2710, clicked: 980, converted: 288, skipped: 210, failed: 16 },
      },
      {
        id: 'wf_3',
        order: 3,
        delayLabel: 'Wait 5 Days',
        delayHours: 120,
        actionType: 'Send SMS',
        title: 'Proposal meeting CTA',
        description: 'SMS for contacts who watched > 50% of recording.',
        subject: 'Want the implementation worksheet?',
        telemetry: { delivered: 1640, opened: 1210, clicked: 402, converted: 156, skipped: 320, failed: 11 },
      },
      {
        id: 'wf_4',
        order: 4,
        delayLabel: 'Wait 8 Days',
        delayHours: 192,
        actionType: 'Add Tag',
        title: 'Archive event cohort',
        description: 'Tag Summit-2026-Complete and exit sequence.',
        tagName: 'Summit-2026-Complete',
        telemetry: { delivered: 6240, opened: 0, clicked: 0, converted: 0, skipped: 0, failed: 0 },
      },
    ],
    telemetry: computeCampaignTelemetryFromSteps(6320, [], {
      activeLeads: 0,
      completedLeads: 5988,
      unsubscribedLeads: 214,
      bounced: 118,
    }),
  },
  {
    _id: 'drip_intent_visitors',
    title: 'High-Intent Pricing Visitors',
    description: 'Behavior drip for anonymous-to-known visitors who viewed pricing three times.',
    triggerType: 'Behavior-Based',
    triggerDetail: 'Pricing page viewed ≥ 3 times in 7 days',
    targetPersona: 'High-Intent Website Visitors',
    enrollmentRules: [
      { id: 'r1', field: 'Pricing views (7d)', operator: 'greater_than', value: '2' },
      { id: 'r2', field: 'Email identified', operator: 'is_true', value: 'true' },
    ],
    goal: 'Convert to demo or self-serve trial',
    status: 'Draft',
    owner: 'David Chen',
    createdAt: daysAgo(3),
    updatedAt: daysAgo(0),
    steps: [
      {
        id: 'iv_1',
        order: 1,
        delayLabel: 'Wait 30 Minutes',
        delayHours: 0.5,
        actionType: 'Send Email',
        title: 'Pricing FAQ + comparison',
        description: 'Answer seat vs usage pricing questions.',
        subject: 'A clearer look at Wholcure pricing',
        telemetry: { delivered: 0, opened: 0, clicked: 0, converted: 0, skipped: 0, failed: 0 },
      },
      {
        id: 'iv_2',
        order: 2,
        delayLabel: 'Wait 1 Day',
        delayHours: 24,
        actionType: 'Send Email',
        title: 'Customer proof near their ICP',
        description: 'Industry-matched logo wall and quote.',
        subject: 'Teams like yours typically start here',
        telemetry: { delivered: 0, opened: 0, clicked: 0, converted: 0, skipped: 0, failed: 0 },
      },
    ],
    telemetry: emptyCampaignTelemetry(),
  },
];

function hydrateTelemetry(campaign: DripCampaign): DripCampaign {
  if (campaign.telemetry.enrolledLeads === 0) {
    return campaign;
  }
  const fromSteps = computeCampaignTelemetryFromSteps(
    campaign.telemetry.enrolledLeads,
    campaign.steps,
    {
      activeLeads: campaign.telemetry.activeLeads,
      completedLeads: campaign.telemetry.completedLeads,
      unsubscribedLeads: campaign.telemetry.unsubscribedLeads,
      bounced: campaign.telemetry.bounced,
    },
  );
  return { ...campaign, telemetry: fromSteps };
}

const LOCAL_STORAGE_KEY = 'marketing_drip_campaigns_cache_v1';

const seeded = MOCK_DRIP_CAMPAIGNS.map(hydrateTelemetry);

const getCachedCampaigns = (): DripCampaign[] => {
  if (typeof window === 'undefined') return seeded;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw) as DripCampaign[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : seeded;
  } catch {
    return seeded;
  }
};

const saveCachedCampaigns = (campaigns: DripCampaign[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(campaigns));
  }
};

export const DripCampaignsService = {
  getAll: async (): Promise<DripCampaign[]> => {
    return getCachedCampaigns();
  },

  /**
   * Alias for getAll to support dashboard and legacy callers
   */
  getAllDripCampaigns: async (): Promise<DripCampaign[]> => {
    return getCachedCampaigns();
  },

  getById: async (id: string): Promise<DripCampaign | null> => {
    return getCachedCampaigns().find((c) => c._id === id) ?? null;
  },

  create: async (payload: DripCampaignCreatePayload): Promise<DripCampaign> => {
    const newRecord: DripCampaign = {
      ...payload,
      _id: `drip_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      status: 'Active',
      steps: payload.steps || [],
      telemetry: emptyCampaignTelemetry(),
      owner: 'Maya Patel (Demand Gen)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newRecord, ...getCachedCampaigns()];
    saveCachedCampaigns(updated);
    return newRecord;
  },

  updateStatus: async (id: string, status: DripCampaignStatus): Promise<boolean> => {
    const updated = getCachedCampaigns().map((c) =>
      c._id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c,
    );
    saveCachedCampaigns(updated);
    return true;
  },

  seedDynamicDrips: async (): Promise<boolean> => {
    const current = getCachedCampaigns();
    const dynamicSeeds: DripCampaign[] = [
      {
        _id: `drip_dyn_${Date.now()}_1`,
        title: 'Post-Discharge Cardiac Care Adherence Pathway',
        description: 'Omnichannel 14-day telemetry check-in sequence for post-PCI and heart failure discharge cohorts.',
        triggerType: 'Event-Based',
        triggerDetail: 'EHR Event: Inpatient discharge with ICD-10 I50.9',
        targetPersona: 'Cardiology Recovering Inpatients',
        enrollmentRules: [
          { id: 'r1', field: 'Discharge Unit', operator: 'equals', value: 'Cardiology Step-down' },
          { id: 'r2', field: 'Readmission Risk', operator: 'greater_than', value: '40' },
        ],
        goal: 'Zero 30-day readmissions & confirm day 7 follow-up booking',
        status: 'Active',
        owner: 'Dr. Michael Chang (Chief Clinical Officer)',
        createdAt: daysAgo(5),
        updatedAt: daysAgo(1),
        lastRunAt: daysAgo(0),
        steps: [
          {
            id: 'cs_1',
            order: 1,
            delayLabel: 'Wait 1 Day',
            delayHours: 24,
            actionType: 'Send SMS',
            title: 'Medication Reconciliation & Careline Check',
            description: 'SMS verifying prescription fill at home dispensary with 1-click nurse callback hold.',
            subject: 'Wholcure Heart Care: Did your pharmacy fill your morning scripts?',
            telemetry: { delivered: 1420, opened: 1290, clicked: 840, converted: 110, skipped: 12, failed: 4 },
          },
          {
            id: 'cs_2',
            order: 2,
            delayLabel: 'Wait 3 Days',
            delayHours: 72,
            actionType: 'Send Email',
            title: 'Low-Sodium Meal Prep & Vitals Log',
            description: 'Nutrition guide and daily BP/weight log reminder link.',
            subject: 'Week 1 recovery checklist: Blood pressure tracking made easy',
            telemetry: { delivered: 1390, opened: 920, clicked: 480, converted: 86, skipped: 18, failed: 2 },
          },
        ],
        telemetry: computeCampaignTelemetryFromSteps(1420, [], {
          activeLeads: 890,
          completedLeads: 510,
          unsubscribedLeads: 12,
          bounced: 8,
        }),
      },
      {
        _id: `drip_dyn_${Date.now()}_2`,
        title: 'Diagnostic Device Pilot-to-Contract Drip',
        description: 'Executive nurturing sequence for hospital pathology directors testing rapid molecular PCR analyzers.',
        triggerType: 'Behavior-Based',
        triggerDetail: 'Device evaluation sample kit delivered to lab',
        targetPersona: 'Pathology & Lab Medicine Directors',
        enrollmentRules: [
          { id: 'r1', field: 'Lab Tier', operator: 'equals', value: 'Tier 1 Regional' },
          { id: 'r2', field: 'Daily Specimen Vol', operator: 'greater_than', value: '500' },
        ],
        goal: 'Execute 36-month reagent supply agreement',
        status: 'Active',
        owner: 'Elena Rostova (VP Enterprise Partnerships)',
        createdAt: daysAgo(12),
        updatedAt: daysAgo(2),
        lastRunAt: daysAgo(0),
        steps: [
          {
            id: 'dd_1',
            order: 1,
            delayLabel: 'Wait 2 Days',
            delayHours: 48,
            actionType: 'Send Email',
            title: 'Assay Sensitivity vs Standard PCR Benchmark Matrix',
            description: 'Comparative CLIA analytical validation data.',
            subject: 'Validation whitepaper: 99.4% concordant sensitivity in 22 mins',
            telemetry: { delivered: 640, opened: 480, clicked: 290, converted: 48, skipped: 8, failed: 2 },
          },
          {
            id: 'dd_2',
            order: 2,
            delayLabel: 'Wait 5 Days',
            delayHours: 120,
            actionType: 'Notify Owner',
            title: 'Schedule Lab On-site Technical Review',
            description: 'Alert Enterprise AE to coordinate Field Applications Specialist visit.',
            telemetry: { delivered: 290, opened: 0, clicked: 0, converted: 34, skipped: 4, failed: 0 },
          },
        ],
        telemetry: computeCampaignTelemetryFromSteps(640, [], {
          activeLeads: 410,
          completedLeads: 218,
          unsubscribedLeads: 6,
          bounced: 6,
        }),
      },
      {
        _id: `drip_dyn_${Date.now()}_3`,
        title: 'Physician Specialty Network Onboarding Pathway',
        description: 'Automated credentialing, portal training, and referral routing education for newly paneled physicians.',
        triggerType: 'Time-Based',
        triggerDetail: 'Provider credentialing approved in CAQH',
        targetPersona: 'Board-Certified Specialist Physicians',
        enrollmentRules: [
          { id: 'r1', field: 'Credential Status', operator: 'equals', value: 'Approved' },
        ],
        goal: 'First specialist tele-consult scheduled within 10 days',
        status: 'Active',
        owner: 'Alex Rivera (VP Growth)',
        createdAt: daysAgo(8),
        updatedAt: daysAgo(1),
        lastRunAt: daysAgo(0),
        steps: [
          {
            id: 'pn_1',
            order: 1,
            delayLabel: 'Immediately',
            delayHours: 0,
            actionType: 'Send Email',
            title: 'Welcome to the Wholcure Provider Specialty Network',
            description: 'Direct portal credentials and EHR integration setup guide.',
            subject: 'Your Wholcure Specialty Provider Portal is Active',
            telemetry: { delivered: 850, opened: 710, clicked: 520, converted: 180, skipped: 6, failed: 3 },
          },
        ],
        telemetry: computeCampaignTelemetryFromSteps(850, [], {
          activeLeads: 520,
          completedLeads: 320,
          unsubscribedLeads: 4,
          bounced: 6,
        }),
      },
    ];

    saveCachedCampaigns([...dynamicSeeds, ...current]);
    return true;
  },

  delete: async (id: string): Promise<boolean> => {
    saveCachedCampaigns(getCachedCampaigns().filter((c) => c._id !== id));
    return true;
  },

  bulkDelete: async (ids: string[]): Promise<boolean> => {
    saveCachedCampaigns(getCachedCampaigns().filter((c) => !ids.includes(c._id)));
    return true;
  },

  resetToDefaultBaseline: async (): Promise<DripCampaign[]> => {
    saveCachedCampaigns(seeded);
    return seeded;
  },
};