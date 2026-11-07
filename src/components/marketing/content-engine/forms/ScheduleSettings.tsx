import React from 'react'
import { FiClock, FiZap } from 'react-icons/fi'

interface ScheduleSettingsProps {
  publishImmediately: boolean
  scheduledAt: string
  onPublishImmediatelyChange: (val: boolean) => void
  onScheduledAtChange: (val: string) => void
}

export const ScheduleSettings: React.FC<ScheduleSettingsProps> = ({
  publishImmediately,
  scheduledAt,
  onPublishImmediatelyChange,
  onScheduledAtChange,
}) => {
  return (
    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiZap className={publishImmediately ? 'text-amber-500' : 'text-slate-400'} />
          <span className="text-xs font-bold text-slate-800">Publish Immediately</span>
        </div>
        <input
          type="checkbox"
          checked={publishImmediately}
          onChange={(e) => onPublishImmediatelyChange(e.target.checked)}
          className="w-4 h-4 accent-blue-600 cursor-pointer"
        />
      </div>

      {!publishImmediately && (
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1 flex items-center gap-1">
            <FiClock size={11} /> Schedule Date & Time
          </label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => onScheduledAtChange(e.target.value)}
            className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 bg-white outline-none"
          />
        </div>
      )}
    </div>
  )
}