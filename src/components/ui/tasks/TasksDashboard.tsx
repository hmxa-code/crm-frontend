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
      <div className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Task Management Suite</h1>
          <p className="mt-1 text-xs text-slate-500">
            Enterprise workstation, project portfolios, time tracking, OS behavior auditing, and productivity intelligence.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/tasks/time-tracker"
            className="inline-flex items-center gap-1.5 rounded-xl bg-sky-50 px-3.5 py-2 text-xs font-bold text-sky-700 hover:bg-sky-100 transition shadow-xs border border-sky-100"
          >
            <FiPlay size={12} className="text-sky-600" />
            Live Timer
          </Link>
          <button
            type="button"
            onClick={() => resetToSeed()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition shadow-xs"
          >
            <FiRefreshCw className="h-3.5 w-3.5" />
            Reset Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Active Projects', value: `${projects.length} Portfolios`, icon: FiFolder, color: 'text-violet-600' },
          { label: 'Open Work Items', value: open, icon: FiList, color: 'text-slate-700' },
          { label: 'Urgent SLA Tasks', value: urgent, icon: FiAlertCircle, color: 'text-red-600' },
          { label: 'Delivery Completion', value: `${completion}%`, icon: FiCheckCircle, color: 'text-emerald-600' },
        ].map((card) => (
          <div key={card.label} className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{card.label}</p>
              <h3 className={`mt-2 text-2xl font-black ${card.color}`}>{card.value}</h3>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 text-slate-600">
              <card.icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Operational Modules Navigation Grid */}
      <div>
        <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Enterprise Workstation Modules</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              href: '/tasks/task-workstation',
              title: 'Task Workstation',
              desc: 'ClickUp-grade Kanban, data matrix list, and milestone timeline.',
              icon: FiGrid,
              color: 'text-sky-600 bg-sky-50',
            },
            {
              href: '/tasks/my-tasks',
              title: 'My Assigned Tasks',
              desc: 'Personal queue, interactive checklist progress, and timer triggers.',
              icon: FiCheckCircle,
              color: 'text-emerald-600 bg-emerald-50',
            },
            {
              href: '/tasks/project-portfolio',
              title: 'Projects Portfolio',
              desc: 'Client contracts, budget burn, deliverables, and team allocation.',
              icon: FiFolder,
              color: 'text-violet-600 bg-violet-50',
            },
            {
              href: '/tasks/time-tracker',
              title: 'Project Time Tracker',
              desc: 'Project-wise stopwatch with distraction-free Fullscreen Focus Mode.',
              icon: FiClock,
              color: 'text-amber-600 bg-amber-50',
            },
            {
              href: '/tasks/os-tracker',
              title: 'Activity & Behavior Tracker',
              desc: 'Telemetry of active software, window titles, URLs, and keystrokes.',
              icon: FiActivity,
              color: 'text-rose-600 bg-rose-50',
            },
            {
              href: '/tasks/behavior-logs',
              title: '10-Min Summary Logs',
              desc: '10-minute interval breakdowns of software usage and AI audits.',
              icon: FiFileText,
              color: 'text-indigo-600 bg-indigo-50',
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`rounded-xl p-2.5 ${item.color}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <FiArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-sky-600" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Tasks & Task Breakdown */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs lg:col-span-2">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Tasks Stream</h2>
              <p className="text-xs text-slate-500">{tasks.length} total active tasks across enterprise projects.</p>
            </div>
            <Link href="/tasks/task-workstation" className="text-xs font-bold text-sky-600 hover:text-sky-700">
              Open workstation →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-3 py-3">Task Details</th>
                  <th className="px-3 py-3">Project</th>
                  <th className="px-3 py-3">Assignee</th>
                  <th className="px-3 py-3">Priority</th>
                  <th className="px-3 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recent.map((task) => {
                  const statusCfg = getStatusConfig(task.status);
                  const priorityCfg = getPriorityConfig(task.priority);
                  const assignee = getMember(task.assigneeId);
                  return (
                    <tr key={task._id} className="hover:bg-slate-50/60">
                      <td className="px-3 py-3 font-semibold text-slate-900 max-w-[200px] truncate">{task.title}</td>
                      <td className="px-3 py-3">
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 truncate">
                          {task.projectName || task.moduleType}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-slate-600 font-medium">{assignee?.name ?? '—'}</td>
                      <td className="px-3 py-3">
                        <span className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase ${priorityCfg.className}`}>
                          {priorityCfg.label}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusCfg.badgeBg}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
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
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="mb-3 text-sm font-bold text-slate-900">Workflow Status Mix</h2>
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

          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-400">Overall completion</span>
              <span className="text-xs font-bold text-slate-700">{completion}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${completion}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
