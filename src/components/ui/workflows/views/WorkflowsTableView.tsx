'use client'

import React from 'react'
import Link from 'next/link'
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiActivity,
  FiPlay,
  FiCopy,
  FiArrowRight,
  FiCheckCircle,
  FiAlertCircle,
  FiTrendingUp,
  FiCheckSquare,
  FiCalendar,
  FiSend,
  FiDatabase,
} from 'react-icons/fi'
import { Workflow, CRMWorkflowDomain } from '@/src/types/workflows/workflow'
import { WorkflowStatusBadge } from '../shared/WorkflowStatusBadge'

interface WorkflowsTableViewProps {
  workflows: Workflow[]
  onView: (wf: Workflow) => void
  onEdit: (wf: Workflow) => void
  onDelete: (id: string) => void
  onDuplicate?: (id: string) => void
  onSimulateRun?: (id: string) => void
}

const getDomainBadge = (domain?: CRMWorkflowDomain) => {
  switch (domain) {
    case 'rengrowcure':
      return { label: 'RenGrowCure', icon: FiTrendingUp, bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
    case 'tasks':
      return { label: 'Task Management', icon: FiCheckSquare, bg: 'bg-violet-50 text-violet-700 border-violet-200' }
    case 'calendar':
      return { label: 'Calendar', icon: FiCalendar, bg: 'bg-sky-50 text-sky-700 border-sky-200' }
    case 'marketing':
      return { label: 'Marketing', icon: FiSend, bg: 'bg-pink-50 text-pink-700 border-pink-200' }
    default:
      return { label: 'Omni-CRM', icon: FiDatabase, bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
  }
}

export const WorkflowsTableView: React.FC<WorkflowsTableViewProps> = ({
  workflows,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onSimulateRun,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 font-bold uppercase tracking-wider text-[10px] text-slate-400">
              <th className="px-5 py-3.5">Workflow & Module</th>
              <th className="px-4 py-3.5">Trigger → Action Flow</th>
              <th className="px-4 py-3.5">Signals Handled</th>
              <th className="px-4 py-3.5">Execution Health</th>
              <th className="px-4 py-3.5">Lifecycle</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {workflows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                  <FiActivity className="inline-block mr-2 h-4 w-4 text-slate-300" />
                  <span className="font-semibold text-slate-500">No automation workflows match your criteria</span>
                </td>
              </tr>
            ) : (
              workflows.map((wf) => {
                const domainInfo = getDomainBadge(wf.domain)
                const DomainIcon = domainInfo.icon
                return (
                  <tr
                    key={wf._id}
                    onClick={() => onView(wf)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                  >
                    {/* Title & Domain */}
                    <td className="px-5 py-3.5 max-w-[260px]">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold border ${domainInfo.bg}`}>
                          <DomainIcon className="h-3 w-3" />
                          <span>{domainInfo.label}</span>
                        </span>
                      </div>
                      <p className="font-bold text-slate-900 mt-1 truncate group-hover:text-blue-600 transition-colors">
                        {wf.workflow_name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[240px]">
                        {wf.description || 'Enterprise visual orchestration flow.'}
                      </p>
                    </td>

                    {/* Trigger & Action Flow */}
                    <td className="px-4 py-3.5 max-w-[220px]">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold uppercase text-slate-400 w-11">Trig:</span>
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 truncate max-w-[150px]">
                            {wf.trigger_type.replace(/Trigger-/, '')}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold uppercase text-slate-400 w-11">Act:</span>
                          <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 truncate max-w-[150px]">
                            {wf.action_type.replace(/Action-/, '')}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Telemetry Queue */}
                    <td className="px-4 py-3.5">
                      <div className="text-xs font-bold text-slate-800">
                        {wf.processed_contacts.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">Total Operations</div>
                    </td>

                    {/* Efficiency & Success Meter */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-emerald-600">
                          {wf.automation_efficiency}%
                        </span>
                        <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${wf.automation_efficiency}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {wf.successful_actions} ok • {wf.failed_actions} err
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3.5">
                      <WorkflowStatusBadge status={wf.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {onSimulateRun && wf._id && (
                          <button
                            type="button"
                            onClick={() => onSimulateRun(wf._id!)}
                            title="Simulate Execution Run"
                            className="rounded-lg p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                          >
                            <FiPlay className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {onDuplicate && wf._id && (
                          <button
                            type="button"
                            onClick={() => onDuplicate(wf._id!)}
                            title="Duplicate Workflow"
                            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <FiCopy className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onView(wf)}
                          title="Open Visual Canvas"
                          className="rounded-lg p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <FiEye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => wf._id && onDelete(wf._id)}
                          title="Delete Workflow"
                          className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <FiTrash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
