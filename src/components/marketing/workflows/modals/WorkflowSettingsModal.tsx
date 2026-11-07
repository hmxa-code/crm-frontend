'use client'

import React, { useState, useEffect } from 'react'
import { FiX, FiSettings, FiCheck } from 'react-icons/fi'
import { Workflow, WorkflowStatus } from '@/src/types/marketing/workflow'

interface WorkflowSettingsModalProps {
  workflow: Workflow | null
  isOpen: boolean
  onClose: () => void
  onSave: (updates: Partial<Workflow>) => void
}

export const WorkflowSettingsModal: React.FC<WorkflowSettingsModalProps> = ({
  workflow,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<WorkflowStatus>('Draft')
  const [triggerType, setTriggerType] = useState('Lead-Creation')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (workflow) {
      setName(workflow.workflow_name || '')
      setDescription(workflow.description || '')
      setStatus(workflow.status || 'Draft')
      setTriggerType(workflow.trigger_type || 'Lead-Creation')
      setNotes(workflow.notes || '')
    }
  }, [workflow])

  if (!isOpen || !workflow) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      workflow_name: name,
      description,
      status,
      trigger_type: triggerType,
      notes,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <FiSettings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Workflow Settings</h2>
              <p className="text-xs text-slate-500">Global metadata & domain execution properties</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Workflow Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Inbound Marketing Nurture Funnel"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what triggers and executes in this marketing workflow..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Lifecycle Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as WorkflowStatus)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Primary Trigger Category</label>
              <select
                value={triggerType}
                onChange={(e) => setTriggerType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Lead-Creation">Lead Creation</option>
                <option value="Form-Submission">Form Submission</option>
                <option value="Page-View">Page View</option>
                <option value="Inbound-Webhook">Inbound Webhook</option>
                <option value="Global-CRM-Event">Global CRM Event</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Operational Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes or deployment instructions..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              <FiCheck className="w-3.5 h-3.5" />
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
