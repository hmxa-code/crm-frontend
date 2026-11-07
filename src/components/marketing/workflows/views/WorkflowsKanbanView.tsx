import React from 'react'
import { FiEye, FiEdit2, FiTrash2, FiLoader, FiTrendingUp } from 'react-icons/fi'
import { Workflow, WorkflowStatus } from '@/src/types/marketing/workflow'

const STATUS_COLUMNS: WorkflowStatus[] = ['Draft', 'Active', 'Paused', 'Completed']

interface WorkflowsKanbanViewProps {
  workflows: Workflow[]
  loading: boolean
  onView: (wf: Workflow) => void
  onEdit: (wf: Workflow) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, newStatus: WorkflowStatus) => void
}

export const WorkflowsKanbanView: React.FC<WorkflowsKanbanViewProps> = ({
  workflows,
  loading,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
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

  const getStatusColorConfig = (status: WorkflowStatus) => {
    switch (status) {
      case 'Active':
        return { dot: 'bg-emerald-500' }
      case 'Completed':
        return { dot: 'bg-blue-500' }
      case 'Paused':
        return { dot: 'bg-rose-500' }
      default:
        return { dot: 'bg-slate-400' }
    }
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData('text/plain', id)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: WorkflowStatus) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (id) onStatusChange(id, status)
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {STATUS_COLUMNS.map((status) => {
        const conf = getStatusColorConfig(status)
        const items = columns[status] || []
        return (
          <div
            key={status}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, status)}
            className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col min-h-[240px] shadow-2xs"
          >
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${conf.dot}`} />
                <span className="font-bold text-slate-800 text-xs">{status}</span>
              </div>
              <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                {items.length}
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-6 text-slate-400">
                <FiLoader className="animate-spin" size={14} />
              </div>
            ) : (
              <div className="space-y-2.5 overflow-y-auto max-h-[380px] pr-1">
                {items.length ? (
                  items.map((wf) => (
                    <div
                      key={wf._id}
                      draggable
                      onDragStart={(e) => wf._id && handleDragStart(e, wf._id)}
                      className="bg-slate-50/50 hover:bg-white border border-slate-200/70 rounded-lg p-3 transition-all cursor-grab active:cursor-grabbing group relative"
                    >
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <h4 className="font-bold text-slate-900 text-xs truncate max-w-[70%]">
                          {wf.workflow_name}
                        </h4>
                        <span className="text-[9px] font-bold bg-white text-slate-500 border px-1 py-0.5 rounded">
                          {wf.trigger_type}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-1 mb-3">
                        Action: {wf.action_type} • Queue: {wf.total_contacts}
                      </p>

                      <div className="flex items-center justify-between text-[10px] border-t border-slate-100 pt-2 text-slate-500">
                        <span>Processed: {wf.processed_contacts}</span>
                        <span className="text-slate-800 font-bold flex items-center gap-0.5">
                          <FiTrendingUp size={10} className="text-blue-500" /> Eff: {wf.automation_efficiency}%
                        </span>
                      </div>

                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex items-center bg-white border border-slate-200 rounded shadow-2xs transition-opacity">
                        <button type="button" onClick={() => onView(wf)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"><FiEye size={11} /></button>
                        <button type="button" onClick={() => onEdit(wf)} className="p-1 text-slate-400 hover:text-amber-600 cursor-pointer"><FiEdit2 size={11} /></button>
                        <button type="button" onClick={() => wf._id && onDelete(wf._id)} className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"><FiTrash2 size={11} /></button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 flex items-center justify-center border border-dashed border-slate-200 rounded-lg text-slate-400 text-[11px]">
                    No records active
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}