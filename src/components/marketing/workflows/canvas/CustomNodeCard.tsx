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
} from 'react-icons/fi'
import { MarketingNodeData } from '@/src/types/marketing/workflow'

// n8n / GoHighLevel styled node visual themes
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
    case 'campaigns':
      return {
        domainLabel: 'CAMPAIGNS',
        icon: FiSend,
        headerBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white',
        accentColor: '#059669',
        tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        glow: 'shadow-emerald-500/10',
      }
    case 'drip-campaigns':
      return {
        domainLabel: 'DRIP CAMPAIGN',
        icon: FiLayers,
        headerBg: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white',
        accentColor: '#2563eb',
        tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
        glow: 'shadow-blue-500/10',
      }
    case 'content-engine':
      return {
        domainLabel: 'CONTENT ENGINE',
        icon: FiShare2,
        headerBg: 'bg-gradient-to-r from-violet-600 to-purple-600 text-white',
        accentColor: '#7c3aed',
        tagColor: 'bg-violet-50 text-violet-700 border-violet-200',
        glow: 'shadow-violet-500/10',
      }
    case 'social-accounts':
      return {
        domainLabel: 'SOCIAL ACCOUNTS',
        icon: FiShare2,
        headerBg: 'bg-gradient-to-r from-pink-600 to-rose-600 text-white',
        accentColor: '#e11d48',
        tagColor: 'bg-pink-50 text-pink-700 border-pink-200',
        glow: 'shadow-pink-500/10',
      }
    case 'global-crm':
      return {
        domainLabel: 'GLOBAL CRM',
        icon: FiDatabase,
        headerBg: 'bg-gradient-to-r from-slate-800 to-slate-900 text-white',
        accentColor: '#1e293b',
        tagColor: 'bg-purple-50 text-purple-700 border-purple-200',
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
  const nodeData = data as unknown as MarketingNodeData
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
          className="!w-3.5 !h-3.5 !-left-2 !top-1/2 !-translate-y-1/2 !bg-white !border-2 !border-slate-500 hover:!border-blue-600 hover:!bg-blue-600 transition-all rounded-full shadow-sm z-30"
        />
      )}

      {/* Top Banner Header with Icon & Subtype */}
      <div className={`px-3.5 py-2.5 rounded-t-2xl flex items-center justify-between ${scheme.headerBg}`}>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <Icon className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] font-black tracking-widest uppercase opacity-90 block truncate leading-none">
              {scheme.domainLabel}
            </span>
            <span className="text-[10px] font-mono font-medium opacity-80 truncate block mt-0.5 leading-none">
              {nodeType.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/20 text-white font-mono font-semibold">
            {telemetry?.efficiency ?? 100}%
          </span>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-3.5 space-y-2.5 bg-white rounded-b-2xl">
        {/* Step Title & Subtitle */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 leading-snug line-clamp-1">{label}</h4>
          {description && (
            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Dynamic linked config preview pill */}
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100/80 text-[10px] text-slate-600 space-y-1">
          {domain === 'drip-campaigns' && (
            <div className="flex items-center justify-between gap-1 text-slate-700">
              <span className="text-slate-400">Sequence:</span>
              <strong className="truncate max-w-[160px] text-blue-600 font-semibold">
                {config?.dripCampaignId || 'Nutrition Food Sequence'}
              </strong>
            </div>
          )}

          {domain === 'campaigns' && (
            <div className="flex items-center justify-between gap-1 text-slate-700">
              <span className="text-slate-400">Campaign:</span>
              <strong className="truncate max-w-[160px] text-emerald-600 font-semibold">
                {config?.campaignName || 'Q4 Expansion'}
              </strong>
            </div>
          )}

          {domain === 'content-engine' && (
            <div className="flex items-center justify-between gap-1 text-slate-700">
              <span className="text-slate-400">Channel:</span>
              <strong className="truncate max-w-[160px] text-violet-600 font-semibold">
                {config?.socialPlatform || 'LinkedIn / FB'}
              </strong>
            </div>
          )}

          {domain === 'global-crm' && (
            <div className="flex items-center justify-between gap-1 text-purple-700 font-mono text-[9px]">
              <span className="text-slate-400">Bridge:</span>
              <span className="truncate max-w-[160px] bg-purple-100/60 px-1 py-0.5 rounded">
                {config?.globalEventName || 'crm.event.sync'}
              </span>
            </div>
          )}

          {nodeType === 'condition' && config?.rules && config.rules.length > 0 && (
            <div className="text-amber-800 font-mono text-[9px] truncate">
              IF {config.rules[0].field} {config.rules[0].operator} &quot;{config.rules[0].value}&quot;
            </div>
          )}
        </div>

        {/* System Telemetry Stats Bar */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-slate-400">Processed:</span>
            <span className="text-slate-800 font-bold">
              {telemetry?.processedCount?.toLocaleString() ?? 0}
            </span>
          </div>

          <div className="flex items-center gap-1 font-semibold text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{telemetry?.successCount?.toLocaleString() ?? 0} sent</span>
          </div>
        </div>
      </div>

      {/* n8n style Right Output Connection Ports */}
      {nodeType === 'condition' ? (
        <>
          <Handle
            type="source"
            position={Position.Right}
            id="true"
            className="!w-3.5 !h-3.5 !-right-2 !top-[35%] !bg-emerald-500 !border-2 !border-white hover:!scale-125 transition-transform rounded-full shadow-sm z-30"
          />
          <Handle
            type="source"
            position={Position.Right}
            id="false"
            className="!w-3.5 !h-3.5 !-right-2 !top-[65%] !bg-rose-500 !border-2 !border-white hover:!scale-125 transition-transform rounded-full shadow-sm z-30"
          />
          <div className="absolute -right-14 top-[28%] text-[9px] font-black text-emerald-600 tracking-wider pointer-events-none uppercase">
            TRUE
          </div>
          <div className="absolute -right-14 top-[58%] text-[9px] font-black text-rose-600 tracking-wider pointer-events-none uppercase">
            FALSE
          </div>
        </>
      ) : (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3.5 !h-3.5 !-right-2 !top-1/2 !-translate-y-1/2 !bg-white !border-2 !border-slate-500 hover:!border-blue-600 hover:!bg-blue-600 transition-all rounded-full shadow-sm z-30"
        />
      )}
    </div>
  )
})

CustomNodeCard.displayName = 'CustomNodeCard'
