import React from 'react'
import { FiX } from 'react-icons/fi'
import { ContentItem } from '@/src/types/marketing/content-engine'
import { ContentStatusBadge } from '../shared/ContentStatusBadge'
import { ChannelPlatformBadge } from '../shared/ChannelPlatformBadge'

interface ContentPreviewSheetProps {
  item: ContentItem | null
  onClose: () => void
}

export const ContentPreviewSheet: React.FC<ContentPreviewSheetProps> = ({ item, onClose }) => {
  if (!item) return null

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/60 backdrop-blur-2xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full p-6 flex flex-col justify-between border-l border-slate-200">
        <div>
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ContentStatusBadge status={item.status} size="sm" />
              <span className="text-[10px] font-mono text-slate-400">{item._id}</span>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-800">
              <FiX size={16} />
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Target Platforms</span>
              <div className="flex gap-1.5">
                {item.target_platforms.map((p) => (
                  <ChannelPlatformBadge key={p} platform={p} />
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Caption Copy</span>
              <p className="text-xs text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200/80 whitespace-pre-line">
                {item.caption}
              </p>
            </div>

            {item.media_assets.length > 0 && (
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Creative Media</span>
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 max-h-48">
                  <img src={item.media_assets[0].url} alt="Media" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>
        </div>

        <button onClick={onClose} className="w-full py-2 bg-slate-100 font-bold text-xs rounded-xl text-slate-700">
          Close Overview
        </button>
      </div>
    </div>
  )
}