'use client';

import Link from 'next/link';
import {
  FiAlertCircle,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiGrid,
  FiList,
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
    <div className="space-y-6 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-5">
      {/* Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-300 bg-white p-4 sm:p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">Task Management Suite</h1>
          <p className="max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-sm">
            Enterprise-grade workstation for project portfolios, time tracking, OS behavior auditing, and productivity intelligence.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200 sm:border-t-0 sm:pt-0 shrink-0">
          <Link
            href="/tasks/time-tracker"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-95"
          >
            <FiPlay className="h-4 w-4 text-white" />
            <span style={{color:'white'}}>Live Timer</span>
          </Link>
          <button
            type="button"
            onClick={() => resetToSeed()}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-100 active:scale-95 shadow-2xs"
          >
            <FiRefreshCw className="h-3.5 w-3.5 text-slate-700" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Active Projects', value: `${projects.length}`, sublabel: 'Enterprise portfolios', icon: FiFolder, color: 'text-blue-600', bg: 'bg-blue-50 text-blue-600 border-blue-200' },
          { label: 'Open Work Items', value: open, sublabel: 'Pending execution', icon: FiList, color: 'text-slate-900', bg: 'bg-slate-100 text-slate-900 border-slate-200' },
          { label: 'Urgent SLA Tasks', value: urgent, sublabel: 'High priority backlog', icon: FiAlertCircle, color: 'text-amber-600', bg: 'bg-amber-50 text-amber-600 border-amber-200' },
          { label: 'Delivery Completion', value: `${completion}%`, sublabel: 'Overall productivity', icon: FiCheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
        ].map((card) => (
          <div key={card.label} className="flex items-center justify-between rounded-2xl border border-slate-300 bg-white p-4 sm:p-5 shadow-xs">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{card.label}</p>
              <h3 className="mt-1.5 text-xl sm:text-2xl font-black text-slate-900">{card.value}</h3>
              <p className="mt-1 text-[11px] text-slate-500 font-medium">{card.sublabel}</p>
            </div>
            <div className={`rounded-xl p-3 border ${card.bg}`}>
              <card.icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Operational Modules Navigation Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Enterprise Workstation Modules
          </h2>
          <span className="text-xs text-slate-500">Suite Navigation</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              href: '/tasks/task-workstation',
              title: 'Task Workstation',
              desc: 'ClickUp-grade Kanban, data matrix list, and milestone timeline.',
              icon: FiGrid,
            },
            {
              href: '/tasks/my-tasks',
              title: 'My Assigned Tasks',
              desc: 'Personal queue, interactive checklist progress, and timer triggers.',
              icon: FiCheckCircle,
            },
            {
              href: '/tasks/project-portfolio',
              title: 'Projects Portfolio',
              desc: 'Client contracts, budget burn, deliverables, and team allocation.',
              icon: FiFolder,
            },
            {
              href: '/tasks/time-tracker',
              title: 'Project Time Tracker',
              desc: 'Project-wise stopwatch with distraction-free Fullscreen Focus Mode.',
              icon: FiClock,
            },
            {
              href: '/tasks/os-tracker',
              title: 'Activity & Behavior Tracker',
              desc: 'Telemetry of active software, window titles, URLs, and keystrokes.',
              icon: FiActivity,
            },
            {
              href: '/tasks/behavior-logs',
              title: '10-Min Summary Logs',
              desc: '10-minute interval breakdowns of software usage and AI audits.',
              icon: FiFileText,
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col justify-between rounded-2xl border border-slate-300 bg-white p-4 sm:p-5 shadow-xs transition hover:border-slate-400 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="rounded-xl p-2.5 bg-slate-100 text-slate-900 border border-slate-200">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <FiArrowRight className="h-4 w-4 text-slate-500 transition group-hover:translate-x-1 group-hover:text-black" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Tasks & Task Breakdown */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-300 bg-white p-4 sm:p-5 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Recent Tasks Stream</h2>
                <p className="text-xs text-slate-500">{tasks.length} total active tasks across enterprise projects.</p>
              </div>
              <Link href="/tasks/task-workstation" className="inline-flex items-center gap-1.5 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition">
                <span className='text-white'>View All Tasks</span>
              </Link>
            </div>
            
            {/* Mobile Responsive Table */}
            <div className="overflow-x-auto -mx-5 px-5">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold uppercase tracking-wider">Task</th>
                    <th className="px-4 py-2.5 font-semibold uppercase tracking-wider">Project</th>
                    <th className="px-4 py-2.5 font-semibold uppercase tracking-wider">Assignee</th>
                    <th className="px-4 py-2.5 font-semibold uppercase tracking-wider">Priority</th>
                    <th className="px-4 py-2.5 font-semibold uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recent.map((task) => {
                    const statusCfg = getStatusConfig(task.status);
                    const priorityCfg = getPriorityConfig(task.priority);
                    const assignee = getMember(task.assigneeId);
                    return (
                      <tr key={task._id} className="transition hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{task.title}</div>
                          <div className="mt-0.5 text-[10px] text-slate-500 line-clamp-1">{task.projectName || task.moduleType}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                            {task.projectName || task.moduleType}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs font-medium text-slate-700">{assignee?.name ?? '—'}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-bold uppercase ${priorityCfg.className}`}>
                            {priorityCfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${statusCfg.badgeBg}`}>
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
        </div>

        {/* Task Breakdown */}
        <div className="rounded-2xl border border-slate-300 bg-white p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="mb-4 text-sm font-bold text-slate-900">Workflow Status Mix</h2>
            <div className="space-y-3">
              {[
                { label: 'To Do', count: tasks.filter((t) => t.status === 'TODO').length, color: 'bg-blue-500' },
                { label: 'In Progress', count: tasks.filter((t) => t.status === 'IN_PROGRESS').length, color: 'bg-amber-500' },
                { label: 'In Review', count: tasks.filter((t) => t.status === 'IN_REVIEW').length, color: 'bg-violet-500' },
                { label: 'Done', count: tasks.filter((t) => t.status === 'DONE').length, color: 'bg-emerald-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${item.color}`} />
                    <span className="text-xs font-medium text-slate-600">{item.label}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 font-medium">Overall completion</span>
              <span className="text-xs font-bold text-slate-900">{completion}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${completion}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}