'use client'

import React from 'react'
import {
  FiEye,
  FiTrash2,
  FiLoader,
  FiArrowRight,
  FiPlay,
  FiCopy,
  FiTrendingUp,
  FiCheckSquare,
  FiCalendar,
  FiSend,
  FiDatabase,
} from 'react-icons/fi'
import { Workflow, WorkflowStatus, CRMWorkflowDomain } from '@/src/types/workflows/workflow'

const STATUS_COLUMNS: { key: WorkflowStatus; label: string; dot: string; countBg: string }[] = [
  { key: 'Draft', label: 'Draft Mode', dot: 'bg-slate-400', countBg: 'bg-slate-100 text-slate-700' },
  { key: 'Active', label: 'Active Engines', dot: 'bg-emerald-500', countBg: 'bg-emerald-100 text-emerald-800' },
  { key: 'Paused', label: 'Paused / Staged', dot: 'bg-amber-500', countBg: 'bg-amber-100 text-amber-800' },
  { key: 'Completed', label: 'Completed Cycles', dot: 'bg-blue-500', countBg: 'bg-blue-100 text-blue-800' },
]

interface WorkflowsKanbanViewProps {
  workflows: Workflow[]
  loading: boolean
  onView: (wf: Workflow) => void
  onEdit?: (wf: Workflow) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, newStatus: WorkflowStatus) => void
  onDuplicate?: (id: string) => void
}

const getDomainBadge = (domain?: CRMWorkflowDomain) => {
  switch (domain) {
    case 'rengrowcure':
      return { label: 'RenGrowCure', icon: FiTrendingUp, bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
    case 'tasks':
      return { label: 'Tasks', icon: FiCheckSquare, bg: 'bg-violet-50 text-violet-700 border-violet-200' }
    case 'calendar':
      return { label: 'Calendar', icon: FiCalendar, bg: 'bg-sky-50 text-sky-700 border-sky-200' }
    case 'marketing':
      return { label: 'Marketing', icon: FiSend, bg: 'bg-pink-50 text-pink-700 border-pink-200' }
    default:
      return { label: 'Omni-CRM', icon: FiDatabase, bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
  }
}

export const WorkflowsKanbanView: React.FC<WorkflowsKanbanViewProps> = ({
  workflows,
  loading,
  onView,
  onDelete,
  onStatusChange,
  onDuplicate,
}) => {
  const getGroupedWorkflows = () => {
    const grouped: Record<WorkflowStatus, Workflow[]> = {
      Draft: [],
      Active: [],
      Paused: [],
      Completed: [],
    }
    workflows.forEach((wf) => {
      if (grouped[wf.status]) grouped[wf.status].push(wf)
    })
    return grouped
  }

  const columns = getGroupedWorkflows()

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData('text/plain', id)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: WorkflowStatus) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (id) onStatusChange(id, status)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATUS_COLUMNS.map((col) => {
        const items = columns[col.key] || []
        return (
          <div
            key={col.key}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, col.key)}
            className="flex flex-col rounded-2xl border border-slate-200/90 bg-slate-50/50 p-3.5 shadow-xs min-h-[360px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${col.dot}`} />
                <h3 className="text-xs font-bold text-slate-800">{col.label}</h3>
              </div>
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${col.countBg}`}>
                {items.length}
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12 text-slate-400">
                <FiLoader className="animate-spin h-5 w-5 text-blue-600" />
              </div>
            ) : items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                <span className="text-[11px] font-medium text-slate-400">Drag or drop workflows here</span>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[640px] pr-1">
                {items.map((wf) => {
                  const domainInfo = getDomainBadge(wf.domain)
                  const DomainIcon = domainInfo.icon
                  return (
                    <div
                      key={wf._id}
                      draggable
                      onDragStart={(e) => wf._id && handleDragStart(e, wf._id)}
                      onClick={() => onView(wf)}
                      className="group relative rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-xs transition hover:border-slate-300 hover:shadow-md cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-bold border ${domainInfo.bg}`}>
                          <DomainIcon className="h-2.5 w-2.5" />
                          <span>{domainInfo.label}</span>
                        </span>
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          {onDuplicate && wf._id && (
                            <button
                              type="button"
                              onClick={() => onDuplicate(wf._id!)}
                              title="Duplicate"
                              className="p-1 text-slate-400 hover:text-slate-700 transition"
                            >
                              <FiCopy size={12} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => wf._id && onDelete(wf._id)}
                            title="Delete"
                            className="p-1 text-slate-400 hover:text-rose-600 transition"
                          >
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                        {wf.workflow_name}
                      </h4>
                      <p className="mt-1 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {wf.description || 'Enterprise visual pipeline.'}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <div>
                          <span className="text-slate-400 font-semibold uppercase">Signals: </span>
                          <span className="font-bold text-slate-700">
                            {wf.processed_contacts.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 font-bold text-emerald-600">
                          <span>{wf.automation_efficiency}% Health</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
