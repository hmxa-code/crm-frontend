export interface IntegrationAddon {
  id: string;
  name: string;
  category: 'social' | 'email' | 'payments' | 'analytics' | 'ads' | 'webhooks';
  description: string;
  iconName: string;
  status: 'connected' | 'disconnected' | 'token_expired';
  apiCallsTotal: number;
  apiCallLimit: number;
  lastSynced: string;
  authAccountName?: string;
  webhookEndpoint?: string;
  features: {
    id: string;
    label: string;
    description: string;
    enabled: boolean;
  }[];
}

export interface CRMSettings {
  // Functional Color System
  primaryColor: string;
  accentColor: string;
  sidebarBg: string;
  sidebarText: string;
  cardBorder: string;

  // Sidebar Architecture & Theme Suits
  sidebarThemeSuit: 'enterprise_slate' | 'executive_dark' | 'glass_modern';
  sidebarDensity: 'compact' | 'comfortable' | 'spacious';
  sidebarActiveStyle: 'filled' | 'pill' | 'subtle' | 'border_left';
  sidebarCornerRadius: 'sharp' | 'rounded' | 'full';
  sidebarPosition: 'left' | 'right';
  sidebarHeaderStyle: 'standard' | 'minimal' | 'badge_card';
  sidebarShowBadges: boolean;
  sidebarShowQuickStats: boolean;
  sidebarShowStatusPulse: boolean;
  sidebarShowGroupTitles: boolean;
  sidebarCollapsible: boolean;

  // Header & Logo Management
  logoUrl: string;
  logoUploadData?: string; // base64 or object URL
  logoWidth: number;
  logoHeight: number;
  faviconUrl: string;

  // Workspace & Purpose Metadata
  crmPurposeText: string;
  crmTagline: string;
  companyName: string;
  customDomain: string;
  cnameVerified: boolean;

  // Calendar & Booking Workflow Rules
  autoScheduleReminders: boolean;
  defaultMeetingDuration: number; // 15, 30, 60
  bufferTimeBetweenCalls: number; // minutes: 0, 5, 10, 15
  bufferLookaheadWindowDays: number; // 7, 14, 30, 60

  // Security, Access & Audit Logs
  restrictLeadToOwnerOnly: boolean;
  roleBasedAutomationsVisibility: boolean;
  maskSensitiveDealValues: boolean;
  enforce2FA: boolean;
  apiSecretKey: string;
  recentAuditLogs: {
    id: string;
    event: string;
    user: string;
    ip: string;
    timestamp: string;
    status: 'success' | 'warning' | 'critical';
  }[];
}

export const THEME_PRESETS = [
  {
    name: "Enterprise Blue",
    description: "HubSpot & Salesforce inspired corporate palette",
    primaryColor: "#0066FF",
    accentColor: "#0F172A",
    sidebarBg: "#FFFFFF",
    sidebarText: "#1E293B",
    cardBorder: "#E2E8F0",
  },
  {
    name: "Dark Obsidian",
    description: "Sleek, modern deep graphite with electric cyan",
    primaryColor: "#06B6D4",
    accentColor: "#090D16",
    sidebarBg: "#0F172A",
    sidebarText: "#F8FAFC",
    cardBorder: "#334155",
  },
  {
    name: "Emerald Slate",
    description: "Fintech & wealth management balanced green",
    primaryColor: "#10B981",
    accentColor: "#064E3B",
    sidebarBg: "#F8FAFC",
    sidebarText: "#0F172A",
    cardBorder: "#CBD5E1",
  },
  {
    name: "Sunset Amber",
    description: "High-energy dynamic warm CRM brand theme",
    primaryColor: "#F59E0B",
    accentColor: "#78350F",
    sidebarBg: "#FFFFFF",
    sidebarText: "#1C1917",
    cardBorder: "#E7E5E4",
  },
  {
    name: "Royal Violet",
    description: "Premium SaaS & product-led tech look",
    primaryColor: "#8B5CF6",
    accentColor: "#4C1D95",
    sidebarBg: "#FAF5FF",
    sidebarText: "#1E1B4B",
    cardBorder: "#DDD6FE",
  },
];

