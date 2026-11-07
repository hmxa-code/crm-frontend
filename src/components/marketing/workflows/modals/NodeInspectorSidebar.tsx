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
} from 'react-icons/fi'
import { WorkflowNode, ConditionOperator } from '@/src/types/marketing/workflow'
import { WorkflowsService } from '@/src/services/marketing/WorkflowsService'

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

  // Synced domain records from campaigns, drip, content-engine, social-accounts
  const [domainRecords, setDomainRecords] = useState<{
    campaigns: any[]
    dripCampaigns: any[]
    contentItems: any[]
    socialAccounts: any[]
  }>({
    campaigns: [],
    dripCampaigns: [],
    contentItems: [],
    socialAccounts: [],
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
    <div className="fixed inset-y-0 right-0 z-40 w-[26rem] bg-white border-l border-slate-200 shadow-2xl flex flex-col transform transition-transform duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
            <FiSliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Node Inspector ({domain})
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              Type: {subType}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>

      {/* Body content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs text-slate-700">
        {/* Core Node Title & Description */}
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Step Title
            </label>
            <input
              type="text"
              value={formLabel}
              onChange={(e) => handleBasicChange(e.target.value, formDesc)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={formDesc}
              onChange={(e) => handleBasicChange(formLabel, e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>
        </div>

        {/* DOMAIN SPECIFIC INTEGRATION CONFIGURATION */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
              {domain.replace('-', ' ')} Parameters
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
              Live Sync
            </span>
          </div>

          {/* DRIP CAMPAIGN SETTINGS */}
          {domain === 'drip-campaigns' && (
            <div className="space-y-3 bg-blue-50/30 p-3 rounded-xl border border-blue-100">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Drip Campaign</label>
                <select
                  value={formConfig.dripCampaignId || 'drip_nutrition_food'}
                  onChange={(e) => handleConfigChange('dripCampaignId', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                >
                  {domainRecords.dripCampaigns.map((dc) => (
                    <option key={dc._id} value={dc._id}>
                      {dc.title} ({dc.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Persona</label>
                <input
                  type="text"
                  value={formConfig.targetPersona || 'Clinic Nutrition Buyers'}
                  onChange={(e) => handleConfigChange('targetPersona', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Sequence Delay (Hours)</label>
                <input
                  type="number"
                  min={0}
                  value={formConfig.delayHours ?? 0}
                  onChange={(e) => handleConfigChange('delayHours', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>
          )}

          {/* CAMPAIGNS SETTINGS */}
          {domain === 'campaigns' && (
            <div className="space-y-3 bg-emerald-50/30 p-3 rounded-xl border border-emerald-100">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Associated Campaign</label>
                <select
                  value={formConfig.campaignId || 'cmp_101'}
                  onChange={(e) => {
                    const selected = domainRecords.campaigns.find((c) => c._id === e.target.value)
                    handleConfigChange('campaignId', e.target.value)
                    if (selected) {
                      handleConfigChange('campaignName', selected.campaign_name)
                      handleConfigChange('campaignChannel', selected.campaign_type)
                    }
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                >
                  {domainRecords.campaigns.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.campaign_name} ({c.campaign_type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Channel Type</label>
                <select
                  value={formConfig.campaignChannel || 'Email'}
                  onChange={(e) => handleConfigChange('campaignChannel', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Email">Email</option>
                  <option value="SMS">SMS</option>
                  <option value="Social">Social</option>
                  <option value="Multi-Channel">Multi-Channel</option>
                </select>
              </div>
            </div>
          )}

          {/* CONTENT ENGINE & SOCIAL ACCOUNTS */}
          {(domain === 'content-engine' || domain === 'social-accounts') && (
            <div className="space-y-3 bg-violet-50/30 p-3 rounded-xl border border-violet-100">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Social Platform</label>
                <select
                  value={formConfig.socialPlatform || 'LinkedIn'}
                  onChange={(e) => handleConfigChange('socialPlatform', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                >
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Twitter">Twitter / X</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Post Caption</label>
                <textarea
                  rows={2}
                  value={formConfig.caption || ''}
                  onChange={(e) => handleConfigChange('caption', e.target.value)}
                  placeholder="Automated post copy with dynamic variables..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Sync With Social Account</label>
                <select
                  value={formConfig.socialAccountId || 'acc_linkedin_03'}
                  onChange={(e) => handleConfigChange('socialAccountId', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                >
                  {domainRecords.socialAccounts.map((acc) => (
                    <option key={acc._id} value={acc._id}>
                      {acc.account_name} ({acc.platform})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* GLOBAL CRM SETTINGS */}
          {domain === 'global-crm' && (
            <div className="space-y-3 bg-purple-50/30 p-3 rounded-xl border border-purple-100">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Global CRM Event Identifier</label>
                <input
                  type="text"
                  value={formConfig.globalEventName || 'crm.automation.assign_rep'}
                  onChange={(e) => handleConfigChange('globalEventName', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">CRM Lead Pipeline Stage</label>
                <select
                  value={formConfig.leadStatusToSet || 'Sales Qualified Lead'}
                  onChange={(e) => handleConfigChange('leadStatusToSet', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Marketing Qualified Lead">Marketing Qualified Lead (MQL)</option>
                  <option value="Sales Qualified Lead">Sales Qualified Lead (SQL)</option>
                  <option value="Opportunity">Opportunity</option>
                  <option value="Customer">Customer</option>
                </select>
              </div>
            </div>
          )}

          {/* LOGIC & CONDITIONS */}
          {nodeType === 'condition' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-semibold">Rules Evaluator</span>
                <button
                  type="button"
                  onClick={addConditionRule}
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold text-xs"
                >
                  <FiPlus className="w-3.5 h-3.5" />
                  Add Rule
                </button>
              </div>

              {(formConfig.rules || []).map((rule: any, idx: number) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2 relative"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={rule.field}
                      onChange={(e) =>
                        updateConditionRule(idx, e.target.value, rule.operator, rule.value)
                      }
                      placeholder="field (e.g. lead_score)"
                      className="flex-1 px-2 py-1.5 bg-white border border-slate-200 rounded text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => removeConditionRule(idx)}
                      className="p-1 text-rose-500 hover:text-rose-700"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
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
                      className="px-2 py-1.5 bg-white border border-slate-200 rounded text-xs"
                    >
                      <option value="greater_than">&gt; Greater than</option>
                      <option value="less_than">&lt; Less than</option>
                      <option value="equals">= Equals</option>
                      <option value="not_equals">!= Not equals</option>
                      <option value="contains">Contains</option>
                      <option value="is_set">Is Set</option>
                    </select>
                    <input
                      type="text"
                      value={rule.value}
                      onChange={(e) =>
                        updateConditionRule(idx, rule.field, rule.operator, e.target.value)
                      }
                      placeholder="Value"
                      className="px-2 py-1.5 bg-white border border-slate-200 rounded text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live System Telemetry Strip (Read-Only) */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
              System Telemetry
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              <FiInfo className="w-3 h-3" /> System Calculated
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <p className="text-[10px] text-slate-500">Processed</p>
              <p className="text-base font-bold text-slate-800">
                {telemetry?.processedCount?.toLocaleString() ?? 0}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500">Efficiency</p>
              <p className="text-base font-bold text-emerald-600">
                {telemetry?.efficiency ?? 100}%
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500">Success Executions</p>
              <p className="text-xs font-semibold text-emerald-600">
                {telemetry?.successCount?.toLocaleString() ?? 0}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500">Failed Records</p>
              <p className="text-xs font-semibold text-rose-500">
                {telemetry?.failureCount?.toLocaleString() ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <button
          onClick={() => {
            onDeleteNode(node.id)
            onClose()
          }}
          className="flex items-center gap-1.5 px-3 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-medium transition-colors"
        >
          <FiTrash2 className="w-4 h-4" />
          <span>Delete Step</span>
        </button>

        <button
          onClick={onClose}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  )
}
