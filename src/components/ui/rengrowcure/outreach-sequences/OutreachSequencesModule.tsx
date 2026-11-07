'use client';

import React, { useState } from 'react';
import { 
  FiLayers, 
  FiTable, 
  FiActivity, 
  FiPlay, 
  FiPause, 
  FiPlus, 
  FiSearch, 
  FiMail, 
  FiPhone, 
  FiMessageSquare, 
  FiUserCheck, 
  FiTrash2, 
  FiX,
  FiArrowRight,
  FiClock
} from 'react-icons/fi';
import RenGrowCureHeader from '../shared/RenGrowCureHeader';
import { 
  mockSequences, 
  mockEnrolments, 
  mockOutreachLogs 
} from '@/src/services/rengrowcure/outreachSequencesService';
import { 
  OutreachSequence, 
  SequenceEnrolment, 
  OutreachTelemetryLog, 
  StepChannel 
} from '@/src/types/rengrowcure/outreachSequences';

type TabKey = 'builder' | 'enrolments' | 'telemetry';

export default function OutreachSequencesModule() {
  const [activeTab, setActiveTab] = useState<TabKey>('builder');
  const [sequences, setSequences] = useState<OutreachSequence[]>(mockSequences);
  const [enrolments, setEnrolments] = useState<SequenceEnrolment[]>(mockEnrolments);
  const [logs, setLogs] = useState<OutreachTelemetryLog[]>(mockOutreachLogs);

  const [selectedSequence, setSelectedSequence] = useState<OutreachSequence>(sequences[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New sequence form
  const [newTitle, setNewTitle] = useState('');
  const [newAudience, setNewAudience] = useState('');

  const handleCreateSequence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const seq: OutreachSequence = {
      id: `seq-${Date.now()}`,
      sequenceCode: `SEQ-${Date.now().toString().slice(-4)}`,
      title: newTitle,
      description: 'Custom multi-touch sales cadence',
      owner: 'Current User',
      status: 'Active',
      targetAudience: newAudience || 'Inbound & Outbound Enterprise Prospects',
      totalSteps: 3,
      enrolledCount: 0,
      openRate: 0,
      replyRate: 0,
      bookingConversionRate: 0,
      createdAt: 'Today',
      steps: [
        { id: 'st1', order: 1, channel: 'Email', title: 'Introductory Email & Case Study', delayDays: 0, isAutomated: true, completionRate: 100 },
        { id: 'st2', order: 2, channel: 'Call Task', title: 'Speed-to-lead Discovery Call', delayDays: 2, isAutomated: false, completionRate: 0 },
        { id: 'st3', order: 3, channel: 'WhatsApp', title: 'Schedule Reminder WhatsApp', delayDays: 3, isAutomated: true, completionRate: 0 },
      ],
    };

    setSequences([seq, ...sequences]);
    setSelectedSequence(seq);
    setIsModalOpen(false);
    setNewTitle('');
    setNewAudience('');
  };

  const handleToggleEnrolment = (enrId: string) => {
    setEnrolments(prev => prev.map(e => {
      if (e.id === enrId) {
        return {
          ...e,
          status: e.status === 'Paused' ? 'In Progress' : 'Paused',
        };
      }
      return e;
    }));
  };

  const getChannelIcon = (ch: StepChannel) => {
    switch (ch) {
      case 'Email': return <FiMail size={14} className="text-blue-500" />;
      case 'Call Task': return <FiPhone size={14} className="text-emerald-500" />;
      case 'WhatsApp': return <FiMessageSquare size={14} className="text-green-600" />;
      default: return <FiUserCheck size={14} className="text-purple-500" />;
    }
  };

  return (
    <div className="w-full space-y-4">
      <RenGrowCureHeader currentModule="outreach-sequences" />

      {/* Main Tab Controller & Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('builder')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'builder' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FiLayers size={14} className="text-indigo-600" />
            <span>Cadence Builder</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
              {sequences.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('enrolments')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'enrolments' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FiTable size={14} className="text-cyan-600" />
            <span>Active Enrolments</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
              {enrolments.length}
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
            <span>Outreach Telemetry</span>
          </button>
        </div>

        {/* Global Action */}
        {activeTab === 'builder' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <FiPlus size={14} />
            <span>Create Cadence</span>
          </button>
        )}
      </div>

      {/* TAB 1: CADENCE BUILDER */}
      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Sequence Selector List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Automated Sales Cadences
            </h3>
            {sequences.map(seq => (
              <div
                key={seq.id}
                onClick={() => setSelectedSequence(seq)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  selectedSequence.id === seq.id
                    ? 'bg-white border-indigo-400 shadow-xs ring-2 ring-indigo-500/10'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {seq.sequenceCode}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {seq.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{seq.title}</h4>
                <p className="text-[11px] text-slate-500">{seq.targetAudience}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] font-mono">
                  <span className="text-slate-600">{seq.enrolledCount} Active</span>
                  <span className="text-emerald-600 font-bold">{seq.bookingConversionRate}% Bookings</span>
                </div>
              </div>
            ))}
          </div>

          {/* Visual Step Canvas for Selected Sequence */}
          <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedSequence.title}</h3>
                <p className="text-xs text-slate-500">
                  Cadence Flow: {selectedSequence.steps.length} touchpoint steps • Open Rate: {selectedSequence.openRate}% • Reply Rate: {selectedSequence.replyRate}%
                </p>
              </div>
              <button
                onClick={() => {
                  const newStep = {
                    id: `st-${Date.now()}`,
                    order: selectedSequence.steps.length + 1,
                    channel: 'Email' as StepChannel,
                    title: 'New Follow-Up Step',
                    delayDays: 2,
                    isAutomated: true,
                    completionRate: 100,
                  };
                  const updated = {
                    ...selectedSequence,
                    steps: [...selectedSequence.steps, newStep],
                    totalSteps: selectedSequence.steps.length + 1,
                  };
                  setSelectedSequence(updated);
                  setSequences(sequences.map(s => s.id === updated.id ? updated : s));
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <FiPlus size={13} />
                <span>Append Step</span>
              </button>
            </div>

            {/* Vertical Step Nodes */}
            <div className="space-y-4">
              {selectedSequence.steps.map((step, idx) => (
                <div key={step.id} className="relative flex items-start gap-4">
                  {/* Step Connector Line */}
                  {idx < selectedSequence.steps.length - 1 && (
                    <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-200 -mb-4 z-0" />
                  )}

                  {/* Step Number Badge */}
                  <div className="relative z-10 w-8 h-8 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-2xs">
                    {step.order}
                  </div>

                  {/* Step Card Content */}
                  <div className="flex-1 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getChannelIcon(step.channel)}
                        <span className="text-xs font-bold text-slate-900">{step.channel}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white text-slate-600 border border-slate-200">
                          {step.delayDays === 0 ? 'Immediately' : `+${step.delayDays} days delay`}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        step.isAutomated ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {step.isAutomated ? 'Automated' : 'Manual Rep Task'}
                      </span>
                    </div>

                    <h5 className="text-xs font-semibold text-slate-800">{step.title}</h5>

                    {step.templateSnippet && (
                      <p className="text-[11px] text-slate-500 font-mono bg-white p-2 rounded-lg border border-slate-200/60">
                        "{step.templateSnippet}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE ENROLMENTS */}
      {activeTab === 'enrolments' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Enrolled Contacts in Active Cadences</h3>
              <p className="text-xs text-slate-500">
                Track each contact's live step position, automated transitions, and pause/resume flags.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Contact & Company</th>
                  <th className="py-3 px-4">Cadence Enrolled</th>
                  <th className="py-3 px-4">Current Step Progress</th>
                  <th className="py-3 px-4">Assigned Rep</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4">Next Due</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {enrolments.map((enr) => (
                  <tr key={enr.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{enr.leadName}</div>
                      <div className="text-[11px] text-slate-500">{enr.company} • {enr.email}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {enr.sequenceName}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">
                          Step {enr.currentStepIndex} of {enr.totalSteps}
                        </span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 rounded-full" 
                            style={{ width: `${(enr.currentStepIndex / enr.totalSteps) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{enr.assignedRep}</td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">{enr.lastActivity}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-700">{enr.nextStepDue}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        enr.status === 'In Progress'
                          ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                          : enr.status === 'Booked'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : enr.status === 'Paused'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {enr.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleEnrolment(enr.id)}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        {enr.status === 'Paused' ? 'Resume' : 'Pause'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: OUTREACH TELEMETRY */}
      {activeTab === 'telemetry' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sequence Event Telemetry Log</h3>
              <p className="text-xs text-slate-500">
                Granular dispatch and recipient engagement signals across email, SMS, and WhatsApp webhooks.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Cadence</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Event Triggered</th>
                  <th className="py-3 px-4">Payload Details</th>
                  <th className="py-3 px-4 text-right">Rep</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {logs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{l.timestamp}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{l.leadName}</td>
                    <td className="py-3 px-4 text-slate-600">{l.sequenceName}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        {getChannelIcon(l.channel)}
                        <span>{l.channel}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        l.event === 'Meeting Booked' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : l.event === 'Bounced'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      }`}>
                        {l.event}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-600 max-w-sm truncate">{l.details}</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-800">{l.rep}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE SEQUENCE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Create Outreach Cadence</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateSequence} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cadence Title</label>
                <input
                  type="text"
                  placeholder="e.g. Inbound Enterprise Medical Cadence"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
                <input
                  type="text"
                  placeholder="e.g. Hospital Systems & Clinic Chains"
                  value={newAudience}
                  onChange={(e) => setNewAudience(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
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
                  Create & Launch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
