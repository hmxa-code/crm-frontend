'use client';

import React, { useState } from 'react';
import {
  FiTarget,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiLayers,
  FiAlertCircle,
  FiFilter,
  FiPlus,
  FiFolder,
  FiUser,
} from 'react-icons/fi';
import { useTaskSuiteStore } from '@/src/components/ui/tasks/data/taskSuiteStore';
import { getMember } from '@/src/components/ui/tasks/task-workstation/data/taskHelpers';
import Link from 'next/link';

export default function SprintsPage() {
  const { projects, tasks } = useTaskSuiteStore();
  const [selectedSprintFilter, setSelectedSprintFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');

  const sprints = [
    {
      id: 'sp-1',
      name: 'Sprint 24: Core Architecture & OS Shadow Telemetry',
      status: 'ACTIVE',
      startDate: '2026-10-25',
      endDate: '2026-11-08',
      committedPoints: 54,
      completedPoints: 42,
      projectName: 'Wholcure CRM Enterprise',
      projectId: 'proj-001',
      goal: 'Deliver lead mapping validation and background OS shadow daemon hooks for enterprise audit.',
      teamMembers: ['u1', 'u2', 'u3'],
    },
    {
      id: 'sp-2',
      name: 'Sprint 12: Realtime Socket Sync & Board Drag',
      status: 'ACTIVE',
      startDate: '2026-10-28',
      endDate: '2026-11-12',
      committedPoints: 44,
      completedPoints: 26,
      projectName: 'Comketra Real-Time Workspace',
      projectId: 'proj-002',
      goal: 'Finalize low-latency WebSocket heartbeat and live board updates across team members.',
      teamMembers: ['u1', 'u2', 'u5'],
    },
    {
      id: 'sp-3',
      name: 'Sprint 8: Merchant Payment Reconciliation',
      status: 'COMPLETED',
      startDate: '2026-10-10',
      endDate: '2026-10-24',
      committedPoints: 60,
      completedPoints: 60,
      projectName: 'NashPay Digital Wallet Gateway',
      projectId: 'proj-003',
      goal: 'Achieve 100% test coverage for multi-currency automated webhook settlements.',
      teamMembers: ['u1', 'u4', 'u5'],
    },
  ];

  const filteredSprints = sprints.filter(
    (s) => selectedSprintFilter === 'ALL' || s.status === selectedSprintFilter
  );

  const totalCommitted = sprints.reduce((acc, s) => acc + s.committedPoints, 0);
  const totalCompleted = sprints.reduce((acc, s) => acc + s.completedPoints, 0);
  const avgVelocity = Math.round((totalCompleted / sprints.length) * 10) / 10;

  return (
    <div className="p-4 md:p-6 bg-slate-50/30 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
            <FiTarget className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Sprints & Milestones
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Agile velocity tracking, sprint burn curves, and contractual delivery milestones
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/tasks/project-portfolio"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            <FiFolder className="h-4 w-4 text-violet-600" />
            Projects Portfolio
          </Link>
          <Link
            href="/tasks/task-workstation"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-xs"
          >
            <FiLayers className="h-4 w-4" />
            Open Workstation
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Sprints</span>
            <span className="rounded-xl bg-slate-50 p-2 text-slate-600 border border-slate-100">
              <FiTarget className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">{sprints.length} Cycles</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">
            {sprints.filter((s) => s.status === 'ACTIVE').length} active in progress
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Points Cleared</span>
            <span className="rounded-xl bg-emerald-50 p-2 text-emerald-600 border border-emerald-100">
              <FiCheckCircle className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-black text-emerald-600">
            {totalCompleted} <span className="text-sm font-normal text-slate-400">/ {totalCommitted} pts</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">
            {Math.round((totalCompleted / totalCommitted) * 100)}% execution rate
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600">Team Velocity</span>
            <span className="rounded-xl bg-sky-50 p-2 text-sky-600 border border-sky-100">
              <FiTrendingUp className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">{avgVelocity} pts</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Average points per sprint</div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600">Milestones Delivery</span>
            <span className="rounded-xl bg-violet-50 p-2 text-violet-600 border border-violet-100">
              <FiClock className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">
            {projects.flatMap((p) => p.milestones).filter((m) => m.completed).length}{' '}
            <span className="text-sm font-normal text-slate-400">
              / {projects.flatMap((p) => p.milestones).length}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">All deliverables on track</div>
        </div>
      </div>

      {/* Sprints List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Active & Historical Sprints</h2>
          <div className="flex rounded-xl border border-slate-200 bg-white p-1">
            {(['ALL', 'ACTIVE', 'COMPLETED'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedSprintFilter(filter)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold uppercase transition ${
                  selectedSprintFilter === filter
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {filteredSprints.map((sprint) => {
            const progress = Math.round((sprint.completedPoints / sprint.committedPoints) * 100);

            return (
              <div
                key={sprint.id}
                className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col justify-between transition hover:border-slate-300"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 border border-sky-100">
                      {sprint.projectName}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        sprint.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {sprint.status}
                    </span>
                  </div>

                  <h3 className="mt-3 text-sm font-bold text-slate-900 leading-snug">
                    {sprint.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {sprint.goal}
                  </p>

                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Story Velocity
                      </span>
                      <span className="font-bold text-slate-700">
                        {sprint.completedPoints} / {sprint.committedPoints} pts ({progress}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-slate-900 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between">
                    {/* Team Avatars */}
                    <div className="flex -space-x-1.5">
                      {sprint.teamMembers.map((userId) => {
                        const member = getMember(userId);
                        return (
                          <div
                            key={userId}
                            title={member?.name}
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold text-white ring-2 ring-white ${
                              member?.color || 'bg-slate-500'
                            }`}
                          >
                            {member?.initials}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                      <FiCalendar size={11} />
                      {sprint.startDate.split('-').slice(1).join('/')} → {sprint.endDate.split('-').slice(1).join('/')}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contractual Milestones Matrix */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Contractual Milestones Roadmap</h3>
          <p className="text-xs text-slate-500">
            Enterprise delivery checkpoints and SLA deadlines across portfolio contracts
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {projects
            .flatMap((p) => p.milestones.map((m) => ({ ...m, projectName: p.name, projectCode: p.code })))
            .map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 text-xs transition hover:bg-white hover:border-slate-200"
              >
                <div className="flex items-center gap-3">
                  {m.completed ? (
                    <FiCheckCircle className="text-emerald-500 h-5 w-5 shrink-0" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-slate-300 shrink-0" />
                  )}
                  <div>
                    <div className={`font-semibold ${m.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {m.title}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      {m.projectName} ({m.projectCode})
                    </div>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-slate-500 font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded">
                  {m.dueDate}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