export const INITIAL_INTEGRATIONS: IntegrationAddon[] = [
  {
    id: "fb-pages",
    name: "Facebook Pages & Leads",
    category: "social",
    description: "Sync Facebook Lead Ads directly into CRM pipeline with instant message reply triage.",
    iconName: "facebook",
    status: "connected",
    apiCallsTotal: 14280,
    apiCallLimit: 25000,
    lastSynced: "Just now",
    authAccountName: "Wholcure Global HQ (Page ID: 948120)",
    features: [
      { id: "auto_reply", label: "Auto-reply to comments", description: "Trigger instant canned replies to ad comments", enabled: true },
      { id: "dm_triage", label: "Direct Message triage", description: "Route Messenger DMs directly to sales reps", enabled: true },
      { id: "cross_post", label: "Cross-post updates to feed", description: "Publish marketing campaigns directly to feed", enabled: false },
    ],
  },
  {
    id: "ig-business",
    name: "Instagram for Business",
    category: "social",
    description: "Automate Story mentions, direct outreach lead capture, and product catalog inquiry logs.",
    iconName: "instagram",
    status: "connected",
    apiCallsTotal: 8430,
    apiCallLimit: 15000,
    lastSynced: "12 mins ago",
    authAccountName: "@wholcure_official",
    features: [
      { id: "dm_triage", label: "Direct Message triage", description: "Sync IG Direct Messages into the CRM inbox", enabled: true },
      { id: "story_mentions", label: "Story Mentions trigger", description: "Log brand stories as high-intent engagement", enabled: true },
      { id: "cross_post", label: "Cross-post to stories", description: "Post campaign promotions to IG stories", enabled: false },
    ],
  },
  {
    id: "linkedin-sales",
    name: "LinkedIn Sales Navigator",
    category: "social",
    description: "B2B contact enrichment, InMail sync, and automated company organizational hierarchy scans.",
    iconName: "linkedin",
    status: "token_expired",
    apiCallsTotal: 4950,
    apiCallLimit: 5000,
    lastSynced: "3 days ago",
    authAccountName: "Enterprise Seats (8 / 10 active)",
    features: [
      { id: "enrichment", label: "Account profile enrichment", description: "Auto-populate titles, employee count & revenue", enabled: true },
      { id: "inmail_sync", label: "InMail thread synchronizer", description: "Archive LinkedIn messages in lead timeline", enabled: true },
      { id: "lead_export", label: "Export saved searches", description: "Stream prospect lists into Opportunities", enabled: false },
    ],
  },
  {
    id: "youtube-studio",
    name: "YouTube Data API",
    category: "social",
    description: "Track video campaign conversions, webinar lead forms, and viewer engagement insights.",
    iconName: "youtube",
    status: "disconnected",
    apiCallsTotal: 0,
    apiCallLimit: 10000,
    lastSynced: "Never",
    features: [
      { id: "comments", label: "Community comments monitoring", description: "Highlight questions containing buying signals", enabled: false },
      { id: "cards", label: "Info Cards click attribution", description: "Track CRM contact origin from video cards", enabled: false },
    ],
  },
  {
    id: "google-workspace",
    name: "Google Workspace & Gmail",
    category: "email",
    description: "Bi-directional email logging, Google Calendar two-way meeting sync, and Drive attachments.",
    iconName: "google",
    status: "connected",
    apiCallsTotal: 34120,
    apiCallLimit: 50000,
    lastSynced: "2 mins ago",
    authAccountName: "admin@wholcure.com (Super Admin)",
    features: [
      { id: "email_sync", label: "2-Way Email Synchronization", description: "Real-time thread matching by client email", enabled: true },
      { id: "cal_sync", label: "Google Meet auto-generation", description: "Create Meet links on calendar appointments", enabled: true },
      { id: "drive_attach", label: "Google Drive proposal cloud", description: "Upload client proposals directly to Drive", enabled: true },
    ],
  },
  {
    id: "sendgrid",
    name: "SendGrid Email Delivery",
    category: "email",
    description: "Dedicated transactional and marketing bulk email dispatch with bounce tracking.",
    iconName: "sendgrid",
    status: "connected",
    apiCallsTotal: 68900,
    apiCallLimit: 100000,
    lastSynced: "5 mins ago",
    authAccountName: "Wholcure Mail Relay (Dedicated IP)",
    features: [
      { id: "tracking", label: "Open & click link tracking", description: "Embed invisible web beacons for engagement score", enabled: true },
      { id: "suppression", label: "Automated bounce suppression", description: "Prevent sending to flagged/invalid emails", enabled: true },
    ],
  },
  {
    id: "stripe-billing",
    name: "Stripe Billing & Subscriptions",
    category: "payments",
    description: "Embed payment links in quotes, synchronize invoices, and capture subscription MRR changes.",
    iconName: "stripe",
    status: "connected",
    apiCallsTotal: 18200,
    apiCallLimit: 50000,
    lastSynced: "1 min ago",
    authAccountName: "Wholcure Technologies Inc (Live Mode)",
    features: [
      { id: "auto_invoice", label: "Auto-generate invoice on deal close", description: "Create finalized invoice once status = Won", enabled: true },
      { id: "dunning", label: "Automated dunning reminders", description: "Send SMS/Email alerts on failed customer charges", enabled: true },
      { id: "payment_links", label: "One-click checkout buttons", description: "Generate custom checkout URLs in proposals", enabled: true },
    ],
  },
  {
    id: "paypal-checkout",
    name: "PayPal Commerce Platform",
    category: "payments",
    description: "Accept global credit card and PayPal payments on client invoices and appointment bookings.",
    iconName: "paypal",
    status: "disconnected",
    apiCallsTotal: 0,
    apiCallLimit: 25000,
    lastSynced: "Never",
    features: [
      { id: "smart_buttons", label: "Smart payment buttons", description: "Present PayPal and Pay in 4 on invoices", enabled: false },
      { id: "dispute_alert", label: "Dispute & chargeback notifications", description: "Flag account owner when a dispute is opened", enabled: false },
    ],
  },
  {
    id: "salesforce-sync",
    name: "Salesforce CRM Two-Way Sync",
    category: "analytics",
    description: "Synchronize Enterprise leads, accounts, opportunities, and custom Apex objects continuously.",
    iconName: "salesforce",
    status: "connected",
    apiCallsTotal: 92400,
    apiCallLimit: 100000,
    lastSynced: "10 mins ago",
    authAccountName: "na142.salesforce.com (Production Org)",
    features: [
      { id: "two_way", label: "Bi-directional field mapping", description: "Sync edits made in Salesforce or Wholcure CRM", enabled: true },
      { id: "conflict_res", label: "Salesforce master record rule", description: "Prefer Salesforce data during simultaneous edits", enabled: true },
    ],
  },
  {
    id: "mixpanel",
    name: "Mixpanel User Analytics",
    category: "analytics",
    description: "Stream product adoption metrics and client usage behavior directly onto deal health badges.",
    iconName: "analytics",
    status: "disconnected",
    apiCallsTotal: 120,
    apiCallLimit: 100000,
    lastSynced: "2 weeks ago",
    features: [
      { id: "cohort_sync", label: "Cohort sync to CRM segments", description: "Target churning accounts automatically", enabled: false },
      { id: "funnel_logs", label: "Onboarding step telemetry", description: "Display client product activation milestone", enabled: false },
    ],
  },
  {
    id: "google-ads",
    name: "Google Ads Offline Conversions",
    category: "ads",
    description: "Send qualified lead stages and closed-won contract values back to Google Ads for Smart Bidding.",
    iconName: "ads",
    status: "connected",
    apiCallsTotal: 12400,
    apiCallLimit: 30000,
    lastSynced: "40 mins ago",
    authAccountName: "Wholcure Search & PMax (MCC-491)",
    features: [
      { id: "offline_gclid", label: "GCLID Closed-Won feedback", description: "Feed converted value back into Target ROAS", enabled: true },
      { id: "enhanced_conversions", label: "Enhanced conversions hashing", description: "SHA-256 hash client email & phone for attribution", enabled: true },
    ],
  },
  {
    id: "custom-webhooks",
    name: "Custom Outbound & Inbound Webhooks",
    category: "webhooks",
    description: "Real-time signed HMAC payloads dispatched on lead creations, status changes, and appointments.",
    iconName: "webhook",
    status: "connected",
    apiCallsTotal: 104250,
    apiCallLimit: 250000,
    lastSynced: "Real-time stream active",
    webhookEndpoint: "https://api.wholcure.com/v1/webhooks/listener",
    features: [
      { id: "hmac_signing", label: "Enforce HMAC-SHA256 Signatures", description: "Validate incoming headers against your secret key", enabled: true },
      { id: "auto_retry", label: "Exponential backoff retry (5x)", description: "Re-attempt delivery on 5xx client timeouts", enabled: true },
      { id: "payload_compression", label: "Gzip payload compression", description: "Minimize network overhead on high volume events", enabled: false },
    ],
  },
];

