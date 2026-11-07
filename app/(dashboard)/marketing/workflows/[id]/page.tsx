'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  FiArrowLeft,
  FiActivity,
  FiCheckCircle,
  FiDatabase,
  FiLayers,
  FiSend,
  FiShare2,
} from 'react-icons/fi'
import { Workflow } from '@/src/types/marketing/workflow'
import { WorkflowsService } from '@/src/services/marketing/WorkflowsService'
import { WorkflowCanvas } from '@/src/components/marketing/workflows/canvas/WorkflowCanvas'
import { WorkflowStatusBadge } from '@/src/components/marketing/workflows/shared/WorkflowStatusBadge'

export default function MarketingWorkflowCanvasPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadWorkflow(id)
    }
  }, [id])

  const loadWorkflow = async (workflowId: string) => {
    try {
      setLoading(true)
      const data = await WorkflowsService.getWorkflowById(workflowId)
      if (!data) {
        router.push('/marketing/workflows')
        return
      }
      setWorkflow(data)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveWorkflow = async (updates: Partial<Workflow>) => {
    if (!id || !workflow) return
    const updated = await WorkflowsService.updateWorkflow(id, updates)
    setWorkflow(updated)
  }

  if (loading || !workflow) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading n8n Visual Automation Canvas...</p>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 overflow-hidden select-none">
      {/* Immersive Top Bar: Minimalist SaaS Header dedicated to the Workflow */}
      <header className="h-13 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/marketing/workflows"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors border border-slate-200"
            title="Exit Canvas & Return to Workflows"
          >
            <FiArrowLeft className="w-3.5 h-3.5" />
            <span>Workflows Hub</span>
          </Link>

          <div className="h-4 w-px bg-slate-200" />

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-900 leading-none">
                {workflow.workflow_name}
              </h1>
              <WorkflowStatusBadge status={workflow.status} />
              <div className="hidden sm:flex items-center gap-1.5 ml-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <FiSend className="w-2.5 h-2.5" /> Campaigns
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                  <FiLayers className="w-2.5 h-2.5" /> Drip
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full">
                  <FiShare2 className="w-2.5 h-2.5" /> Content Engine
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full font-mono">
                  <FiDatabase className="w-2.5 h-2.5" /> Global CRM
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* System Calculated Telemetry Strip */}
        <div className="flex items-center gap-4 text-xs">
          <div className="hidden md:flex items-center gap-1.5 text-slate-500">
            <FiActivity className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Processed: <strong className="text-slate-800">{workflow.processed_contacts.toLocaleString()}</strong>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-slate-500">
            <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>
              Success:{' '}
              <strong className="text-emerald-700">{workflow.successful_actions.toLocaleString()}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg text-slate-600">
            <span className="text-[11px] text-slate-400">Efficiency:</span>
            <span
              className={`font-bold ${
                workflow.automation_efficiency >= 90
                  ? 'text-emerald-600'
                  : 'text-amber-600'
              }`}
            >
              {workflow.automation_efficiency}%
            </span>
          </div>
        </div>
      </header>

      {/* Full Canvas Viewport */}
      <main className="flex-1 relative w-full h-[calc(100vh-3.25rem)]">
        <WorkflowCanvas workflow={workflow} onSaveWorkflow={handleSaveWorkflow} />
      </main>
    </div>
  )
}
