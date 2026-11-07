'use client'

import React from 'react'
import { CRM_FEATURES, FEATURES_BY_MODULE } from '@/src/constants/permissions'

interface FeatureAccessPickerProps {
  selected: string[]
  onChange: (features: string[]) => void
  disabled?: boolean
}

export const FeatureAccessPicker = ({
  selected,
  onChange,
  disabled = false,
}: FeatureAccessPickerProps) => {
  const toggleFeature = (key: string) => {
    if (disabled) return
    if (selected.includes(key)) {
      onChange(selected.filter((f) => f !== key))
    } else {
      onChange([...selected, key])
    }
  }

  return (
    <div className="space-y-4 font-sans antialiased">
      {Object.entries(FEATURES_BY_MODULE).map(([module, features]) => (
        <div key={module} className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-3xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            {module}
          </p>
          <div className="grid grid-cols-1 gap-2">
            {features.map((feature) => {
              const isOn = selected.includes(feature.key)
              return (
                <button
                  key={feature.key}
                  type="button"
                  disabled={disabled}
                  onClick={() => toggleFeature(feature.key)}
                  className={`flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-left text-xs font-semibold transition-all ${
                    isOn
                      ? 'border-slate-900 bg-slate-900 text-white shadow-3xs'
                      : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300 hover:bg-white'
                  } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                >
                  <span className="font-bold text-xs">{feature.label}</span>
                  <span
                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                      isOn ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-2xs transition-transform ${
                        isOn ? 'translate-x-4' : 'translate-x-1'
                      }`}
                    />
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {CRM_FEATURES.length === 0 && (
        <p className="text-xs font-medium text-slate-400 italic">No CRM features configured.</p>
      )}
    </div>
  )
}

// Backward compatible export
export const PermissionPicker = FeatureAccessPicker
export default FeatureAccessPicker