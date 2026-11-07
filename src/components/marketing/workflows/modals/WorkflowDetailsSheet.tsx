import React from 'react'
import { FiX, FiGitBranch } from 'react-icons/fi'
import { Workflow } from '@/src/types/marketing/workflow'

interface WorkflowDetailsSheetProps {
  workflow: Workflow | null
  onClose: () => void
}

export const WorkflowDetailsSheet: React.FC<WorkflowDetailsSheetProps> = ({ workflow, onClose }) => {
  if (!workflow) return null

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden flex justify-end">
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-2xs" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white border-l border-slate-200 h-full p-5 flex flex-col text-xs animate-in slide-in-from-right duration-150">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 text-sm">Workflow Specifications</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded text-slate-400 cursor-pointer"><FiX size={14} /></button>
        </div>
        <div className="mt-4 space-y-4 flex-1 overflow-y-auto">
          <div>
            <span className="text-slate-400 block font-medium">Orchestration Title</span>
            <p className="font-bold text-slate-900 text-sm mt-0.5">{workflow.workflow_name}</p>
            <p className="text-slate-400 text-[10px] mt-0.5">{workflow.description || 'No system logs provided.'}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-400 block font-medium">Trigger Node</span>
              <p className="font-semibold text-slate-800 mt-0.5">{workflow.trigger_type}</p>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Fulfillment Action</span>
              <p className="font-semibold text-slate-800 mt-0.5">{workflow.action_type}</p>
            </div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Pipeline Entries</span>
              <strong className="text-slate-900">{workflow.total_contacts}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Processed Signals</span>
              <strong className="text-slate-900">{workflow.processed_contacts}</strong>
            </div>
            <div className="flex justify-between text-emerald-600">
              <span>Successful Triggers</span>
              <strong>{workflow.successful_actions}</strong>
            </div>
            <div className="flex justify-between text-rose-500">
              <span>Failed Dispatches</span>
              <strong>{workflow.failed_actions}</strong>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-1.5 font-bold text-slate-900 text-xs">
              <span>System Efficiency</span>
              <span className="flex items-center gap-1"><FiGitBranch className="text-blue-500" /> {workflow.automation_efficiency}%</span>
            </div>
          </div>
          {workflow.notes && (
            <div className="border-t border-slate-100 pt-3">
              <span className="text-slate-400 block font-medium">Execution Scope Notes</span>
              <p className="text-slate-600 italic mt-1 bg-slate-50 p-2 rounded border border-slate-100">"{workflow.notes}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}