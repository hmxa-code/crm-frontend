'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  FiPlus,
  FiZap,
  FiSearch,
  FiActivity,
  FiCheckCircle,
  FiArrowRight,
  FiMoreVertical,
  FiCopy,
  FiTrash2,
  FiSend,
  FiLayers,
  FiShare2,
  FiDatabase,
  FiTrendingUp,
  FiCheckSquare,
  FiCalendar,
  FiCpu,
} from 'react-icons/fi'
import { Workflow, WorkflowStatus, CRMWorkflowDomain } from '@/src/types/workflows/workflow'
import { WorkflowsService } from '@/src/services/workflowsService'
import { WorkflowStatusBadge } from '@/src/components/ui/workflows/shared/WorkflowStatusBadge'

export default function StandaloneWorkflowsHubPage() {
  const router = useRouter()
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | WorkflowStatus>('All')
  const [domainFilter, setDomainFilter] = useState<'All' | CRMWorkflowDomain>('All')
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

  const loadWorkflows = async () => {
    try {
      setLoading(true)
      const data = await WorkflowsService.getAllWorkflows()
      setWorkflows(data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWorkflows()
  }, [])

  const handleDuplicate = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setActiveMenuId(null)
    const duplicated = await WorkflowsService.duplicateWorkflow(id)
    if (duplicated) {
      loadWorkflows()
    }
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setActiveMenuId(null)
    if (confirm('Are you sure you want to delete this workflow automation?')) {
      await WorkflowsService.deleteWorkflow(id)
      loadWorkflows()
    }
  }

  const filteredWorkflows = workflows.filter((w) => {
    const matchesSearch =
      w.workflow_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.description && w.description.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === 'All' || w.status === statusFilter
    const matchesDomain = domainFilter === 'All' || w.domain === domainFilter
    return matchesSearch && matchesStatus && matchesDomain
  })

  // Quick Stats across all CRM Workflows
  const totalCount = workflows.length
  const activeCount = workflows.filter((w) => w.status === 'Active').length
  const totalSignals = workflows.reduce((acc, curr) => acc + (curr.processed_contacts || 0), 0)
  const avgEfficiency = totalCount
    ? Math.round(
        workflows.reduce((acc, curr) => acc + (curr.automation_efficiency || 100), 0) / totalCount
      )
    : 100

  return (
    <div className="flex-1 space-y-6 p-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <FiCpu className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Unified Automation Workflows
                <span className="rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-[10px] font-bold">
                  Omni-CRM Engine
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Visual n8n-style automation engine powering RenGrowCure, Marketing, Task Management, Calendar, and Global CRM.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/workflows/create"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 active:scale-95"
          >
            <FiPlus className="h-4 w-4" />
            <span>Create New Workflow</span>
          </Link>
        </div>
      </div>

      {/* KPI Telemetry Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Workflows
            </span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{totalCount}</div>
            <span className="text-[10px] text-slate-500 font-medium">Across all CRM Modules</span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FiCpu className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Active Engines
            </span>
            <div className="text-2xl font-black text-emerald-600 mt-0.5">{activeCount}</div>
            <span className="text-[10px] text-emerald-600 font-medium">Listening to triggers</span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <FiZap className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Signals Processed
            </span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {totalSignals.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Cross-module operations</span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <FiActivity className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Execution Health
            </span>
            <div className="text-2xl font-black text-blue-600 mt-0.5">{avgEfficiency}%</div>
            <span className="text-[10px] text-blue-600 font-medium">Autonomous success rate</span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <FiCheckCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Module Quick Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/60 pb-3">
        {[
          { key: 'All', label: 'All Modules' },
          { key: 'rengrowcure', label: 'RenGrowCure (Sales & Leads)', icon: FiTrendingUp },
          { key: 'tasks', label: 'Task Management', icon: FiCheckSquare },
          { key: 'calendar', label: 'Calendar Bookings', icon: FiCalendar },
          { key: 'marketing', label: 'Marketing Campaigns', icon: FiSend },
          { key: 'global-crm', label: 'Omni-CRM Integrations', icon: FiDatabase },
        ].map((tab: any) => (
          <button
            key={tab.key}
            onClick={() => setDomainFilter(tab.key)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              domainFilter === tab.key
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {tab.icon && <tab.icon className="h-3.5 w-3.5" />}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search automation by name or purpose..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-medium text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Paused">Paused</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Workflows Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
            <p className="text-xs font-semibold text-slate-400">Loading Automation Workflows...</p>
          </div>
        </div>
      ) : filteredWorkflows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mb-3">
            <FiZap className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No automation workflows found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Create automated visual pipelines connecting RenGrowCure, Task Management, Calendar, and Marketing.
          </p>
          <Link
            href="/workflows/create"
            className="mt-4 flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-blue-700"
          >
            <FiPlus className="h-4 w-4" />
            Create Workflow
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWorkflows.map((workflow) => {
            const isMenuOpen = activeMenuId === workflow._id

            // Identify primary module badge
            const domainInfo = (() => {
              switch (workflow.domain) {
                case 'rengrowcure':
                  return { label: 'RenGrowCure', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
                case 'tasks':
                  return { label: 'Task Management', bg: 'bg-violet-50 text-violet-700 border-violet-200' }
                case 'calendar':
                  return { label: 'Calendar', bg: 'bg-sky-50 text-sky-700 border-sky-200' }
                case 'marketing':
                  return { label: 'Marketing', bg: 'bg-pink-50 text-pink-700 border-pink-200' }
                default:
                  return { label: 'Omni-CRM', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
              }
            })()

            return (
              <div
                key={workflow._id}
                onClick={() => router.push(`/workflows/${workflow._id}`)}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-lg hover:border-slate-300 cursor-pointer"
              >
                <div>
                  {/* Top Bar with Status and Menu */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <WorkflowStatusBadge status={workflow.status} />
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${domainInfo.bg}`}>
                        {domainInfo.label}
                      </span>
                    </div>

                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveMenuId(isMenuOpen ? null : (workflow._id as string))
                        }}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                      >
                        <FiMoreVertical className="h-4 w-4" />
                      </button>

                      {isMenuOpen && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-8 z-30 w-36 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl animate-in fade-in duration-100"
                        >
                          <button
                            onClick={(e) => handleDuplicate(e, workflow._id as string)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <FiCopy className="h-3.5 w-3.5 text-slate-400" />
                            <span>Duplicate</span>
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, workflow._id as string)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <FiTrash2 className="h-3.5 w-3.5 text-rose-400" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {workflow.workflow_name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {workflow.description || 'Enterprise visual orchestration flow.'}
                  </p>

                  {/* Trigger & Fulfillment Badges */}
                  <div className="mt-4 flex flex-col gap-1.5 text-[11px] text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase text-slate-400 w-14">Trigger:</span>
                      <span className="rounded bg-slate-100 px-2 py-0.5 font-semibold text-slate-700 truncate">
                        {workflow.trigger_type.replace(/Trigger-/, '')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase text-slate-400 w-14">Action:</span>
                      <span className="rounded bg-blue-50 px-2 py-0.5 font-semibold text-blue-700 truncate">
                        {workflow.action_type.replace(/Action-/, '')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Telemetry Bar */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block">Processed</span>
                      <span className="font-bold text-slate-800">
                        {workflow.processed_contacts.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block">Success</span>
                      <span className="font-bold text-emerald-600">
                        {workflow.automation_efficiency}%
                      </span>
                    </div>
                  </div>

                  <span className="flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                    <span>Open Canvas</span>
                    <FiArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
