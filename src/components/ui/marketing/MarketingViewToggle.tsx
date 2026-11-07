'use client'

import React from 'react'
import { PiKanban, PiTable } from 'react-icons/pi'

type MarketingViewMode = 'table' | 'kanban'

interface MarketingViewToggleProps {
  viewMode: MarketingViewMode
  onChange: (mode: MarketingViewMode) => void
  label?: string
}

export default function MarketingViewToggle({ viewMode, onChange, label }: MarketingViewToggleProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <p className="text-sm font-semibold text-slate-700">{label ?? 'View mode'}</p>
        <p className="text-xs text-slate-500">Toggle between table and kanban workflows.</p>
      </div>
      <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
        <button
          type="button"
          onClick={() => onChange('table')}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
            viewMode === 'table'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <PiTable size={16} /> Table
        </button>
        <button
          type="button"
          onClick={() => onChange('kanban')}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
            viewMode === 'kanban'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <PiKanban size={16} /> Kanban
        </button>
      </div>
    </div>
  )
}
