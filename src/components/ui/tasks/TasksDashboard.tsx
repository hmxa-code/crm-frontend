'use client';

import Link from 'next/link';
import {
  FiAlertCircle,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiGrid,
  FiList,
  FiTrendingUp,
  FiRefreshCw,
  FiFolder,
  FiActivity,
  FiFileText,
  FiPlay,
} from 'react-icons/fi';
import { useTaskSuiteStore } from './data/taskSuiteStore';
import { getMember, getPriorityConfig, getStatusConfig } from './task-workstation/data/taskHelpers';

export default function TasksDashboard() {
  const { tasks, resetToSeed, projects } = useTaskSuiteStore();

  const open = tasks.filter((t) => t.status !== 'DONE').length;
  const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const urgent = tasks.filter((t) => (t.priority === 'URGENT' || t.priority === 'HIGH') && t.status !== 'DONE').length;
  const done = tasks.filter((t) => t.status === 'DONE').length;
  const completion = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const recent = [...tasks].sort((a, b) => +new Date(b.updatedAt ?? 0) - +new Date(a.updatedAt ?? 0)).slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
        <div className="max-w-xl">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Task Management Suite</h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Enterprise-grade workstation for project portfolios, time tracking, OS behavior auditing, and productivity intelligence.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/tasks/time-tracker"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-sm"
          >
            <FiPlay size={14} />
            Live Timer
          </Link>
          <button
            type="button"
            onClick={() => resetToSeed()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm"
          >
            <FiRefreshCw className="h-4 w-4" />
            Reset Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Active Projects', value: `${projects.length}`, icon: FiFolder, color: 'text-blue-600', bg: 'bg-blue-50/50' },
          { label: 'Open Work Items', value: open, icon: FiList, color: 'text-slate-700', bg: 'bg-slate-50/50' },
          { label: 'Urgent SLA Tasks', value: urgent, icon: FiAlertCircle, color: 'text-amber-600', bg: 'bg-amber-50/50' },
          { label: 'Delivery Completion', value: `${completion}%`, icon: FiCheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50/50' },
        ].map((card) => (
          <div key={card.label} className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{card.label}</p>
              <h3 className={`mt-2 text-2xl font-bold ${card.color}`}>{card.value}</h3>
            </div>
            <div className={`mt-4 inline-flex items-center justify-center rounded-xl p-2.5 ${card.bg} transition group-hover:scale-105`}>
              <card.icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Operational Modules Navigation Grid */}
      <div>
        <h2 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Enterprise Workstation Modules</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              href: '/tasks/task-workstation',
              title: 'Task Workstation',
              desc: 'ClickUp-grade Kanban, data matrix list, and milestone timeline.',
              icon: FiGrid,
              color: 'text-blue-600',
            },
            {
              href: '/tasks/my-tasks',
              title: 'My Assigned Tasks',
              desc: 'Personal queue, interactive checklist progress, and timer triggers.',
              icon: FiCheckCircle,
              color: 'text-emerald-600',
            },
            {
              href: '/tasks/project-portfolio',
              title: 'Projects Portfolio',
              desc: 'Client contracts, budget burn, deliverables, and team allocation.',
              icon: FiFolder,
              color: 'text-violet-600',
            },
            {
              href: '/tasks/time-tracker',
              title: 'Project Time Tracker',
              desc: 'Project-wise stopwatch with distraction-free Fullscreen Focus Mode.',
              icon: FiClock,
              color: 'text-amber-600',
            },
            {
              href: '/tasks/os-tracker',
              title: 'Activity & Behavior Tracker',
              desc: 'Telemetry of active software, window titles, URLs, and keystrokes.',
              icon: FiActivity,
              color: 'text-rose-600',
            },
            {
              href: '/tasks/behavior-logs',
              title: '10-Min Summary Logs',
              desc: '10-minute interval breakdowns of software usage and AI audits.',
              icon: FiFileText,
              color: 'text-indigo-600',
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600 transition group-hover:bg-blue-50 group-hover:text-blue-600">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  </div>
                  <FiArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-500" />
                </div>
                <p className="mt-3 text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Tasks & Task Breakdown */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Tasks Stream</h2>
              <p className="text-xs text-slate-500">{tasks.length} total active tasks across enterprise projects.</p>
            </div>
            <Link href="/tasks/task-workstation" className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition">
              View All Tasks
            </Link>
          </div>
          
          {/* Mobile Responsive Table */}
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200/80 bg-slate-50/50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Task</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Project</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Assignee</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent.map((task) => {
                  const statusCfg = getStatusConfig(task.status);
                  const priorityCfg = getPriorityConfig(task.priority);
                  const assignee = getMember(task.assigneeId);
                  return (
                    <tr key={task._id} className="transition hover:bg-slate-50/60">
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-900">{task.title}</div>
                        <div className="mt-0.5 text-[10px] text-slate-500 line-clamp-1">{task.projectName || task.moduleType}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center rounded bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                          {task.projectName || task.moduleType}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-xs font-medium text-slate-700">{assignee?.name ?? '—'}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center rounded border px-2 py-1 text-[10px] font-bold uppercase ${priorityCfg.className}`}>
                          {priorityCfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusCfg.badgeBg}`}>
                          <span className={`h-2 w-2 rounded-full ${statusCfg.dot}`} />
                          {statusCfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Task Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="mb-4 text-sm font-bold text-slate-900">Workflow Status Mix</h2>
            <div className="space-y-3">
              {[
                { label: 'To Do', count: tasks.filter((t) => t.status === 'TODO').length, color: 'bg-slate-400' },
                { label: 'In Progress', count: tasks.filter((t) => t.status === 'IN_PROGRESS').length, color: 'bg-blue-500' },
                { label: 'In Review', count: tasks.filter((t) => t.status === 'IN_REVIEW').length, color: 'bg-violet-500' },
                { label: 'Done', count: tasks.filter((t) => t.status === 'DONE').length, color: 'bg-emerald-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                    <span className="text-xs font-medium text-slate-600">{item.label}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Overall completion</span>
              <span className="text-xs font-bold text-slate-700">{completion}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${completion}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
