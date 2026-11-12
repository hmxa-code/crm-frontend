import { ContentItem, CreateContentPayload, ContentStatus } from '@/src/types/marketing/content-engine';

const LOCAL_STORAGE_KEY = 'marketing_content_engine_cache_v2';

const now = Date.now();
const hour = 3600 * 1000;
const day = 24 * hour;

export const ENTERPRISE_HARDCODED_CONTENT: ContentItem[] = [
  {
    _id: 'post_ce_001',
    campaign_association: 'Enterprise Clinical Trial Expansion 2026',
    target_account_ids: ['acc_linkedin_03', 'acc_twitter_04'],
    target_platforms: ['LinkedIn', 'Twitter'],
    caption: '🚀 We are thrilled to reveal our 2026 multi-center diagnostic AI telemetry suite! Empowering clinical research teams to reduce patient trial onboarding latency by 44%. Discover the full clinical benchmark report below.\n\n#ClinicalResearch #HealthTech #AIinMedicine #Diagnostics',
    media_assets: [
      {
        id: 'media_101',
        url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
        type: 'image',
        filename: 'telemetry_dashboard.jpg',
      },
    ],
    status: 'Published',
    published_at: new Date(now - 2 * day).toISOString(),
    publish_immediately: true,
    target_persona: 'Chief Medical Officers & Clinical Trial Directors',
    telemetry: {
      LinkedIn: { impressions: 14200, likes: 482, comments: 64, clicks: 890, shares: 38 },
      Twitter: { impressions: 9800, likes: 215, comments: 28, clicks: 430, shares: 52 },
    },
    created_by: 'Alex Rivera (VP Growth)',
    createdAt: new Date(now - 3 * day).toISOString(),
    updatedAt: new Date(now - 2 * day).toISOString(),
  },
  {
    _id: 'post_ce_002',
    campaign_association: 'Diagnostic AI Hardware Showcase & In-Person Tasting Tour',
    target_account_ids: ['acc_meta_ig_01', 'acc_meta_fb_02'],
    target_platforms: ['Instagram', 'Facebook'],
    caption: '🔬 Behind the Scenes: Tour our automated specimen processing robotics! When speed and molecular accuracy matter most, Wholcure systems process 1,200 panels per hour with zero human error.\n\nCatch our live booth tour at the MedTech Expo next Thursday! 🏥✨\n\n#MedTech #LabAutomation #HealthcareInnovation #Biotechnology',
    media_assets: [
      {
        id: 'media_102',
        url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800&auto=format&fit=crop&q=80',
        type: 'image',
        filename: 'laboratory_robotics.jpg',
      },
    ],
    status: 'Published',
    published_at: new Date(now - 1 * day).toISOString(),
    publish_immediately: true,
    target_persona: 'Hospital Lab Directors & Operations Leads',
    telemetry: {
      Instagram: { impressions: 22400, likes: 1640, comments: 94, clicks: 310, shares: 142 },
      Facebook: { impressions: 8900, likes: 320, comments: 45, clicks: 180, shares: 28 },
    },
    created_by: 'Elena Rostova',
    createdAt: new Date(now - 2 * day).toISOString(),
    updatedAt: new Date(now - 1 * day).toISOString(),
  },
  {
    _id: 'post_ce_003',
    campaign_association: 'Urgent Care Seasonal Supplies Bulk Procurement Flash Blast',
    target_account_ids: ['acc_twitter_04', 'acc_whatsapp_06'],
    target_platforms: ['Twitter', 'WhatsApp'],
    caption: '⚡ Flash Procurement Alert: Q4 wholesale diagnostic inventory allocations are live. Urgent care partners receive guaranteed priority freight on rapid PCR tests & antigen panels.\n\nUse wholesale portal code URGENT-Q4 for volume rebates. Link in bio! 📦',
    media_assets: [
      {
        id: 'media_103',
        url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
        type: 'image',
        filename: 'procurement_boxes.jpg',
      },
    ],
    status: 'Scheduled',
    scheduled_at: new Date(now + 1 * day + 4 * hour).toISOString(),
    publish_immediately: false,
    target_persona: 'Urgent Care Practice Managers',
    created_by: 'Sarah Jenkins',
    createdAt: new Date(now - 6 * hour).toISOString(),
    updatedAt: new Date(now - 6 * hour).toISOString(),
  },
  {
    _id: 'post_ce_004',
    campaign_association: 'Telemedicine Regulatory & Compliance Whitepaper Push',
    target_account_ids: ['acc_linkedin_03'],
    target_platforms: ['LinkedIn'],
    caption: '⚖️ Cross-State Telehealth Licensure in 2026: What Healthcare General Counsels Need to Know.\n\nOur regulatory legal advisory team breaks down the latest Interstate Medical Licensure Compact (IMLC) updates and HIPAA encryption standards for AI transcription.\n\nRead our 24-page whitepaper guide. 📑',
    media_assets: [
      {
        id: 'media_104',
        url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
        type: 'image',
        filename: 'compliance_report.jpg',
      },
    ],
    status: 'Scheduled',
    scheduled_at: new Date(now + 2 * day + 2 * hour).toISOString(),
    publish_immediately: false,
    target_persona: 'Telehealth Legal Counsel & Compliance Officers',
    created_by: 'Maya Patel (Demand Gen)',
    createdAt: new Date(now - 12 * hour).toISOString(),
    updatedAt: new Date(now - 12 * hour).toISOString(),
  },
  {
    _id: 'post_ce_005',
    campaign_association: 'Executive Cardiology Preventive Protocol 2026',
    target_account_ids: ['acc_youtube_05', 'acc_linkedin_03'],
    target_platforms: ['YouTube', 'LinkedIn'],
    caption: '🫀 Grand Rounds Keynote: Dr. Aris Vance presents "AI-Augmented Arrhythmia Detection in Ambulatory Monitoring."\n\nWatch how deep learning reduces false positive Holter monitor readings by 67% without sacrificing sensitivity.\n\nWatch the 18-minute masterclass on YouTube now!',
    media_assets: [
      {
        id: 'media_105',
        url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80',
        type: 'image',
        filename: 'cardiology_webinar.jpg',
      },
    ],
    status: 'Published',
    published_at: new Date(now - 4 * day).toISOString(),
    publish_immediately: true,
    target_persona: 'Cardiologists & Clinic Directors',
    telemetry: {
      YouTube: { impressions: 38400, likes: 2100, comments: 180, clicks: 1420, shares: 310 },
      LinkedIn: { impressions: 12500, likes: 390, comments: 42, clicks: 610, shares: 48 },
    },
    created_by: 'Alex Rivera (VP Growth)',
    createdAt: new Date(now - 5 * day).toISOString(),
    updatedAt: new Date(now - 4 * day).toISOString(),
  },
  {
    _id: 'post_ce_006',
    campaign_association: 'Nutrition Food Sequence',
    target_account_ids: ['acc_meta_ig_01', 'acc_tiktok_07'],
    target_platforms: ['Instagram', 'TikTok'],
    caption: '🥗 3 Micronutrient Shifts that Accelerate Metabolic Recovery: Evidence-Based Clinical Nutrition.\n\nSwipe through for the full patient diet protocol designed by our registered oncology & metabolic dietitians. Tag a colleague who needs this evidence cheat-sheet!\n\n#NutritionScience #ClinicalDietitian #FunctionalMedicine #WellnessJourney',
    media_assets: [
      {
        id: 'media_106',
        url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80',
        type: 'image',
        filename: 'healthy_plate.jpg',
      },
    ],
    status: 'Published',
    published_at: new Date(now - 6 * day).toISOString(),
    publish_immediately: true,
    target_persona: 'Clinic Nutritionists & Health Coaches',
    telemetry: {
      Instagram: { impressions: 31200, likes: 2840, comments: 145, clicks: 580, shares: 390 },
      TikTok: { impressions: 54000, likes: 4900, comments: 230, clicks: 890, shares: 620 },
    },
    created_by: 'Maya Patel (Demand Gen)',
    createdAt: new Date(now - 7 * day).toISOString(),
    updatedAt: new Date(now - 6 * day).toISOString(),
  },
  {
    _id: 'post_ce_007',
    campaign_association: 'General Brand Awareness',
    target_account_ids: ['acc_twitter_04', 'acc_meta_fb_02'],
    target_platforms: ['Twitter', 'Facebook'],
    caption: '💡 Healthcare Fact: Chronic condition care adherence increases by 58% when patients receive omnichannel educational touchpoints within 48 hours of discharge.\n\nHow does your health system bridge the inpatient-to-home transition gap?',
    media_assets: [
      {
        id: 'media_107',
        url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80',
        type: 'image',
        filename: 'patient_tablet.jpg',
      },
    ],
    status: 'Scheduled',
    scheduled_at: new Date(now + 3 * day + 6 * hour).toISOString(),
    publish_immediately: false,
    target_persona: 'Patient Experience Officers & Nurse Navigators',
    created_by: 'Sarah Jenkins',
    createdAt: new Date(now - 1 * day).toISOString(),
    updatedAt: new Date(now - 1 * day).toISOString(),
  },
  {
    _id: 'post_ce_008',
    campaign_association: 'Q4 Product Launch & Retention',
    target_account_ids: ['acc_linkedin_03', 'acc_meta_ig_01'],
    target_platforms: ['LinkedIn', 'Instagram'],
    caption: '🎉 Introducing SmartCare Patient Portal 4.0: Biometric login, real-time lab order tracking, and instant prescription refill routing.\n\nBuilt on HIPAA-certified microservices to guarantee 99.99% uptime for high-volume health networks.\n\nSchedule your hospital tech demo today!',
    media_assets: [
      {
        id: 'media_108',
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
        type: 'image',
        filename: 'patient_portal_ui.jpg',
      },
    ],
    status: 'Draft',
    publish_immediately: false,
    target_persona: 'Health System CIOs & IT Directors',
    created_by: 'Alex Rivera (VP Growth)',
    createdAt: new Date(now - 3 * hour).toISOString(),
    updatedAt: new Date(now - 3 * hour).toISOString(),
  },
  {
    _id: 'post_ce_009',
    campaign_association: 'Physician Onboarding Series',
    target_account_ids: ['acc_linkedin_03'],
    target_platforms: ['LinkedIn'],
    caption: '👩‍⚕️ Welcome Dr. Samantha Chen, MD, to our Chief Clinical Advisory Board!\n\nWith over 18 years leading digital health transformation at Mayo Clinic and Stanford Health Care, Dr. Chen will oversee our diagnostic AI model validation protocols.\n\nRead the full press release in our newsroom.',
    media_assets: [
      {
        id: 'media_109',
        url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80',
        type: 'image',
        filename: 'dr_samantha_chen.jpg',
      },
    ],
    status: 'Published',
    published_at: new Date(now - 8 * day).toISOString(),
    publish_immediately: true,
    target_persona: 'Healthcare Leaders & Medical Staff',
    telemetry: {
      LinkedIn: { impressions: 21800, likes: 980, comments: 112, clicks: 740, shares: 64 },
    },
    created_by: 'Elena Rostova',
    createdAt: new Date(now - 9 * day).toISOString(),
    updatedAt: new Date(now - 8 * day).toISOString(),
  },
  {
    _id: 'post_ce_010',
    campaign_association: 'Lead Nurturing Sequence',
    target_account_ids: ['acc_twitter_04', 'acc_meta_ig_01'],
    target_platforms: ['Twitter', 'Instagram'],
    caption: '📈 Quick Tip Tuesday: How to lower your clinic’s no-show appointment rate from 18% down to under 5% using automated two-way SMS reminders.\n\nTap the link to download our free clinic operations SOP template! 📲✨\n\n#ClinicManagement #HealthcareAdmin #SOPs #PatientEngagement',
    media_assets: [
      {
        id: 'media_110',
        url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80',
        type: 'image',
        filename: 'clinic_frontdesk.jpg',
      },
    ],
    status: 'Scheduled',
    scheduled_at: new Date(now + 4 * day + 1 * hour).toISOString(),
    publish_immediately: false,
    target_persona: 'Private Practice Owners & Office Managers',
    created_by: 'Maya Patel (Demand Gen)',
    createdAt: new Date(now - 1 * day).toISOString(),
    updatedAt: new Date(now - 1 * day).toISOString(),
  },
];

