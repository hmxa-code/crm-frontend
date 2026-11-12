'use client';

import React, { useState, useMemo } from 'react';
import { 
  FiEye, 
  FiTrash2, 
  FiSearch, 
  FiSend, 
  FiCopy, 
  FiCalendar, 
  FiTrendingUp, 
  FiUsers, 
  FiCheckCircle, 
  FiClock, 
  FiFileText,
  FiFilter
} from 'react-icons/fi';
import { ContentItem, ContentStatus } from '@/src/types/marketing/content-engine';
import { SocialPlatform } from '@/src/types/marketing/social-account';
import { ContentStatusBadge } from '../shared/ContentStatusBadge';
import { ChannelPlatformBadge } from '../shared/ChannelPlatformBadge';

interface ContentTableViewProps {
  items: ContentItem[];
  onView: (item: ContentItem) => void;
  onDelete: (id: string) => void;
  onPublishNow?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export const ContentTableView: React.FC<ContentTableViewProps> = ({ 
  items, 
  onView, 
  onDelete,
  onPublishNow,
  onDuplicate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.caption.toLowerCase().includes(q) ||
        (item.campaign_association || '').toLowerCase().includes(q) ||
        (item.target_persona || '').toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesPlatform = platformFilter === 'all' || item.target_platforms.includes(platformFilter as SocialPlatform);

      return matchesSearch && matchesStatus && matchesPlatform;
    });
  }, [items, searchQuery, statusFilter, platformFilter]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAggregateTelemetry = (item: ContentItem) => {
    if (!item.telemetry) return null;
    let imp = 0;
    let likes = 0;
    let clicks = 0;
    Object.values(item.telemetry).forEach((t) => {
      imp += t.impressions || 0;
      likes += t.likes || 0;
      clicks += t.clicks || 0;
    });
    return { imp, likes, clicks };
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Search and Filters Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Status Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['all', 'Published', 'Scheduled', 'Draft'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? `All Posts (${items.length})` : st}
            </button>
          ))}
        </div>

        {/* Search & Platform Filter */}
        <div className="flex items-center gap-2 flex-1 max-w-lg">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
            <input
              type="text"
              placeholder="Search post copy, campaign, persona..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Channels</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Instagram">Instagram</option>
            <option value="Facebook">Facebook</option>
            <option value="Twitter">Twitter</option>
            <option value="YouTube">YouTube</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="TikTok">TikTok</option>
          </select>
        </div>
      </div>

      {/* Main Content: Desktop Table & Mobile Cards */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-sm font-bold text-slate-800">No content items found</p>
          <p className="text-xs text-slate-400 mt-1">Try resetting the filters or create a new post using the button above.</p>
        </div>
      ) : (
        <>
          {/* Mobile Card View (Hidden on md and up) */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filteredItems.map((item) => {
              const tel = getAggregateTelemetry(item);
              return (
                <div key={item._id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <ContentStatusBadge status={item.status} size="sm" />
                      {(item.target_platforms || []).map((p) => (
                        <ChannelPlatformBadge key={p} platform={p} size="sm" showName={false} />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {item.publish_immediately ? 'Immediate' : formatDate(item.scheduled_at || item.published_at)}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    {item.media_assets && item.media_assets.length > 0 ? (
                      <img 
                        src={item.media_assets[0].url} 
                        alt="thumb" 
                        className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0" 
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">
                        <FiFileText size={16} />
                        <span>TEXT</span>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-900 line-clamp-3 leading-snug">
                        {item.caption}
                      </p>
                      {item.campaign_association && (
                        <span className="text-[10px] font-medium text-blue-600 block mt-1 truncate">
                          🎯 {item.campaign_association}
                        </span>
                      )}
                    </div>
                  </div>

                  {tel && (
                    <div className="bg-slate-50 p-2 rounded-xl flex items-center justify-around text-[10px] text-slate-600 font-semibold border border-slate-100">
                      <span><strong>{tel.imp.toLocaleString()}</strong> Views</span>
                      <span>•</span>
                      <span><strong>{tel.likes.toLocaleString()}</strong> Likes</span>
                      <span>•</span>
                      <span><strong>{tel.clicks.toLocaleString()}</strong> Clicks</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => onView(item)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1"
                    >
                      <FiEye size={13} /> View Preview
                    </button>

                    <div className="flex items-center gap-2">
                      {item.status !== 'Published' && onPublishNow && (
                        <button
                          onClick={() => onPublishNow(item._id)}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-[11px] rounded-lg border border-emerald-200 cursor-pointer"
                        >
                          Publish Now
                        </button>
                      )}
                      {onDuplicate && (
                        <button
                          onClick={() => onDuplicate(item._id)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                        >
                          <FiCopy size={13} />
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(item._id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg cursor-pointer"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop & Tablet Table View */}
          <div className="hidden md:block bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Content Creative & Copy</th>
                    <th className="px-4 py-3.5">Target Channels</th>
                    <th className="px-4 py-3.5">Queue Status</th>
                    <th className="px-4 py-3.5">Audience & Campaign</th>
                    <th className="px-4 py-3.5">Schedule / Published</th>
                    <th className="px-4 py-3.5 text-center">Live Telemetry</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {filteredItems.map((item) => {
                    const tel = getAggregateTelemetry(item);
                    return (
                      <tr key={item._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3.5 max-w-sm">
                          <div className="flex items-start gap-3">
                            {item.media_assets && item.media_assets.length > 0 ? (
                              <img 
                                src={item.media_assets[0].url} 
                                alt="thumb" 
                                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" 
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-[9px] font-bold text-slate-400 shrink-0">
                                <FiFileText size={14} />
                                <span>TEXT</span>
                              </div>
                            )}
                            <div className="min-w-0">
                              <p 
                                onClick={() => onView(item)}
                                className="font-bold text-slate-900 hover:text-blue-600 line-clamp-2 cursor-pointer leading-snug"
                              >
                                {item.caption}
                              </p>
                              <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                                By {item.created_by || 'Growth Team'}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="flex flex-wrap gap-1 max-w-[130px]">
                            {(item.target_platforms || []).map((p) => (
                              <ChannelPlatformBadge key={p} platform={p} size="sm" showName={false} />
                            ))}
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <ContentStatusBadge status={item.status} size="sm" />
                        </td>

                        <td className="px-4 py-3.5 max-w-[180px]">
                          <p className="font-semibold text-slate-800 text-xs truncate">
                            {item.campaign_association || 'General Broadcast'}
                          </p>
                          <span className="text-[10px] text-slate-400 truncate block">
                            🎯 {item.target_persona || 'All Network Followers'}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-slate-500 text-[11px] whitespace-nowrap">
                          {item.publish_immediately ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                              <FiCheckCircle size={11} /> Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                              <FiClock size={11} className="text-slate-400" />
                              {formatDate(item.scheduled_at || item.published_at)}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3.5 text-center">
                          {tel ? (
                            <div className="inline-flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 text-[11px] font-mono">
                              <span className="font-bold text-slate-900">{tel.imp.toLocaleString()} views</span>
                              <span className="text-slate-300">•</span>
                              <span className="font-bold text-emerald-600">{tel.likes} likes</span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">No telemetry yet</span>
                          )}
                        </td>

                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button 
                              onClick={() => onView(item)} 
                              title="Live Preview"
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <FiEye size={14} />
                            </button>

                            {item.status !== 'Published' && onPublishNow && (
                              <button 
                                onClick={() => onPublishNow(item._id)} 
                                title="Publish Immediately"
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <FiSend size={14} />
                              </button>
                            )}

                            {onDuplicate && (
                              <button 
                                onClick={() => onDuplicate(item._id)} 
                                title="Duplicate Post"
                                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              >
                                <FiCopy size={14} />
                              </button>
                            )}

                            <button 
                              onClick={() => onDelete(item._id)} 
                              title="Delete Post"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
