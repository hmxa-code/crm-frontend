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
} from 'react-icons/fi'
import { WorkflowStatus, MarketingIntegrationDomain } from '@/src/types/marketing/workflow'

interface ControlsToolbarProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onFitView: () => void
  onSave: () => void
  onOpenSettings: () => void
  onAddNode: (type: 'trigger' | 'condition' | 'action', subType: string, domain: MarketingIntegrationDomain) => void
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
          desc: 'Triggered when contact fills a marketing form or webhook',
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
      group: '2. Drip Campaigns Integration',
      domain: 'drip-campaigns' as const,
      items: [
        {
          label: 'Enroll in Drip Campaign Sequence',
          type: 'action' as const,
          subType: 'Action-Enroll-Drip-Campaign',
          icon: FiLayers,
          desc: 'Start automated educational sequence (e.g. Nutrition Food)',
        },
        {
          label: 'Drip Sequence Step Trigger',
          type: 'trigger' as const,
          subType: 'Trigger-Drip-Step',
          icon: FiLayers,
          desc: 'Fires when a contact completes or clicks a drip step',
        },
        {
          label: 'Pause / Terminate Drip Sequence',
          type: 'action' as const,
          subType: 'Action-Pause-Drip-Campaign',
          icon: FiLayers,
          desc: 'Halt sequence if lead reaches positive sales qualification',
        },
      ],
    },
    {
      group: '3. Campaigns & Mass Outreach',
      domain: 'campaigns' as const,
      items: [
        {
          label: 'Trigger Campaign Blast',
          type: 'action' as const,
          subType: 'Action-Trigger-Campaign-Blast',
          icon: FiSend,
          desc: 'Execute scheduled campaign (Email, SMS, or Multi-Channel)',
        },
        {
          label: 'Campaign Delivery & Reply Event',
          type: 'trigger' as const,
          subType: 'Trigger-Campaign-Event',
          icon: FiSend,
          desc: 'Listen for high open or click rate threshold triggers',
        },
      ],
    },
    {
      group: '4. Content Engine & Social Accounts',
      domain: 'content-engine' as const,
      items: [
        {
          label: 'Publish Content Engine Post',
          type: 'action' as const,
          subType: 'Action-Publish-Content-Engine',
          icon: FiShare2,
          desc: 'Syndicate post caption & media across social platforms',
        },
        {
          label: 'Social Account Engagement Trigger',
          type: 'trigger' as const,
          subType: 'Trigger-Social-Engagement',
          icon: FiShare2,
          desc: 'Fires on inbound comments, DM leads, or hashtag mentions',
        },
      ],
    },
    {
      group: '5. Global CRM Bridge',
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
          label: 'Listen to Global CRM Event',
          type: 'trigger' as const,
          subType: 'Trigger-Global-CRM',
          icon: FiDatabase,
          desc: 'Fires when CRM updates account tier or assigns a sales rep',
        },
      ],
    },
  ]

  return (
    <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
      {/* Left Canvas Navigation Controls */}
      <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-1.5 shadow-md pointer-events-auto">
        <button
          onClick={onZoomIn}
          title="Zoom In"
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
        >
          <FiZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={onZoomOut}
          title="Zoom Out"
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
        >
          <FiZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={onFitView}
          title="Fit Canvas"
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
        >
          <FiMaximize2 className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-slate-200 mx-1" />

        {/* Add Node Menu */}
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <FiPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Integration Node</span>
            <FiChevronDown className="w-3.5 h-3.5 opacity-80" />
          </button>

          {showAddMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowAddMenu(false)} />
              <div className="absolute left-0 mt-2.5 w-[26rem] bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-3 max-h-[32rem] overflow-y-auto">
                <div className="p-2.5 border-b border-slate-100 mb-2">
                  <h4 className="text-xs font-bold text-slate-900">Marketing Integration Library</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Click any node to append it to the visual canvas
                  </p>
                </div>

                {domainNodeGroups.map((group) => (
                  <div key={group.group} className="mb-3.5 last:mb-0">
                    <p className="px-2 py-1 text-[10px] font-black tracking-wider text-slate-400 uppercase">
                      {group.group}
                    </p>
                    <div className="space-y-1 mt-1">
                      {group.items.map((item) => {
                        const Icon = item.icon
                        return (
                          <button
                            key={item.subType}
                            onClick={() => {
                              onAddNode(item.type, item.subType, group.domain)
                              setShowAddMenu(false)
                            }}
                            className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50/60 hover:border-blue-200 transition-all flex items-start gap-3 group border border-slate-100 cursor-pointer"
                          >
                            <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0 mt-0.5">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-800 group-hover:text-blue-700 truncate">
                                {item.label}
                              </p>
                              <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Canvas Save & Configuration Controls */}
      <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-1.5 shadow-md pointer-events-auto">
        <button
          onClick={onOpenSettings}
          title="Workflow Settings"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 cursor-pointer"
        >
          <FiSettings className="w-3.5 h-3.5 text-slate-500" />
          <span>Config</span>
        </button>

        <button
          onClick={onToggleStatus}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-colors border cursor-pointer ${
            status === 'Active'
              ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
          }`}
        >
          {status === 'Active' ? (
            <>
              <FiPause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <FiPlay className="w-3.5 h-3.5" />
              <span>Activate</span>
            </>
          )}
        </button>

        <button
          onClick={onSave}
          disabled={isSaving}
          className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            hasUnsavedChanges
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md animate-pulse'
              : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs'
          } ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <FiSave className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save Changes *' : 'Saved'}</span>
        </button>
      </div>
    </div>
  )
}
