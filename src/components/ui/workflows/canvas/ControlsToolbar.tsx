'use client'

import React, { useState } from 'react'
import {
  FiZoomIn,
  FiZoomOut,
  FiMaximize2,
  FiSave,
  FiPlus,
  FiPlay,
  FiPause,
  FiSettings,
  FiZap,
  FiFilter,
  FiDatabase,
  FiSend,
  FiLayers,
  FiShare2,
  FiChevronDown,
  FiCheck,
  FiTrendingUp,
  FiCheckSquare,
  FiCalendar,
  FiUsers,
  FiBell,
} from 'react-icons/fi'
import { WorkflowStatus, CRMWorkflowDomain } from '@/src/types/workflows/workflow'

interface ControlsToolbarProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onFitView: () => void
  onSave: () => void
  onOpenSettings: () => void
  onAddNode: (type: 'trigger' | 'condition' | 'action', subType: string, domain: CRMWorkflowDomain) => void
  onToggleStatus: () => void
  status: WorkflowStatus
  isSaving?: boolean
  hasUnsavedChanges?: boolean
}

export const ControlsToolbar: React.FC<ControlsToolbarProps> = ({
  onZoomIn,
  onZoomOut,
  onFitView,
  onSave,
  onOpenSettings,
  onAddNode,
  onToggleStatus,
  status,
  isSaving = false,
  hasUnsavedChanges = false,
}) => {
  const [showAddMenu, setShowAddMenu] = useState(false)

  // Enterprise Omni-CRM Visual Node Palette
  const domainNodeGroups = [
    {
      group: '1. Inbound & Lead Capturing',
      domain: 'leads-capture' as const,
      items: [
        {
          label: 'Inbound Lead Captured',
          type: 'trigger' as const,
          subType: 'Trigger-Lead-Captured',
          icon: FiZap,
          desc: 'Triggered when contact fills a CRM form or ad webhook',
        },
        {
          label: 'Evaluate Qualification & Score',
          type: 'condition' as const,
          subType: 'Logic-Filter-Condition',
          icon: FiFilter,
          desc: 'Filter leads with Score > 50 and persona parameters',
        },
      ],
    },
    {
      group: '2. RenGrowCure (Pipeline & Deals)',
      domain: 'rengrowcure' as const,
      items: [
        {
          label: 'RenGrowCure Deal Stage Changed',
          type: 'trigger' as const,
          subType: 'Trigger-RenGrowCure-Deal-Stage',
          icon: FiTrendingUp,
          desc: 'Triggered when deal advances or changes stage in Venture Matrix',
        },
        {
          label: 'Assign to DistroEngine',
          type: 'action' as const,
          subType: 'Action-RenGrowCure-Assign-Distro',
          icon: FiTrendingUp,
          desc: 'Auto-route qualified lead into sales distro round-robin',
        },
        {
          label: 'Move RenGrowCure Deal Stage',
          type: 'action' as const,
          subType: 'Action-RenGrowCure-Move-Stage',
          icon: FiTrendingUp,
          desc: 'Advance deal to Proposal, Demo, or Won status',
        },
        {
          label: 'Enroll in Outreach Sequence',
          type: 'action' as const,
          subType: 'Action-RenGrowCure-Enroll-Sequence',
          icon: FiTrendingUp,
          desc: 'Add contact to RenGrowCure outreach multi-touch cadences',
        },
      ],
    },
    {
      group: '3. Task Management Automation',
      domain: 'tasks' as const,
      items: [
        {
          label: 'Create Task in Workstation',
          type: 'action' as const,
          subType: 'Action-Create-Task',
          icon: FiCheckSquare,
          desc: 'Auto-assign tasks to reps with priority and due date',
        },
        {
          label: 'Task Status Completed Trigger',
          type: 'trigger' as const,
          subType: 'Trigger-Task-Completed',
          icon: FiCheckSquare,
          desc: 'Fires when assigned rep marks task as complete',
        },
        {
          label: 'Task Due Date Approaching',
          type: 'trigger' as const,
          subType: 'Trigger-Task-Due-Date-Approaching',
          icon: FiCheckSquare,
          desc: 'Fires 24h before task deadline to trigger alerts',
        },
      ],
    },
    {
      group: '4. Calendar Scheduling',
      domain: 'calendar' as const,
      items: [
        {
          label: 'Schedule Calendar Meeting',
          type: 'action' as const,
          subType: 'Action-Schedule-Calendar-Meeting',
          icon: FiCalendar,
          desc: 'Auto-book consultation, sales demo or follow-up call',
        },
        {
          label: 'Calendar Event Booked Trigger',
          type: 'trigger' as const,
          subType: 'Trigger-Calendar-Event-Scheduled',
          icon: FiCalendar,
          desc: 'Fires when prospect or rep reserves an appointment slot',
        },
      ],
    },
    {
      group: '5. Marketing & Drip Campaigns',
      domain: 'marketing' as const,
      items: [
        {
          label: 'Enroll in Drip Sequence',
          type: 'action' as const,
          subType: 'Action-Enroll-Drip-Campaign',
          icon: FiLayers,
          desc: 'Start automated educational nurture sequence',
        },
        {
          label: 'Trigger Campaign Blast',
          type: 'action' as const,
          subType: 'Action-Trigger-Campaign-Blast',
          icon: FiSend,
          desc: 'Execute scheduled campaign blast (Email, SMS)',
        },
        {
          label: 'Publish Content Engine Post',
          type: 'action' as const,
          subType: 'Action-Publish-Content-Engine',
          icon: FiShare2,
          desc: 'Syndicate post caption & media across social networks',
        },
      ],
    },
    {
      group: '6. Global CRM & Notifications',
      domain: 'global-crm' as const,
      items: [
        {
          label: 'Sync to Parent Global CRM Engine',
          type: 'action' as const,
          subType: 'Action-Sync-Global-CRM',
          icon: FiDatabase,
          desc: 'Bridge telemetry and dispatch updates to core CRM pipeline',
        },
        {
          label: 'Notify Team Member',
          type: 'action' as const,
          subType: 'Action-Notify-Team-Member',
          icon: FiBell,
          desc: 'Send in-app notification or slack/email webhook to team',
        },
      ],
    },
  ]

  return (
    <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
      {/* Left controls: Add Node Palette Button */}
      <div className="pointer-events-auto relative">
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 active:scale-95"
        >
          <FiPlus className="h-4 w-4" />
          <span>Add CRM Node</span>
          <FiChevronDown className="h-3 w-3" />
        </button>

        {/* Dropdown Menu of Nodes */}
        {showAddMenu && (
          <div className="absolute top-12 left-0 w-80 max-h-[75vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl z-50 divide-y divide-slate-100">
            {domainNodeGroups.map((group) => (
              <div key={group.group} className="py-2 first:pt-0 last:pb-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 block mb-1.5">
                  {group.group}
                </span>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const ItemIcon = item.icon
                    return (
                      <button
                        key={item.subType}
                        onClick={() => {
                          onAddNode(item.type, item.subType, group.domain)
                          setShowAddMenu(false)
                        }}
                        className="flex w-full items-start gap-2.5 rounded-xl p-2 text-left transition-colors hover:bg-slate-50 group"
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <ItemIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800 leading-tight">
                            {item.label}
                          </div>
                          <div className="text-[10px] text-slate-400 leading-snug line-clamp-1">
                            {item.desc}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Center status pill */}
      <div className="pointer-events-auto flex items-center gap-2 rounded-xl bg-white/90 backdrop-blur-md px-3 py-1.5 border border-slate-200/80 shadow-md">
        <button
          onClick={onToggleStatus}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
            status === 'Active'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
              : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
          }`}
        >
          {status === 'Active' ? (
            <>
              <FiPlay className="h-3 w-3 fill-emerald-600" />
              <span>Status: Active</span>
            </>
          ) : (
            <>
              <FiPause className="h-3 w-3 fill-amber-600" />
              <span>Status: Draft / Paused</span>
            </>
          )}
        </button>

        {hasUnsavedChanges && (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Unsaved Changes
          </span>
        )}
      </div>

      {/* Right controls: Zoom, Settings, Save */}
      <div className="pointer-events-auto flex items-center gap-2">
        <div className="flex items-center rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 p-1 shadow-md">
          <button
            onClick={onZoomIn}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Zoom In"
          >
            <FiZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={onZoomOut}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Zoom Out"
          >
            <FiZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={onFitView}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Fit View"
          >
            <FiMaximize2 className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 px-3 py-2 text-xs font-semibold text-slate-700 shadow-md hover:bg-slate-50 transition-colors"
        >
          <FiSettings className="h-3.5 w-3.5 text-slate-500" />
          <span>Config</span>
        </button>

        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-lg transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50"
        >
          <FiSave className="h-3.5 w-3.5" />
          <span>{isSaving ? 'Saving...' : 'Save Flow'}</span>
        </button>
      </div>
    </div>
  )
}
