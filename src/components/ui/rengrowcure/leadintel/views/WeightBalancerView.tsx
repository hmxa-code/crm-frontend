'use client';

import React, { useState, useMemo } from 'react';
import { 
  FiSliders, 
  FiCheck, 
  FiRotateCcw, 
  FiZap, 
  FiTrendingUp, 
  FiShield, 
  FiLayers, 
  FiCpu, 
  FiAward, 
  FiActivity,
  FiAlertCircle,
  FiCheckCircle,
  FiExternalLink,
  FiCrosshair
} from 'react-icons/fi';
import { ScoringProfile } from '@/src/types/rengrowcure/leadIntel';

interface WeightBalancerViewProps {
  selectedProfile: ScoringProfile | null;
  balancerWeights: Record<string, number>;
  profiles: ScoringProfile[];
  onWeightChange: (key: keyof ScoringProfile['weights'], val: number) => void;
  onSaveWeights: () => void;
  onSelectProfile: (profile: ScoringProfile) => void;
}

interface SignalDefinition {
  key: keyof ScoringProfile['weights'];
  label: string;
  category: 'Direct Intent' | 'Digital Engagement' | 'ABM / Inbound';
  weightTier: 'High Velocity' | 'Medium Intent' | 'Foundational';
  description: string;
  historicalImpact: string;
  recommendedRange: [number, number];
}

const SIGNAL_METRICS: SignalDefinition[] = [
  {
    key: 'demo',
    label: 'Executive Demo Scheduled',
    category: 'Direct Intent',
    weightTier: 'High Velocity',
    description: 'Direct booking via Calendly or inbound procurement form. Highest indicator of pipeline readiness.',
    historicalImpact: '+42% Win Probability',
    recommendedRange: [25, 45],
  },
  {
    key: 'linkedin',
    label: 'LinkedIn ABM Executive Touch',
    category: 'ABM / Inbound',
    weightTier: 'High Velocity',
    description: 'Targeted account interaction on C-level sponsored collateral, InMail reply, or verified persona click.',
    historicalImpact: '+28% Account Expansion',
    recommendedRange: [20, 35],
  },
  {
    key: 'webinar',
    label: 'Clinical Webinar Attendance',
    category: 'Digital Engagement',
    weightTier: 'Medium Intent',
    description: 'Full attendance duration (≥ 30 min) or technical case study pack download.',
    historicalImpact: '+19% Deal Size',
    recommendedRange: [15, 30],
  },
  {
    key: 'websiteVisits',
    label: 'High-Intent Pricing & Compliance Hits',
    category: 'Direct Intent',
    weightTier: 'Medium Intent',
    description: 'Repeated visits to Enterprise Pricing, HIPAA security overview, or API docs within 72 hours.',
    historicalImpact: '+24% Velocity Acceleration',
    recommendedRange: [10, 25],
  },
  {
    key: 'email',
    label: 'Outreach Sequence Multi-Click',
    category: 'ABM / Inbound',
    weightTier: 'Foundational',
    description: 'Two or more link clicks within automated multi-touch sequences or technical briefs.',
    historicalImpact: '+12% Response Conversion',
    recommendedRange: [10, 20],
  },
  {
    key: 'fb',
    label: 'Paid Social & Retargeting Ingestion',
    category: 'Digital Engagement',
    weightTier: 'Foundational',
    description: 'Top-of-funnel paid retargeting engagement and brand awareness touchpoints.',
    historicalImpact: '+8% Top-of-Funnel Nurture',
    recommendedRange: [5, 15],
  },
];

