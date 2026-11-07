import React from 'react'
import { ContentItem } from '@/src/types/marketing/content-engine'
import { ContentStatusBadge } from '../shared/ContentStatusBadge'

interface ContentCalendarViewProps {
  items: ContentItem[]
  onView: (item: ContentItem) => void
}

export const ContentCalendarView: React.FC<ContentCalendarViewProps> = ({ items, onView }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 pb-2 border-b">
        {days.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 pt-3 min-h-[300px]">
        {items.map((item, idx) => (
          <div
            key={item._id}
            onClick={() => onView(item)}
            className="p-2 border border-slate-200 rounded-xl bg-slate-50/60 hover:bg-white transition-all cursor-pointer shadow-2xs h-24 flex flex-col justify-between"
          >
            <p className="text-[10px] font-bold text-slate-800 line-clamp-2">{item.caption}</p>
            <ContentStatusBadge status={item.status} size="sm" />
          </div>
        ))}
      </div>
    </div>
  )
}