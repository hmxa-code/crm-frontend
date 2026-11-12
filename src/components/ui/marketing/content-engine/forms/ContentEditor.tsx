'use client';

import React from 'react';

interface ContentEditorProps {
  caption: string;
  persona: string;
  onCaptionChange: (val: string) => void;
  onPersonaChange: (val: string) => void;
}

const AI_PRESETS = [
  {
    title: 'Clinical Milestone',
    caption: '🔬 Clinical Milestone: New peer-reviewed data demonstrates a 48% reduction in diagnostic turnaround time when integrating automated specimen sequencing into high-volume workflows.\n\nExplore our clinical evidence summary below. #ClinicalDiagnostics #HealthTech #PrecisionMedicine',
    persona: 'Chief Medical Officers & Clinical Lab Directors',
  },
  {
    title: 'Product Launch',
    caption: '🚀 We are thrilled to introduce the next generation of our Wholcure Patient Navigation Suite! Streamline patient intake, lab telemetry, and clinical follow-up in one unified HIPAA-compliant portal.\n\nBook an executive demo today! #DigitalHealth #HealthcareInnovation',
    persona: 'Health System CIOs & Practice Administrators',
  },
  {
    title: 'Patient Wellness Tip',
    caption: '💡 Wellness Advisory: Preventing cardiovascular fatigue begins with circadian metabolic alignment. 3 clinically-proven daily habits to preserve endothelial vascular health:\n\n1. Consistent morning sunlight exposure\n2. 30g+ protein within 1hr of waking\n3. Micro-hydration electrolytes.\n\nSave this for your morning routine! 🥑🏃‍♂️',
    persona: 'General Patients & Wellness Seekers',
  },
  {
    title: 'Urgent Care Notice',
    caption: '⚡ Operational Notice: Winter seasonal respiratory viral panels and pediatric rapid tests are now in high demand across our network branches. Walk-ins and portal priority holds available.\n\nCheck live wait times on our portal! 🏥',
    persona: 'Local Community Families & Urgent Care Patients',
  },
];

export const ContentEditor: React.FC<ContentEditorProps> = ({
  caption,
  persona,
  onCaptionChange,
  onPersonaChange,
}) => {
  const handleApplyPreset = (preset: typeof AI_PRESETS[0]) => {
    onCaptionChange(preset.caption);
    onPersonaChange(preset.persona);
  };

  return (
    <div className="space-y-4">
      {/* AI Prompt Presets */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            AI Copy Starters
          </span>
          <span className="text-[10px] text-slate-400">Click to fill</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {AI_PRESETS.map((p) => (
            <button
              key={p.title}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="px-2.5 py-1 bg-amber-50/80 hover:bg-amber-100/90 text-amber-900 border border-amber-200/80 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
            >
              + {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Caption Textarea */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Content Copy & Caption <span className="text-rose-500">*</span>
          </label>
          <span className="text-[10px] font-mono text-slate-400">
            {caption.length} / 2200 characters
          </span>
        </div>
        <textarea
          rows={5}
          required
          value={caption}
          onChange={(e) => onCaptionChange(e.target.value)}
          placeholder="Write your main post caption, announcements, or AI generated text..."
          className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none resize-none transition-all"
        />
      </div>

      {/* Target Persona Focus */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
          Target Persona Focus
        </label>
        <input
          type="text"
          value={persona}
          onChange={(e) => onPersonaChange(e.target.value)}
          placeholder="e.g. Chief Medical Officers, Inbound Tech Founders"
          className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none transition-all"
        />
      </div>
    </div>
  );
};
