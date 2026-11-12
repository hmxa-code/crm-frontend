export type SocialPlatform = 'Facebook' | 'Instagram' | 'LinkedIn' | 'Google' | 'TikTok' | 'Twitter' | 'YouTube' | 'WhatsApp';

export type AccountHealthStatus = 'Connected' | 'Expired' | 'Pending_Auth' | 'Error' | 'Syncing';

export interface SocialAccount {
  _id: string;
  platform: SocialPlatform;
  account_name: string;
  handle?: string;
  account_id: string; // Native platform page/profile ID
  avatar_url?: string;
  status: AccountHealthStatus;
  followers_count?: number;
  impressions_30d?: number;
  engagement_rate?: number;
  posts_count?: number;
  last_synced?: string;
  category?: string;
  auto_sync?: boolean;
  scopes?: string[];
  expires_at?: number; // Epoch timestamp
  createdAt?: string;
  updatedAt?: string;
}
