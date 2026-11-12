import { SocialAccount, SocialPlatform } from '@/src/types/marketing/social-account';

const LOCAL_STORAGE_KEY = 'marketing_social_accounts_cache_v2';

export const ENTERPRISE_HARDCODED_ACCOUNTS: SocialAccount[] = [
  {
    _id: 'acc_meta_ig_01',
    platform: 'Instagram',
    account_name: 'Wholcure Health & Wellness',
    handle: '@wholcure_health',
    account_id: 'ig_biz_99201',
    avatar_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&auto=format&fit=crop&q=80',
    status: 'Connected',
    followers_count: 48200,
    impressions_30d: 245600,
    engagement_rate: 4.8,
    posts_count: 128,
    last_synced: 'Just now',
    category: 'Healthcare & Clinical Research',
    auto_sync: true,
    scopes: ['instagram_basic', 'instagram_content_publish', 'instagram_manage_insights'],
    expires_at: Date.now() + 5184000000, // 60 days ahead
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-11-01T08:00:00Z',
  },
  {
    _id: 'acc_meta_fb_02',
    platform: 'Facebook',
    account_name: 'Wholcure Health Systems Official',
    handle: 'fb.com/wholcure.health',
    account_id: 'fb_page_88102',
    avatar_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=200&auto=format&fit=crop&q=80',
    status: 'Connected',
    followers_count: 24900,
    impressions_30d: 112400,
    engagement_rate: 3.2,
    posts_count: 82,
    last_synced: '5 minutes ago',
    category: 'Hospital & Healthcare Organization',
    auto_sync: true,
    scopes: ['pages_show_list', 'pages_read_engagement', 'pages_manage_posts'],
    expires_at: Date.now() + 5184000000,
    createdAt: '2026-01-12T12:00:00Z',
    updatedAt: '2026-11-02T10:00:00Z',
  },
  {
    _id: 'acc_linkedin_03',
    platform: 'LinkedIn',
    account_name: 'Wholcure Technologies Corp.',
    handle: 'linkedin.com/company/wholcure',
    account_id: 'li_corp_33012',
    avatar_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&auto=format&fit=crop&q=80',
    status: 'Connected',
    followers_count: 16400,
    impressions_30d: 94200,
    engagement_rate: 5.6,
    posts_count: 45,
    last_synced: '12 minutes ago',
    category: 'Biotechnology & Medical Software',
    auto_sync: true,
    scopes: ['w_member_social', 'rw_organization_admin', 'r_organization_social'],
    expires_at: Date.now() + 4320000000,
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-11-03T11:30:00Z',
  },
  {
    _id: 'acc_twitter_04',
    platform: 'Twitter',
    account_name: 'Wholcure Care Updates',
    handle: '@wholcure_care',
    account_id: 'tw_usr_55029',
    avatar_url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=200&auto=format&fit=crop&q=80',
    status: 'Connected',
    followers_count: 19800,
    impressions_30d: 310500,
    engagement_rate: 4.1,
    posts_count: 210,
    last_synced: '2 minutes ago',
    category: 'Medical News & Patient Advisory',
    auto_sync: true,
    scopes: ['tweet.read', 'tweet.write', 'users.read'],
    expires_at: Date.now() + 2592000000,
    createdAt: '2026-02-15T14:00:00Z',
    updatedAt: '2026-11-04T07:15:00Z',
  },
  {
    _id: 'acc_youtube_05',
    platform: 'YouTube',
    account_name: 'Wholcure Clinical Academy',
    handle: '@WholcureAcademy',
    account_id: 'yt_chan_1092',
    avatar_url: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=200&auto=format&fit=crop&q=80',
    status: 'Connected',
    followers_count: 32500,
    impressions_30d: 480000,
    engagement_rate: 6.2,
    posts_count: 64,
    last_synced: '1 hour ago',
    category: 'Clinical Continuing Education',
    auto_sync: true,
    scopes: ['youtube.readonly', 'youtube.upload'],
    expires_at: Date.now() + 7776000000,
    createdAt: '2026-03-01T15:00:00Z',
    updatedAt: '2026-11-05T09:20:00Z',
  },
  {
    _id: 'acc_whatsapp_06',
    platform: 'WhatsApp',
    account_name: 'Wholcure Enterprise CareLine',
    handle: '+1 (800) 420-CARE',
    account_id: 'wa_biz_7781',
    avatar_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=200&auto=format&fit=crop&q=80',
    status: 'Connected',
    followers_count: 12100,
    impressions_30d: 88400,
    engagement_rate: 18.4,
    posts_count: 42,
    last_synced: 'Just now',
    category: 'Direct Patient Messaging & Broadcast',
    auto_sync: true,
    scopes: ['whatsapp_business_messaging', 'whatsapp_business_management'],
    expires_at: Date.now() + 8640000000,
    createdAt: '2026-03-10T11:00:00Z',
    updatedAt: '2026-11-05T14:00:00Z',
  },
  {
    _id: 'acc_tiktok_07',
    platform: 'TikTok',
    account_name: 'Wholcure Daily Wellness',
    handle: '@wholcure_wellness',
    account_id: 'tt_biz_6610',
    avatar_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=200&auto=format&fit=crop&q=80',
    status: 'Expired',
    followers_count: 65400,
    impressions_30d: 820000,
    engagement_rate: 8.7,
    posts_count: 34,
    last_synced: '3 days ago',
    category: 'Preventative Health & Nutrition Tips',
    auto_sync: false,
    scopes: ['user.info.basic', 'video.upload'],
    expires_at: Date.now() - 86400000, // Expired yesterday
    createdAt: '2026-04-01T16:00:00Z',
    updatedAt: '2026-11-06T12:00:00Z',
  },
];

