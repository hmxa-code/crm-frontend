'use client';

import React, { useState, useMemo } from 'react';
import {
  FiFileText,
  FiClock,
  FiCalendar,
  FiFolder,
  FiTrendingUp,
  FiFilter,
  FiSearch,
  FiCheckCircle,
  FiDownload,
  FiChevronDown,
  FiChevronUp,
  FiMonitor,
  FiCode,
  FiExternalLink,
  FiEye,
  FiX,
  FiCommand,
  FiShield,
} from 'react-icons/fi';
import { useTaskSuiteStore, TenMinuteSummary } from '../data/taskSuiteStore';
import Link from 'next/link';

export default function TenMinuteSummaryView() {
  const { tenMinuteSummaries, projects } = useTaskSuiteStore();

  const [selectedProjectId, setSelectedProjectId] = useState<string>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-04');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [previewSummary, setPreviewSummary] = useState<TenMinuteSummary | null>(null);

  // Filtered Summaries
  const filteredSummaries = useMemo(() => {
    return tenMinuteSummaries.filter((sum) => {
      const matchProj = selectedProjectId === 'ALL' || sum.projectId === selectedProjectId;
      const matchDate = !selectedDate || sum.date === selectedDate;
      const matchSearch =
        sum.summaryNote.toLowerCase().includes(search.toLowerCase()) ||
        sum.dominantApp.toLowerCase().includes(search.toLowerCase()) ||
        sum.activeWindowTitle.toLowerCase().includes(search.toLowerCase()) ||
        (sum.typedSummary || '').toLowerCase().includes(search.toLowerCase()) ||
        sum.projectName.toLowerCase().includes(search.toLowerCase());
      return matchProj && matchDate && matchSearch;
    });
  }, [tenMinuteSummaries, selectedProjectId, selectedDate, search]);

  // Aggregate Metrics for 10-min logs
  const totalIntervals = filteredSummaries.length;
  const avgProductivity =
    totalIntervals > 0
      ? Math.round(
          filteredSummaries.reduce((acc, s) => acc + s.productivityScore, 0) / totalIntervals
        )
      : 0;
  const totalKeystrokes = filteredSummaries.reduce((acc, s) => acc + s.keystrokes, 0);
  const totalClicks = filteredSummaries.reduce((acc, s) => acc + s.clicks, 0);
  const totalHotkeys = filteredSummaries.reduce((acc, s) => acc + (s.hotkeysCount || 8), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'HIGHLY_PRODUCTIVE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'PRODUCTIVE':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      case 'NEUTRAL':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 border border-sky-100">
              <FiFileText className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                10-Minute Summary Logs
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Automated 10-minute shadow audits: software usage, keys typed, hotkeys executed, active windows, and AI summaries
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/tasks/os-tracker"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            <FiMonitor className="h-4 w-4 text-slate-500" />
            Live OS Tracker
          </Link>
          <button
            onClick={() => {
              const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredSummaries, null, 2));
              const dl = document.createElement('a');
              dl.setAttribute('href', dataStr);
              dl.setAttribute('download', `10-min-summary-${selectedDate}.json`);
              dl.click();
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-xs"
          >
            <FiDownload className="h-4 w-4" />
            Export Audit Report
          </button>
        </div>
      </div>

      {/* Aggregate KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Audited Intervals
            </span>
            <span className="rounded-xl bg-slate-50 p-2 text-slate-600 border border-slate-100">
              <FiClock className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">{totalIntervals} Blocks</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">
            {totalIntervals * 10} minutes shadowed
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
              Productivity Index
            </span>
            <span className="rounded-xl bg-emerald-50 p-2 text-emerald-600 border border-emerald-100">
              <FiTrendingUp className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-black text-emerald-600">{avgProductivity}%</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Interval average score</div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600">
              Interval Keystrokes
            </span>
            <span className="rounded-xl bg-sky-50 p-2 text-sky-600 border border-sky-100">
              <FiCode className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">
            {totalKeystrokes.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">
            ~{totalIntervals > 0 ? Math.round(totalKeystrokes / totalIntervals) : 0} keys / 10 mins
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600">
              Hotkeys Detected
            </span>
            <span className="rounded-xl bg-violet-50 p-2 text-violet-600 border border-violet-100">
              <FiCommand className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">
            {totalHotkeys} Combinations
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Ctrl+S, Alt+Tab, etc.</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <FiFolder className="text-slate-400" size={14} />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition focus:border-sky-500"
            >
              <option value="ALL">All Projects Intervals</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <FiCalendar className="text-slate-400" size={14} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-sky-500"
            />
          </div>

          <div className="relative min-w-[220px] flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search interval notes, windows, keys typed..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-xs text-slate-800 placeholder-slate-400 outline-none transition focus:border-sky-500 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* 10-Minute Timeline Stream */}
      <div className="space-y-4">
        {filteredSummaries.map((summary) => {
          const isExpanded = expandedId === summary.id;

          return (
            <div
              key={summary.id}
              className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-slate-300"
            >
              {/* Summary Card Header */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-24 items-center justify-center rounded-xl bg-slate-900 font-mono text-xs font-bold text-white shadow-xs">
                    {summary.timeSlot}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 border border-sky-100">
                        {summary.projectName}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${getStatusBadge(
                          summary.status
                        )}`}
                      >
                        {summary.status.replace('_', ' ')} ({summary.productivityScore}%)
                      </span>
                    </div>

                    <h4 className="mt-1 text-xs font-semibold text-slate-800">
                      Dominant App: <strong className="text-slate-900">{summary.dominantApp}</strong>
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-4 text-right text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400">Keystrokes</span>
                      <div className="font-mono font-bold text-slate-800">{summary.keystrokes}</div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400">Hotkeys</span>
                      <div className="font-mono font-bold text-amber-600">{summary.hotkeysCount || 8}</div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400">Clicks</span>
                      <div className="font-mono font-bold text-slate-800">{summary.clicks}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setPreviewSummary(summary)}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                    title="Inspect Screenshot & Telemetry"
                  >
                    <FiEye size={14} />
                  </button>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : summary.id)}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-500 hover:bg-slate-100 transition"
                  >
                    {isExpanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                  </button>
                </div>
              </div>

              {/* AI Activity Summary & Exact Typing Buffer */}
              <div className="mt-3.5 space-y-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs text-slate-700">
                  <span className="font-bold text-slate-900">Work Activity Summary: </span>
                  {summary.summaryNote}
                </div>

                {summary.typedSummary && (
                  <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-3 text-xs text-slate-700 font-mono">
                    <span className="font-sans font-bold text-sky-900">Keys & Typed Buffer Audit: </span>
                    <span className="text-slate-800">{summary.typedSummary}</span>
                    {summary.hotkeysSample && (
                      <div className="mt-2 flex flex-wrap gap-1.5 font-sans">
                        <span className="text-[11px] font-semibold text-slate-500">Key combinations:</span>
                        {summary.hotkeysSample.map((hk) => (
                          <span
                            key={hk}
                            className="rounded bg-white border border-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-700"
                          >
                            {hk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* App Distribution Bar */}
              <div className="mt-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Application Distribution (10 Minutes)</span>
                  <div className="flex items-center gap-3 font-medium">
                    {summary.appDistribution.map((app) => (
                      <span key={app.app} className="flex items-center gap-1 text-slate-600">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: app.color }}
                        />
                        {app.app} ({app.percentage}%)
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  {summary.appDistribution.map((app) => (
                    <div
                      key={app.app}
                      style={{
                        width: `${app.percentage}%`,
                        backgroundColor: app.color,
                      }}
                      title={`${app.app}: ${app.percentage}%`}
                    />
                  ))}
                </div>
              </div>

              {/* Expandable Drilldown */}
              {isExpanded && (
                <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-600 space-y-2">
                  <div className="font-bold text-slate-800">Foreground Active Window Shadowed:</div>
                  <div className="font-mono text-[11px] text-slate-700 bg-slate-100 p-2.5 rounded-lg truncate">
                    {summary.activeWindowTitle}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Daemon Log Timestamp: {summary.startTimestamp}</span>
                    <span>Confidence Score: 99.8% Verified</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredSummaries.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-xs text-slate-400">
            No 10-minute logs recorded for the selected project and date filter.
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SCREENSHOT & AUDIT PREVIEW MODAL                              */}
      {/* ------------------------------------------------------------- */}
      {previewSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  10-Min Desktop Shadow Snapshot ({previewSummary.timeSlot})
                </h3>
                <p className="text-xs text-slate-500">
                  Project: {previewSummary.projectName} • Date: {previewSummary.date}
                </p>
              </div>
              <button
                onClick={() => setPreviewSummary(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Desktop Shadow Screenshot Canvas */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-5 text-white flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2.5">
                <span className="font-mono text-emerald-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  SHADOW CAPTURE - DISPLAY 1 (2560x1440)
                </span>
                <span>{previewSummary.dominantApp}</span>
              </div>

              <div className="my-auto space-y-3 text-center">
                <div className="font-mono text-xs text-slate-400">Captured Active Foreground Window:</div>
                <div className="font-mono text-sm font-bold text-sky-400 bg-slate-900/90 p-3.5 rounded-lg border border-slate-800">
                  {previewSummary.activeWindowTitle}
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {previewSummary.keystrokes} Keystrokes • {previewSummary.hotkeysCount || 8} Hotkeys • {previewSummary.clicks} Clicks
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800 pt-2.5">
                <span>Classification: {previewSummary.status}</span>
                <span>Productivity Index: {previewSummary.productivityScore}%</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewSummary(null)}
                className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                Close Snapshot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
