'use client'

import React from 'react'
import { FiZap, FiCheckSquare, FiCalendar, FiTrendingUp, FiSend, FiDatabase } from 'react-icons/fi'

interface TriggerTypeBadgeProps {
  type: string
  className?: string
}

export const TriggerTypeBadge: React.FC<TriggerTypeBadgeProps> = ({ type, className = '' }) => {
  const getIcon = () => {
    if (type.includes('RenGrowCure') || type.includes('Deal') || type.includes('Score')) return FiTrendingUp
    if (type.includes('Task')) return FiCheckSquare
    if (type.includes('Calendar')) return FiCalendar
    if (type.includes('Campaign') || type.includes('Drip')) return FiSend
    if (type.includes('Global') || type.includes('CRM')) return FiDatabase
    return FiZap
  }

  const cleanLabel = type.replace(/^(Trigger-|Action-|Logic-)/, '').replace(/-/g, ' ')
  const Icon = getIcon()

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80 ${className}`}
    >
      <Icon className="h-3 w-3 text-slate-500 shrink-0" />
      <span className="truncate max-w-[140px]">{cleanLabel}</span>
    </span>
  )
}