export const DEFAULT_CRM_SETTINGS: CRMSettings = {
  // Colors
  primaryColor: "#0066FF",
  accentColor: "#0F172A",
  sidebarBg: "#FFFFFF",
  sidebarText: "#1E293B",
  cardBorder: "#E2E8F0",

  // Sidebar Architecture & Theme Suits
  sidebarThemeSuit: "enterprise_slate",
  sidebarDensity: "comfortable",
  sidebarActiveStyle: "filled",
  sidebarCornerRadius: "rounded",
  sidebarPosition: "left",
  sidebarHeaderStyle: "standard",
  sidebarShowBadges: true,
  sidebarShowQuickStats: true,
  sidebarShowStatusPulse: true,
  sidebarShowGroupTitles: true,
  sidebarCollapsible: true,

  // Header & Logo
  logoUrl: "",
  logoUploadData: "",
  logoWidth: 140,
  logoHeight: 36,
  faviconUrl: "",

  // Workspace Metadata
  crmPurposeText: "Turn every opportunity into a measurable customer journey.",
  crmTagline: "The modern revenue platform designed for ambitious growth teams.",
  companyName: "Wholcure Global CRM",
  customDomain: "crm.wholcure.com",
  cnameVerified: true,

  // Calendar & Booking
  autoScheduleReminders: true,
  defaultMeetingDuration: 30,
  bufferTimeBetweenCalls: 10,
  bufferLookaheadWindowDays: 14,

  // Security & Audit
  restrictLeadToOwnerOnly: false,
  roleBasedAutomationsVisibility: true,
  maskSensitiveDealValues: false,
  enforce2FA: true,
  apiSecretKey: "whc_live_9f83021a8d01e920bc73892ef00a94b",
  recentAuditLogs: [
    {
      id: "log-1",
      event: "CRM Branding Colors Updated",
      user: "Alex Rivera (Super Admin)",
      ip: "192.168.1.42",
      timestamp: "10 mins ago",
      status: "success",
    },
    {
      id: "log-2",
      event: "Stripe Billing Webhook Dispatched",
      user: "System Daemon (Automated)",
      ip: "10.0.4.12",
      timestamp: "32 mins ago",
      status: "success",
    },
    {
      id: "log-3",
      event: "LinkedIn API Token Expired",
      user: "OAuth Refresh Worker",
      ip: "10.0.4.19",
      timestamp: "3 days ago",
      status: "warning",
    },
    {
      id: "log-4",
      event: "Global User Export Initiated",
      user: "Elena Rostova (VP Sales)",
      ip: "185.220.101.5",
      timestamp: "4 days ago",
      status: "critical",
    },
  ],
};