const getStoredAccounts = (): SocialAccount[] => {
  if (typeof window === 'undefined') return ENTERPRISE_HARDCODED_ACCOUNTS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ENTERPRISE_HARDCODED_ACCOUNTS));
      return ENTERPRISE_HARDCODED_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : ENTERPRISE_HARDCODED_ACCOUNTS;
  } catch {
    return ENTERPRISE_HARDCODED_ACCOUNTS;
  }
};

const saveAccounts = (accounts: SocialAccount[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(accounts));
  }
};

export const SocialAccountsService = {
  getConnectedAccounts: async (): Promise<SocialAccount[]> => {
    // Pure fast hardcoded local state - guaranteed resilience
    return getStoredAccounts();
  },

  connectSimulatedAccount: async (platform: SocialPlatform, customName?: string, customHandle?: string): Promise<SocialAccount> => {
    const current = getStoredAccounts();
    const platformDefaults: Record<SocialPlatform, { name: string; handle: string; followers: number; avatar: string }> = {
      Instagram: {
        name: customName || 'Wholcure Clinic Instagram',
        handle: customHandle || '@wholcure_clinic',
        followers: 18500,
        avatar: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&auto=format&fit=crop&q=80',
      },
      Facebook: {
        name: customName || 'Wholcure Medical Practice',
        handle: customHandle || 'fb.com/wholcure.practice',
        followers: 14200,
        avatar: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=200&auto=format&fit=crop&q=80',
      },
      LinkedIn: {
        name: customName || 'Wholcure Enterprise Health',
        handle: customHandle || 'linkedin.com/company/wholcure-enterprise',
        followers: 12400,
        avatar: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&auto=format&fit=crop&q=80',
      },
      Twitter: {
        name: customName || 'Wholcure Research Feed',
        handle: customHandle || '@wholcure_research',
        followers: 21300,
        avatar: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=200&auto=format&fit=crop&q=80',
      },
      Google: {
        name: customName || 'Wholcure Diagnostic Center (Google Business)',
        handle: customHandle || 'maps.google.com/wholcure',
        followers: 8900,
        avatar: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=200&auto=format&fit=crop&q=80',
      },
      TikTok: {
        name: customName || 'Wholcure Wellness Clips',
        handle: customHandle || '@wholcure_clips',
        followers: 54100,
        avatar: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=200&auto=format&fit=crop&q=80',
      },
      YouTube: {
        name: customName || 'Wholcure Health Insights',
        handle: customHandle || '@WholcureHealth',
        followers: 28400,
        avatar: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=200&auto=format&fit=crop&q=80',
      },
      WhatsApp: {
        name: customName || 'Wholcure Patient VIP Line',
        handle: customHandle || '+1 (800) 888-CURE',
        followers: 9400,
        avatar: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=200&auto=format&fit=crop&q=80',
      },
    };

    const def = platformDefaults[platform] || platformDefaults.Instagram;

    const newAccount: SocialAccount = {
      _id: `acc_${platform.toLowerCase()}_${Date.now()}`,
      platform,
      account_name: def.name,
      handle: def.handle,
      account_id: `${platform.toLowerCase()}_id_${Math.floor(10000 + Math.random() * 90000)}`,
      avatar_url: def.avatar,
      status: 'Connected',
      followers_count: def.followers,
      impressions_30d: Math.floor(def.followers * 3.4),
      engagement_rate: 4.5,
      posts_count: 14,
      last_synced: 'Just now',
      category: 'Verified Healthcare Organization',
      auto_sync: true,
      scopes: ['read_profile', 'publish_content', 'read_insights'],
      expires_at: Date.now() + 5184000000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newAccount, ...current];
    saveAccounts(updated);
    return newAccount;
  },

  reconnectAccount: async (accountId: string): Promise<SocialAccount | null> => {
    const current = getStoredAccounts();
    let target: SocialAccount | null = null;
    const updated = current.map((acc) => {
      if (acc._id === accountId) {
        target = {
          ...acc,
          status: 'Connected',
          expires_at: Date.now() + 5184000000,
          last_synced: 'Just now',
          updatedAt: new Date().toISOString(),
        };
        return target;
      }
      return acc;
    });
    saveAccounts(updated);
    return target;
  },

  toggleAutoSync: async (accountId: string): Promise<boolean> => {
    const current = getStoredAccounts();
    const updated = current.map((acc) => {
      if (acc._id === accountId) {
        return { ...acc, auto_sync: !acc.auto_sync, updatedAt: new Date().toISOString() };
      }
      return acc;
    });
    saveAccounts(updated);
    return true;
  },

  syncAllNow: async (): Promise<SocialAccount[]> => {
    const current = getStoredAccounts();
    const updated = current.map((acc) => {
      if (acc.status === 'Connected') {
        const delta = Math.floor(Math.random() * 50) + 5;
        return {
          ...acc,
          followers_count: (acc.followers_count || 1000) + delta,
          last_synced: 'Just now',
          updatedAt: new Date().toISOString(),
        };
      }
      return acc;
    });
    saveAccounts(updated);
    return updated;
  },

  disconnectAccount: async (accountId: string): Promise<boolean> => {
    const current = getStoredAccounts();
    const updated = current.filter((a) => a._id !== accountId);
    saveAccounts(updated);
    return true;
  },

  resetToDefaultAccounts: async (): Promise<SocialAccount[]> => {
    saveAccounts(ENTERPRISE_HARDCODED_ACCOUNTS);
    return ENTERPRISE_HARDCODED_ACCOUNTS;
  },
};
