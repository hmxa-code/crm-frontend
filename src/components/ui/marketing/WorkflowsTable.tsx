'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiLoader, FiEye, FiGitBranch, FiColumns, FiList, FiChevronDown, FiTrendingUp, FiActivity } from 'react-icons/fi'
import { Workflow, WorkflowsService } from '@/src/services/marketing/WorkflowsService'

const STATUS_COLUMNS: Workflow['status'][] = ['Draft', 'Active', 'Paused', 'Completed']

const emptyWorkflow: Workflow = {
  workflow_name: '',
  description: '',
  status: 'Draft',
  trigger_type: 'Lead-Creation',
  action_type: 'Email',
  total_contacts: 0,
  processed_contacts: 0,
  successful_actions: 0,
  failed_actions: 0,
  automation_efficiency: 0,
  created_by: 'Current User',
  created_date: new Date().getTime(),
  notes: '',
}

const WorkflowsTable = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban')
  const [showViewDropdown, setShowViewDropdown] = useState(false)
  const [formData, setFormData] = useState<Workflow>(emptyWorkflow)
  const [submitting, setSubmitting] = useState(false)
  const [viewingWorkflow, setViewingWorkflow] = useState<Workflow | null>(null)

  useEffect(() => {
    fetchWorkflows()
  }, [])

  const fetchWorkflows = async () => {
    try {
      setLoading(true)
      const data = await WorkflowsService.getAllWorkflows()
      setWorkflows(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      if (isEditing && formData._id) {
        await WorkflowsService.updateWorkflow(formData._id, formData)
      } else {
        await WorkflowsService.createWorkflow(formData)
      }
      await fetchWorkflows()
      setShowModal(false)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to terminate this automation workflow?')) {
      try {
        await WorkflowsService.deleteWorkflow(id)
        await fetchWorkflows()
      } catch (err) {
        console.error(err)
      }
    }
  }

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, workflowId: string) => {
    event.dataTransfer.setData('text/plain', workflowId)
    event.dataTransfer.effectAllowed = 'move'
  }

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>, newStatus: Workflow['status']) => {
    event.preventDefault()
    const id = event.dataTransfer.getData('text/plain')
    if (!id) return
    const workflow = workflows.find((item) => item._id === id)
    if (!workflow || workflow.status === newStatus) return

    const updated = { ...workflow, status: newStatus }
    setWorkflows((prev) => prev.map((item) => (item._id === id ? updated : item)))

    try {
      await WorkflowsService.updateWorkflow(id, { status: newStatus })
    } catch (error) {
      console.error('Failed to update workflow state matrix', error)
      await fetchWorkflows()
    }
  }

  const columns = useMemo(() => {
    const grouped: Record<Workflow['status'], Workflow[]> = {
      Draft: [],
      Active: [],
      Paused: [],
      Completed: [],
    }
    workflows.forEach((wf) => {
      if (grouped[wf.status]) {
        grouped[wf.status].push(wf)
      }
    })
    return grouped
  }, [workflows])

  const getStatusColorConfig = (status: Workflow['status']) => {
    switch (status) {
      case 'Active':
        return { dot: 'bg-emerald-500', bg: 'bg-emerald-50/40', text: 'text-emerald-800' }
      case 'Completed':
        return { dot: 'bg-blue-500', bg: 'bg-blue-50/40', text: 'text-blue-800' }
      case 'Paused':
        return { dot: 'bg-rose-500', bg: 'bg-rose-50/40', text: 'text-rose-800' }
      default:
        return { dot: 'bg-slate-400', bg: 'bg-slate-50', text: 'text-slate-700' }
    }
  }

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen p-6 text-slate-900 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-5">
        
        {/* --- High End Enterprise Header --- */}
        <div className="flex items-center justify-between bg-white px-5 py-3 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-bold tracking-tight text-slate-900">Automation Workflows</h1>
            <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-bold text-slate-500">
              {workflows.length} active pipelines
            </span>
          </div>

          <div className="flex items-center gap-2 relative">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowViewDropdown(!showViewDropdown)}
                className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-2.5 py-1.5 rounded-lg font-medium text-xs transition-colors cursor-pointer"
              >
                {viewMode === 'table' ? <FiList size={13} className="text-slate-500" /> : <FiColumns size={13} className="text-slate-500" />}
                <span className="capitalize">{viewMode} Layout</span>
                <FiChevronDown size={11} className={`text-slate-400 transition-transform ${showViewDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showViewDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowViewDropdown(false)} />
                  <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-md py-0.5 z-20 text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => { setViewMode('table'); setShowViewDropdown(false); }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-left hover:bg-slate-50 ${viewMode === 'table' ? 'text-blue-600 bg-blue-50/40 font-semibold' : 'text-slate-600'}`}
                    >
                      <FiList size={12} /> Table View
                    </button>
                    <button
                      type="button"
                      onClick={() => { setViewMode('kanban'); setShowViewDropdown(false); }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-left hover:bg-slate-50 ${viewMode === 'kanban' ? 'text-blue-600 bg-blue-50/40 font-semibold' : 'text-slate-600'}`}
                    >
                      <FiColumns size={12} /> Kanban View
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => { setFormData(emptyWorkflow); setIsEditing(false); setShowModal(true); }}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors text-xs cursor-pointer"
            >
              <FiPlus size={12} /> Add Orchestration Flow
            </button>
          </div>
        </div>

        {/* --- Modern Wrapped Grid Kanban View --- */}
        {viewMode === 'kanban' ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {STATUS_COLUMNS.map((status) => {
              const conf = getStatusColorConfig(status)
              return (
                <div
                  key={status}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, status)}
                  className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col min-h-[220px] shadow-2xs hover:shadow-xs transition-shadow"
                >
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${conf.dot}`} />
                      <span className="font-bold text-slate-800 text-xs tracking-wide">{status}</span>
                    </div>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                      {columns[status]?.length || 0}
                    </span>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center py-6 text-slate-400">
                      <FiLoader className="animate-spin" size={14} />
                    </div>
                  ) : (
                    <div className="grid gap-2.5 grid-cols-1 overflow-y-auto max-h-[380px] pr-1 custom-scrollbar">
                      {columns[status]?.length ? (
                        columns[status].map((wf) => (
                          <div
                            key={wf._id}
                            draggable
                            onDragStart={(e) => wf._id && handleDragStart(e, wf._id)}
                            className="bg-slate-50/50 hover:bg-white border border-slate-200/70 rounded-lg p-3 transition-all cursor-grab active:cursor-grabbing group relative"
                          >
                            <div className="flex justify-between items-start gap-2 mb-1.5">
                              <h4 className="font-bold text-slate-900 text-xs truncate max-w-[70%]">
                                {wf.workflow_name || 'Untitled Trigger'}
                              </h4>
                              <span className="text-[9px] font-bold bg-white text-slate-500 border border-slate-200/60 px-1 py-0.5 rounded">
                                {wf.trigger_type}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-400 line-clamp-1 mb-3">
                              Action: {wf.action_type} • Profile Queue: {wf.total_contacts}
                            </p>

                            <div className="flex items-center justify-between text-[10px] border-t border-slate-100/80 pt-2 text-slate-500">
                              <span className="font-medium">Processed: {wf.processed_contacts}</span>
                              <span className="text-slate-800 font-bold flex items-center gap-0.5">
                                <FiTrendingUp size={10} className="text-blue-500" /> Eff: {wf.automation_efficiency}%
                              </span>
                            </div>

                            {/* Minimal Overlay Controls */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex items-center bg-white border border-slate-200 rounded shadow-2xs transition-opacity">
                              <button type="button" onClick={() => setViewingWorkflow(wf)} className="p-1 text-slate-400 hover:text-slate-700" title="View Details">
                                <FiEye size={11} />
                              </button>
                              <button type="button" onClick={() => { setFormData(wf); setIsEditing(true); setShowModal(true); }} className="p-1 text-slate-400 hover:text-amber-600" title="Edit System">
                                <FiEdit2 size={11} />
                              </button>
                              <button type="button" onClick={() => wf._id && handleDelete(wf._id)} className="p-1 text-slate-400 hover:text-rose-600" title="Delete Rule">
                                <FiTrash2 size={11} />
                              </button>
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
        ) : (
          /* --- Traditional Minimalist Table View --- */
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-5 py-3 font-semibold text-slate-500">Workflow Target</th>
                    <th className="px-5 py-3 font-semibold text-slate-500">Trigger Conditions</th>
                    <th className="px-5 py-3 font-semibold text-slate-500">Queue Metrics</th>
                    <th className="px-5 py-3 font-semibold text-slate-500">Action Index</th>
                    <th className="px-5 py-3 font-semibold text-slate-500">State</th>
                    <th className="px-5 py-3 font-semibold text-slate-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                        <FiLoader className="animate-spin inline-block mr-2" size={14} /> Resolving streams...
                      </td>
                    </tr>
                  ) : workflows.length === 0 ? (
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
                          <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[180px]">{wf.description || 'No description listed'}</p>
                        </td>
                        <td className="px-5 py-3">
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] uppercase font-medium">{wf.trigger_type}</span>
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
                          <span className="px-2 py-0.5 font-bold rounded-full text-[10px] bg-slate-100 text-slate-700">
                            {wf.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex justify-end gap-1">
                            <button onClick={() => setViewingWorkflow(wf)} className="p-1 text-slate-400 hover:text-slate-700"><FiEye size={13} /></button>
                            <button onClick={() => { setFormData(wf); setIsEditing(true); setShowModal(true); }} className="p-1 text-slate-400 hover:text-amber-600"><FiEdit2 size={13} /></button>
                            <button onClick={() => wf._id && handleDelete(wf._id)} className="p-1 text-slate-400 hover:text-rose-600"><FiTrash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* --- Details Sidebar Sheet --- */}
      {viewingWorkflow && (
        <div className="fixed inset-0 z-[9999] overflow-hidden flex justify-end">
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-2xs" onClick={() => setViewingWorkflow(null)} />
          <div className="relative w-full max-w-sm bg-white border-l border-slate-200 h-full p-4 flex flex-col text-xs animate-in slide-in-from-right duration-150">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-sm">Workflow Specifications</h2>
              <button onClick={() => setViewingWorkflow(null)} className="p-1 hover:bg-slate-100 rounded text-slate-400"><FiX size={14} /></button>
            </div>
            <div className="mt-4 space-y-4 flex-1 overflow-y-auto">
              <div>
                <span className="text-slate-400 block font-medium">Orchestration Title</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{viewingWorkflow.workflow_name}</p>
                <p className="text-slate-400 text-[10px] mt-0.5">{viewingWorkflow.description || 'No system logs provided.'}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block font-medium">Trigger Node</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{viewingWorkflow.trigger_type}</p>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Fulfillment Action</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{viewingWorkflow.action_type}</p>
                </div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Pipeline Entries</span>
                  <strong className="text-slate-900">{viewingWorkflow.total_contacts}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Processed Signals</span>
                  <strong className="text-slate-900">{viewingWorkflow.processed_contacts}</strong>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Successful Triggers</span>
                  <strong>{viewingWorkflow.successful_actions}</strong>
                </div>
                <div className="flex justify-between text-rose-500">
                  <span>Failed Dispatches</span>
                  <strong>{viewingWorkflow.failed_actions}</strong>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1.5 font-bold text-slate-900 text-xs">
                  <span>System Efficiency</span>
                  <span className="flex items-center gap-1"><FiGitBranch className="text-blue-500" /> {viewingWorkflow.automation_efficiency}%</span>
                </div>
              </div>
              {viewingWorkflow.notes && (
                <div className="border-t border-slate-100 pt-3">
                  <span className="text-slate-400 block font-medium">Execution Scope Notes</span>
                  <p className="text-slate-600 italic mt-1 bg-slate-50 p-2 rounded border border-slate-100">"{viewingWorkflow.notes}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- Quick Setup Form Modal --- */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] overflow-hidden flex justify-end">
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-2xs" onClick={() => setShowModal(false)} />
          <form onSubmit={handleSubmit} className="relative w-full max-w-sm bg-white border-l border-slate-200 h-full p-4 flex flex-col text-xs animate-in slide-in-from-right duration-150">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-sm">{isEditing ? "Reconfigure Rule Set" : "New Automation Engine"}</h2>
              <button type="button" onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded text-slate-400"><FiX size={14} /></button>
            </div>
            
            <div className="mt-4 space-y-3 flex-1 overflow-y-auto">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Workflow Target Name *</label>
                <input
                  type="text"
                  name="workflow_name"
                  required
                  value={formData.workflow_name}
                  onChange={handleInputChange}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-slate-400 transition-colors"
                  placeholder="e.g., Post-Purchase Sync Node"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Short Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none"
                  placeholder="Describe main scope objective..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Trigger Event</label>
                  <select name="trigger_type" value={formData.trigger_type} onChange={handleInputChange} className="w-full px-2 py-1.5 border border-slate-200 rounded-lg">
                    <option value="Lead-Creation">Lead Creation</option>
                    <option value="Form-Submission">Form Submission</option>
                    <option value="Page-View">Page View</option>
                    <option value="Manual">Manual Initialization</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Fulfillment Action</label>
                  <select name="action_type" value={formData.action_type} onChange={handleInputChange} className="w-full px-2 py-1.5 border border-slate-200 rounded-lg">
                    <option value="Email">Email Dispatch</option>
                    <option value="SMS">SMS Core</option>
                    <option value="Webhook">Webhook Pipeline</option>
                    <option value="Update-Status">Update Matrix Status</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Deployment Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-2 py-1.5 border border-slate-200 rounded-lg">
                    <option value="Draft">Draft</option>
                    <option value="Active">Active State</option>
                    <option value="Paused">Paused State</option>
                    <option value="Completed">Completed Cycle</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Total Audience Queue</label>
                  <input type="number" name="total_contacts" value={formData.total_contacts} onChange={handleInputChange} className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none" />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2">
                <span className="font-bold text-slate-800 block text-[11px]">Streaming Diagnostics</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="font-medium text-slate-500 block mb-1">Processed</label>
                    <input type="number" name="processed_contacts" value={formData.processed_contacts} onChange={handleInputChange} className="w-full px-2 py-1 border border-slate-200 bg-white rounded-md" />
                  </div>
                  <div>
                    <label className="font-medium text-slate-500 block mb-1">Success</label>
                    <input type="number" name="successful_actions" value={formData.successful_actions} onChange={handleInputChange} className="w-full px-2 py-1 border border-slate-200 bg-white rounded-md" />
                  </div>
                  <div>
                    <label className="font-medium text-slate-500 block mb-1">Efficiency %</label>
                    <input type="number" name="automation_efficiency" value={formData.automation_efficiency} onChange={handleInputChange} className="w-full px-2 py-1 border border-slate-200 bg-white rounded-md" />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Orchestration Logs / Context</label>
                <textarea
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleInputChange}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none resize-none h-16"
                  placeholder="Add scope instructions..."
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 font-medium">Cancel</button>
              <button type="submit" disabled={submitting} className="flex-1 py-1.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 flex items-center justify-center gap-1">
                {submitting && <FiLoader className="animate-spin" size={12} />}
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default WorkflowsTable