const STORAGE_KEY = "crm-settings-v2";
const INTEGRATIONS_STORAGE_KEY = "crm-integrations-v2";

export const applyCRMSettings = (settings: CRMSettings) => {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.style.setProperty("--crm-primary", settings.primaryColor);
  root.style.setProperty("--crm-accent", settings.accentColor);
  root.style.setProperty("--crm-primary-soft", `${settings.primaryColor}22`);
  root.style.setProperty("--primary", settings.primaryColor);
  root.style.setProperty("--accent", settings.accentColor);
  root.style.setProperty("--sidebar-bg", settings.sidebarBg);
  root.style.setProperty("--sidebar-text", settings.sidebarText);
  root.style.setProperty("--card-border", settings.cardBorder);
};

export const getCRMSettings = (): CRMSettings => {
  if (typeof window === "undefined") return DEFAULT_CRM_SETTINGS;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Check legacy key if exists
      const legacy = window.localStorage.getItem("crm-settings");
      if (legacy) {
        const parsedLegacy = JSON.parse(legacy);
        const merged = { ...DEFAULT_CRM_SETTINGS, ...parsedLegacy };
        applyCRMSettings(merged);
        return merged;
      }
      applyCRMSettings(DEFAULT_CRM_SETTINGS);
      return DEFAULT_CRM_SETTINGS;
    }

    const parsed = JSON.parse(stored) as Partial<CRMSettings>;
    const merged = { ...DEFAULT_CRM_SETTINGS, ...parsed };
    applyCRMSettings(merged);
    return merged;
  } catch {
    applyCRMSettings(DEFAULT_CRM_SETTINGS);
    return DEFAULT_CRM_SETTINGS;
  }
};

export const saveCRMSettings = (settings: Partial<CRMSettings>): CRMSettings => {
  const current = getCRMSettings();
  const merged = { ...current, ...settings };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    applyCRMSettings(merged);
    window.dispatchEvent(new Event("crm-settings-updated"));
  }

  return merged;
};

export const getIntegrations = (): IntegrationAddon[] => {
  if (typeof window === "undefined") return INITIAL_INTEGRATIONS;

  try {
    const stored = window.localStorage.getItem(INTEGRATIONS_STORAGE_KEY);
    if (!stored) {
      return INITIAL_INTEGRATIONS;
    }
    return JSON.parse(stored);
  } catch {
    return INITIAL_INTEGRATIONS;
  }
};

export const saveIntegrations = (integrations: IntegrationAddon[]): IntegrationAddon[] => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(INTEGRATIONS_STORAGE_KEY, JSON.stringify(integrations));
    window.dispatchEvent(new Event("crm-integrations-updated"));
  }
  return integrations;
};
