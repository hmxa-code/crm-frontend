export type SocialPlatform = 'Facebook' | 'Instagram' | 'LinkedIn' | 'Google' | 'TikTok' | 'Twitter';

export type AccountHealthStatus = 'Connected' | 'Expired' | 'Pending_Auth' | 'Error';

export interface SocialAccount {
  _id: string;
  platform: SocialPlatform;
  account_name: string;
  account_id: string; // Native platform page/profile ID
  avatar_url?: string;
  status: AccountHealthStatus;
  followers_count?: number;
  scopes?: string[];
  expires_at?: number; // Epoch timestamp
  createdAt?: string;
  updatedAt?: string;
}