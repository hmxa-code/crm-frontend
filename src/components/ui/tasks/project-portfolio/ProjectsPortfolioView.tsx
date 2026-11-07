'use client';

import React, { useState, useMemo } from 'react';
import {
  FiPlus,
  FiClock,
  FiUsers,
  FiTrendingUp,
  FiDollarSign,
  FiCheckCircle,
  FiAlertTriangle,
  FiCalendar,
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiChevronRight,
  FiX,
  FiLayers,
  FiFolder,
  FiTag,
  FiExternalLink,
} from 'react-icons/fi';
import {
  useTaskSuiteStore,
  EnterpriseProject,
  ProjectHealth,
} from '@/src/components/ui/tasks/data/taskSuiteStore';
import { getMember } from '@/src/components/ui/tasks/task-workstation/data/taskHelpers';
import Link from 'next/link';

export default function ProjectsPortfolioView() {
  const { projects, addProject, updateProject, deleteProject, tasks } = useTaskSuiteStore();

  const [viewMode, setViewMode] = useState<'cards' | 'matrix'>('cards');
  const [search, setSearch] = useState('');
  const [filterHealth, setFilterHealth] = useState<ProjectHealth | 'ALL'>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Drawer / Modals
  const [selectedProject, setSelectedProject] = useState<EnterpriseProject | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New Project Form State
  const [newProject, setNewProject] = useState({
    name: '',
    code: '',
    client: '',
    description: '',
    category: 'SALES',
    health: 'ON_TRACK' as ProjectHealth,
    priority: 'HIGH' as any,
    budgetTotal: 45000,
    totalEstimatedHours: 400,
    dueDate: '2027-01-31',
    techStack: 'Next.js, TypeScript, PostgreSQL',
  });

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.client.toLowerCase().includes(search.toLowerCase()) ||
        p.code.toLowerCase().includes(search.toLowerCase());
      const matchHealth = filterHealth === 'ALL' || p.health === filterHealth;
      const matchCategory = filterCategory === 'ALL' || p.category === filterCategory;
      return matchSearch && matchHealth && matchCategory;
    });
  }, [projects, search, filterHealth, filterCategory]);

  // Executive Metrics
  const totalBudget = projects.reduce((acc, p) => acc + p.budgetTotal, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.budgetSpent, 0);
  const budgetUtilization = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const totalHoursLogged = projects.reduce((acc, p) => acc + p.loggedHours, 0);
  const totalHoursEst = projects.reduce((acc, p) => acc + p.totalEstimatedHours, 0);
  const onTrackCount = projects.filter((p) => p.health === 'ON_TRACK' || p.health === 'COMPLETED').length;

  const handleOpenDetail = (proj: EnterpriseProject) => {
    setSelectedProject(proj);
    setIsDetailOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;

    const created: EnterpriseProject = {
      id: `proj-${Date.now()}`,
      name: newProject.name,
      code: newProject.code || `PRJ-${Math.floor(100 + Math.random() * 900)}`,
      client: newProject.client || 'Enterprise Client',
      description: newProject.description || 'Enterprise project under execution.',
      category: newProject.category as any,
      health: newProject.health,
      priority: newProject.priority,
      status: 'ACTIVE',
      progress: 5,
      startDate: new Date().toISOString().split('T')[0],
      dueDate: newProject.dueDate,
      budgetTotal: Number(newProject.budgetTotal) || 30000,
      budgetSpent: 0,
      totalEstimatedHours: Number(newProject.totalEstimatedHours) || 250,
      loggedHours: 0,
      team: [
        { userId: 'u1', role: 'Project Lead', allocatedHours: 80 },
        { userId: 'u2', role: 'Full Stack Dev', allocatedHours: 100 },
      ],
      milestones: [
        { id: `m-${Date.now()}-1`, title: 'Kickoff & Architecture Review', dueDate: '2026-11-20', completed: false },
        { id: `m-${Date.now()}-2`, title: 'Core MVP Delivery', dueDate: '2026-12-15', completed: false },
      ],
      techStack: newProject.techStack.split(',').map((s) => s.trim()).filter(Boolean),
    };

    addProject(created);
    setIsCreateOpen(false);
    setNewProject({
      name: '',
      code: '',
      client: '',
      description: '',
      category: 'SALES',
      health: 'ON_TRACK',
      priority: 'HIGH',
      budgetTotal: 45000,
      totalEstimatedHours: 400,
      dueDate: '2027-01-31',
      techStack: 'Next.js, TypeScript, PostgreSQL',
    });
  };

  const getHealthBadge = (health: ProjectHealth) => {
    switch (health) {
      case 'ON_TRACK':
        return {
          label: 'On Track',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          dot: 'bg-emerald-500',
        };
      case 'AT_RISK':
        return {
          label: 'At Risk',
          bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
          dot: 'bg-amber-500',
        };
      case 'CRITICAL':
        return {
          label: 'Critical SLA',
          bg: 'bg-red-50 text-red-700 border-red-200/80',
          dot: 'bg-red-500',
        };
      case 'COMPLETED':
        return {
          label: 'Completed',
          bg: 'bg-sky-50 text-sky-700 border-sky-200/80',
          dot: 'bg-sky-500',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 border border-violet-100">
              <FiFolder className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Projects Portfolio
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Enterprise client contracts, budget burn variance, team allocations, and milestone deliverables
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/tasks/task-workstation"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            <FiLayers className="h-4 w-4" />
            Task Workstation
          </Link>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-xs"
          >
            <FiPlus className="h-4 w-4" />
            New Enterprise Project
          </button>
        </div>
      </div>

      {/* Executive Portfolio KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Portfolio</span>
            <span className="rounded-xl bg-slate-50 p-2 text-slate-600 border border-slate-100">
              <FiFolder className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">{projects.length} Active</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">{onTrackCount} projects on track</div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Capital Budget</span>
            <span className="rounded-xl bg-emerald-50 p-2 text-emerald-600 border border-emerald-100">
              <FiDollarSign className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">
            ${(totalBudget / 1000).toFixed(0)}k
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Burned: ${(totalSpent / 1000).toFixed(1)}k</span>
            <span className="font-bold text-slate-700">{budgetUtilization}%</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600">Capacity Logged</span>
            <span className="rounded-xl bg-sky-50 p-2 text-sky-600 border border-sky-100">
              <FiClock className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">
            {totalHoursLogged}h <span className="text-sm font-normal text-slate-400">/ {totalHoursEst}h</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">
            {Math.round((totalHoursLogged / totalHoursEst) * 100)}% capacity executed
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600">Milestones Cleared</span>
            <span className="rounded-xl bg-violet-50 p-2 text-violet-600 border border-violet-100">
              <FiCheckCircle className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">
            {projects.flatMap((p) => p.milestones).filter((m) => m.completed).length}
            <span className="text-sm font-normal text-slate-400">
              {' '}
              / {projects.flatMap((p) => p.milestones).length}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Contractual deliverables cleared</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects, client names, codes..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-xs text-slate-800 placeholder-slate-400 outline-none transition focus:border-sky-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <FiFilter className="text-slate-400" size={14} />
            <select
              value={filterHealth}
              onChange={(e) => setFilterHealth(e.target.value as any)}
              className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-sky-500"
            >
              <option value="ALL">All Health States</option>
              <option value="ON_TRACK">On Track</option>
              <option value="AT_RISK">At Risk</option>
              <option value="CRITICAL">Critical SLA</option>
              <option value="COMPLETED">Completed</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-sky-500"
            >
              <option value="ALL">All Modules</option>
              <option value="SALES">Sales & CRM</option>
              <option value="MARKETING">Marketing</option>
              <option value="GENERAL">General Workspace</option>
              <option value="SUPPORT">Support</option>
            </select>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex rounded-xl border border-slate-200 bg-slate-50/70 p-1">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              viewMode === 'cards'
                ? 'bg-white font-bold text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FiGrid size={13} /> Project Cards
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              viewMode === 'matrix'
                ? 'bg-white font-bold text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FiList size={13} /> Enterprise Matrix
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. CARDS VIEW */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const healthCfg = getHealthBadge(project.health);
            const budgetPercent = Math.round((project.budgetSpent / project.budgetTotal) * 100);
            const hoursPercent = Math.round((project.loggedHours / project.totalEstimatedHours) * 100);
            const completedMilestones = project.milestones.filter((m) => m.completed).length;

            return (
              <div
                key={project.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-md"
              >
                <div>
                  {/* Top Bar: Code, Category, Health */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-black uppercase text-slate-400">
                        {project.code}
                      </span>
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                        {project.category}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${healthCfg.bg}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${healthCfg.dot}`} />
                      {healthCfg.label}
                    </span>
                  </div>

                  {/* Project Title & Client */}
                  <h3
                    onClick={() => handleOpenDetail(project)}
                    className="mt-3 cursor-pointer text-base font-bold text-slate-900 hover:text-sky-600 transition leading-snug"
                  >
                    {project.name}
                  </h3>
                  <p className="mt-0.5 text-xs font-semibold text-slate-500">Client: {project.client}</p>
                  <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Overall Delivery Progress Bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Delivery Progress
                      </span>
                      <span className="font-bold text-slate-800">{project.progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-slate-900 transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Financial & Hours Burn Breakdown */}
                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-xs">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Budget Burn
                      </div>
                      <div className="mt-1 font-bold text-slate-800">
                        ${(project.budgetSpent / 1000).toFixed(1)}k{' '}
                        <span className="text-[10px] font-normal text-slate-400">
                          / ${(project.budgetTotal / 1000).toFixed(0)}k
                        </span>
                      </div>
                      <div className="mt-1 text-[10px] text-slate-500 font-medium">
                        {budgetPercent}% consumed
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Logged Hours
                      </div>
                      <div className="mt-1 font-bold text-slate-800">
                        {project.loggedHours}h{' '}
                        <span className="text-[10px] font-normal text-slate-400">
                          / {project.totalEstimatedHours}h
                        </span>
                      </div>
                      <div className="mt-1 text-[10px] text-slate-500 font-medium">
                        {hoursPercent}% burn
                      </div>
                    </div>
                  </div>

                  {/* Milestones Preview */}
                  <div className="mt-3.5 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 font-medium">
                      <FiCheckCircle className="text-emerald-500" size={13} />
                      Milestones:
                    </span>
                    <span className="font-bold text-slate-700">
                      {completedMilestones} / {project.milestones.length} cleared
                    </span>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded bg-white border border-slate-200 px-1.5 py-0.5 text-[9px] font-medium text-slate-600"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 4 && (
                      <span className="rounded bg-slate-100 px-1 py-0.5 text-[9px] text-slate-500">
                        +{project.techStack.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer: Team Avatars & Actions */}
                <div className="mt-5 border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between">
                    {/* Team Stack */}
                    <div className="flex -space-x-2">
                      {project.team.map((alloc) => {
                        const member = getMember(alloc.userId);
                        return (
                          <div
                            key={alloc.userId}
                            title={`${member?.name || 'Member'} (${alloc.role})`}
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-white ${
                              member?.color || 'bg-slate-500'
                            }`}
                          >
                            {member?.initials || 'U'}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                      <FiCalendar size={12} />
                      Due: {project.dueDate}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-end border-t border-slate-100/70 pt-2">
                    <button
                      onClick={() => handleOpenDetail(project)}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                    >
                      Drilldown Details <FiChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. MATRIX VIEW */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'matrix' && (
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/70 font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Project & Code</th>
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Health Status</th>
                  <th className="px-5 py-3">Delivery Progress</th>
                  <th className="px-5 py-3">Budget Burn</th>
                  <th className="px-5 py-3">Logged Hours</th>
                  <th className="px-5 py-3">Deadline</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((proj) => {
                  const healthCfg = getHealthBadge(proj.health);
                  return (
                    <tr key={proj.id} className="transition hover:bg-slate-50/70">
                      <td className="px-5 py-3.5">
                        <div
                          className="font-bold text-slate-900 hover:text-sky-600 cursor-pointer"
                          onClick={() => handleOpenDetail(proj)}
                        >
                          {proj.name}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400">{proj.code}</div>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-600">{proj.client}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${healthCfg.bg}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${healthCfg.dot}`} />
                          {healthCfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-slate-900"
                              style={{ width: `${proj.progress}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-700">{proj.progress}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-800">
                        ${(proj.budgetSpent / 1000).toFixed(1)}k / ${(proj.budgetTotal / 1000).toFixed(0)}k
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-700">
                        {proj.loggedHours}h / {proj.totalEstimatedHours}h
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-600">{proj.dueDate}</td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleOpenDetail(proj)}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PROJECT DRILLDOWN DRAWER */}
      {/* ------------------------------------------------------------- */}
      {isDetailOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition">
          <div className="h-full w-full max-w-2xl bg-white shadow-2xl flex flex-col justify-between overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-slate-400">
                    {selectedProject.code}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                      getHealthBadge(selectedProject.health).bg
                    }`}
                  >
                    {getHealthBadge(selectedProject.health).label}
                  </span>
                </div>
                <h2 className="mt-1 text-xl font-bold text-slate-900">{selectedProject.name}</h2>
                <p className="text-xs text-slate-500 font-medium">Client: {selectedProject.client}</p>
              </div>

              <button
                onClick={() => setIsDetailOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="space-y-6 p-6">
              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Project Scope & Abstract
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {selectedProject.description}
                </p>
              </div>

              {/* Financial & Time Metrics Matrix */}
              <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Contract Total Budget</span>
                  <div className="mt-1 text-xl font-black text-slate-900">
                    ${selectedProject.budgetTotal.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Spent: ${selectedProject.budgetSpent.toLocaleString()} (
                    {Math.round((selectedProject.budgetSpent / selectedProject.budgetTotal) * 100)}%)
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Hours Allocation</span>
                  <div className="mt-1 text-xl font-black text-slate-900">
                    {selectedProject.loggedHours}h / {selectedProject.totalEstimatedHours}h
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Remaining: {selectedProject.totalEstimatedHours - selectedProject.loggedHours}h
                  </div>
                </div>
              </div>

              {/* Milestones Delivery Roadmap */}
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Contractual Milestones
                  </h4>
                  <span className="text-xs font-bold text-slate-700">
                    {selectedProject.milestones.filter((m) => m.completed).length} /{' '}
                    {selectedProject.milestones.length} Completed
                  </span>
                </div>

                <div className="mt-3 space-y-2.5">
                  {selectedProject.milestones.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        {m.completed ? (
                          <FiCheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                        )}
                        <span className={`font-semibold ${m.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {m.title}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-400">Target: {m.dueDate}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Allocation */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Allocated Engineering & Product Staff
                </h4>
                <div className="mt-3 divide-y divide-slate-100 rounded-2xl border border-slate-200/80 bg-white">
                  {selectedProject.team.map((alloc) => {
                    const member = getMember(alloc.userId);
                    return (
                      <div key={alloc.userId} className="flex items-center justify-between p-3 text-xs">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${
                              member?.color || 'bg-slate-500'
                            }`}
                          >
                            {member?.initials || 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{member?.name}</div>
                            <div className="text-[11px] text-slate-400">{alloc.role}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-800">{alloc.allocatedHours} hrs</div>
                          <div className="text-[10px] text-slate-400">Dedicated</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Linked Active Tasks */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Active Project Tickets ({tasks.filter((t) => t.projectId === selectedProject.id).length})
                </h4>
                <div className="mt-2.5 space-y-2">
                  {tasks
                    .filter((t) => t.projectId === selectedProject.id)
                    .slice(0, 4)
                    .map((t) => (
                      <div
                        key={t._id}
                        className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 text-xs"
                      >
                        <span className="font-bold text-slate-800 truncate max-w-[280px]">
                          {t.title}
                        </span>
                        <span className="rounded bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                          {t.status}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 bg-slate-50 p-6 flex items-center justify-between">
              <Link
                href="/tasks/task-workstation"
                onClick={() => setIsDetailOpen(false)}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition shadow-xs"
              >
                <FiLayers size={13} />
                Open In Workstation
              </Link>

              <button
                onClick={() => setIsDetailOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Close Drilldown
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CREATE NEW PROJECT MODAL */}
      {/* ------------------------------------------------------------- */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Create Enterprise Project</h3>
                <p className="text-xs text-slate-500">
                  Register new client contract or internal workstation product
                </p>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-500">Project Name *</label>
                <input
                  type="text"
                  required
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="e.g. Apex AI Customer Engine"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-800 outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-500">Project Code</label>
                  <input
                    type="text"
                    value={newProject.code}
                    onChange={(e) => setNewProject({ ...newProject, code: e.target.value })}
                    placeholder="e.g. APX-ENG"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-800 outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-500">Client / Company</label>
                  <input
                    type="text"
                    value={newProject.client}
                    onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                    placeholder="e.g. Apex Global Corp"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-800 outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-slate-500">Description</label>
                <textarea
                  rows={2}
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="High-level objectives and deliverables..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-800 outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-500">Category</label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs font-medium text-slate-700 outline-none"
                  >
                    <option value="SALES">Sales & CRM</option>
                    <option value="MARKETING">Marketing</option>
                    <option value="GENERAL">General</option>
                    <option value="SUPPORT">Support</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-500">Health</label>
                  <select
                    value={newProject.health}
                    onChange={(e) => setNewProject({ ...newProject, health: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs font-medium text-slate-700 outline-none"
                  >
                    <option value="ON_TRACK">On Track</option>
                    <option value="AT_RISK">At Risk</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-500">Target Deadline</label>
                  <input
                    type="date"
                    value={newProject.dueDate}
                    onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-500">Budget ($)</label>
                  <input
                    type="number"
                    value={newProject.budgetTotal}
                    onChange={(e) => setNewProject({ ...newProject, budgetTotal: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-500">Estimated Hours</label>
                  <input
                    type="number"
                    value={newProject.totalEstimatedHours}
                    onChange={(e) => setNewProject({ ...newProject, totalEstimatedHours: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
