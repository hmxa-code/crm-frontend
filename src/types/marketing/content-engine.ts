import { SocialPlatform } from './social-account';

export type ContentStatus = 'Draft' | 'Scheduled' | 'Publishing' | 'Published' | 'Failed';

export type MediaType = 'image' | 'video' | 'carousel';

export interface MediaAsset {
  id: string;
  url: string;
  type: MediaType;
  filename: string;
  size_bytes?: number;
}

export interface PlatformTelemetry {
  impressions?: number;
  reach?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  clicks?: number;
}

export interface ContentItem {
  _id: string;
  campaign_association?: string;
  target_account_ids: string[]; // Connected SocialAccount IDs
  target_platforms: SocialPlatform[];
  caption: string;
  media_assets: MediaAsset[];
  status: ContentStatus;
  scheduled_at?: string; // ISO String
  published_at?: string; // ISO String
  publish_immediately: boolean;
  target_persona?: string;
  telemetry?: Record<string, PlatformTelemetry>; // Keyed by platform or account_id
  error_message?: string;
  created_by: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateContentPayload = Omit<ContentItem, '_id' | 'telemetry' | 'createdAt' | 'updatedAt'>;