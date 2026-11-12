'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiLoader, FiEye, FiGitBranch, FiColumns, FiList, FiChevronDown, FiTrendingUp, FiActivity } from 'react-icons/fi'
import { Workflow, WorkflowStatus } from '@/src/types/workflows/workflow'
import { WorkflowsService } from '@/src/services/marketing/WorkflowsService'

const STATUS_COLUMNS: WorkflowStatus[] = ['Draft', 'Active', 'Paused', 'Completed']

const emptyWorkflow: Workflow = {
  workflow_name: '',
  description: '',
  status: 'Draft' as WorkflowStatus,
  trigger_type: 'Lead-Creation',
  action_type: 'Email',
  total_contacts: 0,
  processed_contacts: 0,
  successful_actions: 0,
  failed_actions: 0,
  automation_efficiency: 0,
  created_by: 'Current User',
  created_date: Date.now(),
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
    return { dot: 'bg-black', bg: 'bg-slate-100', text: 'text-slate-900' }
  }

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen p-6 text-slate-900 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-5">
        
        {/* --- High End Enterprise Header --- */}
        <div className="flex flex-col gap-2 bg-white px-6 py-4 rounded-2xl border border-slate-300 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900">Automation Workflows</h1>
              <p className="text-xs text-slate-500 mt-0.5">Manage orchestrations, triggers, and execution pipelines.</p>
            </div>
            <span className="px-2.5 py-1 bg-slate-100 border border-slate-300 rounded-lg text-[10px] font-bold text-slate-700">
              {workflows.length} active pipelines
            </span>
          </div>
        </div>

        {/* --- Controls Bar --- */}
        <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-slate-300 shadow-xs">
          <div className="flex items-center gap-2 relative">
            <button
              type="button"
              onClick={() => setShowViewDropdown(!showViewDropdown)}
              className="flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 px-3 py-2 rounded-xl font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
            >
              {viewMode === 'table' ? <FiList size={14} className="text-slate-700" /> : <FiColumns size={14} className="text-slate-700" />}
              <span className="capitalize">{viewMode} Layout</span>
              <FiChevronDown size={12} className={`text-slate-500 transition-transform ${showViewDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showViewDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowViewDropdown(false)} />
                <div className="absolute left-0 mt-1 w-36 bg-white border border-slate-300 rounded-xl shadow-lg py-1 z-20 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => { setViewMode('table'); setShowViewDropdown(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-100 ${viewMode === 'table' ? 'text-black bg-slate-100 font-bold' : 'text-slate-700'}`}
                  >
                    <FiList size={13} /> Table View
                  </button>
                  <button
                    type="button"
                    onClick={() => { setViewMode('kanban'); setShowViewDropdown(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-100 ${viewMode === 'kanban' ? 'text-black bg-slate-100 font-bold' : 'text-slate-700'}`}
                  >
                    <FiColumns size={13} /> Kanban View
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => { setFormData(emptyWorkflow); setIsEditing(false); setShowModal(true); }}
            className="flex items-center gap-1.5 bg-black hover:bg-slate-800 text-white px-4 py-2 rounded-xl font-bold transition-colors text-xs cursor-pointer shadow-xs active:scale-95"
          >
            <FiPlus size={13} className="text-white" /> Add Orchestration Flow
          </button>
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
                  className="bg-white border border-slate-300 rounded-2xl p-3.5 flex flex-col min-h-[220px] shadow-2xs hover:shadow-xs transition-shadow"
                >
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-black" />
                      <span className="font-bold text-slate-900 text-xs tracking-wide">{status}</span>
                    </div>
                    <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200">
                      {columns[status]?.length || 0}
                    </span>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center py-6 text-slate-500">
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
                            className="bg-slate-50/50 hover:bg-white border border-slate-300 rounded-xl p-3 transition-all cursor-grab active:cursor-grabbing group relative shadow-2xs"
                          >
                            <div className="flex justify-between items-start gap-2 mb-1.5">
                              <h4 className="font-bold text-slate-900 text-xs truncate max-w-[70%]">
                                {wf.workflow_name || 'Untitled Trigger'}
                              </h4>
                              <span className="text-[9px] font-bold bg-white text-slate-800 border border-slate-300 px-1.5 py-0.5 rounded">
                                {wf.trigger_type}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-600 line-clamp-1 mb-3">
                              Action: {wf.action_type} • Queue: {wf.total_contacts}
                            </p>

                            <div className="flex items-center justify-between text-[10px] border-t border-slate-200 pt-2 text-slate-700 font-semibold">
                              <span>Processed: {wf.processed_contacts}</span>
                              <span className="text-slate-900 font-extrabold flex items-center gap-1">
                                <FiTrendingUp size={11} className="text-black" /> Eff: {wf.automation_efficiency}%
                              </span>
                            </div>

                            {/* Minimal Overlay Controls */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex items-center bg-white border border-slate-300 rounded-lg shadow-sm transition-opacity">
                              <button type="button" onClick={() => setViewingWorkflow(wf)} className="p-1.5 text-slate-600 hover:text-black" title="View Details">
                                <FiEye size={12} />
                              </button>
                              <button type="button" onClick={() => { setFormData(wf); setIsEditing(true); setShowModal(true); }} className="p-1.5 text-slate-600 hover:text-black" title="Edit System">
                                <FiEdit2 size={12} />
                              </button>
                              <button type="button" onClick={() => wf._id && handleDelete(wf._id)} className="p-1.5 text-slate-600 hover:text-black" title="Delete Rule">
                                <FiTrash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-6 flex items-center justify-center border border-dashed border-slate-300 rounded-xl text-slate-500 text-[11px] font-medium">
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
          <div className="bg-white border border-slate-300 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300">
                    <th className="px-5 py-3 font-bold text-slate-700 uppercase tracking-wider text-[10px]">Workflow Target</th>
                    <th className="px-5 py-3 font-bold text-slate-700 uppercase tracking-wider text-[10px]">Trigger Conditions</th>
                    <th className="px-5 py-3 font-bold text-slate-700 uppercase tracking-wider text-[10px]">Queue Metrics</th>
                    <th className="px-5 py-3 font-bold text-slate-700 uppercase tracking-wider text-[10px]">Action Index</th>
                    <th className="px-5 py-3 font-bold text-slate-700 uppercase tracking-wider text-[10px]">State</th>
                    <th className="px-5 py-3 font-bold text-slate-700 uppercase tracking-wider text-[10px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                        <FiLoader className="animate-spin inline-block mr-2" size={14} /> Resolving streams...
                      </td>
                    </tr>
                  ) : workflows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                        <FiActivity className="inline-block mr-2" size={14} /> No Orchestrations Configured
                      </td>
                    </tr>
                  ) : (
                    workflows.map((wf) => (
                      <tr key={wf._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="font-bold text-slate-900">{wf.workflow_name}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[180px]">{wf.description || 'No description listed'}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="px-2 py-0.5 bg-slate-100 border border-slate-300 text-slate-800 rounded font-semibold text-[10px] uppercase">{wf.trigger_type}</span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-700">
                          <div>Total Queue: <span className="text-slate-900 font-bold">{wf.total_contacts}</span></div>
                          <div className="text-[10px] text-slate-500">Processed: {wf.processed_contacts}</div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-700">
                          <div className="flex gap-3 text-[11px] font-semibold">
                            <span>Success: <strong className="text-slate-900">{wf.successful_actions}</strong></span>
                            <span>Failures: <strong className="text-slate-900">{wf.failed_actions}</strong></span>
                            <span>Efficiency: <strong className="text-slate-900">{wf.automation_efficiency}%</strong></span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="px-2.5 py-1 font-bold rounded-full text-[10px] bg-slate-100 border border-slate-300 text-slate-900">
                            {wf.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button onClick={() => setViewingWorkflow(wf)} className="p-1.5 text-slate-600 hover:text-black rounded-lg border border-slate-200 bg-white" title="View"><FiEye size={13} /></button>
                            <button onClick={() => { setFormData(wf); setIsEditing(true); setShowModal(true); }} className="p-1.5 text-slate-600 hover:text-black rounded-lg border border-slate-200 bg-white" title="Edit"><FiEdit2 size={13} /></button>
                            <button onClick={() => wf._id && handleDelete(wf._id)} className="p-1.5 text-slate-600 hover:text-black rounded-lg border border-slate-200 bg-white" title="Delete"><FiTrash2 size={13} /></button>
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
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setViewingWorkflow(null)} />
          <div className="relative w-full max-w-sm bg-white border-l border-slate-300 h-full p-5 flex flex-col text-xs animate-in slide-in-from-right duration-150 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-300">
              <h2 className="font-bold text-slate-900 text-sm">Workflow Specifications</h2>
              <button onClick={() => setViewingWorkflow(null)} className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-600 border border-slate-200"><FiX size={14} /></button>
            </div>
            <div className="mt-4 space-y-4 flex-1 overflow-y-auto">
              <div>
                <span className="text-slate-500 block font-semibold">Orchestration Title</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{viewingWorkflow.workflow_name}</p>
                <p className="text-slate-500 text-[10px] mt-0.5">{viewingWorkflow.description || 'No system logs provided.'}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 block font-semibold">Trigger Node</span>
                  <p className="font-bold text-slate-900 mt-0.5">{viewingWorkflow.trigger_type}</p>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">Fulfillment Action</span>
                  <p className="font-bold text-slate-900 mt-0.5">{viewingWorkflow.action_type}</p>
                </div>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-xl space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Pipeline Entries</span>
                  <strong className="text-slate-900">{viewingWorkflow.total_contacts}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Processed Signals</span>
                  <strong className="text-slate-900">{viewingWorkflow.processed_contacts}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Successful Triggers</span>
                  <strong className="text-slate-900">{viewingWorkflow.successful_actions}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Failed Dispatches</span>
                  <strong className="text-slate-900">{viewingWorkflow.failed_actions}</strong>
                </div>
                <div className="flex justify-between border-t border-slate-300 pt-2 font-bold text-slate-900 text-xs">
                  <span>System Efficiency</span>
                  <span className="flex items-center gap-1"><FiGitBranch className="text-black" /> {viewingWorkflow.automation_efficiency}%</span>
                </div>
              </div>
              {viewingWorkflow.notes && (
                <div className="border-t border-slate-200 pt-3">
                  <span className="text-slate-500 block font-semibold">Execution Scope Notes</span>
                  <p className="text-slate-800 font-medium mt-1 bg-slate-50 p-2.5 rounded-xl border border-slate-300">"{viewingWorkflow.notes}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- Quick Setup Form Modal --- */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] overflow-hidden flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setShowModal(false)} />
          <form onSubmit={handleSubmit} className="relative w-full max-w-sm bg-white border-l border-slate-300 h-full p-5 flex flex-col text-xs animate-in slide-in-from-right duration-150 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-300">
              <h2 className="font-bold text-slate-900 text-sm">{isEditing ? "Reconfigure Rule Set" : "New Automation Engine"}</h2>
              <button type="button" onClick={() => setShowModal(false)} className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-600 border border-slate-200"><FiX size={14} /></button>
            </div>
            
            <div className="mt-4 space-y-3.5 flex-1 overflow-y-auto">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Workflow Target Name *</label>
                <input
                  type="text"
                  name="workflow_name"
                  required
                  value={formData.workflow_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-black transition-colors bg-slate-50"
                  placeholder="e.g., Post-Purchase Sync Node"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Short Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-black bg-slate-50"
                  placeholder="Describe main scope objective..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Trigger Event</label>
                  <select 
                    name="trigger_type" 
                    value={formData.trigger_type} 
                    onChange={(e) => setFormData(prev => ({ ...prev, trigger_type: e.target.value }))} 
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                  >
                    <option value="Lead-Creation">Lead Creation</option>
                    <option value="Form-Submission">Form Submission</option>
                    <option value="Page-View">Page View</option>
                    <option value="Manual">Manual Initialization</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Fulfillment Action</label>
                  <select 
                    name="action_type" 
                    value={formData.action_type} 
                    onChange={(e) => setFormData(prev => ({ ...prev, action_type: e.target.value }))} 
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                  >
                    <option value="Email">Email Dispatch</option>
                    <option value="SMS">SMS Core</option>
                    <option value="Webhook">Webhook Pipeline</option>
                    <option value="Update-Status">Update Matrix Status</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Deployment Status</label>
                  <select 
                    name="status" 
                    value={formData.status} 
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as WorkflowStatus }))} 
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Active">Active State</option>
                    <option value="Paused">Paused State</option>
                    <option value="Completed">Completed Cycle</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Audience Queue</label>
                  <input type="number" name="total_contacts" value={formData.total_contacts} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-slate-50 font-mono" />
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-xl space-y-2.5">
                <span className="font-bold text-slate-900 block text-[11px]">Streaming Diagnostics</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Processed</label>
                    <input type="number" name="processed_contacts" value={formData.processed_contacts} onChange={handleInputChange} className="w-full px-2 py-1.5 border border-slate-300 bg-white rounded-lg font-mono" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Success</label>
                    <input type="number" name="successful_actions" value={formData.successful_actions} onChange={handleInputChange} className="w-full px-2 py-1.5 border border-slate-300 bg-white rounded-lg font-mono" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Efficiency %</label>
                    <input type="number" name="automation_efficiency" value={formData.automation_efficiency} onChange={handleInputChange} className="w-full px-2 py-1.5 border border-slate-300 bg-white rounded-lg font-mono" />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Orchestration Logs / Context</label>
                <textarea
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none resize-none h-16 bg-slate-50 font-medium"
                  placeholder="Add scope instructions..."
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-300 flex gap-2">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 font-bold hover:bg-slate-100 transition-colors">Cancel</button>
              <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-black text-white rounded-xl font-bold hover:bg-slate-800 flex items-center justify-center gap-1.5 shadow-xs transition-all">
                {submitting && <FiLoader className="animate-spin" size={13} />}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default WorkflowsTable