'use client';

import React, { useState } from 'react';
import { 
  FiGitCommit, 
  FiTable, 
  FiUsers, 
  FiActivity, 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiTrash2, 
  FiCheckCircle, 
  FiClock, 
  FiAlertTriangle,
  FiX,
  FiPause,
  FiPlay
} from 'react-icons/fi';
import RenGrowCureHeader from '../shared/RenGrowCureHeader';
import { 
  mockDistroRules, 
  mockRepCapacities, 
  mockDistroTraceLogs 
} from '@/src/services/rengrowcure/distroEngineService';
import { RoutingRule, SalesRepCapacity, DistributionTraceLog } from '@/src/types/rengrowcure/distroEngine';

type TabKey = 'routing' | 'capacity' | 'traces';

export default function DistroEngineModule() {
  const [activeTab, setActiveTab] = useState<TabKey>('routing');
  const [rules, setRules] = useState<RoutingRule[]>(mockDistroRules);
  const [capacities, setCapacities] = useState<SalesRepCapacity[]>(mockRepCapacities);
  const [traces, setTraces] = useState<DistributionTraceLog[]>(mockDistroTraceLogs);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [newRuleId, setNewRuleId] = useState('');
  const [newRuleName, setNewRuleName] = useState('');
  const [newMode, setNewMode] = useState<RoutingRule['assignmentMode']>('Round Robin');
  const [newEntity, setNewEntity] = useState('');
  const [newCriteria, setNewCriteria] = useState('');
  const [newSla, setNewSla] = useState(30);

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleId || !newRuleName) return;

    const rule: RoutingRule = {
      id: `dr-${Date.now()}`,
      ruleId: newRuleId,
      ruleName: newRuleName,
      assignmentMode: newMode,
      targetEntity: newEntity || 'Enterprise Account Team',
      conditionCriteria: newCriteria || 'score >= 60',
      priority: rules.length + 1,
      slaMinutes: Number(newSla),
      fallbackRep: 'Unassigned Fallback Pool',
      status: 'Active',
      leadsAssignedToday: 0,
    };

    setRules([rule, ...rules]);
    setIsModalOpen(false);
    setNewRuleId('');
    setNewRuleName('');
  };

  const toggleRepStatus = (repId: string) => {
    setCapacities(prev => prev.map(rep => {
      if (rep.id === repId) {
        const nextStatus = rep.status === 'Available' ? 'On Break' : 'Available';
        return { ...rep, status: nextStatus };
      }
      return rep;
    }));
  };

  const filteredRules = rules.filter(r => 
    r.ruleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.ruleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.targetEntity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full space-y-4">
      <RenGrowCureHeader currentModule="distroengine" />

      {/* Main Tab Controller & Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('routing')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'routing' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FiGitCommit size={14} className="text-indigo-600" />
            <span>Routing Matrix</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
              {rules.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('capacity')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'capacity' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FiUsers size={14} className="text-cyan-600" />
            <span>Team Capacity & Shifts</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
              {capacities.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('traces')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'traces' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FiActivity size={14} className="text-amber-600" />
            <span>Execution Logs</span>
          </button>
        </div>

        {/* Action Button */}
        {activeTab === 'routing' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <FiPlus size={14} />
            <span>Add Route Node</span>
          </button>
        )}
      </div>

      {/* TAB 1: ROUTING MATRIX */}
      {activeTab === 'routing' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-2.5 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search routing rules by rule ID, pod, or conditions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Real-time load balancing across <span className="font-bold text-slate-900">{rules.length} active allocation nodes</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Rule Node</th>
                    <th className="py-3 px-4">Distribution Mode</th>
                    <th className="py-3 px-4">Target Pod / Team</th>
                    <th className="py-3 px-4">Condition Match Criteria</th>
                    <th className="py-3 px-4">SLA Target</th>
                    <th className="py-3 px-4">Today Assigned</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredRules.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{r.ruleName}</div>
                        <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                          {r.ruleId}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {r.assignmentMode}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {r.targetEntity}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600 max-w-xs truncate">
                        {r.conditionCriteria}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-700">
                          <FiClock size={12} className="text-slate-400" />
                          {r.slaMinutes}m
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {r.leadsAssignedToday} leads
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setRules(rules.filter(x => x.id !== r.id))}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Node"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEAM CAPACITY & SCHEDULES */}
      {activeTab === 'capacity' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {capacities.map((rep) => {
            const usagePercent = Math.round((rep.currentActiveLeads / rep.maxLeadCap) * 100);
            const isFull = usagePercent >= 90;

            return (
              <div 
                key={rep.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                      {rep.avatar}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{rep.repName}</h4>
                      <p className="text-[11px] text-slate-500">{rep.role} • {rep.region}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    rep.status === 'Available' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : rep.status === 'At Capacity'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {rep.status}
                  </span>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Active Load Cap:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {rep.currentActiveLeads} / {rep.maxLeadCap} leads ({usagePercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        isFull ? 'bg-rose-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${Math.min(usagePercent, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-medium text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Shift Window:</span>
                    <span className="font-mono text-slate-800">{rep.shiftSchedule}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Avg Speed-to-Lead:</span>
                    <span className="font-mono text-slate-800">{rep.avgResponseMins}m SLA</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">
                    Auto-pause: <strong className="text-slate-700">{rep.autoPauseOnSlaBreach ? 'Enabled' : 'Disabled'}</strong>
                  </span>
                  <button
                    onClick={() => toggleRepStatus(rep.id)}
                    className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
                  >
                    {rep.status === 'Available' ? <FiPause size={11} /> : <FiPlay size={11} />}
                    <span>{rep.status === 'Available' ? 'Pause Queue' : 'Resume Queue'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: TRACES */}
      {activeTab === 'traces' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Lead Routing Decision Trace Stream</h3>
              <p className="text-xs text-slate-500">
                Audited path evaluation for every inbound conversion, round-robin handoff, and overflow queue route.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700">
              Avg Dispatch: 133ms
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Lead ID & Name</th>
                  <th className="py-3 px-4">Assigned Representative</th>
                  <th className="py-3 px-4">Target Pod</th>
                  <th className="py-3 px-4">Matched Rule</th>
                  <th className="py-3 px-4">Algorithm Traversal</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {traces.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{t.timestamp}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{t.leadName}</div>
                      <span className="text-[10px] font-mono text-slate-400">{t.leadId}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {t.assignedRep}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {t.team}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-indigo-700">
                      {t.routingRuleMatched}
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      {t.algorithmUsed}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        t.status === 'Success'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-500 text-[11px]">
                      {t.decisionLatencyMs}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE ROUTE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add DistroEngine Routing Node</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Route Identifier</label>
                <input
                  type="text"
                  placeholder="e.g. ROUTE-APAC-TIER1"
                  value={newRuleId}
                  onChange={(e) => setNewRuleId(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Node Policy Name</label>
                <input
                  type="text"
                  placeholder="e.g. APAC High-Touch Territory Allocation"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assignment Mode</label>
                  <select
                    value={newMode}
                    onChange={(e) => setNewMode(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Round Robin">Round Robin</option>
                    <option value="Weighted">Weighted</option>
                    <option value="Load Balanced">Load Balanced</option>
                    <option value="Geographic">Geographic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">SLA Minutes</label>
                  <input
                    type="number"
                    value={newSla}
                    onChange={(e) => setNewSla(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Sales Pod / Rep Queue</label>
                <input
                  type="text"
                  placeholder="e.g. Strategic Global Enterprise Pod"
                  value={newEntity}
                  onChange={(e) => setNewEntity(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Match Criteria (Logic Query)</label>
                <input
                  type="text"
                  placeholder="e.g. country == 'AU' AND mql_score >= 70"
                  value={newCriteria}
                  onChange={(e) => setNewCriteria(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Deploy Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
