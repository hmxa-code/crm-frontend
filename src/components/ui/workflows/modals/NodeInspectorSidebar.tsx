'use client'

import React, { useState, useEffect } from 'react'
import {
  FiX,
  FiSliders,
  FiTrash2,
  FiPlus,
  FiZap,
  FiFilter,
  FiDatabase,
  FiInfo,
  FiLayers,
  FiSend,
  FiShare2,
  FiTrendingUp,
  FiCheckSquare,
  FiCalendar,
  FiUsers,
} from 'react-icons/fi'
import { WorkflowNode, ConditionOperator } from '@/src/types/workflows/workflow'
import { WorkflowsService } from '@/src/services/workflowsService'

interface NodeInspectorSidebarProps {
  node: WorkflowNode | null
  isOpen: boolean
  onClose: () => void
  onUpdateNode: (nodeId: string, updatedData: Partial<WorkflowNode['data']>) => void
  onDeleteNode: (nodeId: string) => void
}

export const NodeInspectorSidebar: React.FC<NodeInspectorSidebarProps> = ({
  node,
  isOpen,
  onClose,
  onUpdateNode,
  onDeleteNode,
}) => {
  const [formLabel, setFormLabel] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formConfig, setFormConfig] = useState<any>({})

  // Synced domain records across CRM (RenGrowCure, Tasks, Calendar, Marketing)
  const [domainRecords, setDomainRecords] = useState<any>({
    campaigns: [],
    dripCampaigns: [],
    contentItems: [],
    socialAccounts: [],
    dealPipelines: [],
    dealStages: [],
    taskPriorities: ['Low', 'Medium', 'High', 'Urgent'],
    calendarMeetingTypes: ['Consultation', 'Sales Demo', 'Follow-up', 'Clinical Review'],
  })

  useEffect(() => {
    WorkflowsService.getMarketingDomainRecords().then(setDomainRecords)
  }, [])

  useEffect(() => {
    if (node) {
      setFormLabel(node.data.label)
      setFormDesc(node.data.description || '')
      setFormConfig({ ...node.data.config })
    }
  }, [node])

  if (!isOpen || !node) return null

  const { data } = node
  const { nodeType, subType, domain, telemetry } = data

  const handleConfigChange = (key: string, value: any) => {
    const updated = { ...formConfig, [key]: value }
    setFormConfig(updated)
    onUpdateNode(node.id, {
      config: updated,
    })
  }

  const handleBasicChange = (newLabel: string, newDesc: string) => {
    setFormLabel(newLabel)
    setFormDesc(newDesc)
    onUpdateNode(node.id, {
      label: newLabel,
      description: newDesc,
    })
  }

  // Condition Rules Management
  const addConditionRule = () => {
    const rules = formConfig.rules ? [...formConfig.rules] : []
    rules.push({ field: 'lead_score', operator: 'greater_than', value: '50' })
    handleConfigChange('rules', rules)
  }

  const updateConditionRule = (index: number, field: string, operator: ConditionOperator, value: string) => {
    const rules = formConfig.rules ? [...formConfig.rules] : []
    rules[index] = { field, operator, value }
    handleConfigChange('rules', rules)
  }

  const removeConditionRule = (index: number) => {
    const rules = formConfig.rules ? [...formConfig.rules] : []
    rules.splice(index, 1)
    handleConfigChange('rules', rules)
  }

  return (
    <div className="absolute top-0 right-0 bottom-0 w-[420px] bg-white border-l border-slate-200/90 shadow-2xl z-30 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <FiSliders className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">Node Inspector</h3>
            <p className="text-[11px] text-slate-500 font-medium capitalize">
              {domain} • {nodeType}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
        >
          <FiX className="h-4 w-4" />
        </button>
      </div>

      {/* Sidebar Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Node Basic Info */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Node Identity & Purpose
          </h4>
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Node Title</label>
            <input
              type="text"
              value={formLabel}
              onChange={(e) => handleBasicChange(e.target.value, formDesc)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Description</label>
            <textarea
              rows={2}
              value={formDesc}
              onChange={(e) => handleBasicChange(formLabel, e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Dynamic CRM Domain Configuration Panel */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Module Parameters & Actions
          </h4>

          {/* RENGROWCURE PIPELINE CONFIG */}
          {domain === 'rengrowcure' && (
            <div className="space-y-3 rounded-xl bg-emerald-50/50 p-4 border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs">
                <FiTrendingUp className="h-4 w-4" />
                <span>RenGrowCure Sales & Pipeline Integration</span>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Target Deal Pipeline
                </label>
                <select
                  value={formConfig.dealPipeline || 'Primary Medical Sales'}
                  onChange={(e) => handleConfigChange('dealPipeline', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Primary Medical Sales">Primary Medical Sales Pipeline</option>
                  <option value="Enterprise Healthcare">Enterprise Healthcare Deal Matrix</option>
                  <option value="Strategic Partners">Strategic Health Partners</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Target Deal Stage
                </label>
                <select
                  value={formConfig.dealStage || 'Qualified Lead'}
                  onChange={(e) => handleConfigChange('dealStage', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="LeadIntel Scored">LeadIntel Scored</option>
                  <option value="Qualified Lead">Qualified Lead</option>
                  <option value="Venture Matrix Active">Venture Matrix Active</option>
                  <option value="Outreach Cadence">Outreach Cadence</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Closed Won">Closed Won</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Assigned Sales Representative (DistroEngine)
                </label>
                <select
                  value={formConfig.assignedRep || 'Round Robin'}
                  onChange={(e) => handleConfigChange('assignedRep', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Round Robin">DistroEngine Round-Robin (Auto Load Balance)</option>
                  <option value="Dr. Sarah Patel">Dr. Sarah Patel (Senior Clinical Lead)</option>
                  <option value="David Kim">David Kim (Enterprise Director)</option>
                  <option value="Elena Rostova">Elena Rostova (Onboarding Specialist)</option>
                </select>
              </div>
            </div>
          )}

          {/* TASK MANAGEMENT CONFIG */}
          {domain === 'tasks' && (
            <div className="space-y-3 rounded-xl bg-violet-50/50 p-4 border border-violet-100">
              <div className="flex items-center gap-2 text-violet-800 font-semibold text-xs">
                <FiCheckSquare className="h-4 w-4" />
                <span>Task Management Automation</span>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Task Title Template</label>
                <input
                  type="text"
                  placeholder="e.g. Schedule clinical assessment demo"
                  value={formConfig.taskTitle || ''}
                  onChange={(e) => handleConfigChange('taskTitle', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-violet-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Priority</label>
                  <select
                    value={formConfig.taskPriority || 'Medium'}
                    onChange={(e) => handleConfigChange('taskPriority', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-violet-500 focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Due Date Offset</label>
                  <select
                    value={formConfig.taskDueDateOffsetDays || 1}
                    onChange={(e) => handleConfigChange('taskDueDateOffsetDays', Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-violet-500 focus:outline-none"
                  >
                    <option value={1}>1 Day (24 hrs)</option>
                    <option value={2}>2 Days</option>
                    <option value={3}>3 Days</option>
                    <option value={7}>1 Week</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* CALENDAR CONFIG */}
          {domain === 'calendar' && (
            <div className="space-y-3 rounded-xl bg-sky-50/50 p-4 border border-sky-100">
              <div className="flex items-center gap-2 text-sky-800 font-semibold text-xs">
                <FiCalendar className="h-4 w-4" />
                <span>Calendar Booking & Schedules</span>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Meeting Title</label>
                <input
                  type="text"
                  placeholder="e.g. Discovery & System Demo"
                  value={formConfig.meetingTitle || ''}
                  onChange={(e) => handleConfigChange('meetingTitle', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Meeting Type</label>
                  <select
                    value={formConfig.meetingType || 'Sales Demo'}
                    onChange={(e) => handleConfigChange('meetingType', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-sky-500 focus:outline-none"
                  >
                    <option value="Consultation">Consultation</option>
                    <option value="Sales Demo">Sales Demo</option>
                    <option value="Follow-up">Follow-up Call</option>
                    <option value="Review">Clinical Review</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Duration</label>
                  <select
                    value={formConfig.meetingDurationMinutes || 30}
                    onChange={(e) => handleConfigChange('meetingDurationMinutes', Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-sky-500 focus:outline-none"
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* MARKETING CAMPAIGNS CONFIG */}
          {domain === 'campaigns' && (
            <div className="space-y-3 rounded-xl bg-emerald-50/50 p-4 border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs">
                <FiSend className="h-4 w-4" />
                <span>Campaigns Hub Live Sync</span>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Select Live Campaign Target
                </label>
                <select
                  value={formConfig.campaignId || ''}
                  onChange={(e) => handleConfigChange('campaignId', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">-- Choose Campaign --</option>
                  {domainRecords.campaigns.map((camp: any) => (
                    <option key={camp.id} value={camp.id}>
                      {camp.name} ({camp.type})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* DRIP SEQUENCES CONFIG */}
          {(domain === 'drip-campaigns' || domain === 'marketing') && (
            <div className="space-y-3 rounded-xl bg-blue-50/50 p-4 border border-blue-100">
              <div className="flex items-center gap-2 text-blue-800 font-semibold text-xs">
                <FiLayers className="h-4 w-4" />
                <span>Drip Campaign Sequences</span>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Target Drip Sequence
                </label>
                <select
                  value={formConfig.dripCampaignId || ''}
                  onChange={(e) => handleConfigChange('dripCampaignId', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">-- Choose Drip Sequence --</option>
                  {domainRecords.dripCampaigns.map((drip: any) => (
                    <option key={drip.id} value={drip.id}>
                      {drip.name} ({drip.channel})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* LOGIC & CONDITIONS BUILDER */}
          {nodeType === 'condition' && (
            <div className="space-y-3 rounded-xl bg-amber-50/60 p-4 border border-amber-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <FiFilter className="h-3.5 w-3.5" />
                  <span>Evaluation Rules (Filter logic)</span>
                </span>
                <button
                  onClick={addConditionRule}
                  className="flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-900"
                >
                  <FiPlus className="h-3 w-3" />
                  Add Rule
                </button>
              </div>

              <div className="space-y-2">
                {(formConfig.rules || []).map((rule: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-amber-100">
                    <input
                      type="text"
                      value={rule.field}
                      onChange={(e) =>
                        updateConditionRule(idx, e.target.value, rule.operator, rule.value)
                      }
                      placeholder="field"
                      className="w-24 text-[11px] font-semibold text-slate-800 border-b border-slate-200 focus:outline-none"
                    />
                    <select
                      value={rule.operator}
                      onChange={(e) =>
                        updateConditionRule(
                          idx,
                          rule.field,
                          e.target.value as ConditionOperator,
                          rule.value
                        )
                      }
                      className="text-[11px] text-slate-600 bg-transparent focus:outline-none"
                    >
                      <option value="greater_than">&gt;</option>
                      <option value="less_than">&lt;</option>
                      <option value="equals">=</option>
                      <option value="contains">contains</option>
                    </select>
                    <input
                      type="text"
                      value={rule.value}
                      onChange={(e) =>
                        updateConditionRule(idx, rule.field, rule.operator, e.target.value)
                      }
                      placeholder="value"
                      className="w-20 text-[11px] font-semibold text-slate-800 border-b border-slate-200 focus:outline-none"
                    />
                    <button
                      onClick={() => removeConditionRule(idx)}
                      className="text-slate-400 hover:text-rose-500 ml-auto"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TELEMETRY READOUT */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Flow Telemetry
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Total Executions</span>
                <span className="text-sm font-bold text-slate-800">
                  {telemetry?.processedCount?.toLocaleString() || 0}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Success Rate</span>
                <span className="text-sm font-bold text-emerald-600">
                  {telemetry?.efficiency || 100}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Footer with Delete Action */}
      <div className="border-t border-slate-100 p-4 bg-slate-50/70 flex items-center justify-between">
        <button
          onClick={() => onDeleteNode(node.id)}
          className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
        >
          <FiTrash2 className="h-4 w-4" />
          <span>Remove Node from Canvas</span>
        </button>
        <button
          onClick={onClose}
          className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
        >
          Done
        </button>
      </div>
    </div>
  )
}
