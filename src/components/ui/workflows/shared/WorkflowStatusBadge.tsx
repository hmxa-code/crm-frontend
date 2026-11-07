import React from 'react'
import { WorkflowStatus } from '@/src/types/workflows/workflow'

interface WorkflowStatusBadgeProps {
  status: WorkflowStatus
  className?: string
}

export const WorkflowStatusBadge: React.FC<WorkflowStatusBadgeProps> = ({
  status,
  className = '',
}) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10'
      case 'Paused':
        return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/10'
      case 'Completed':
        return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/10'
      case 'Draft':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/10'
    }
  }

  const getDotStyle = () => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500 animate-pulse'
      case 'Paused':
        return 'bg-amber-500'
      case 'Completed':
        return 'bg-blue-500'
      case 'Draft':
      default:
        return 'bg-slate-400'
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-xs ring-1 ${getBadgeStyle()} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${getDotStyle()}`} />
      {status}
    </span>
  )
}
