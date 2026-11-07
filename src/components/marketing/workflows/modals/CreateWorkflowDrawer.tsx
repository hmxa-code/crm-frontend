import React, { useState, useEffect } from 'react'
import { FiX, FiLoader } from 'react-icons/fi'
import { Workflow, WorkflowStatus } from '@/src/types/marketing/workflow'

interface CreateWorkflowDrawerProps {
  isOpen: boolean
  isEditing: boolean
  initialData: Workflow
  onClose: () => void
  onSubmit: (data: Workflow) => Promise<void>
}

export const CreateWorkflowDrawer: React.FC<CreateWorkflowDrawerProps> = ({
  isOpen,
  isEditing,
  initialData,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Workflow>(initialData)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit(formData)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden flex justify-end">
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-2xs" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative w-full max-w-sm bg-white border-l border-slate-200 h-full p-5 flex flex-col text-xs animate-in slide-in-from-right duration-150">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 text-sm">{isEditing ? "Reconfigure Rule Set" : "New Automation Engine"}</h2>
          <button type="button" onClick={onClose} className="p-1 hover:bg-slate-100 rounded text-slate-400 cursor-pointer"><FiX size={14} /></button>
        </div>

        <div className="mt-4 space-y-3.5 flex-1 overflow-y-auto pr-1">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Workflow Target Name *</label>
            <input
              type="text"
              name="workflow_name"
              required
              value={formData.workflow_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-slate-400 bg-slate-50/50"
              placeholder="e.g., Post-Purchase Sync Node"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Short Description</label>
            <input
              type="text"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50"
              placeholder="Describe main scope objective..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Trigger Event</label>
              <select name="trigger_type" value={formData.trigger_type} onChange={handleChange} className="w-full px-2.5 py-2 border border-slate-200 rounded-lg bg-slate-50/50">
                <option value="Lead-Creation">Lead Creation</option>
                <option value="Form-Submission">Form Submission</option>
                <option value="Page-View">Page View</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Fulfillment Action</label>
              <select name="action_type" value={formData.action_type} onChange={handleChange} className="w-full px-2.5 py-2 border border-slate-200 rounded-lg bg-slate-50/50">
                <option value="Email">Email Dispatch</option>
                <option value="SMS">SMS Core</option>
                <option value="Webhook">Webhook</option>
                <option value="Update-Status">Update Matrix</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Deployment Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-2.5 py-2 border border-slate-200 rounded-lg bg-slate-50/50">
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Audience Queue</label>
              <input type="number" name="total_contacts" value={formData.total_contacts} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50" />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2">
            <span className="font-bold text-slate-800 block text-[11px]">Streaming Diagnostics</span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="font-medium text-slate-500 block mb-1">Processed</label>
                <input type="number" name="processed_contacts" value={formData.processed_contacts} onChange={handleChange} className="w-full px-2 py-1.5 border border-slate-200 bg-white rounded-md" />
              </div>
              <div>
                <label className="font-medium text-slate-500 block mb-1">Success</label>
                <input type="number" name="successful_actions" value={formData.successful_actions} onChange={handleChange} className="w-full px-2 py-1.5 border border-slate-200 bg-white rounded-md" />
              </div>
              <div>
                <label className="font-medium text-slate-500 block mb-1">Efficiency %</label>
                <input type="number" name="automation_efficiency" value={formData.automation_efficiency} onChange={handleChange} className="w-full px-2 py-1.5 border border-slate-200 bg-white rounded-md" />
              </div>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Orchestration Logs / Context</label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none resize-none h-16 bg-slate-50/50"
              placeholder="Add scope instructions..."
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-medium cursor-pointer">Cancel</button>
          <button type="submit" disabled={submitting} className="flex-1 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 flex items-center justify-center gap-1 cursor-pointer">
            {submitting && <FiLoader className="animate-spin" size={12} />}
            Save Flow
          </button>
        </div>
      </form>
    </div>
  )
}