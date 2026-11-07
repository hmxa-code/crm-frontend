'use client';

import React, { useState } from 'react';
import { 
  FiActivity, 
  FiClock, 
  FiPhone, 
  FiMail, 
  FiVideo, 
  FiMessageSquare, 
  FiShield, 
  FiSearch, 
  FiFilter, 
  FiAlertTriangle,
  FiFileText
} from 'react-icons/fi';
import RenGrowCureHeader from '../shared/RenGrowCureHeader';
import { 
  mockChronosEvents, 
  mockComplianceRecords 
} from '@/src/services/rengrowcure/chronosService';
import { ChronosEvent, ComplianceAuditRecord, TouchpointChannel } from '@/src/types/rengrowcure/chronos';

type TabKey = 'timeline' | 'channels' | 'compliance';

export default function ChronosModule() {
  const [activeTab, setActiveTab] = useState<TabKey>('timeline');
  const [events, setEvents] = useState<ChronosEvent[]>(mockChronosEvents);
  const [complianceLogs, setComplianceLogs] = useState<ComplianceAuditRecord[]>(mockComplianceRecords);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<string>('ALL');

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.leadOrAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.actionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.repName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel = selectedChannelFilter === 'ALL' || e.channel === selectedChannelFilter;
    return matchesSearch && matchesChannel;
  });

  const getChannelIcon = (ch: TouchpointChannel) => {
    switch (ch) {
      case 'Calls': return <FiPhone size={14} className="text-emerald-500" />;
      case 'Meetings': return <FiVideo size={14} className="text-indigo-500" />;
      case 'Emails': return <FiMail size={14} className="text-blue-500" />;
      case 'WhatsApp': return <FiMessageSquare size={14} className="text-green-600" />;
      default: return <FiShield size={14} className="text-amber-500" />;
    }
  };

  return (
    <div className="w-full space-y-4">
      <RenGrowCureHeader currentModule="chronos" />

      {/* Main Tab Controller & Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'timeline' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FiActivity size={14} className="text-cyan-600" />
            <span>Timeline Feed</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
              {events.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('channels')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'channels' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FiFilter size={14} className="text-indigo-600" />
            <span>Channel Breakdown</span>
          </button>

          <button
            onClick={() => setActiveTab('compliance')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'compliance' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FiShield size={14} className="text-rose-600" />
            <span>Compliance & Audit Trails</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
              {complianceLogs.length}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-2.5 text-slate-400" size={13} />
          <input
            type="text"
            placeholder="Search chronological events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none w-64"
          />
        </div>
      </div>

      {/* TAB 1: TIMELINE FEED */}
      {activeTab === 'timeline' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Universal Interaction & Touchpoint Log</h3>
              <p className="text-xs text-slate-500">
                Audited timeline tracking sales rep calls, meetings, emails, and automatic triggers.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Showing {filteredEvents.length} events
            </span>
          </div>

          <div className="space-y-4 relative">
            <div className="absolute left-4 top-3 bottom-3 w-0.5 bg-slate-200 z-0" />

            {filteredEvents.map((evt) => (
              <div key={evt.id} className="relative z-10 flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-white border-2 border-slate-300 flex items-center justify-center flex-shrink-0 shadow-2xs">
                  {getChannelIcon(evt.channel)}
                </div>

                <div className="flex-1 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2 hover:bg-white hover:shadow-2xs transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{evt.actionTitle}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/60 text-slate-700">
                        {evt.channel}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">{evt.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{evt.summary}</p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{evt.leadOrAccount}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">Rep: {evt.repName}</span>
                    </div>

                    {evt.outcome && (
                      <span className="font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">
                        {evt.outcome}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CHANNELS BREAKDOWN */}
      {activeTab === 'channels' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { ch: 'Calls', count: events.filter(e => e.channel === 'Calls').length, icon: FiPhone, color: 'text-emerald-600' },
              { ch: 'Meetings', count: events.filter(e => e.channel === 'Meetings').length, icon: FiVideo, color: 'text-indigo-600' },
              { ch: 'Emails', count: events.filter(e => e.channel === 'Emails').length, icon: FiMail, color: 'text-blue-600' },
              { ch: 'WhatsApp', count: events.filter(e => e.channel === 'WhatsApp').length, icon: FiMessageSquare, color: 'text-green-600' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.ch}
                  onClick={() => setSelectedChannelFilter(selectedChannelFilter === item.ch ? 'ALL' : item.ch)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedChannelFilter === item.ch 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider">{item.ch}</span>
                    <Icon size={16} className={selectedChannelFilter === item.ch ? 'text-cyan-400' : item.color} />
                  </div>
                  <div className="text-xl font-bold font-mono mt-2">{item.count} Touchpoints</div>
                </div>
              );
            })}
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Channel</th>
                    <th className="py-3 px-4">Account / Lead</th>
                    <th className="py-3 px-4">Touchpoint Summary</th>
                    <th className="py-3 px-4">Outcome</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4 text-right">Rep</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredEvents.map(e => (
                    <tr key={e.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{e.timestamp}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{e.channel}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{e.leadOrAccount}</td>
                      <td className="py-3 px-4 text-slate-600 max-w-sm truncate">{e.summary}</td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {e.outcome || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {e.durationMins ? `${e.durationMins}m` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-slate-800">{e.repName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMPLIANCE & AUDIT TRAILS */}
      {activeTab === 'compliance' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Immutable Compliance & Security Audit Feed</h3>
              <p className="text-xs text-slate-500">
                System override traces, manual re-allocations, export operations, and data governance logs.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700">
              HIPAA & SOC-2 Compliant
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Audit Action</th>
                  <th className="py-3 px-4">Target Resource</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Justification Reason</th>
                  <th className="py-3 px-4 text-right">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {complianceLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{log.timestamp}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{log.actor}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-indigo-700">{log.actionType}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{log.targetResource}</td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{log.ipAddress}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-sm">{log.reason}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        log.severity === 'Critical'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : log.severity === 'Warning'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {log.severity}
                      </span>
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
