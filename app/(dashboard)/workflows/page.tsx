'use client'

import React, { useEffect, useState, useMemo } from 'react'
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
  FiPlay,
  FiRefreshCw,
  FiGrid,
  FiList,
  FiClock,
  FiFolder,
  FiAlertCircle,
  FiSliders,
  FiFilter,
  FiX,
} from 'react-icons/fi'
import { Workflow, WorkflowStatus, CRMWorkflowDomain } from '@/src/types/workflows/workflow'
import { WorkflowsService } from '@/src/services/workflowsService'
import { WorkflowStatusBadge } from '@/src/components/ui/workflows/shared/WorkflowStatusBadge'
import { WorkflowsTableView } from '@/src/components/ui/workflows/views/WorkflowsTableView'
import { WorkflowsKanbanView } from '@/src/components/ui/workflows/views/WorkflowsKanbanView'

export default function StandaloneWorkflowsHubPage() {
  const router = useRouter()
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | WorkflowStatus>('All')
  const [domainFilter, setDomainFilter] = useState<'All' | CRMWorkflowDomain>('All')
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'kanban'>('grid')
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [simulationNotice, setSimulationNotice] = useState<string | null>(null)
  const [executionLogs, setExecutionLogs] = useState<any[]>([])

  const loadWorkflows = async () => {
    try {
      setLoading(true)
      const data = await WorkflowsService.getAllWorkflows()
      setWorkflows(data || [])
      const logs = await WorkflowsService.getExecutionLogs()
      setExecutionLogs(logs || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWorkflows()

    const handleUpdated = () => {
      WorkflowsService.getAllWorkflows().then(setWorkflows)
    }
    window.addEventListener('wholcure_workflows_updated', handleUpdated)
    return () => window.removeEventListener('wholcure_workflows_updated', handleUpdated)
  }, [])

  // Close active menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => setActiveMenuId(null)
    window.addEventListener('click', handleOutsideClick)
    return () => window.removeEventListener('click', handleOutsideClick)
  }, [])

  const handleResetSeed = async () => {
    const restored = await WorkflowsService.resetToSeed()
    setWorkflows(restored)
    setSimulationNotice('Workflow ecosystem reset to factory seed data.')
    setTimeout(() => setSimulationNotice(null), 3500)
  }

  const handleSimulateRun = async (targetId?: string) => {
    const res = await WorkflowsService.simulateRun(targetId)
    if (res.success) {
      setSimulationNotice(res.message)
      const updated = await WorkflowsService.getAllWorkflows()
      setWorkflows(updated)
      setTimeout(() => setSimulationNotice(null), 4000)
    }
  }

  const handleDuplicate = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setActiveMenuId(null)
    const duplicated = await WorkflowsService.duplicateWorkflow(id)
    if (duplicated) {
      loadWorkflows()
      setSimulationNotice(`Duplicated workflow: "${duplicated.workflow_name}"`)
      setTimeout(() => setSimulationNotice(null), 3500)
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

  const handleStatusChange = async (id: string, newStatus: WorkflowStatus) => {
    await WorkflowsService.updateWorkflowStatus(id, newStatus)
    loadWorkflows()
  }

  const filteredWorkflows = useMemo(() => {
    return workflows.filter((w) => {
      const matchesSearch =
        w.workflow_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (w.description && w.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        w.trigger_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.action_type.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'All' || w.status === statusFilter
      const matchesDomain = domainFilter === 'All' || w.domain === domainFilter
      return matchesSearch && matchesStatus && matchesDomain
    })
  }, [workflows, searchQuery, statusFilter, domainFilter])

  // Aggregate Metrics
  const totalCount = workflows.length
  const activeCount = workflows.filter((w) => w.status === 'Active').length
  const totalSignals = workflows.reduce((acc, curr) => acc + (curr.processed_contacts || 0), 0)
  const avgEfficiency = totalCount
    ? Math.round(
        workflows.reduce((acc, curr) => acc + (curr.automation_efficiency || 100), 0) / totalCount
      )
    : 100

  // Domain Distribution Calculations
  const domainCounts = useMemo(() => {
    const counts = {
      rengrowcure: 0,
      tasks: 0,
      calendar: 0,
      marketing: 0,
      'global-crm': 0,
    }
    workflows.forEach((w) => {
      const d = (w.domain || 'global-crm') as keyof typeof counts
      if (counts[d] !== undefined) counts[d]++
    })
    return counts
  }, [workflows])

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-5">
      {/* Simulation Banner Notice */}
      {simulationNotice && (
        <div className="flex items-center justify-between rounded-xl bg-sky-50 border border-sky-200 px-4 py-2.5 text-xs text-sky-800 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <FiPlay className="h-4 w-4 text-sky-600 shrink-0" />
            <span className="font-semibold">{simulationNotice}</span>
          </div>
          <button
            onClick={() => setSimulationNotice(null)}
            className="text-sky-500 hover:text-sky-800 p-1"
          >
            <FiX className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 1. Header Banner - Fixed Mobile & Button Contrast Issues */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      {/* Title & Description */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Automation Workflow Suite
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600" />
            Omni-CRM Engine
          </span>
        </div>
        <p className="max-w-2xl text-xs leading-relaxed text-slate-500 sm:text-sm">
          Enterprise visual orchestration connecting RenGrowCure venture deals, Task Workstation items, Calendar bookings, and Marketing drip pipelines.
        </p>
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 sm:border-t-0 sm:pt-0 shrink-0">
        <button
          type="button"
          onClick={() => handleSimulateRun()}
          className="inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-3.5 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-100 active:scale-95"
        >
          <FiPlay className="h-3.5 w-3.5 text-sky-600" />
          <span>Simulate Run</span>
        </button>

        <button
          type="button"
          onClick={handleResetSeed}
          className="inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-95"
        >
          <FiRefreshCw className="h-3.5 w-3.5 text-slate-500" />
          <span>Reset Seed</span>
        </button>

        <Link
          href="/workflows/create"
          className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-95"
        >
          <FiPlus className="h-4 w-4" />
          <span>Create Workflow</span>
        </Link>
      </div>
    </div>

      {/* 2. KPI Telemetry Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Active Engines',
            value: `${activeCount} / ${totalCount}`,
            sublabel: 'Autonomous triggers active',
            icon: FiZap,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50 text-emerald-600',
          },
          {
            label: 'Signals Processed',
            value: totalSignals.toLocaleString(),
            sublabel: 'Cross-module operations',
            icon: FiActivity,
            color: 'text-slate-900',
            bg: 'bg-slate-100 text-slate-700',
          },
          {
            label: 'Execution Health',
            value: `${avgEfficiency}%`,
            sublabel: 'Autonomous SLA success rate',
            icon: FiCheckCircle,
            color: 'text-blue-600',
            bg: 'bg-blue-50 text-blue-600',
          },
          {
            label: 'Integrated Modules',
            value: '5 CRM Domains',
            sublabel: 'Tasks, Deals, Cal & Marketing',
            icon: FiLayers,
            color: 'text-violet-600',
            bg: 'bg-violet-50 text-violet-600',
          },
        ].map((card) => (
          <div
            key={card.label}
            className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {card.label}
              </p>
              <h3 className={`mt-1.5 text-xl sm:text-2xl font-black ${card.color}`}>{card.value}</h3>
              <p className="mt-1 text-[11px] text-slate-400 font-medium">{card.sublabel}</p>
            </div>
            <div className={`rounded-xl p-3 ${card.bg}`}>
              <card.icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Operational Workstation Modules Navigation Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Enterprise Automation Modules
          </h2>
          <span className="text-xs text-slate-400">Omni-CRM Visual Hub</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              href: '/workflows/create',
              title: 'Visual Flow Canvas',
              desc: 'n8n-grade drag-and-drop node graph orchestrating end-to-end automations.',
              icon: FiCpu,
              color: 'text-blue-600 bg-blue-50',
            },
            {
              filter: 'rengrowcure' as CRMWorkflowDomain,
              title: 'RenGrowCure Deal Velocity',
              desc: 'Auto-sync Venture Matrix deals, evaluate LeadIntel score, and assign sales reps.',
              icon: FiTrendingUp,
              color: 'text-emerald-600 bg-emerald-50',
            },
            {
              filter: 'tasks' as CRMWorkflowDomain,
              title: 'Task Workstation Bridge',
              desc: 'Generate high-priority work items, set SLA timers, and trigger manager alerts.',
              icon: FiCheckSquare,
              color: 'text-violet-600 bg-violet-50',
            },
            {
              filter: 'calendar' as CRMWorkflowDomain,
              title: 'Calendar Smart Scheduler',
              desc: 'Automatically reserve discovery calls, send client invites, and lock focus slots.',
              icon: FiCalendar,
              color: 'text-sky-600 bg-sky-50',
            },
            {
              filter: 'marketing' as CRMWorkflowDomain,
              title: 'Marketing Drip Engine',
              desc: 'Multi-touch educational email sequences, campaign blasts, and social feeds.',
              icon: FiSend,
              color: 'text-pink-600 bg-pink-50',
            },
            {
              filter: 'global-crm' as CRMWorkflowDomain,
              title: 'Omni-CRM Telemetry & Webhooks',
              desc: 'Real-time cross-platform webhook dispatchers, customer sync, and live audits.',
              icon: FiDatabase,
              color: 'text-indigo-600 bg-indigo-50',
            },
          ].map((item) => {
            const isClickableFilter = 'filter' in item
            const isActive = isClickableFilter && domainFilter === item.filter

            if (isClickableFilter) {
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setDomainFilter(isActive ? 'All' : item.filter!)}
                  className={`group flex flex-col justify-between text-left rounded-2xl border p-4 sm:p-5 shadow-xs transition cursor-pointer ${
                    isActive
                      ? 'border-blue-500 bg-blue-50/20 shadow-sm'
                      : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className={`rounded-xl p-2.5 ${item.color}`}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600 transition">
                        {isActive ? 'Filtered ✓' : 'Filter →'}
                      </span>
                    </div>
                    <h3 className="mt-4 text-sm font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </button>
              )
            }

            return (
              <Link
                key={item.title}
                href={item.href!}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs transition hover:border-slate-300 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`rounded-xl p-2.5 ${item.color}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <FiArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* 4. Filter & Controls Bar */}
      <div className="space-y-3">
        {/* Module Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-1 border-b border-slate-200/80">
          {[
            { key: 'All', label: 'All Modules', count: totalCount },
            {
              key: 'rengrowcure',
              label: 'RenGrowCure (Pipeline)',
              icon: FiTrendingUp,
              count: domainCounts.rengrowcure,
            },
            {
              key: 'tasks',
              label: 'Task Management',
              icon: FiCheckSquare,
              count: domainCounts.tasks,
            },
            {
              key: 'calendar',
              label: 'Calendar Bookings',
              icon: FiCalendar,
              count: domainCounts.calendar,
            },
            {
              key: 'marketing',
              label: 'Marketing Drip',
              icon: FiSend,
              count: domainCounts.marketing,
            },
            {
              key: 'global-crm',
              label: 'Omni-CRM Global',
              icon: FiDatabase,
              count: domainCounts['global-crm'],
            },
          ].map((tab: any) => {
            const isSelected = domainFilter === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setDomainFilter(tab.key)}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {tab.icon && <tab.icon className="h-3.5 w-3.5 shrink-0" />}
                <span>{tab.label}</span>
                <span
                  className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search, Status & View Mode Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
          {/* Search bar */}
          <div className="relative flex-1 w-full sm:max-w-md">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search workflows by title, trigger or action..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 pl-10 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <FiX className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 justify-between sm:justify-end">
            {/* Status Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase hidden md:inline">
                Status:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none transition shadow-2xs"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Paused">Paused</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200/80">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid Cards View"
              >
                <FiGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Table Matrix View"
              >
                <FiList className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                  viewMode === 'kanban'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Kanban Pipeline View"
              >
                <FiLayers className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Main View: Grid, Table, or Kanban */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
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
            {searchQuery || statusFilter !== 'All' || domainFilter !== 'All'
              ? 'Try adjusting your search query, module filter, or lifecycle status.'
              : 'Create automated visual pipelines connecting RenGrowCure, Task Management, Calendar, and Marketing.'}
          </p>
          <div className="flex items-center gap-2 mt-4">
            {(searchQuery || statusFilter !== 'All' || domainFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('All')
                  setDomainFilter('All')
                }}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
              >
                Clear Filters
              </button>
            )}
            <Link
              href="/workflows/create"
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800"
            >
              <FiPlus className="h-4 w-4" />
              <span>Create Workflow</span>
            </Link>
          </div>
        </div>
      ) : viewMode === 'table' ? (
        <div className="w-full overflow-x-auto">
          <WorkflowsTableView
            workflows={filteredWorkflows}
            onView={(wf) => router.push(`/workflows/${wf._id}`)}
            onEdit={(wf) => router.push(`/workflows/${wf._id}`)}
            onDelete={(id) => {
              if (confirm('Delete this workflow?')) {
                WorkflowsService.deleteWorkflow(id).then(loadWorkflows)
              }
            }}
            onDuplicate={(id) => {
              WorkflowsService.duplicateWorkflow(id).then(loadWorkflows)
            }}
            onSimulateRun={handleSimulateRun}
          />
        </div>
      ) : viewMode === 'kanban' ? (
        <div className="w-full overflow-x-auto pb-4">
          <WorkflowsKanbanView
            workflows={filteredWorkflows}
            loading={loading}
            onView={(wf) => router.push(`/workflows/${wf._id}`)}
            onDelete={(id) => {
              if (confirm('Delete this workflow?')) {
                WorkflowsService.deleteWorkflow(id).then(loadWorkflows)
              }
            }}
            onStatusChange={handleStatusChange}
            onDuplicate={(id) => {
              WorkflowsService.duplicateWorkflow(id).then(loadWorkflows)
            }}
          />
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredWorkflows.map((workflow) => {
            const isMenuOpen = activeMenuId === workflow._id

            const domainInfo = (() => {
              switch (workflow.domain) {
                case 'rengrowcure':
                  return {
                    label: 'RenGrowCure',
                    icon: FiTrendingUp,
                    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  }
                case 'tasks':
                  return {
                    label: 'Task Management',
                    icon: FiCheckSquare,
                    bg: 'bg-violet-50 text-violet-700 border-violet-200',
                  }
                case 'calendar':
                  return {
                    label: 'Calendar',
                    icon: FiCalendar,
                    bg: 'bg-sky-50 text-sky-700 border-sky-200',
                  }
                case 'marketing':
                  return {
                    label: 'Marketing',
                    icon: FiSend,
                    bg: 'bg-pink-50 text-pink-700 border-pink-200',
                  }
                default:
                  return {
                    label: 'Omni-CRM',
                    icon: FiDatabase,
                    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                  }
              }
            })()
            const DomainIcon = domainInfo.icon

            return (
              <div
                key={workflow._id}
                onClick={() => router.push(`/workflows/${workflow._id}`)}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-lg hover:border-slate-300 cursor-pointer"
              >
                <div>
                  {/* Top Bar with Status and Menu */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <WorkflowStatusBadge status={workflow.status} />
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold border ${domainInfo.bg}`}
                      >
                        <DomainIcon className="h-3 w-3" />
                        <span>{domainInfo.label}</span>
                      </span>
                    </div>

                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
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
                          className="absolute right-0 top-8 z-30 w-44 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl animate-in fade-in duration-100 divide-y divide-slate-100"
                        >
                          <div className="py-1">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null)
                                handleSimulateRun(workflow._id)
                              }}
                              className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              <FiPlay className="h-3.5 w-3.5 text-sky-600" />
                              <span>Simulate Run</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDuplicate(e, workflow._id as string)}
                              className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              <FiCopy className="h-3.5 w-3.5 text-slate-400" />
                              <span>Duplicate Flow</span>
                            </button>
                          </div>
                          <div className="py-1">
                            <button
                              type="button"
                              onClick={(e) => handleDelete(e, workflow._id as string)}
                              className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <FiTrash2 className="h-3.5 w-3.5 text-rose-400" />
                              <span>Delete</span>
                            </button>
                          </div>
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
                      <span className="text-[10px] font-bold uppercase text-slate-400 w-14 shrink-0">
                        Trigger:
                      </span>
                      <span className="rounded bg-slate-100 px-2 py-0.5 font-semibold text-slate-700 truncate">
                        {workflow.trigger_type.replace(/Trigger-/, '')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase text-slate-400 w-14 shrink-0">
                        Action:
                      </span>
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
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">
                        Processed
                      </span>
                      <span className="font-bold text-slate-800">
                        {workflow.processed_contacts.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">
                        Success
                      </span>
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

      {/* 6. Live Execution Stream & Ecosystem Domain Breakdown */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left 2 Cols: Live Execution Audit Stream */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <h2 className="text-sm font-bold text-slate-900">Live Execution Audit Stream</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time cross-module event firing and telemetry dispatched across CRM nodes.
              </p>
            </div>
            <button
              onClick={() => handleSimulateRun()}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 shrink-0"
            >
              <FiPlay size={11} />
              <span>Trigger Test Event →</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-xs">
              <thead className="border-b border-slate-100 font-semibold uppercase tracking-wider text-[10px] text-slate-400">
                <tr>
                  <th className="px-3 py-2.5">Automation Entity</th>
                  <th className="px-3 py-2.5">Domain</th>
                  <th className="px-3 py-2.5">Triggered Event</th>
                  <th className="px-3 py-2.5">Latency</th>
                  <th className="px-3 py-2.5">Audit State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {executionLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-3 py-2.5">
                      <p className="font-semibold text-slate-900 truncate max-w-[180px]">
                        {log.entity}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[180px]">
                        {log.workflowName}
                      </p>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                        {log.domain}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 truncate max-w-[150px]">
                      {log.triggerEvent}
                    </td>
                    <td className="px-3 py-2.5 text-slate-500 font-medium">
                      {log.durationMs}ms
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            log.status === 'SUCCESS' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Automation Ecosystem Health & Domain Mix */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">CRM Automation Mix</h2>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Module distribution & autonomous reliability index.
            </p>

            <div className="space-y-3">
              {[
                {
                  label: 'RenGrowCure (Deals & Pipeline)',
                  count: domainCounts.rengrowcure,
                  color: 'bg-emerald-500',
                },
                {
                  label: 'Task Management Workstation',
                  count: domainCounts.tasks,
                  color: 'bg-violet-500',
                },
                {
                  label: 'Calendar Consultation Bookings',
                  count: domainCounts.calendar,
                  color: 'bg-sky-500',
                },
                {
                  label: 'Marketing Drip & Socials',
                  count: domainCounts.marketing,
                  color: 'bg-pink-500',
                },
                {
                  label: 'Omni-CRM Global Integrations',
                  count: domainCounts['global-crm'],
                  color: 'bg-indigo-500',
                },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${item.color} shrink-0`} />
                      <span className="font-medium text-slate-600 truncate max-w-[170px] sm:max-w-[200px]">
                        {item.label}
                      </span>
                    </div>
                    <span className="font-bold text-slate-800 shrink-0">{item.count} flows</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{
                        width: `${totalCount ? Math.round((item.count / totalCount) * 100) : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-400 font-medium">Autonomous SLA Health</span>
              <span className="text-xs font-bold text-slate-700">{avgEfficiency}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${avgEfficiency}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
              <span>{totalSignals.toLocaleString()} Signals Processed</span>
              <span className="text-emerald-600 font-bold">Zero Data Drift</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}