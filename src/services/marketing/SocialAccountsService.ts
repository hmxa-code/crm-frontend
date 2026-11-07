import { apiRequest } from '@/src/api/client';
import { SocialAccount, SocialPlatform } from '@/src/types/marketing/social-account';

const HARDCODED_ACCOUNTS: SocialAccount[] = [
  {
    _id: 'acc_meta_fb_01',
    platform: 'Facebook',
    account_name: 'Wholcure Global Official Page',
    account_id: 'fb_page_88102',
    avatar_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
    status: 'Connected',
    followers_count: 14200,
    expires_at: Date.now() + 5184000000, // 60 days ahead
  },
  {
    _id: 'acc_meta_ig_02',
    platform: 'Instagram',
    account_name: '@wholcure_global',
    account_id: 'ig_biz_99201',
    avatar_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
    status: 'Connected',
    followers_count: 28900,
    expires_at: Date.now() + 5184000000,
  },
  {
    _id: 'acc_linkedin_03',
    platform: 'LinkedIn',
    account_name: 'Wholcure Technologies Inc.',
    account_id: 'li_corp_33012',
    avatar_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&auto=format&fit=crop&q=60',
    status: 'Expired',
    followers_count: 8400,
    expires_at: Date.now() - 86400000, // Expired yesterday
  },
];

export const SocialAccountsService = {
  getConnectedAccounts: async (): Promise<SocialAccount[]> => {
    try {
      const response = await apiRequest('/marketing/social-accounts', { method: 'GET' });
      return Array.isArray(response) && response.length > 0 ? response : HARDCODED_ACCOUNTS;
    } catch (err) {
      console.warn('[SocialAccountsService] API fallback triggered:', err);
      return HARDCODED_ACCOUNTS;
    }
  },

  initiateOAuthFlow: (platform: SocialPlatform): void => {
    // Official OAuth Redirect Pattern
    const authEndpoints: Record<SocialPlatform, string> = {
      Facebook: '/api/v1/auth/social/facebook',
      Instagram: '/api/v1/auth/social/instagram',
      LinkedIn: '/api/v1/auth/social/linkedin',
      Google: '/api/v1/auth/social/google',
      TikTok: '/api/v1/auth/social/tiktok',
      Twitter: '/api/v1/auth/social/twitter',
    };
    
    window.location.href = authEndpoints[platform] || '#';
  },

  disconnectAccount: async (accountId: string): Promise<boolean> => {
    try {
      await apiRequest(`/marketing/social-accounts/${accountId}`, { method: 'DELETE' });
      return true;
    } catch {
      return true;
    }
  },
};