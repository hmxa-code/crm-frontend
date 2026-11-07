'use client';

import React from 'react';
import { FiUsers, FiClock, FiCheckCircle, FiActivity, FiLayers, FiAlertTriangle, FiCalendar } from 'react-icons/fi';
import { TEAM_MEMBERS } from '@/src/components/ui/tasks/task-workstation/data/taskHelpers';
import { useTaskSuiteStore } from '@/src/components/ui/tasks/data/taskSuiteStore';
import Link from 'next/link';

export default function TeamWorkloadPage() {
  const { tasks, projects } = useTaskSuiteStore();

  const membersWithLoad = TEAM_MEMBERS.map((member) => {
    const assignedTasks = tasks.filter((t) => t.assigneeId === member.id);
    const assignedHours = assignedTasks.reduce((acc, t) => acc + (t.estimatedHours || 4), 0);
    const maxCapacityHours = 40;
    const utilization = Math.round((assignedHours / maxCapacityHours) * 100);

    return {
      ...member,
      assignedTasks,
      assignedHours,
      maxCapacityHours,
      utilization,
    };
  });

  const totalAssignedHours = membersWithLoad.reduce((acc, m) => acc + m.assignedHours, 0);
  const totalMaxCapacity = membersWithLoad.reduce((acc, m) => acc + m.maxCapacityHours, 0);
  const avgUtilization = Math.round((totalAssignedHours / totalMaxCapacity) * 100);

  return (
    <div className="p-4 md:p-6 bg-slate-50/30 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 border border-violet-100">
            <FiUsers className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Team Workload & Capacity Planning
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Engineering resource allocation, weekly capacity utilization, and burnout prevention
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/tasks/my-tasks"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            <FiCheckCircle className="h-4 w-4 text-emerald-600" />
            My Assigned Queue
          </Link>
          <Link
            href="/tasks/time-tracker"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-xs"
          >
            <FiClock className="h-4 w-4 text-sky-400" />
            Time Tracker
          </Link>
        </div>
      </div>

      {/* Capacity Overview Bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Staff</span>
            <span className="rounded-xl bg-slate-50 p-2 text-slate-600 border border-slate-100">
              <FiUsers className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">{membersWithLoad.length} Engineers</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Core delivery staff</div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600">Committed Hours</span>
            <span className="rounded-xl bg-sky-50 p-2 text-sky-600 border border-sky-100">
              <FiClock className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">
            {totalAssignedHours}h <span className="text-sm font-normal text-slate-400">/ {totalMaxCapacity}h max</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">40h per member threshold</div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Team Utilization</span>
            <span className="rounded-xl bg-emerald-50 p-2 text-emerald-600 border border-emerald-100">
              <FiActivity className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-black text-emerald-600">{avgUtilization}%</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Healthy capacity range</div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600">Active Work Items</span>
            <span className="rounded-xl bg-violet-50 p-2 text-violet-600 border border-violet-100">
              <FiLayers className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">{tasks.length} Tickets</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Distributed across projects</div>
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {membersWithLoad.map((member) => {
          const isOverloaded = member.utilization > 100;
          const isOptimal = member.utilization >= 60 && member.utilization <= 90;

          return (
            <div
              key={member.id}
              className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col justify-between transition hover:border-slate-300"
            >
              <div>
                {/* Member Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xs font-bold text-white shadow-xs ${member.color}`}
                    >
                      {member.initials}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{member.name}</h3>
                      <div className="text-[11px] text-slate-400 font-medium">
                        {member.assignedTasks.length} active assignments
                      </div>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      isOverloaded
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : isOptimal
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-amber-50 text-amber-600 border border-amber-200'
                    }`}
                  >
                    {member.utilization}% load
                  </span>
                </div>

                {/* Capacity Progress Bar */}
                <div className="mt-5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium text-[11px]">Weekly Committed Hours</span>
                    <span className="font-bold text-slate-800">
                      {member.assignedHours}h / {member.maxCapacityHours}h max
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOverloaded
                          ? 'bg-red-500'
                          : member.utilization > 75
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, member.utilization)}%` }}
                    />
                  </div>
                </div>

                {/* Assigned Tasks Preview */}
                <div className="mt-4 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Active Assigned Tickets
                  </div>
                  <div className="space-y-1.5">
                    {member.assignedTasks.slice(0, 3).map((task) => (
                      <div
                        key={task._id}
                        className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-2 text-xs"
                      >
                        <span className="font-medium text-slate-800 truncate max-w-[200px]">
                          {task.title}
                        </span>
                        <span className="rounded bg-white border border-slate-200 px-1.5 py-0.5 text-[9px] font-bold text-slate-600">
                          {task.status}
                        </span>
                      </div>
                    ))}
                    {member.assignedTasks.length === 0 && (
                      <div className="text-[11px] text-slate-400 py-1 font-medium">
                        No active tickets assigned
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-medium">
                  Available: {Math.max(0, member.maxCapacityHours - member.assignedHours)} hrs
                </span>
                <span className="font-bold text-sky-600">Active Duty</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
