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
import { Workflow } from '@/src/types/workflows/workflow'
import { WorkflowsService } from '@/src/services/workflowsService'
import { WorkflowCanvas } from '@/src/components/ui/workflows/canvas/WorkflowCanvas'
import { WorkflowStatusBadge } from '@/src/components/ui/workflows/shared/WorkflowStatusBadge'

export default function CRMWorkflowCanvasPage() {
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
        router.push('/workflows')
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

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Initializing Workflow Canvas...</p>
        </div>
      </div>
    )
  }

  if (!workflow) return null

  return (
    <div className="flex h-[calc(100vh-64px)] w-full flex-col overflow-hidden bg-slate-50">
      {/* Immersive Top Bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200/90 bg-white px-3 sm:px-4 shadow-2xs z-10">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href="/workflows"
            className="flex items-center gap-1.5 rounded-lg p-1.5 sm:p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors shrink-0"
          >
            <FiArrowLeft className="h-4 w-4" />
            <span className="text-xs font-semibold hidden sm:inline">All Workflows</span>
          </Link>

          <div className="h-4 w-px bg-slate-200 shrink-0" />

          <div className="min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <h2 className="text-xs font-black text-slate-900 leading-tight truncate max-w-[130px] xs:max-w-[180px] sm:max-w-xs md:max-w-md">
                {workflow.workflow_name}
              </h2>
              <div className="shrink-0">
                <WorkflowStatusBadge status={workflow.status} />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-medium truncate max-w-md hidden sm:block">
              {workflow.description || 'Omni-CRM automated graph builder'}
            </p>
          </div>
        </div>

        {/* Live Mini Stats */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs font-medium shrink-0">
          <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Health:</span>
            <span className="font-bold text-emerald-600">
              {workflow.automation_efficiency}%
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Runs:</span>
            <span className="font-bold text-slate-800">
              {workflow.processed_contacts.toLocaleString()}
            </span>
          </div>
        </div>
      </header>

      {/* React Flow Visual Canvas */}
      <main className="relative flex-1 w-full h-full">
        <WorkflowCanvas workflow={workflow} onSaveWorkflow={handleSaveWorkflow} />
      </main>
    </div>
  )
}
