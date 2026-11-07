import React from 'react'
import { FiEye, FiEdit2, FiTrash2, FiActivity } from 'react-icons/fi'
import { Workflow } from '@/src/types/workflows/workflow'
import { WorkflowStatusBadge } from '../shared/WorkflowStatusBadge'

interface WorkflowsTableViewProps {
  workflows: Workflow[]
  onView: (wf: Workflow) => void
  onEdit: (wf: Workflow) => void
  onDelete: (id: string) => void
}

export const WorkflowsTableView: React.FC<WorkflowsTableViewProps> = ({
  workflows,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <th className="px-5 py-3">Workflow Target</th>
              <th className="px-5 py-3">Trigger Conditions</th>
              <th className="px-5 py-3">Queue Metrics</th>
              <th className="px-5 py-3">Action Index</th>
              <th className="px-5 py-3">State</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {workflows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                  <FiActivity className="inline-block mr-2" size={14} /> No Orchestrations Configured
                </td>
              </tr>
            ) : (
              workflows.map((wf) => (
                <tr key={wf._id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-slate-900">{wf.workflow_name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[200px]">
                      {wf.description || 'No description listed'}
                    </p>
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] uppercase font-medium">
                      {wf.trigger_type}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    <div>Total Queue: <span className="text-slate-900 font-bold">{wf.total_contacts}</span></div>
                    <div className="text-[10px] text-slate-400">Processed: {wf.processed_contacts}</div>
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    <div className="flex gap-3 text-[11px]">
                      <span>Success: <strong className="text-emerald-600">{wf.successful_actions}</strong></span>
                      <span>Failures: <strong className="text-rose-600">{wf.failed_actions}</strong></span>
                      <span>Efficiency: <strong className="text-slate-900">{wf.automation_efficiency}%</strong></span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <WorkflowStatusBadge status={wf.status} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => onView(wf)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"><FiEye size={13} /></button>
                      <button onClick={() => onEdit(wf)} className="p-1 text-slate-400 hover:text-amber-600 cursor-pointer"><FiEdit2 size={13} /></button>
                      <button onClick={() => wf._id && onDelete(wf._id)} className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"><FiTrash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
