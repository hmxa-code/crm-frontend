'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  FiArrowLeft,
  FiZap,
  FiSend,
  FiLayers,
  FiShare2,
  FiDatabase,
  FiCheck,
} from 'react-icons/fi'
import { WorkflowsService } from '@/src/services/marketing/WorkflowsService'
import { WorkflowGraph, WorkflowNode, WorkflowEdge } from '@/src/types/marketing/workflow'

export default function CreateMarketingWorkflowPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [triggerType, setTriggerType] = useState('Trigger-Lead-Captured')
  const [templatePreset, setTemplatePreset] = useState<'omnichannel' | 'drip' | 'social' | 'blank'>('omnichannel')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const buildInitialGraph = (preset: string): WorkflowGraph => {
    if (preset === 'blank') {
      const initialNode: WorkflowNode = {
        id: 'node-trigger-1',
        type: 'trigger',
        position: { x: 120, y: 150 },
        data: {
          label: 'Trigger Step',
          nodeType: 'trigger',
          subType: triggerType,
          domain: 'leads-capture',
          description: 'Initial entry point for workflow automation',
          config: {},
          telemetry: { processedCount: 0, successCount: 0, failureCount: 0, efficiency: 100 },
        },
      }
      return { nodes: [initialNode], edges: [] }
    }

    if (preset === 'social') {
      const nodes: WorkflowNode[] = [
        {
          id: 'n-camp',
          type: 'trigger',
          position: { x: 80, y: 150 },
          data: {
            label: 'Campaign Launched Event',
            nodeType: 'trigger',
            subType: 'Trigger-Campaign-Event',
            domain: 'campaigns',
            description: 'Triggered when a new marketing campaign transitions to Active',
            config: { campaignId: 'cmp_101', campaignChannel: 'Multi-Channel' },
            telemetry: { processedCount: 0, successCount: 0, failureCount: 0, efficiency: 100 },
          },
        },
        {
          id: 'n-content',
          type: 'action',
          position: { x: 440, y: 150 },
          data: {
            label: 'Syndicate via Content Engine',
            nodeType: 'action',
            subType: 'Action-Publish-Content-Engine',
            domain: 'content-engine',
            description: 'Post media to LinkedIn and Facebook accounts',
            config: { socialPlatform: 'LinkedIn', socialAccountId: 'acc_linkedin_03' },
            telemetry: { processedCount: 0, successCount: 0, failureCount: 0, efficiency: 100 },
          },
        },
        {
          id: 'n-crm',
          type: 'action',
          position: { x: 800, y: 150 },
          data: {
            label: 'Sync Social Engagement to CRM',
            nodeType: 'action',
            subType: 'Action-Sync-Global-CRM',
            domain: 'global-crm',
            description: 'Log social reach and interaction metrics in CRM timeline',
            config: { globalEventName: 'crm.campaign.social_sync' },
            telemetry: { processedCount: 0, successCount: 0, failureCount: 0, efficiency: 100 },
          },
        },
      ]

      const edges: WorkflowEdge[] = [
        { id: 'e1', source: 'n-camp', target: 'n-content', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
        { id: 'e2', source: 'n-content', target: 'n-crm', type: 'smoothstep', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
      ]
      return { nodes, edges }
    }

    // Default Omnichannel Pipeline Preset
    return {
      nodes: [
        {
          id: 'node-trigger-lead',
          type: 'trigger',
          position: { x: 80, y: 140 },
          data: {
            label: 'Inbound Lead Capturing',
            nodeType: 'trigger',
            subType: 'Trigger-Lead-Captured',
            domain: 'leads-capture',
            description: 'New high-intent lead lands via Marketing Form or Ad Campaign',
            config: { globalEventName: 'crm.lead.inbound_captured' },
            telemetry: { processedCount: 0, successCount: 0, failureCount: 0, efficiency: 100 },
          },
        },
        {
          id: 'node-condition-score',
          type: 'condition',
          position: { x: 420, y: 140 },
          data: {
            label: 'Lead Score & Persona Filter',
            nodeType: 'condition',
            subType: 'Logic-Filter-Condition',
            domain: 'leads-capture',
            description: 'Checks if lead score > 50',
            config: { rules: [{ field: 'lead_score', operator: 'greater_than', value: '50' }] },
            telemetry: { processedCount: 0, successCount: 0, failureCount: 0, efficiency: 100 },
          },
        },
        {
          id: 'node-action-drip',
          type: 'action',
          position: { x: 780, y: 60 },
          data: {
            label: 'Enroll in Drip Campaign Sequence',
            nodeType: 'action',
            subType: 'Action-Enroll-Drip-Campaign',
            domain: 'drip-campaigns',
            description: 'Triggers multi-touch "Nutrition Food Sequence"',
            config: { dripCampaignId: 'drip_nutrition_food', targetPersona: 'Clinic Nutrition Buyers' },
            telemetry: { processedCount: 0, successCount: 0, failureCount: 0, efficiency: 100 },
          },
        },
        {
          id: 'node-action-crm',
          type: 'action',
          position: { x: 1140, y: 140 },
          data: {
            label: 'Sync to Parent Global CRM Engine',
            nodeType: 'action',
            subType: 'Action-Sync-Global-CRM',
            domain: 'global-crm',
            description: 'Dispatches qualified lead status update to central CRM pipeline',
            config: { globalEventName: 'crm.automation.assign_rep', leadStatusToSet: 'Sales Qualified Lead' },
            telemetry: { processedCount: 0, successCount: 0, failureCount: 0, efficiency: 100 },
          },
        },
      ],
      edges: [
        { id: 'e1', source: 'node-trigger-lead', target: 'node-condition-score', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
        { id: 'e2', source: 'node-condition-score', sourceHandle: 'true', target: 'node-action-drip', type: 'smoothstep', label: 'Score > 50', style: { stroke: '#10b981', strokeWidth: 2 } },
        { id: 'e3', source: 'node-action-drip', target: 'node-action-crm', type: 'smoothstep', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
      ],
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      const graph = buildInitialGraph(templatePreset)
      const created = await WorkflowsService.createWorkflow({
        workflow_name: name,
        description,
        trigger_type: triggerType,
        action_type: 'Action-Sync-Global-CRM',
        graph,
      })

      router.push(`/marketing/workflows/${created._id}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 select-none">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/marketing/workflows"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Workflows Hub</span>
        </Link>

        <div className="mb-6">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 rounded-md">
              Visual Canvas Setup
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">n8n Orchestration Architecture</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Create Marketing Automation Flow</h1>
          <p className="text-xs text-slate-500 mt-1">
            Connect live Marketing Campaigns, Drip Sequences, Content Engine, and Social Accounts into an automated visual flow.
          </p>
        </div>

        <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Workflow Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Inbound Nutrition Lead Nurture & Multi-Channel Sync"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the multi-channel marketing flow and Global CRM handoff..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Entry Trigger Category
            </label>
            <select
              value={triggerType}
              onChange={(e) => setTriggerType(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="Trigger-Lead-Captured">Inbound Lead Captured (Web form or landing page)</option>
              <option value="Trigger-Campaign-Event">Campaign Launched / Threshold Reached</option>
              <option value="Trigger-Drip-Step">Drip Sequence Step Completed / Clicked</option>
              <option value="Trigger-Social-Engagement">Social Account Engagement (DM, comment, mention)</option>
              <option value="Trigger-Global-CRM">Global CRM Event Trigger Bridge</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Canvas Starter Architecture
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  id: 'omnichannel' as const,
                  title: 'Omnichannel & Drip',
                  desc: 'Inbound lead + Score Condition + Drip Sequence + Global CRM sync.',
                  icon: FiLayers,
                },
                {
                  id: 'social' as const,
                  title: 'Campaign & Social',
                  desc: 'Campaign event + Content Engine syndication + Social account blast.',
                  icon: FiShare2,
                },
                {
                  id: 'blank' as const,
                  title: 'Blank Canvas',
                  desc: 'Start with an empty canvas and build node connections freely.',
                  icon: FiZap,
                },
              ].map((tpl) => {
                const Icon = tpl.icon
                const selected = templatePreset === tpl.id
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setTemplatePreset(tpl.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selected
                        ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-500 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-1.5 rounded-lg ${selected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {selected && <FiCheck className="w-4 h-4 text-blue-600" />}
                    </div>
                    <p className="text-xs font-bold text-slate-900">{tpl.title}</p>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{tpl.desc}</p>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              href="/marketing/workflows"
              className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-medium transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-md transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Opening Canvas Sheet...' : 'Launch n8n Flow Canvas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