export default function WeightBalancerView({
  selectedProfile,
  balancerWeights,
  profiles,
  onWeightChange,
  onSaveWeights,
  onSelectProfile,
}: WeightBalancerViewProps) {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Direct Intent' | 'Digital Engagement' | 'ABM / Inbound'>('All');
  const [isApplying, setIsApplying] = useState(false);

  // Compute live calculations
  const totalWeight = useMemo(() => {
    return Object.values(balancerWeights).reduce((a, b) => a + (Number(b) || 0), 0);
  }, [balancerWeights]);

  const weightDistribution = useMemo(() => {
    if (totalWeight === 0) return { direct: 0, digital: 0, abm: 0 };
    const directSum = (balancerWeights.demo || 0) + (balancerWeights.websiteVisits || 0);
    const digitalSum = (balancerWeights.webinar || 0) + (balancerWeights.fb || 0);
    const abmSum = (balancerWeights.linkedin || 0) + (balancerWeights.email || 0);
    return {
      direct: Math.round((directSum / totalWeight) * 100),
      digital: Math.round((digitalSum / totalWeight) * 100),
      abm: Math.round((abmSum / totalWeight) * 100),
    };
  }, [balancerWeights, totalWeight]);

  if (!selectedProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-80 bg-slate-50/60 border border-slate-200/90 rounded-xl p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-slate-200/80 flex items-center justify-center text-slate-600">
          <FiSliders size={20} />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">No Scoring Profile Selected</h3>
        <p className="text-xs text-slate-500 max-w-sm">
          Please select a predictive qualification profile from the directory or list below to balance and calibrate weights.
        </p>
      </div>
    );
  }

  const filteredSignals = SIGNAL_METRICS.filter(
    (s) => activeCategory === 'All' || s.category === activeCategory
  );

  const handleApplyWithFeedback = async () => {
    setIsApplying(true);
    try {
      await onSaveWeights();
    } finally {
      setTimeout(() => setIsApplying(false), 500);
    }
  };

  const handleResetToBaseline = () => {
    if (selectedProfile?.weights) {
      Object.entries(selectedProfile.weights).forEach(([k, v]) => {
        onWeightChange(k as keyof ScoringProfile['weights'], v);
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header / Profile Selector Ribbon */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <FiCpu size={18} className="text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Predictive Weight Balancer & Calibration Engine
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200/80">
                ACTIVE CLUSTER
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live algorithmic weighting for multi-channel intent signals across enterprise pipeline tiers.
            </p>
          </div>
        </div>

        {/* Profile Switcher dropdown */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <span className="text-xs font-semibold text-slate-500">Target Model:</span>
          <select
            value={selectedProfile.id}
            onChange={(e) => {
              const found = profiles.find((p) => p.id === e.target.value);
              if (found) onSelectProfile(found);
            }}
            className="text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500/20 cursor-pointer"
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.profileName} ({p.targetTier})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: 2 Cols layout (Left: Calibration Matrix Sliders | Right: Live Telemetry Analytics & Simulator) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Signal Sliders Matrix (7 Cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
          
          {/* Header & Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Model Under Calibration</span>
                <span className="text-xs font-mono font-bold text-cyan-700">{selectedProfile.modelId}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                {selectedProfile.profileName}
              </h3>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-lg">
              {(['All', 'Direct Intent', 'ABM / Inbound', 'Digital Engagement'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Signal Cards */}
          <div className="space-y-3">
            {filteredSignals.map((signal) => {
              const currentVal = balancerWeights[signal.key] || 0;
              const [minRec, maxRec] = signal.recommendedRange;
              const isOptimal = currentVal >= minRec && currentVal <= maxRec;

              return (
                <div
                  key={signal.key}
                  className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200/70 hover:border-slate-300 rounded-lg p-3.5 transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{signal.label}</span>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-200/70 text-slate-700">
                          {signal.category}
                        </span>
                        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                          {signal.historicalImpact}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed max-w-xl">
                        {signal.description}
                      </p>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-sm font-mono font-bold text-slate-900 px-2 py-0.5 bg-white border border-slate-200 rounded shadow-2xs">
                        +{currentVal} <span className="text-[10px] font-sans font-medium text-slate-400">pts</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 mt-1">
                        Rec: {minRec}-{maxRec} pts
                      </span>
                    </div>
                  </div>

                  {/* Slider Control with Range Markers */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="50"
                        step="1"
                        value={currentVal}
                        onChange={(e) => onWeightChange(signal.key, Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900 focus:outline-none"
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>0 pts (Negligible)</span>
                      <span className={isOptimal ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>
                        {isOptimal ? '● Calibrated Within Recommended Corridor' : 'Manual Tuning'}
                      </span>
                      <span>50 pts (Dominant)</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={handleResetToBaseline}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <FiRotateCcw size={13} />
              <span>Reset to Profile Baseline</span>
            </button>

            <button
              onClick={handleApplyWithFeedback}
              disabled={isApplying}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <FiCheck size={14} className={isApplying ? 'animate-spin' : ''} />
              <span>{isApplying ? 'Calibrating Cluster Nodes...' : 'Apply & Calibrate Matrix'}</span>
            </button>
          </div>

        </div>

        {/* Right Column: Live Telemetry Simulator & Diagnostic Summary (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Card 1: Aggregate Scoring Distribution */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <FiCrosshair size={13} className="text-cyan-600" />
                <span>Simulation & Pool State</span>
              </h4>
              <span className="text-[10px] font-mono text-slate-400">REALTIME</span>
            </div>

            {/* Total Weight Metric Box */}
            <div className="p-4 bg-slate-900 text-white rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Total Dynamic Pool
                  </span>
                  <div className="text-2xl font-mono font-bold text-cyan-400">
                    {totalWeight} <span className="text-xs font-normal text-slate-400">/ 100 max</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-emerald-400 block font-bold">
                    {totalWeight >= selectedProfile.mqlThreshold ? 'QUALIFIED MQL' : 'NURTURE TIER'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {totalWeight >= selectedProfile.sqlThreshold ? 'SQL Auto-Promote' : 'Awaiting Signals'}
                  </span>
                </div>
              </div>

              {/* Gradient Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 via-indigo-400 to-emerald-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(totalWeight, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Cold: 0</span>
                  <span className="text-amber-400">MQL: &ge; {selectedProfile.mqlThreshold}</span>
                  <span className="text-emerald-400">SQL: &ge; {selectedProfile.sqlThreshold}</span>
                </div>
              </div>
            </div>

            {/* Category Split Breakdown */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold text-slate-700 block">Signal Categorical Distribution</span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg">
                  <span className="text-[10px] text-slate-500 block">Direct Intent</span>
                  <span className="text-xs font-mono font-bold text-slate-900">{weightDistribution.direct}%</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg">
                  <span className="text-[10px] text-slate-500 block">ABM Touch</span>
                  <span className="text-xs font-mono font-bold text-slate-900">{weightDistribution.abm}%</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg">
                  <span className="text-[10px] text-slate-500 block">Digital</span>
                  <span className="text-xs font-mono font-bold text-slate-900">{weightDistribution.digital}%</span>
                </div>
              </div>
            </div>

            {/* Diagnostic Advisory Notice */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px]">
                <FiShield size={13} className="text-indigo-600" />
                <span>Governance & SLA Guardrails</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Weights saved here are propagated instantly across all webhook ingestion workers. Incoming leads matching <strong>{selectedProfile.targetTier}</strong> tier will immediately evaluate against this calibrated matrix.
              </p>
            </div>

          </div>

          {/* Card 2: Quick Model Directory Selector */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800">All Registered Models</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                {profiles.length} Total
              </span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {profiles.map((p) => {
                const isSelected = selectedProfile.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectProfile(p)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-50/80 border-cyan-300 text-cyan-950 font-bold shadow-2xs'
                        : 'bg-white border-slate-200/70 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="line-clamp-1">{p.profileName}</p>
                      <span className="text-[10px] font-mono text-slate-400">{p.modelId}</span>
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                      {p.targetTier}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
