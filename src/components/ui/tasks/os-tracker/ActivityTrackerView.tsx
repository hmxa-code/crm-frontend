'use client';

import React, { useState, useMemo } from 'react';
import {
  FiActivity,
  FiMonitor,
  FiGlobe,
  FiCode,
  FiClock,
  FiFolder,
  FiTrendingUp,
  FiZap,
  FiSearch,
  FiFilter,
  FiExternalLink,
  FiCpu,
  FiShield,
  FiCommand,
  FiTerminal,
  FiCornerDownLeft,
  FiCheckCircle,
} from 'react-icons/fi';
import { useTaskSuiteStore, AppActivityLog, BrowsingLog, KeypressLogItem } from '../data/taskSuiteStore';
import Link from 'next/link';

export default function ActivityTrackerView() {
  const {
    projects,
    appActivities,
    browsingLogs,
    keypressLogs,
    currentActiveApp,
    updateCurrentActiveApp,
    simulateKeypressEvent,
  } = useTaskSuiteStore();

  const [selectedProjectId, setSelectedProjectId] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'keystrokes' | 'apps' | 'browsing'>('keystrokes');
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Interactive typing input box for testing live keystrokes
  const [interactiveInput, setInteractiveInput] = useState('');

  // Filter activities by project
  const filteredApps = useMemo(() => {
    return appActivities.filter((app) => {
      const matchProject = selectedProjectId === 'ALL' || app.projectId === selectedProjectId;
      const matchSearch =
        app.appName.toLowerCase().includes(search.toLowerCase()) ||
        app.windowTitle.toLowerCase().includes(search.toLowerCase());
      return matchProject && matchSearch;
    });
  }, [appActivities, selectedProjectId, search]);

  const filteredBrowsing = useMemo(() => {
    return browsingLogs.filter((b) => {
      const matchProject = selectedProjectId === 'ALL' || b.projectId === selectedProjectId;
      const matchSearch =
        b.domain.toLowerCase().includes(search.toLowerCase()) ||
        b.urlTitle.toLowerCase().includes(search.toLowerCase());
      return matchProject && matchSearch;
    });
  }, [browsingLogs, selectedProjectId, search]);

  const filteredKeypresses = useMemo(() => {
    return keypressLogs.filter((k) => {
      const matchCat = filterCategory === 'ALL' || k.category === filterCategory;
      const matchSearch =
        k.keyCombo.toLowerCase().includes(search.toLowerCase()) ||
        k.appName.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [keypressLogs, filterCategory, search]);

  // Aggregate metrics
  const totalAppMinutes = filteredApps.reduce((acc, a) => acc + a.durationMinutes, 0);
  const totalKeystrokes = filteredApps.reduce((acc, a) => acc + a.keystrokes, 0);
  const totalClicks = filteredApps.reduce((acc, a) => acc + a.mouseClicks, 0);
  const avgActivePct =
    filteredApps.length > 0
      ? Math.round(filteredApps.reduce((acc, a) => acc + a.activePercentage, 0) / filteredApps.length)
      : 0;

  // Handle interactive keyboard capture in input
  const handleKeyDownCapture = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (interactiveInput.trim()) {
        simulateKeypressEvent(interactiveInput.trim(), 'Interactive Test Terminal', 'COMMAND');
        setInteractiveInput('');
      }
    } else if (e.ctrlKey || e.altKey || e.metaKey) {
      const combo = `${e.ctrlKey ? 'Ctrl + ' : ''}${e.altKey ? 'Alt + ' : ''}${e.shiftKey ? 'Shift + ' : ''}${e.key.toUpperCase()}`;
      simulateKeypressEvent(combo, 'Visual Studio Code', 'HOTKEY');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <FiActivity className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Activity & Behavior Tracker
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Live desktop shadow telemetry: Keypress logger, pressed keys audit, software usage, and browsing logs
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/tasks/behavior-logs"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-xs"
          >
            <FiClock className="h-4 w-4" />
            10-Min Summary Logs
          </Link>
          <Link
            href="/tasks/time-tracker"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            <FiClock className="h-4 w-4 text-sky-600" />
            Time Tracker
          </Link>
        </div>
      </div>

      {/* Live Active Window Status Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-white shadow-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Live Keypress & OS Telemetry Stream
              </span>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                {currentActiveApp.name}
              </span>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              {currentActiveApp.title}
            </h3>
          </div>

          <div className="flex items-center gap-6 border-t border-slate-800 pt-3 md:border-t-0 md:pt-0">
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase text-slate-400">Typing Velocity</div>
              <div className="font-mono text-2xl font-black text-emerald-400">
                {currentActiveApp.wpm} <span className="text-xs font-normal text-slate-400">WPM</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-bold uppercase text-slate-400">Focus Index</div>
              <div className="font-mono text-2xl font-black text-sky-400">
                98% <span className="text-xs font-normal text-slate-400">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Aggregate Telemetry KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Focus Time
            </span>
            <span className="rounded-xl bg-slate-50 p-2 text-slate-600 border border-slate-100">
              <FiClock className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">
            {Math.floor(totalAppMinutes / 60)}h {totalAppMinutes % 60}m
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Recorded today</div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600">
              Total Keystrokes
            </span>
            <span className="rounded-xl bg-sky-50 p-2 text-sky-600 border border-sky-100">
              <FiCode className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">
            {totalKeystrokes.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Logged key inputs</div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600">
              Mouse Clicks
            </span>
            <span className="rounded-xl bg-violet-50 p-2 text-violet-600 border border-violet-100">
              <FiMonitor className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">
            {totalClicks.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">UI interactions captured</div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
              Productivity Ratio
            </span>
            <span className="rounded-xl bg-emerald-50 p-2 text-emerald-600 border border-emerald-100">
              <FiTrendingUp className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-black text-emerald-600">
            {avgActivePct}%
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Focus vs idle ratio</div>
        </div>
      </div>

      {/* Filter Bar & Tabs */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <FiFolder className="text-slate-400" size={14} />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition focus:border-sky-500"
            >
              <option value="ALL">All Projects Telemetry</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative min-w-[200px] flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search keys typed, apps, window titles, URLs..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-xs text-slate-800 placeholder-slate-400 outline-none transition focus:border-sky-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl border border-slate-200 bg-slate-50/70 p-1">
          <button
            onClick={() => setActiveTab('keystrokes')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === 'keystrokes'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FiCommand size={13} /> Keystrokes & Keys Pressed ({keypressLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('apps')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === 'apps'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FiCpu size={13} /> Applications ({filteredApps.length})
          </button>
          <button
            onClick={() => setActiveTab('browsing')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === 'browsing'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FiGlobe size={13} /> Browsing & URLs ({filteredBrowsing.length})
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. KEYSTROKES & KEYS PRESSED LOG (DETAILED TYPING AUDIT)      */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'keystrokes' && (
        <div className="space-y-6">
          {/* Live Keypress Tester & Simulator Bar */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FiCommand className="text-sky-600" />
                  Live Keypress Capture & Buffer Audit
                </h3>
                <p className="text-xs text-slate-500">
                  Type into the testing box or click simulation triggers to watch keys, hotkeys, and buffer telemetry register live
                </p>
              </div>

              {/* Privacy Shield Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200/80">
                <FiShield size={13} />
                Privacy Protection Active (Passwords Masked)
              </div>
            </div>

            {/* Interactive Live Input Field */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <FiTerminal className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  value={interactiveInput}
                  onChange={(e) => setInteractiveInput(e.target.value)}
                  onKeyDown={handleKeyDownCapture}
                  placeholder="Test live keystroke hook: Type code or shortcuts here (e.g. git commit, const [id], Ctrl+S)..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-3 text-xs font-mono text-slate-800 placeholder-slate-400 outline-none transition focus:border-sky-500 focus:bg-white"
                />
              </div>

              <button
                onClick={() => {
                  if (interactiveInput.trim()) {
                    simulateKeypressEvent(interactiveInput.trim(), 'Visual Studio Code', 'CODE');
                    setInteractiveInput('');
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition shadow-xs"
              >
                <FiCornerDownLeft size={13} /> Push Key Event
              </button>
            </div>

            {/* Quick Simulation Triggers */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
              <span className="font-semibold text-slate-400 text-[11px]">Quick Samples:</span>
              <button
                onClick={() =>
                  simulateKeypressEvent(
                    'interface EnterpriseTask { id: string; status: TaskStatus; }',
                    'Visual Studio Code',
                    'CODE'
                  )
                }
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-mono text-slate-700 hover:bg-slate-100"
              >
                + Code: TypeScript Interface
              </button>
              <button
                onClick={() =>
                  simulateKeypressEvent('Ctrl + S (Quick Save)', 'Visual Studio Code', 'HOTKEY')
                }
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-mono text-slate-700 hover:bg-slate-100"
              >
                + Hotkey: Ctrl + S
              </button>
              <button
                onClick={() =>
                  simulateKeypressEvent(
                    'npm run build -- --profile',
                    'Windows Terminal / PowerShell',
                    'COMMAND'
                  )
                }
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-mono text-slate-700 hover:bg-slate-100"
              >
                + Shell: npm build
              </button>
              <button
                onClick={() =>
                  simulateKeypressEvent('Alt + Tab (Switch Window)', 'OS Manager', 'HOTKEY')
                }
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-mono text-slate-700 hover:bg-slate-100"
              >
                + Hotkey: Alt + Tab
              </button>
            </div>
          </div>

          {/* Keypress Ledger Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Audit Trail: Exact Keys Pressed & Input Streams
                </h3>
                <p className="text-xs text-slate-500">
                  Granular chronological recording of keystrokes and shortcuts captured by desktop shadow daemon
                </p>
              </div>

              {/* Filter By Category */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-400">Category:</span>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none"
                >
                  <option value="ALL">All Categories</option>
                  <option value="CODE">Code Syntax</option>
                  <option value="HOTKEY">System Hotkeys</option>
                  <option value="COMMAND">Terminal Commands</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 bg-slate-50/70 font-bold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-3">Timestamp</th>
                    <th className="px-5 py-3">Keys / Buffer Pressed</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Target Application</th>
                    <th className="px-5 py-3">Typing WPM</th>
                    <th className="px-5 py-3 text-right">Characters</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredKeypresses.map((kp) => (
                    <tr key={kp.id} className="transition hover:bg-slate-50/60">
                      <td className="px-5 py-3.5 text-slate-500 text-[11px]">
                        {kp.timestamp}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-900 max-w-[420px] truncate">
                        <span className="rounded bg-slate-100 border border-slate-200 px-2 py-1 text-xs text-slate-800">
                          {kp.keyCombo}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-sans">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            kp.category === 'CODE'
                              ? 'bg-sky-50 text-sky-700 border border-sky-100'
                              : kp.category === 'HOTKEY'
                              ? 'bg-amber-50 text-amber-700 border border-amber-100'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          }`}
                        >
                          {kp.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-sans text-slate-700 font-medium">
                        {kp.appName}
                      </td>
                      <td className="px-5 py-3.5 text-emerald-600 font-bold">
                        {kp.wpm} WPM
                      </td>
                      <td className="px-5 py-3.5 text-right text-slate-500 font-bold">
                        {kp.keystrokeCount} keys
                      </td>
                    </tr>
                  ))}
                  {filteredKeypresses.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 font-sans">
                        No keypresses match the current search or category filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Keystroke Density Distribution Graph */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">24-Hour Keystroke Burst Density</h3>
              <p className="text-xs text-slate-500">
                Visual representation of typing bursts captured per 10-minute interval
              </p>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
              {[72, 85, 90, 64, 45, 95, 110, 88, 76, 52, 98, 104, 60, 40, 82, 94, 112, 118, 92, 84, 70, 78, 86, 92].map(
                (speed, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <div className="h-24 w-full bg-slate-100 rounded-lg flex items-end p-1">
                      <div
                        className="w-full bg-emerald-500 rounded-sm transition-all"
                        style={{ height: `${Math.min(100, (speed / 120) * 100)}%` }}
                      />
                    </div>
                    <span className="font-mono text-[9px] text-slate-400">{idx * 2}m</span>
                  </div>
                )
              )}
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 text-xs text-slate-600 space-y-1">
              <div className="font-bold text-slate-900">Behavioral Telemetry Assessment:</div>
              <div>• Top pressed hotkeys: <strong>Ctrl + S (42x), Alt + Tab (38x), Ctrl + C/V (26x)</strong></div>
              <div>• Average sustained typing speed: <strong>82 WPM</strong></div>
              <div>• Sustained deep focus stretches: <strong>4 intervals exceeding 45 minutes</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. APPLICATIONS TAB                                           */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'apps' && (
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/70 font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Software Application</th>
                  <th className="px-5 py-3">Active Window Title</th>
                  <th className="px-5 py-3">Project Association</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Duration</th>
                  <th className="px-5 py-3">Keystrokes</th>
                  <th className="px-5 py-3">Active Focus %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="transition hover:bg-slate-50/60">
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px]">
                          {app.appName.slice(0, 2).toUpperCase()}
                        </span>
                        {app.appName}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 max-w-[280px] truncate" title={app.windowTitle}>
                      {app.windowTitle}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="rounded bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 border border-sky-100">
                        {app.projectName}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                        {app.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {Math.floor(app.durationMinutes / 60) > 0
                        ? `${Math.floor(app.durationMinutes / 60)}h ${app.durationMinutes % 60}m`
                        : `${app.durationMinutes}m`}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-700">
                      {app.keystrokes.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${app.activePercentage}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-700 text-[11px]">
                          {app.activePercentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. BROWSING & URLS TAB                                        */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'browsing' && (
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/70 font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Domain</th>
                  <th className="px-5 py-3">Page / Pull Request Title</th>
                  <th className="px-5 py-3">Time Spent</th>
                  <th className="px-5 py-3">Classification</th>
                  <th className="px-5 py-3">Last Visit</th>
                  <th className="px-5 py-3 text-right">URL Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBrowsing.map((b) => (
                  <tr key={b.id} className="transition hover:bg-slate-50/60">
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <FiGlobe className="text-slate-400" size={14} />
                        {b.domain}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 max-w-[340px] truncate" title={b.urlTitle}>
                      {b.urlTitle}
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {Math.floor(b.timeSpentSeconds / 60)}m {b.timeSpentSeconds % 60}s
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/60">
                        {b.rating.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-500">{b.visitTime}</td>
                    <td className="px-5 py-3.5 text-right">
                      <a
                        href={b.fullUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 font-semibold"
                      >
                        Inspect <FiExternalLink size={11} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
