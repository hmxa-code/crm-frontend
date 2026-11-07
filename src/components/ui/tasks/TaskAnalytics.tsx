'use client';

import React, { useState } from 'react';
import {
  FiBarChart2,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiCalendar,
  FiDownload,
  FiFilter,
  FiFolder,
  FiDollarSign,
  FiPieChart,
} from 'react-icons/fi';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useTaskSuiteStore } from './data/taskSuiteStore';
import Link from 'next/link';

export default function TaskAnalytics() {
  const { projects, tasks, timeLogs } = useTaskSuiteStore();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'quarter'>('7d');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('ALL');

  // Chart 1 Data: Weekly Velocity Trend
  const weeklyVelocityData = [
    { day: 'Mon', billableHours: 6.5, nonBillable: 1.0, productivity: 92 },
    { day: 'Tue', billableHours: 7.2, nonBillable: 0.8, productivity: 95 },
    { day: 'Wed', billableHours: 5.8, nonBillable: 1.5, productivity: 88 },
    { day: 'Thu', billableHours: 8.0, nonBillable: 0.5, productivity: 98 },
    { day: 'Fri', billableHours: 6.0, nonBillable: 1.2, productivity: 90 },
    { day: 'Sat', billableHours: 3.5, nonBillable: 0.5, productivity: 85 },
    { day: 'Sun', billableHours: 1.0, nonBillable: 0.2, productivity: 80 },
  ];

  // Chart 2 Data: Project Hours Estimated vs Actual
  const projectComparisonData = projects.map((p) => ({
    name: p.code,
    fullName: p.name,
    estimated: p.totalEstimatedHours,
    actual: p.loggedHours,
  }));

  // Chart 3 Data: Software Category Usage Mix
  const appMixData = [
    { name: 'VS Code (Development)', value: 54, color: '#0284c7' },
    { name: 'Chrome (Research/Docs)', value: 24, color: '#f59e0b' },
    { name: 'Figma (UI/UX)', value: 12, color: '#8b5cf6' },
    { name: 'Slack (Comms)', value: 6, color: '#ec4899' },
    { name: 'Terminal / CLI', value: 4, color: '#10b981' },
  ];

  // Calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const urgentTasks = tasks.filter((t) => t.priority === 'URGENT' || t.priority === 'HIGH').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalBillableHours = timeLogs
    .filter((l) => l.isBillable)
    .reduce((acc, l) => acc + l.durationSeconds / 3600, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <FiBarChart2 className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Reports & Productivity Analytics
              </h1>
              <p className="text-xs text-slate-500">
                Enterprise velocity curves, billable hours audit, project burn variance, and software efficiency telemetry
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-xl border border-slate-200 bg-slate-50/70 p-1">
            {(['7d', '30d', 'quarter'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase transition ${
                  timeRange === range
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-xs"
          >
            <FiDownload className="h-4 w-4" />
            Print Analytics Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Completion Rate
            </span>
            <span className="rounded-md bg-emerald-50 p-2 text-emerald-600">
              <FiCheckCircle className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600">{completionRate}%</div>
          <div className="mt-1 text-[11px] text-slate-500">
            {completedTasks} of {totalTasks} tickets closed
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
              Billable Hours
            </span>
            <span className="rounded-md bg-sky-50 p-2 text-sky-600">
              <FiClock className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {totalBillableHours.toFixed(1)} hrs
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            ${(totalBillableHours * 65).toLocaleString()} gross billable value
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600">
              Sprint Velocity
            </span>
            <span className="rounded-md bg-violet-50 p-2 text-violet-600">
              <FiTrendingUp className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">38.4 pts</div>
          <div className="mt-1 text-[11px] text-slate-500">+14% vs previous sprint cycle</div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
              Active SLA Tickets
            </span>
            <span className="rounded-md bg-amber-50 p-2 text-amber-600">
              <FiAlertTriangle className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{urgentTasks} Tickets</div>
          <div className="mt-1 text-[11px] text-slate-500">High priority SLA deliverables</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Weekly Velocity Area Chart */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Weekly Velocity & Hours Logged</h3>
              <p className="text-xs text-slate-500">Billable vs non-billable delivery hours</p>
            </div>
            <span className="rounded-lg bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700">
              Avg: 6.8h/day
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyVelocityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit="h" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '11px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="billableHours"
                  name="Billable Hours"
                  stroke="#0284c7"
                  fill="#bae6fd"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="nonBillable"
                  name="Internal / Non-billable"
                  stroke="#94a3b8"
                  fill="#f1f5f9"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Comparison Bar Chart */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Project Hours: Estimated vs Logged</h3>
              <p className="text-xs text-slate-500">Burn rate analysis across active contracts</p>
            </div>
            <Link
              href="/tasks/project-portfolio"
              className="text-xs font-bold text-sky-600 hover:text-sky-700"
            >
              View Portfolio →
            </Link>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit="h" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '11px',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="estimated" name="Estimated Hours" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="Logged Hours" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Software Category Usage Donut Chart */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Software Category Telemetry</h3>
            <p className="text-xs text-slate-500">Time distribution across engineering tools</p>
          </div>

          <div className="flex flex-col items-center justify-center sm:flex-row gap-6">
            <div className="h-60 w-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={appMixData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {appMixData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#fff',
                      border: 'none',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 text-xs">
              {appMixData.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-slate-700">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Efficiency & Audit Assessment Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Engineering Workstation Health</h3>
            <p className="text-xs text-slate-500">Automated diagnostic score based on OS activity logs</p>

            <div className="mt-5 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-600">Deep Work Concentration</span>
                  <span className="font-bold text-emerald-600">92% Optimal</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: '92%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-600">SLA Deliverable Adherence</span>
                  <span className="font-bold text-sky-600">88% High</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-sky-500" style={{ width: '88%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-600">Context Switching Index</span>
                  <span className="font-bold text-slate-700">14% Low Distraction</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-slate-800" style={{ width: '14%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs text-slate-600">
            <span className="font-bold text-slate-900">Recommendation: </span>
            Wholcure CRM milestone M3 is pacing 4.5 days ahead of schedule. No team capacity bottlenecks detected.
          </div>
        </div>
      </div>
    </div>
  );
}