const getStoredContent = (): ContentItem[] => {
  if (typeof window === 'undefined') return ENTERPRISE_HARDCODED_CONTENT;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ENTERPRISE_HARDCODED_CONTENT));
      return ENTERPRISE_HARDCODED_CONTENT;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : ENTERPRISE_HARDCODED_CONTENT;
  } catch {
    return ENTERPRISE_HARDCODED_CONTENT;
  }
};

const saveContent = (items: ContentItem[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  }
};

export const ContentEngineService = {
  getAllContent: async (): Promise<ContentItem[]> => {
    return getStoredContent();
  },

  createContent: async (payload: CreateContentPayload): Promise<ContentItem> => {
    const newItem: ContentItem = {
      ...payload,
      _id: `post_ce_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      telemetry: payload.status === 'Published' ? {
        [payload.target_platforms[0] || 'LinkedIn']: {
          impressions: Math.floor(Math.random() * 2000) + 500,
          likes: Math.floor(Math.random() * 80) + 10,
          comments: Math.floor(Math.random() * 12) + 1,
          clicks: Math.floor(Math.random() * 90) + 15,
        }
      } : undefined,
    };

    const current = getStoredContent();
    const updated = [newItem, ...current];
    saveContent(updated);
    return newItem;
  },

  updateContentStatus: async (id: string, status: ContentStatus): Promise<boolean> => {
    const current = getStoredContent();
    const updated = current.map((item) =>
      item._id === id
        ? {
            ...item,
            status,
            published_at: status === 'Published' ? new Date().toISOString() : item.published_at,
            updatedAt: new Date().toISOString(),
          }
        : item
    );
    saveContent(updated);
    return true;
  },

  publishNow: async (id: string): Promise<ContentItem | null> => {
    const current = getStoredContent();
    let publishedItem: ContentItem | null = null;
    const updated = current.map((item) => {
      if (item._id === id) {
        publishedItem = {
          ...item,
          status: 'Published',
          publish_immediately: true,
          published_at: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          telemetry: {
            [item.target_platforms[0] || 'LinkedIn']: {
              impressions: 120,
              likes: 8,
              comments: 2,
              clicks: 14,
            },
          },
        };
        return publishedItem;
      }
      return item;
    });
    saveContent(updated);
    return publishedItem;
  },

  deleteContent: async (id: string): Promise<boolean> => {
    const current = getStoredContent();
    const updated = current.filter((item) => item._id !== id);
    saveContent(updated);
    return true;
  },

  duplicateContent: async (id: string): Promise<ContentItem | null> => {
    const current = getStoredContent();
    const target = current.find((item) => item._id === id);
    if (!target) return null;

    const duplicated: ContentItem = {
      ...target,
      _id: `post_ce_${Date.now()}_copy`,
      caption: `[Copy] ${target.caption}`,
      status: 'Draft',
      published_at: undefined,
      scheduled_at: undefined,
      telemetry: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveContent([duplicated, ...current]);
    return duplicated;
  },

  resetToDefaultContent: async (): Promise<ContentItem[]> => {
    saveContent(ENTERPRISE_HARDCODED_CONTENT);
    return ENTERPRISE_HARDCODED_CONTENT;
  },
};
