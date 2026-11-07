import React from 'react'

interface ContentEditorProps {
  caption: string;
  persona: string;
  onCaptionChange: (val: string) => void;
  onPersonaChange: (val: string) => void;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  caption,
  persona,
  onCaptionChange,
  onPersonaChange,
}) => {
  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Content Copy & Caption <span className="text-rose-500">*</span>
          </label>
          <span className="text-[10px] font-mono text-slate-400">
            {caption.length} / 2200
          </span>
        </div>
        <textarea
          rows={4}
          required
          value={caption}
          onChange={(e) => onCaptionChange(e.target.value)}
          placeholder="Write your main post caption, announcements, or AI generated text..."
          className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none resize-none"
        />
      </div>

      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
          Target Persona Focus
        </label>
        <input
          type="text"
          value={persona}
          onChange={(e) => onPersonaChange(e.target.value)}
          placeholder="e.g. Enterprise Decision Makers, Tech Founders"
          className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none"
        />
      </div>
    </div>
  )
}