'use client'

import React, { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import {
  FiZap,
  FiMail,
  FiFilter,
  FiShare2,
  FiDatabase,
  FiLayers,
  FiSend,
  FiSettings,
  FiTrash2,
  FiCopy,
  FiCheckCircle,
  FiClock,
  FiCalendar,
  FiCheckSquare,
  FiTrendingUp,
  FiUsers,
  FiAward,
} from 'react-icons/fi'
import { CRMNodeData } from '@/src/types/workflows/workflow'

// n8n / GoHighLevel styled node visual themes across entire CRM
const getNodeVisualScheme = (domain: string, nodeType: string) => {
  if (nodeType === 'condition') {
    return {
      domainLabel: 'LOGIC FILTER',
      icon: FiFilter,
      headerBg: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
      accentColor: '#f59e0b',
      tagColor: 'bg-amber-50 text-amber-700 border-amber-200',
      glow: 'shadow-amber-500/10',
    }
  }

  switch (domain) {
    case 'rengrowcure':
      return {
        domainLabel: 'RENGROWCURE',
        icon: FiTrendingUp,
        headerBg: 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white',
        accentColor: '#059669',
        tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        glow: 'shadow-emerald-500/10',
      }
    case 'tasks':
      return {
        domainLabel: 'TASK WORKSPACE',
        icon: FiCheckSquare,
        headerBg: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white',
        accentColor: '#7c3aed',
        tagColor: 'bg-violet-50 text-violet-700 border-violet-200',
        glow: 'shadow-violet-500/10',
      }
    case 'calendar':
      return {
        domainLabel: 'CALENDAR',
        icon: FiCalendar,
        headerBg: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white',
        accentColor: '#0284c7',
        tagColor: 'bg-sky-50 text-sky-700 border-sky-200',
        glow: 'shadow-sky-500/10',
      }
    case 'marketing':
    case 'campaigns':
      return {
        domainLabel: 'MARKETING CAMPAIGN',
        icon: FiSend,
        headerBg: 'bg-gradient-to-r from-pink-600 to-rose-600 text-white',
        accentColor: '#e11d48',
        tagColor: 'bg-pink-50 text-pink-700 border-pink-200',
        glow: 'shadow-pink-500/10',
      }
    case 'drip-campaigns':
      return {
        domainLabel: 'DRIP CAMPAIGN',
        icon: FiLayers,
        headerBg: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
        accentColor: '#2563eb',
        tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
        glow: 'shadow-blue-500/10',
      }
    case 'content-engine':
      return {
        domainLabel: 'CONTENT ENGINE',
        icon: FiShare2,
        headerBg: 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white',
        accentColor: '#9333ea',
        tagColor: 'bg-purple-50 text-purple-700 border-purple-200',
        glow: 'shadow-purple-500/10',
      }
    case 'social-accounts':
      return {
        domainLabel: 'SOCIAL ACCOUNTS',
        icon: FiShare2,
        headerBg: 'bg-gradient-to-r from-rose-500 to-pink-600 text-white',
        accentColor: '#e11d48',
        tagColor: 'bg-rose-50 text-rose-700 border-rose-200',
        glow: 'shadow-rose-500/10',
      }
    case 'global-crm':
      return {
        domainLabel: 'GLOBAL CRM',
        icon: FiDatabase,
        headerBg: 'bg-gradient-to-r from-slate-800 to-slate-900 text-white',
        accentColor: '#1e293b',
        tagColor: 'bg-slate-100 text-slate-700 border-slate-300',
        glow: 'shadow-slate-500/10',
      }
    case 'leads-capture':
    default:
      return {
        domainLabel: 'LEAD CAPTURE',
        icon: FiZap,
        headerBg: 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white',
        accentColor: '#4f46e5',
        tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        glow: 'shadow-indigo-500/10',
      }
  }
}

export const CustomNodeCard: React.FC<NodeProps> = memo(({ data, selected }) => {
  const nodeData = data as unknown as CRMNodeData
  const { nodeType, subType, domain, label, description, config, telemetry } = nodeData
  const scheme = getNodeVisualScheme(domain || 'leads-capture', nodeType)
  const Icon = scheme.icon

  return (
    <div
      className={`group relative w-[290px] rounded-2xl bg-white transition-all duration-200 shadow-md ${
        scheme.glow
      } ${
        selected
          ? 'ring-2 ring-blue-600 ring-offset-2 ring-offset-slate-50 shadow-xl scale-[1.02]'
          : 'hover:shadow-lg hover:border-slate-300'
      } border border-slate-200/90`}
    >
      {/* n8n style Left Input Connection Port */}
      {nodeType !== 'trigger' && (
        <Handle
          type="target"
          position={Position.Left}
          className="!h-4 !w-4 !-left-2 !bg-white !border-3 !border-blue-600 hover:!scale-125 !transition-transform shadow-sm"
        />
      )}

      {/* Card Header with Category Gradient Banner */}
      <div className={`flex items-center justify-between rounded-t-2xl px-3.5 py-2.5 ${scheme.headerBg}`}>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 backdrop-blur-xs">
            <Icon className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase opacity-90">
              {scheme.domainLabel}
            </span>
            <div className="text-[11px] font-medium leading-none text-white/90">
              {nodeType.toUpperCase()}
            </div>
          </div>
        </div>
        <span className="rounded-full bg-black/20 px-2 py-0.5 text-[9px] font-semibold text-white uppercase backdrop-blur-xs">
          {telemetry?.efficiency ?? 100}% Health
        </span>
      </div>

      {/* Card Body */}
      <div className="p-3.5 space-y-2.5">
        <div>
          <h4 className="text-xs font-bold text-slate-800 leading-snug line-clamp-1">{label}</h4>
          {description && (
            <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Subtype Pill */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold border ${scheme.tagColor}`}
          >
            {subType?.replace(/Trigger-|Action-|Logic-/, '') || 'Default Node'}
          </span>

          {/* Quick config preview */}
          {config?.targetPersona && (
            <span className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">
              {config.targetPersona}
            </span>
          )}
          {config?.dealPipeline && (
            <span className="text-[10px] text-emerald-600 font-medium truncate max-w-[120px]">
              {config.dealPipeline}
            </span>
          )}
          {config?.taskPriority && (
            <span className="text-[10px] text-violet-600 font-medium truncate max-w-[120px]">
              Priority: {config.taskPriority}
            </span>
          )}
          {config?.meetingType && (
            <span className="text-[10px] text-blue-600 font-medium truncate max-w-[120px]">
              {config.meetingType}
            </span>
          )}
        </div>

        {/* Real-time Telemetry Metrics Pill */}
        <div className="grid grid-cols-3 gap-1 rounded-lg bg-slate-50 p-2 text-center border border-slate-100">
          <div>
            <div className="text-[9px] font-semibold text-slate-400 uppercase">Passed</div>
            <div className="text-[11px] font-bold text-slate-700">
              {telemetry?.processedCount?.toLocaleString() || 0}
            </div>
          </div>
          <div>
            <div className="text-[9px] font-semibold text-emerald-500 uppercase">Success</div>
            <div className="text-[11px] font-bold text-emerald-600">
              {telemetry?.successCount?.toLocaleString() || 0}
            </div>
          </div>
          <div>
            <div className="text-[9px] font-semibold text-rose-400 uppercase">Failed</div>
            <div className="text-[11px] font-bold text-rose-500">
              {telemetry?.failureCount || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Multi-port logic handle branching if condition node */}
      {nodeType === 'condition' ? (
        <>
          <div className="relative">
            <Handle
              type="source"
              position={Position.Right}
              id="true"
              style={{ top: '35%' }}
              className="!h-3.5 !w-3.5 !-right-2 !bg-emerald-500 !border-2 !border-white hover:!scale-125 !transition-transform shadow-sm"
            />
            <span className="absolute right-3 -top-6 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">
              TRUE
            </span>
          </div>
          <div className="relative">
            <Handle
              type="source"
              position={Position.Right}
              id="false"
              style={{ top: '70%' }}
              className="!h-3.5 !w-3.5 !-right-2 !bg-slate-400 !border-2 !border-white hover:!scale-125 !transition-transform shadow-sm"
            />
            <span className="absolute right-3 -top-1 text-[9px] font-bold text-slate-500 bg-slate-100 px-1 rounded">
              FALSE
            </span>
          </div>
        </>
      ) : (
        /* Standard Output Handle */
        <Handle
          type="source"
          position={Position.Right}
          className="!h-4 !w-4 !-right-2 !bg-blue-600 !border-3 !border-white hover:!scale-125 !transition-transform shadow-sm"
        />
      )}
    </div>
  )
})

CustomNodeCard.displayName = 'CustomNodeCard'
