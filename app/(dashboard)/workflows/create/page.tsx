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
  FiTrendingUp,
  FiCheckSquare,
  FiCalendar,
} from 'react-icons/fi'
import { WorkflowsService } from '@/src/services/workflowsService'
import { WorkflowGraph, WorkflowNode, WorkflowEdge, CRMWorkflowDomain } from '@/src/types/workflows/workflow'

export default function CreateCRMWorkflowPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [triggerType, setTriggerType] = useState('Trigger-Lead-Captured')
  const [targetDomain, setTargetDomain] = useState<CRMWorkflowDomain>('global-crm')
  const [templatePreset, setTemplatePreset] = useState<'omnicrm' | 'rengrowcure' | 'tasks' | 'marketing' | 'blank'>('omnicrm')
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
          domain: targetDomain,
          description: 'Initial entry point for unified workflow automation',
          config: {},
          telemetry: { processedCount: 0, successCount: 0, failureCount: 0, efficiency: 100 },
        },
      }
      return { nodes: [initialNode], edges: [] }
    }

    if (preset === 'rengrowcure') {
      const nodes: WorkflowNode[] = [
        {
          id: 'n-rg-trigger',
          type: 'trigger',
          position: { x: 80, y: 150 },
          data: {
            label: 'RenGrowCure Deal Stage Qualified',
            nodeType: 'trigger',
            subType: 'Trigger-RenGrowCure-Deal-Stage',
            domain: 'rengrowcure',
            description: 'Fires when prospect advances in Venture Matrix',
            config: { dealStage: 'Qualified Lead' },
            telemetry: { processedCount: 240, successCount: 240, failureCount: 0, efficiency: 100 },
          },
        },
        {
          id: 'n-rg-task',
          type: 'action',
          position: { x: 440, y: 150 },
          data: {
            label: 'Dispatch Priority Task to Rep',
            nodeType: 'action',
            subType: 'Action-Create-Task',
            domain: 'tasks',
            description: 'Creates task in Task Management Workstation',
            config: { taskTitle: 'Review Venture Matrix proposal', taskPriority: 'High' },
            telemetry: { processedCount: 240, successCount: 238, failureCount: 2, efficiency: 99 },
          },
        },
        {
          id: 'n-rg-cal',
          type: 'action',
          position: { x: 800, y: 150 },
          data: {
            label: 'Book Calendar Discovery Slot',
            nodeType: 'action',
            subType: 'Action-Schedule-Calendar-Meeting',
            domain: 'calendar',
            description: 'Reserves 30m consultation on rep calendar',
            config: { meetingTitle: 'Executive Solution Demo', meetingDurationMinutes: 30 },
            telemetry: { processedCount: 238, successCount: 238, failureCount: 0, efficiency: 100 },
          },
        },
      ]
      const edges: WorkflowEdge[] = [
        { id: 'e1', source: 'n-rg-trigger', target: 'n-rg-task', type: 'smoothstep', animated: true },
        { id: 'e2', source: 'n-rg-task', target: 'n-rg-cal', type: 'smoothstep', animated: true },
      ]
      return { nodes, edges }
    }

    if (preset === 'tasks') {
      const nodes: WorkflowNode[] = [
        {
          id: 'n-task-trigger',
          type: 'trigger',
          position: { x: 80, y: 150 },
          data: {
            label: 'Task Due Date Alert (24h)',
            nodeType: 'trigger',
            subType: 'Trigger-Task-Due-Date-Approaching',
            domain: 'tasks',
            description: 'Fires when task deadline is under 24 hours',
            config: { taskDueDateOffsetDays: 1 },
            telemetry: { processedCount: 150, successCount: 150, failureCount: 0, efficiency: 100 },
          },
        },
        {
          id: 'n-task-cal',
          type: 'action',
          position: { x: 440, y: 150 },
          data: {
            label: 'Sync Buffer Slot to Calendar',
            nodeType: 'action',
            subType: 'Action-Schedule-Calendar-Meeting',
            domain: 'calendar',
            description: 'Holds time on rep calendar to wrap up deliverables',
            config: { meetingTitle: 'Focus Block: Deliverable Wrap-up', meetingDurationMinutes: 45 },
            telemetry: { processedCount: 150, successCount: 149, failureCount: 1, efficiency: 99 },
          },
        },
      ]
      const edges: WorkflowEdge[] = [
        { id: 'e1', source: 'n-task-trigger', target: 'n-task-cal', type: 'smoothstep', animated: true },
      ]
      return { nodes, edges }
    }

    // Default omnicrm graph
    return WorkflowsService.createWorkflow
      ? (require('@/src/services/workflowsService').createDefaultCRMGraph())
      : { nodes: [], edges: [] }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      setIsSubmitting(true)
      const graph = buildInitialGraph(templatePreset)

      const created = await WorkflowsService.createWorkflow({
        workflow_name: name,
        description: description || 'Multi-module unified CRM automation pipeline',
        trigger_type: triggerType,
        action_type:
          templatePreset === 'rengrowcure'
            ? 'Action-RenGrowCure-Assign-Distro'
            : templatePreset === 'tasks'
            ? 'Action-Create-Task'
            : 'Action-Sync-Global-CRM',
        domain: targetDomain,
        graph,
      })

      router.push(`/workflows/${created._id}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6 max-w-4xl mx-auto">
      {/* Top Navigation */}
      <div>
        <Link
          href="/workflows"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-2"
        >
          <FiArrowLeft className="h-4 w-4" />
          <span>Back to All Workflows</span>
        </Link>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Create CRM Automation Workflow
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Design visual pipelines that coordinate tasks, RenGrowCure deals, calendar bookings, and marketing signals.
        </p>
      </div>

      <form onSubmit={handleCreate} className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            1. Workflow Identity
          </h2>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Workflow Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. RenGrowCure High-Score Lead to Calendar Demo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Description</label>
            <textarea
              rows={2}
              placeholder="Describe what CRM actions this workflow automates..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Primary CRM Domain
              </label>
              <select
                value={targetDomain}
                onChange={(e) => setTargetDomain(e.target.value as CRMWorkflowDomain)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="global-crm">Omni-CRM (Cross-System Bridge)</option>
                <option value="rengrowcure">RenGrowCure (Pipeline & Leads)</option>
                <option value="tasks">Task Management</option>
                <option value="calendar">Calendar Schedules</option>
                <option value="marketing">Marketing Campaigns</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Initial Trigger Event
              </label>
              <select
                value={triggerType}
                onChange={(e) => setTriggerType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="Trigger-Lead-Captured">Inbound Lead Captured</option>
                <option value="Trigger-RenGrowCure-Deal-Stage">RenGrowCure Deal Stage Changed</option>
                <option value="Trigger-Task-Completed">Task Marked Complete</option>
                <option value="Trigger-Task-Due-Date-Approaching">Task Deadline Approaching</option>
                <option value="Trigger-Calendar-Event-Scheduled">Calendar Booking Confirmed</option>
                <option value="Trigger-Campaign-Event">Marketing Blast Opened / Clicked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Template Presets */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            2. Choose Blueprint Preset
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                id: 'omnicrm',
                title: 'Full Omni-CRM Autopilot',
                desc: 'Pre-wires Marketing leads -> RenGrowCure Distro -> Task Workstation -> Calendar Demo.',
                badge: 'Recommended',
                icon: FiDatabase,
              },
              {
                id: 'rengrowcure',
                title: 'RenGrowCure Deal Velocity',
                desc: 'When deal qualifies in Venture Matrix, creates urgent task and schedules calendar review.',
                badge: 'RenGrowCure',
                icon: FiTrendingUp,
              },
              {
                id: 'tasks',
                title: 'Task & Calendar Sync',
                desc: 'Automates deadline reminders and synchronizes work blocks directly onto the CRM calendar.',
                badge: 'Tasks & Cal',
                icon: FiCheckSquare,
              },
              {
                id: 'blank',
                title: 'Blank Visual Flow',
                desc: 'Start with a clean canvas and drag-and-drop triggers, conditions, and actions manually.',
                badge: 'Advanced',
                icon: FiZap,
              },
            ].map((preset) => {
              const Icon = preset.icon
              const isSelected = templatePreset === preset.id
              return (
                <div
                  key={preset.id}
                  onClick={() => setTemplatePreset(preset.id as any)}
                  className={`group relative flex flex-col justify-between rounded-xl border p-4 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 shadow-md ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-xs border border-slate-200 text-blue-600">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                        {preset.badge}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">{preset.title}</h3>
                    <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">{preset.desc}</p>
                  </div>

                  <div className="mt-3 flex items-center justify-end">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <FiCheck className="h-3 w-3" />}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/workflows"
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 active:scale-95 disabled:opacity-50"
          >
            <FiZap className="h-4 w-4" />
            <span>{isSubmitting ? 'Configuring Canvas...' : 'Launch Workflow Canvas'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
