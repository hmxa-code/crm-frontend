'use client'

import React from 'react'
import { FiX, FiGitBranch, FiActivity } from 'react-icons/fi'
import { Workflow } from '@/src/types/workflows/workflow'

interface WorkflowDetailsSheetProps {
  workflow: Workflow | null
  onClose: () => void
}

export const WorkflowDetailsSheet: React.FC<WorkflowDetailsSheetProps> = ({ workflow, onClose }) => {
  if (!workflow) return null

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full sm:max-w-sm max-w-full bg-white border-l border-slate-200 h-full p-4 sm:p-5 flex flex-col text-xs shadow-2xl animate-in slide-in-from-right duration-150">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <FiActivity className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Workflow Specifications</h2>
              <p className="text-[10px] text-slate-400">Telemetry & Routing Rules</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer transition"
          >
            <FiX size={15} />
          </button>
        </div>

        <div className="mt-4 space-y-4 flex-1 overflow-y-auto pr-1">
          <div>
            <span className="text-slate-400 block font-medium">Orchestration Title</span>
            <p className="font-bold text-slate-900 text-sm mt-0.5">{workflow.workflow_name}</p>
            <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
              {workflow.description || 'No system logs provided.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-slate-400 block font-medium">Trigger Node</span>
              <p className="font-semibold text-slate-800 mt-0.5">{workflow.trigger_type}</p>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Fulfillment Action</span>
              <p className="font-semibold text-slate-800 mt-0.5">{workflow.action_type}</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-medium">Pipeline Entries</span>
              <strong className="text-slate-900">{workflow.total_contacts}</strong>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-medium">Processed Signals</span>
              <strong className="text-slate-900">{workflow.processed_contacts}</strong>
            </div>
            <div className="flex justify-between text-xs text-emerald-600">
              <span className="font-medium">Successful Triggers</span>
              <strong>{workflow.successful_actions}</strong>
            </div>
            <div className="flex justify-between text-xs text-rose-500">
              <span className="font-medium">Failed Dispatches</span>
              <strong>{workflow.failed_actions}</strong>
            </div>
            <div className="flex justify-between border-t border-slate-200/80 pt-2 font-bold text-slate-900 text-xs">
              <span>System Efficiency</span>
              <span className="flex items-center gap-1 text-emerald-600">
                <FiGitBranch className="text-blue-500" /> {workflow.automation_efficiency}%
              </span>
            </div>
          </div>

          {workflow.notes && (
            <div className="border-t border-slate-100 pt-3">
              <span className="text-slate-400 block font-medium mb-1">Execution Scope Notes</span>
              <p className="text-slate-600 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                {workflow.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
