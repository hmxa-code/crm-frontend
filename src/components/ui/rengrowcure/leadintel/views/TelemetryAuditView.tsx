'use client';

import React, { useState } from 'react';
import { 
  FiTrash2, 
  FiActivity, 
  FiFilter, 
  FiSearch, 
  FiRefreshCw, 
  FiZap, 
  FiClock, 
  FiCheckCircle, 
  FiLayers 
} from 'react-icons/fi';
import { ScoringTelemetryEvent } from '@/src/types/rengrowcure/leadIntel';

interface TelemetryAuditViewProps {
  telemetry: ScoringTelemetryEvent[];
  onRefreshTelemetry?: () => void;
  onDeleteTelemetry?: (id: string) => void;
  onBulkDeleteTelemetry?: (ids: string[]) => void;
}

export default function TelemetryAuditView({
  telemetry,
  onRefreshTelemetry,
  onDeleteTelemetry,
  onBulkDeleteTelemetry,
}: TelemetryAuditViewProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('All');

  const filteredTelemetry = telemetry.filter((t) => {
    const matchesSearch =
      t.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.leadCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.appliedModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.eventType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesEvent = eventTypeFilter === 'All' || t.eventType === eventTypeFilter;
    return matchesSearch && matchesStatus && matchesEvent;
  });

  const allFilteredSelected =
    filteredTelemetry.length > 0 &&
    filteredTelemetry.every((t) => selectedIds.includes(t.id));

  const handleToggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTelemetry.map((t) => t.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleConfirmBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Delete ${selectedIds.length} telemetry event record(s)?`)) {
      if (onBulkDeleteTelemetry) {
        onBulkDeleteTelemetry(selectedIds);
      }
      setSelectedIds([]);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Auto-Promoted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Qualified':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'Evaluating':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner / Telemetry System Health */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <FiActivity size={18} className="text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Scoring Execution Telemetry & Audit Stream
              </h2>
              <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                STREAMING LIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Audited real-time scoring events generated when leads interact with outreach sequences, booking links, or web pages.
            </p>
          </div>
        </div>

        {onRefreshTelemetry && (
          <button
            onClick={onRefreshTelemetry}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer self-start md:self-center"
          >
            <FiRefreshCw size={13} />
            <span>Poll Stream</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <FiSearch className="absolute left-3.5 top-3 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search telemetry by lead name, account, event type, or applied model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 outline-none cursor-pointer text-slate-800"
          >
            <option value="All">All States</option>
            <option value="Auto-Promoted">Auto-Promoted</option>
            <option value="Qualified">Qualified</option>
            <option value="Evaluating">Evaluating</option>
            <option value="Nurturing">Nurturing</option>
          </select>

          {/* Event Filter */}
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 outline-none cursor-pointer text-slate-800"
          >
            <option value="All">All Trigger Events</option>
            <option value="Demo Booked">Demo Booked</option>
            <option value="LinkedIn Click">LinkedIn Click</option>
            <option value="Whitepaper Download">Whitepaper Download</option>
            <option value="Form Submit">Form Submit</option>
            <option value="Page Visit">Page Visit</option>
          </select>
        </div>
      </div>

      {/* Selected Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center justify-between text-xs animate-in fade-in duration-200">
          <span className="font-bold text-rose-800">
            {selectedIds.length} telemetry event(s) selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1 text-slate-600 hover:text-slate-900 font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmBulkDelete}
              className="flex items-center gap-1.5 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <FiTrash2 size={12} />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Telemetry Stream Table */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={handleToggleSelectAll}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Event Timestamp</th>
                <th className="py-3.5 px-4">Lead Profile & Company</th>
                <th className="py-3.5 px-4">Interaction Signal</th>
                <th className="py-3.5 px-4">Score Delta</th>
                <th className="py-3.5 px-4">Resulting Score</th>
                <th className="py-3.5 px-4">Applied Predictive Model</th>
                <th className="py-3.5 px-4">Promoted State</th>
                <th className="py-3.5 px-4 text-right">Latency</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredTelemetry.map((t) => {
                const isSelected = selectedIds.includes(t.id);
                return (
                  <tr
                    key={t.id}
                    className={`transition-colors ${
                      isSelected ? 'bg-cyan-50/40' : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectOne(t.id)}
                        className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {t.timestamp}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{t.leadName}</div>
                      <div className="text-[11px] text-slate-500">{t.leadCompany}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200/60 inline-block">
                        {t.eventType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">
                      +{t.scoreDelta} pts
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {t.resultingScore} <span className="text-[10px] text-slate-400 font-sans">/ 100</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-cyan-800 text-[11px]">
                      {t.appliedModel}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(t.status)}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-400 text-[11px]">
                      {t.latencyMs}ms
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {onDeleteTelemetry && (
                        <button
                          onClick={() => onDeleteTelemetry(t.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Delete event record"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredTelemetry.length === 0 && (
          <div className="p-12 text-center text-xs text-slate-500 space-y-1">
            <p className="font-bold text-slate-700">No telemetry events found</p>
            <p className="text-slate-400">Run the "+10 Bulk Dynamic Test" or trigger simulated webhook actions to generate live data.</p>
          </div>
        )}
      </div>
    </div>
  );
}
