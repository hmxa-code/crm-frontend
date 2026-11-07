'use client';

import React, { useState } from 'react';
import { 
  FiCheckSquare, 
  FiTable, 
  FiClock, 
  FiAlertTriangle, 
  FiPlus, 
  FiSearch, 
  FiCheckCircle, 
  FiTrash2, 
  FiX, 
  FiZap,
  FiActivity
} from 'react-icons/fi';
import RenGrowCureHeader from '../shared/RenGrowCureHeader';
import { 
  mockKineticTasks, 
  mockSlaTriggers, 
  mockSlaTelemetry 
} from '@/src/services/rengrowcure/kineticsService';
import { 
  KineticTask, 
  SlaTriggerRule, 
  SlaExecutionTelemetry, 
  TaskPriority, 
  TaskStatus, 
  TaskCategory 
} from '@/src/types/rengrowcure/kinetics';

type TabKey = 'workstation' | 'triggers' | 'telemetry';

export default function KineticsModule() {
  const [activeTab, setActiveTab] = useState<TabKey>('workstation');
  const [tasks, setTasks] = useState<KineticTask[]>(mockKineticTasks);
  const [triggers, setTriggers] = useState<SlaTriggerRule[]>(mockSlaTriggers);
  const [telemetry, setTelemetry] = useState<SlaExecutionTelemetry[]>(mockSlaTelemetry);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TaskCategory>('Follow-up Call');
  const [newPriority, setNewPriority] = useState<TaskPriority>('High');
  const [newAssignee, setNewAssignee] = useState('Marcus Vance');
  const [newDeal, setNewDeal] = useState('');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const task: KineticTask = {
      id: `kt-${Date.now()}`,
      taskCode: `TASK-KIN-${Date.now().toString().slice(-3)}`,
      title: newTitle,
      category: newCategory,
      priority: newPriority,
      status: 'Pending',
      assignee: newAssignee,
      assigneeAvatar: newAssignee.split(' ').map(n => n[0]).join(''),
      associatedDealOrLead: newDeal || 'General Pipeline Lead',
      dueDate: 'Today, 19:00',
      slaTargetHours: 8,
      slaHoursRemaining: 8,
      isBreached: false,
      autoCreatedByTrigger: 'Manual Workstation Dispatch',
    };

    setTasks([task, ...tasks]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewDeal('');
  };

  const handleToggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus: TaskStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.associatedDealOrLead.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.assignee.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full space-y-4">
      <RenGrowCureHeader currentModule="kinetics" />

      {/* Top Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Pending Tasks
          </span>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">
            {tasks.filter(t => t.status !== 'Completed').length}
          </div>
          <span className="text-[10px] text-indigo-600 font-semibold block mt-1">
            In active rep workstation queues
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            SLA Breaches
          </span>
          <div className="text-xl font-bold font-mono text-rose-600 mt-1">
            {tasks.filter(t => t.isBreached).length}
          </div>
          <span className="text-[10px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
            <FiAlertTriangle size={11} /> Requires management attention
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Automated Rules Active
          </span>
          <div className="text-xl font-bold font-mono text-cyan-600 mt-1">
            {triggers.filter(tr => tr.isActive).length}
          </div>
          <span className="text-[10px] text-slate-500 font-medium block mt-1">
            Event-driven background watchers
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Completed Velocity
          </span>
          <div className="text-xl font-bold font-mono text-emerald-600 mt-1">
            94.2%
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
            Within SLA target bounds
          </span>
        </div>
      </div>

      {/* Main Tab Controller & Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('workstation')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'workstation' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FiCheckSquare size={14} className="text-indigo-600" />
            <span>Task Workstation</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
              {tasks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('triggers')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'triggers' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FiZap size={14} className="text-cyan-600" />
            <span>Automated SLA Triggers</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
              {triggers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'telemetry' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FiActivity size={14} className="text-amber-600" />
            <span>Execution Log</span>
          </button>
        </div>

        {/* Action Button */}
        {activeTab === 'workstation' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <FiPlus size={14} />
            <span>Dispatch Task</span>
          </button>
        )}
      </div>

      {/* TAB 1: TASK WORKSTATION */}
      {activeTab === 'workstation' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-2.5 text-slate-400" size={13} />
              <input
                type="text"
                placeholder="Search actionable tasks, reps, or deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Real-time priority dispatching
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Task & Category</th>
                  <th className="py-3 px-4">Associated Deal / Account</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assigned Rep</th>
                  <th className="py-3 px-4">Due Target</th>
                  <th className="py-3 px-4">SLA Remaining</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{t.title}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-mono text-cyan-700 bg-cyan-50 px-1.5 py-0.2 rounded border border-cyan-100">
                          {t.taskCode}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">{t.category}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {t.associatedDealOrLead}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        t.priority === 'Urgent'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : t.priority === 'High'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center">
                          {t.assigneeAvatar || 'U'}
                        </div>
                        <span className="font-medium text-slate-800">{t.assignee}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{t.dueDate}</td>
                    <td className="py-3 px-4">
                      <span className={`font-mono text-xs font-bold ${
                        t.isBreached ? 'text-rose-600' : 'text-slate-800'
                      }`}>
                        {t.isBreached ? `Breached (${Math.abs(t.slaHoursRemaining)}h)` : `${t.slaHoursRemaining}h left`}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        t.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : t.status === 'Overdue'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleTaskStatus(t.id)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-colors cursor-pointer ${
                          t.status === 'Completed'
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                            : 'bg-slate-900 text-white hover:bg-slate-800 border-slate-900 shadow-2xs'
                        }`}
                      >
                        {t.status === 'Completed' ? 'Reopen' : 'Mark Complete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: AUTOMATED SLA TRIGGERS */}
      {activeTab === 'triggers' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Event-Driven SLA Task Automation</h3>
              <p className="text-xs text-slate-500">
                Rules that listen to lead stagnation, score promotions, and engagement webhooks to automatically instantiate operational tasks.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {triggers.map((tr) => (
              <div 
                key={tr.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3 hover:border-slate-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">
                    {tr.ruleCode}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ACTIVE WATCHER
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900">{tr.title}</h4>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs space-y-1.5 font-medium text-slate-600">
                  <div>
                    <span className="text-slate-400">Trigger Condition: </span>
                    <strong className="text-slate-900">{tr.triggerEvent}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Automated Action: </span>
                    <strong className="text-indigo-600">{tr.actionToExecute}</strong>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                    <span>Target Queue: <strong className="text-slate-800">{tr.assignedQueue}</strong></span>
                    <span className="font-mono font-bold text-slate-900">SLA: {tr.dueWithinHours}h</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EXECUTION LOG */}
      {activeTab === 'telemetry' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">SLA Resolution & Task Velocity Telemetry</h3>
              <p className="text-xs text-slate-500">
                Audited turnaround metrics, resolution speeds, and breach escalations.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Task Description</th>
                  <th className="py-3 px-4">Assigned Representative</th>
                  <th className="py-3 px-4">Turnaround Time</th>
                  <th className="py-3 px-4">SLA Target</th>
                  <th className="py-3 px-4 text-right">Resolution Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {telemetry.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{t.timestamp}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{t.taskTitle}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{t.repName}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{t.turnaroundHours} hrs</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{t.slaTargetHours} hrs</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        t.breached 
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {t.resolutionStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE TASK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Dispatch Operational Task</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Schedule Executive Demo with VP of Clinical Systems"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Associated Opportunity / Lead</label>
                <input
                  type="text"
                  placeholder="e.g. St. Jude Health Network"
                  value={newDeal}
                  onChange={(e) => setNewDeal(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Follow-up Call">Follow-up Call</option>
                    <option value="Demo Presentation">Demo Presentation</option>
                    <option value="Proposal Draft">Proposal Draft</option>
                    <option value="Contract Review">Contract Review</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assignee</label>
                <select
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
                >
                  <option value="Marcus Vance">Marcus Vance</option>
                  <option value="Elena Rostova">Elena Rostova</option>
                  <option value="Liam Davies">Liam Davies</option>
                  <option value="Aisha Al-Mansoor">Aisha Al-Mansoor</option>
                </select>
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
                  Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
