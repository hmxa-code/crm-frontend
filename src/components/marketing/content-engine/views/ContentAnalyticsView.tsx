import React from 'react'
import { FiTrendingUp, FiEye, FiThumbsUp, FiMessageSquare } from 'react-icons/fi'
import { ContentItem } from '@/src/types/marketing/content-engine'

interface ContentAnalyticsViewProps {
  items: ContentItem[]
}

export const ContentAnalyticsView: React.FC<ContentAnalyticsViewProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs">
        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Queue Items</span>
        <span className="text-2xl font-extrabold text-slate-900">{items.length}</span>
      </div>
      <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs">
        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Published Content</span>
        <span className="text-2xl font-extrabold text-emerald-600">
          {items.filter((i) => i.status === 'Published').length}
        </span>
      </div>
      <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs">
        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Scheduled Active</span>
        <span className="text-2xl font-extrabold text-blue-600">
          {items.filter((i) => i.status === 'Scheduled').length}
        </span>
      </div>
    </div>
  )
}