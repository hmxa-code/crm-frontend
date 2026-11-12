'use client';

import React, { useState } from 'react';
import { 
  FiX, 
  FiSend, 
  FiTrash2, 
  FiCopy, 
  FiCalendar, 
  FiUsers, 
  FiEye, 
  FiThumbsUp, 
  FiMessageSquare, 
  FiShare2, 
  FiMousePointer,
  FiClock,
  FiCheckCircle
} from 'react-icons/fi';
import { ContentItem } from '@/src/types/marketing/content-engine';
import { SocialPlatform } from '@/src/types/marketing/social-account';
import { ContentStatusBadge } from '../shared/ContentStatusBadge';
import { ChannelPlatformBadge } from '../shared/ChannelPlatformBadge';
import { LinkedInFeedPreview } from '../previews/LinkedInFeedPreview';
import { InstagramFeedPreview } from '../previews/InstagramFeedPreview';
import { FacebookFeedPreview } from '../previews/FacebookFeedPreview';

interface ContentPreviewSheetProps {
  item: ContentItem | null;
  onClose: () => void;
  onPublishNow?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const ContentPreviewSheet: React.FC<ContentPreviewSheetProps> = ({ 
  item, 
  onClose,
  onPublishNow,
  onDuplicate,
  onDelete
}) => {
  if (!item) return null;

  const [activeTab, setActiveTab] = useState<SocialPlatform>(
    item.target_platforms[0] || 'LinkedIn'
  );

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-[1200] bg-slate-950/60 backdrop-blur-2xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white h-full flex flex-col justify-between border-l border-slate-200 shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <ContentStatusBadge status={item.status} size="md" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Content Dispatch Overview</h3>
              <p className="text-[10px] font-mono text-slate-400">{item._id}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Channel Selector Pills */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Preview Across Platforms
            </span>
            <div className="flex flex-wrap gap-1.5">
              {item.target_platforms.map((p) => (
                <button
                  key={p}
                  onClick={() => setActiveTab(p)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === p
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <ChannelPlatformBadge platform={p} size="sm" />
                </button>
              ))}
            </div>
          </div>

          {/* Live Mock Platform Frame */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
              Native In-Feed Simulation: {activeTab}
            </span>

            {activeTab === 'LinkedIn' && (
              <LinkedInFeedPreview 
                caption={item.caption} 
                mediaAssets={item.media_assets || []}
                mediaUrl={item.media_assets?.[0]?.url} 
                persona={item.target_persona} 
              />
            )}
            {activeTab === 'Instagram' && (
              <InstagramFeedPreview 
                caption={item.caption} 
                mediaAssets={item.media_assets || []}
                mediaUrl={item.media_assets?.[0]?.url} 
              />
            )}
            {(activeTab === 'Facebook' || activeTab === 'Twitter' || activeTab === 'YouTube' || activeTab === 'WhatsApp' || activeTab === 'TikTok' || activeTab === 'Google') && (
              <FacebookFeedPreview 
                caption={item.caption} 
                mediaAssets={item.media_assets || []}
                mediaUrl={item.media_assets?.[0]?.url} 
              />
            )}
          </div>

          {/* Telemetry Breakdown if published */}
          {item.telemetry && Object.keys(item.telemetry).length > 0 && (
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Audience Interaction Telemetry
              </span>

              {Object.entries(item.telemetry).map(([platform, tel]) => (
                <div key={platform} className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-slate-800">{platform} Performance</span>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 block">Impressions</span>
                      <strong className="text-xs text-slate-900">{(tel.impressions || 0).toLocaleString()}</strong>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 block">Likes</span>
                      <strong className="text-xs text-emerald-600">{(tel.likes || 0).toLocaleString()}</strong>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 block">Comments</span>
                      <strong className="text-xs text-blue-600">{(tel.comments || 0).toLocaleString()}</strong>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 block">Clicks</span>
                      <strong className="text-xs text-purple-600">{(tel.clicks || 0).toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Dispatch Metadata */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Campaign Linked:</span>
              <strong className="text-slate-800">{item.campaign_association || 'General Broadcast'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Target Persona:</span>
              <strong className="text-slate-800">{item.target_persona || 'All Network Followers'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Created By:</span>
              <strong className="text-slate-800">{item.created_by || 'Growth Team'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Schedule Window:</span>
              <strong className="text-slate-800">
                {item.publish_immediately ? 'Immediate Publish' : formatDate(item.scheduled_at)}
              </strong>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {item.status !== 'Published' && onPublishNow && (
              <button
                onClick={() => {
                  onPublishNow(item._id);
                  onClose();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FiSend size={13} />
                <span>Publish Now</span>
              </button>
            )}

            {onDuplicate && (
              <button
                onClick={() => {
                  onDuplicate(item._id);
                  onClose();
                }}
                className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FiCopy size={13} />
                <span>Duplicate</span>
              </button>
            )}
          </div>

          {onDelete && (
            <button
              onClick={() => {
                onDelete(item._id);
                onClose();
              }}
              className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              title="Delete Content"
            >
              <FiTrash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
