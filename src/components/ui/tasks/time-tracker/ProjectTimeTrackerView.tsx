'use client';

import React, { useState, useEffect } from 'react';
import {
  FiPlay,
  FiPause,
  FiSquare,
  FiClock,
  FiCalendar,
  FiDollarSign,
  FiCheckCircle,
  FiFolder,
  FiPlus,
  FiTrash2,
  FiActivity,
  FiDownload,
  FiMonitor,
  FiLayers,
  FiCpu,
  FiShield,
  FiCode,
  FiEye,
  FiRefreshCw,
} from 'react-icons/fi';
import { useTaskSuiteStore } from '../data/taskSuiteStore';
import { Task } from '../task-workstation/data/taskHelpers';
import Link from 'next/link';

export default function ProjectTimeTrackerView() {
  const {
    projects,
    tasks,
    timeLogs,
    activeTimer,
    dailyTargetSeconds,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    tickTimer,
    toggleShadowMode,
    addManualLog,
    deleteTimeLog,
    currentActiveApp,
  } = useTaskSuiteStore();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    activeTimer.projectId || projects[0]?.id || 'proj-001'
  );
  const [selectedTaskId, setSelectedTaskId] = useState<string>(activeTimer.taskId || '');
  const [timerNote, setTimerNote] = useState<string>(activeTimer.description || '');
  const [isBillable, setIsBillable] = useState<boolean>(activeTimer.isBillable);
  const [filterProject, setFilterProject] = useState<string>('ALL');

  // Manual Log Modal
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    projectId: projects[0]?.id || 'proj-001',
    taskId: '',
    description: '',
    hours: 1,
    minutes: 30,
    isBillable: true,
    date: new Date().toISOString().split('T')[0],
  });

  // Floating Mini Shadow HUD Toggle
  const [showFloatingHud, setShowFloatingHud] = useState(false);

  // Ticking effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTimer.isRunning && !activeTimer.isPaused) {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer.isRunning, activeTimer.isPaused, tickTimer]);

  // Tasks for current user or selected project
  const myAssignedTasks = tasks.filter((t) => t.assigneeId === 'u1' || !t.assigneeId);
  const projectTasks = tasks.filter((t) => !selectedProjectId || t.projectId === selectedProjectId);

  // Formatting helpers
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatHoursMinutes = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    if (hrs === 0) return `${mins}m`;
    return `${hrs}h ${mins}m`;
  };

  // Today's total logged time
  const todayDateString = new Date().toISOString().split('T')[0];
  const todayLogs = timeLogs.filter((log) => log.date === todayDateString);
  const todayTotalSeconds =
    todayLogs.reduce((acc, log) => acc + log.durationSeconds, 0) +
    (activeTimer.isRunning ? activeTimer.elapsedSeconds : 0);

  const dailyProgressPercent = Math.min(
    100,
    Math.round((todayTotalSeconds / dailyTargetSeconds) * 100)
  );

  // Filtered Time Logs
  const filteredLogs = timeLogs.filter(
    (log) => filterProject === 'ALL' || log.projectId === filterProject
  );

  // Start / Resume handler
  const handleToggleTimer = () => {
    if (!activeTimer.isRunning) {
      const task = tasks.find((t) => t._id === selectedTaskId);
      startTimer(
        selectedProjectId,
        selectedTaskId || undefined,
        task?.title || undefined,
        timerNote || 'Focused project sprint',
        isBillable
      );
    } else if (activeTimer.isPaused) {
      resumeTimer();
    } else {
      pauseTimer();
    }
  };

  const handleStartTaskTimer = (task: Task) => {
    setSelectedProjectId(task.projectId || 'proj-001');
    setSelectedTaskId(task._id);
    setTimerNote(`Working on: ${task.title}`);
    startTimer(
      task.projectId || 'proj-001',
      task._id,
      task.title,
      `Working on: ${task.title}`,
      true
    );
  };

  const handleStop = () => {
    stopTimer(timerNote);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === manualForm.projectId);
    const task = tasks.find((t) => t._id === manualForm.taskId);
    const duration = manualForm.hours * 3600 + manualForm.minutes * 60;

    addManualLog({
      projectId: manualForm.projectId,
      projectName: proj?.name || 'General Project',
      taskId: manualForm.taskId || undefined,
      taskTitle: task?.title || undefined,
      description: manualForm.description || 'Manual entry for logged sprint',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      durationSeconds: duration,
      isBillable: manualForm.isBillable,
      hourlyRate: 65,
      userName: 'Muhammad Hamza',
      date: manualForm.date,
    });

    setIsManualModalOpen(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* FLOATING DESKTOP SHADOW HUD */}
      {showFloatingHud && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-3 sm:gap-4 rounded-2xl border border-slate-800 bg-slate-950/95 p-3 sm:p-3.5 text-white shadow-2xl backdrop-blur-md transition-all">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <div className="font-mono text-xs font-black text-white">
                {formatTime(activeTimer.elapsedSeconds)}
              </div>
              <div className="text-[10px] text-slate-400 truncate max-w-[120px] sm:max-w-[160px]">
                {activeTimer.projectName}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 border-l border-slate-800 pl-3">
            <button
              onClick={handleToggleTimer}
              className={`rounded-lg p-1.5 transition ${
                activeTimer.isRunning && !activeTimer.isPaused
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-emerald-500 text-slate-950'
              }`}
            >
              {activeTimer.isRunning && !activeTimer.isPaused ? (
                <FiPause size={14} />
              ) : (
                <FiPlay size={14} />
              )}
            </button>
            {activeTimer.isRunning && (
              <button
                onClick={handleStop}
                className="rounded-lg bg-red-600/90 p-1.5 text-white hover:bg-red-500"
              >
                <FiSquare size={14} />
              </button>
            )}
            <button
              onClick={() => setShowFloatingHud(false)}
              className="rounded-lg p-1 text-slate-400 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                Project Time Tracker
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Live task timer, background desktop activity shadow daemon, and enterprise billable ledger
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <button
            onClick={() => setShowFloatingHud(!showFloatingHud)}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl px-3.5 sm:px-4 py-2.5 text-xs font-semibold transition shadow-xs ${
              showFloatingHud
                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <FiMonitor size={14} />
            <span className="truncate">{showFloatingHud ? 'Hide Floating HUD' : 'Pin Floating HUD'}</span>
          </button>
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-3.5 sm:px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-xs"
          >
            <FiPlus size={14} /> <span className="truncate">Add Manual Time Entry</span>
          </button>
        </div>
      </div>

      {/* Master Active Timer Console */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Controls Left: Project, Task, Notes */}
          <div className="flex-1 space-y-3.5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Target Project *
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => {
                    setSelectedProjectId(e.target.value);
                    setSelectedTaskId('');
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-sky-500 focus:bg-white cursor-pointer"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Linked Task (Optional)
                </label>
                <select
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs font-medium text-slate-800 outline-none transition focus:border-sky-500 focus:bg-white cursor-pointer"
                >
                  <option value="">-- General Project Work --</option>
                  {projectTasks.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                value={timerNote}
                onChange={(e) => setTimerNote(e.target.value)}
                placeholder="What are you working on? (e.g. Lead validation loop logic)"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none transition focus:border-sky-500 focus:bg-white"
              />

              <label className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBillable}
                  onChange={(e) => setIsBillable(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-0"
                />
                <span>Billable ($)</span>
              </label>
            </div>
          </div>

          {/* Stopwatch & Action Center Right */}
          <div className="flex items-center justify-between lg:justify-end gap-4 sm:gap-6 border-t border-slate-100 pt-4 lg:border-t-0 lg:pt-0">
            <div className="text-left lg:text-right">
              <div className="font-mono text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                {formatTime(activeTimer.elapsedSeconds)}
              </div>
              <div className="mt-1 flex items-center lg:justify-end gap-1.5 text-[11px] font-semibold text-slate-400">
                <span
                  className={`h-2 w-2 rounded-full ${
                    activeTimer.isRunning && !activeTimer.isPaused
                      ? 'bg-emerald-500 animate-pulse'
                      : activeTimer.isPaused
                      ? 'bg-amber-500'
                      : 'bg-slate-300'
                  }`}
                />
                <span>
                  {activeTimer.isRunning && !activeTimer.isPaused
                    ? 'Timer Running'
                    : activeTimer.isPaused
                    ? 'Paused'
                    : 'Standby'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleTimer}
                className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl text-xl font-bold transition shadow-sm ${
                  activeTimer.isRunning && !activeTimer.isPaused
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
                title={activeTimer.isRunning && !activeTimer.isPaused ? 'Pause' : 'Start'}
              >
                {activeTimer.isRunning && !activeTimer.isPaused ? (
                  <FiPause size={22} />
                ) : (
                  <FiPlay size={22} className="translate-x-0.5" />
                )}
              </button>

              {activeTimer.isRunning && (
                <button
                  onClick={handleStop}
                  className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-red-500 text-white hover:bg-red-600 transition shadow-sm"
                  title="Stop & Log Entry"
                >
                  <FiSquare size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MY ASSIGNED TASKS QUEUE */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              My Assigned Tasks Queue (Start Timer Directly)
            </h2>
            <p className="text-xs text-slate-500">
              Select any assigned task below to immediately start its dedicated project stopwatch
            </p>
          </div>
          <Link
            href="/tasks/my-tasks"
            className="text-xs font-bold text-sky-600 hover:text-sky-700 self-start sm:self-auto mt-1 sm:mt-0"
          >
            Manage Queue →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {myAssignedTasks.slice(0, 6).map((task) => {
            const isCurrentlyTracking =
              activeTimer.isRunning && activeTimer.taskId === task._id;

            return (
              <div
                key={task._id}
                className={`flex flex-col justify-between rounded-xl border p-3.5 sm:p-4 transition ${
                  isCurrentlyTracking
                    ? 'border-emerald-300 bg-emerald-50/40 shadow-xs'
                    : 'border-slate-200 bg-slate-50/40 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="rounded bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600 truncate max-w-[130px]">
                      {task.projectName || task.moduleType}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {task.status}
                    </span>
                  </div>

                  <h4 className="mt-2 text-xs font-bold text-slate-900 line-clamp-1">
                    {task.title}
                  </h4>
                  <p className="mt-1 text-[11px] text-slate-500 line-clamp-1">
                    {task.description || 'No description'}
                  </p>
                </div>

                <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5">
                  <span className="text-[10px] font-mono text-slate-400">
                    Est: {task.estimatedHours || 4}h
                  </span>

                  <button
                    onClick={() => handleStartTaskTimer(task)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1 text-xs font-bold transition ${
                      isCurrentlyTracking
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    <FiPlay size={11} />
                    {isCurrentlyTracking ? 'Tracking Now...' : 'Start Timer'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Target & Metric Cards */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Today's Productivity Meter
              </span>
              <h3 className="mt-1 text-lg sm:text-xl font-black text-slate-900">
                {formatHoursMinutes(todayTotalSeconds)}{' '}
                <span className="text-xs font-semibold text-slate-400">
                  / {formatHoursMinutes(dailyTargetSeconds)} target
                </span>
              </h3>
            </div>
            <span className="text-sm font-black text-sky-600">{dailyProgressPercent}%</span>
          </div>

          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-sky-500 transition-all duration-300"
              style={{ width: `${dailyProgressPercent}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Remaining: {formatHoursMinutes(Math.max(0, dailyTargetSeconds - todayTotalSeconds))}</span>
            <span>Daily Target: 8h 00m</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Billable Value Logged
          </span>
          <div className="mt-1 text-2xl font-black text-emerald-600">
            $
            {(
              todayLogs
                .filter((l) => l.isBillable)
                .reduce((acc, l) => acc + (l.durationSeconds / 3600) * l.hourlyRate, 0)
            ).toFixed(0)}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {todayLogs.filter((l) => l.isBillable).length} billable sprint sessions recorded
          </div>
        </div>
      </div>

      {/* Time Logs Ledger Table */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recorded Project Time Entries</h2>
            <p className="text-xs text-slate-500">
              Audit trail of verified desktop sessions and manual logs
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 outline-none cursor-pointer"
            >
              <option value="ALL">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(timeLogs, null, 2));
                const dl = document.createElement('a');
                dl.setAttribute('href', dataStr);
                dl.setAttribute('download', `time-logs-${todayDateString}.json`);
                dl.click();
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <FiDownload size={13} /> Export Ledger
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[750px]">
            <thead className="border-b border-slate-100 bg-slate-50/60 font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 sm:px-5 py-3">Project & Task</th>
                <th className="px-4 sm:px-5 py-3">Description</th>
                <th className="px-4 sm:px-5 py-3">Date</th>
                <th className="px-4 sm:px-5 py-3">Duration</th>
                <th className="px-4 sm:px-5 py-3">Type</th>
                <th className="px-4 sm:px-5 py-3">User</th>
                <th className="px-4 sm:px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="transition hover:bg-slate-50/60">
                  <td className="px-4 sm:px-5 py-3">
                    <div className="font-bold text-slate-900">{log.projectName}</div>
                    {log.taskTitle && (
                      <div className="text-[11px] text-slate-500">{log.taskTitle}</div>
                    )}
                  </td>
                  <td className="px-4 sm:px-5 py-3 text-slate-600 max-w-[220px] sm:max-w-[260px] truncate">
                    {log.description}
                  </td>
                  <td className="px-4 sm:px-5 py-3 font-mono text-slate-500">{log.date}</td>
                  <td className="px-4 sm:px-5 py-3 font-mono font-bold text-slate-800">
                    {formatTime(log.durationSeconds)}
                  </td>
                  <td className="px-4 sm:px-5 py-3">
                    {log.isBillable ? (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/60">
                        Billable (${log.hourlyRate}/h)
                      </span>
                    ) : (
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                        Non-billable
                      </span>
                    )}
                  </td>
                  <td className="px-4 sm:px-5 py-3 text-slate-600 font-medium">{log.userName}</td>
                  <td className="px-4 sm:px-5 py-3 text-right">
                    <button
                      onClick={() => deleteTimeLog(log.id)}
                      className="rounded p-1 text-slate-400 hover:text-red-500"
                      title="Delete log"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No time logs found for the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MANUAL LOG MODAL */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl my-auto">
            <h3 className="text-base font-bold text-slate-900">Add Manual Time Entry</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Record offline client meetings or asynchronous research
            </p>

            <form onSubmit={handleManualSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500">Project *</label>
                <select
                  value={manualForm.projectId}
                  onChange={(e) => setManualForm({ ...manualForm, projectId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500">Task (Optional)</label>
                <select
                  value={manualForm.taskId}
                  onChange={(e) => setManualForm({ ...manualForm, taskId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs text-slate-800 outline-none cursor-pointer"
                >
                  <option value="">-- General Work --</option>
                  {tasks
                    .filter((t) => t.projectId === manualForm.projectId)
                    .map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.title}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500">Description</label>
                <input
                  type="text"
                  required
                  value={manualForm.description}
                  onChange={(e) => setManualForm({ ...manualForm, description: e.target.value })}
                  placeholder="e.g. Architecture review meeting with client"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500">Hours</label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    value={manualForm.hours}
                    onChange={(e) => setManualForm({ ...manualForm, hours: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500">Minutes</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={manualForm.minutes}
                    onChange={(e) => setManualForm({ ...manualForm, minutes: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500">Date</label>
                  <input
                    type="date"
                    value={manualForm.date}
                    onChange={(e) => setManualForm({ ...manualForm, date: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs text-slate-800 outline-none"
                  />
                </div>
                <div className="pt-2 sm:pt-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={manualForm.isBillable}
                      onChange={(e) => setManualForm({ ...manualForm, isBillable: e.target.checked })}
                      className="rounded text-sky-600 focus:ring-0"
                    />
                    <span>Billable Entry</span>
                  </label>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-3 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800"
                >
                  Save Time Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}