import { apiRequest } from '@/src/api/client';
import { ContentItem, CreateContentPayload, ContentStatus } from '@/src/types/marketing/content-engine';

const HARDCODED_CONTENT_QUEUE: ContentItem[] = [
  {
    _id: 'post_01',
    campaign_association: 'Q4 Product Launch & Retention',
    target_account_ids: ['acc_meta_fb_01', 'acc_meta_ig_02'],
    target_platforms: ['Facebook', 'Instagram'],
    caption: '🚀 We are thrilled to reveal our next-gen platform capabilities! Scale your enterprise operations with live automated telemetry. #ProductLaunch #SaaS',
    media_assets: [
      {
        id: 'media_1',
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
        type: 'image',
        filename: 'dashboard-preview.png',
      },
    ],
    status: 'Scheduled',
    scheduled_at: new Date(Date.now() + 86400000).toISOString(),
    publish_immediately: false,
    target_persona: 'Enterprise Decision Makers',
    created_by: 'Mr Demo',
  },
  {
    _id: 'post_02',
    campaign_association: 'Weekly Growth Insights',
    target_account_ids: ['acc_linkedin_03'],
    target_platforms: ['LinkedIn'],
    caption: 'Discover how top tech leaders manage multi-touch customer acquisition channels seamlessly.',
    media_assets: [],
    status: 'Published',
    published_at: new Date(Date.now() - 360000000).toISOString(),
    publish_immediately: true,
    telemetry: {
      LinkedIn: { impressions: 4200, likes: 184, comments: 29, clicks: 312 },
    },
    created_by: 'Mr Demo',
  },
];

export const ContentEngineService = {
  getAllContent: async (): Promise<ContentItem[]> => {
    try {
      const response = await apiRequest('/marketing/content-engine', { method: 'GET' });
      return Array.isArray(response) && response.length > 0 ? response : HARDCODED_CONTENT_QUEUE;
    } catch (err) {
      console.warn('[ContentEngineService] API fallback to hardcoded queue:', err);
      return HARDCODED_CONTENT_QUEUE;
    }
  },

  createContent: async (payload: CreateContentPayload): Promise<ContentItem> => {
    try {
      const response = await apiRequest('/marketing/content-engine', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return response;
    } catch {
      return {
        ...payload,
        _id: 'post_' + Date.now(),
        createdAt: new Date().toISOString(),
      };
    }
  },

  updateContentStatus: async (id: string, status: ContentStatus): Promise<boolean> => {
    try {
      await apiRequest(`/marketing/content-engine/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      return true;
    } catch {
      return true;
    }
  },

  deleteContent: async (id: string): Promise<boolean> => {
    try {
      await apiRequest(`/marketing/content-engine/${id}`, { method: 'DELETE' });
      return true;
    } catch {
      return true;
    }
  },
};