import React from 'react'
import { FiEye, FiTrash2 } from 'react-icons/fi'
import { ContentItem } from '@/src/types/marketing/content-engine'
import { ContentStatusBadge } from '../shared/ContentStatusBadge'
import { ChannelPlatformBadge } from '../shared/ChannelPlatformBadge'

interface ContentTableViewProps {
  items: ContentItem[]
  onView: (item: ContentItem) => void
  onDelete: (id: string) => void
}

export const ContentTableView: React.FC<ContentTableViewProps> = ({ items, onView, onDelete }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
      <table className="w-full text-left border-collapse text-xs">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase">
          <tr>
            <th className="px-5 py-3">Content Copy & Media</th>
            <th className="px-4 py-3">Target Platforms</th>
            <th className="px-4 py-3">Queue Status</th>
            <th className="px-4 py-3">Schedule Window</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => (
            <tr key={item._id} className="hover:bg-slate-50/50">
              <td className="px-5 py-3.5 max-w-xs">
                <div className="flex items-center gap-3">
                  {item.media_assets.length > 0 ? (
                    <img src={item.media_assets[0].url} alt="thumb" className="w-9 h-9 rounded-lg object-cover border" />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-slate-100 border flex items-center justify-center text-[9px] font-bold text-slate-400">
                      TEXT
                    </div>
                  )}
                  <p className="font-semibold text-slate-900 truncate">{item.caption}</p>
                </div>
              </td>
              <td className="px-4 py-3.5">
                <div className="flex gap-1">
                  {item.target_platforms.map((p) => (
                    <ChannelPlatformBadge key={p} platform={p} showName={false} />
                  ))}
                </div>
              </td>
              <td className="px-4 py-3.5">
                <ContentStatusBadge status={item.status} size="sm" />
              </td>
              <td className="px-4 py-3.5 text-slate-500 text-[11px]">
                {item.publish_immediately ? 'Immediate' : item.scheduled_at || '—'}
              </td>
              <td className="px-5 py-3.5 text-right">
                <div className="flex justify-end gap-1">
                  <button onClick={() => onView(item)} className="p-1 text-slate-400 hover:text-slate-800">
                    <FiEye size={13} />
                  </button>
                  <button onClick={() => onDelete(item._id)} className="p-1 text-slate-400 hover:text-rose-600">
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}