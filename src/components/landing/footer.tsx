"use client"
import React from 'react'

export const LandingFooter = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-slate-500 text-sm font-medium">
          © 2026 Wholcure. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
          <span className="hover:text-emerald-600 cursor-pointer transition-colors">Privacy</span>
          <span className="hover:text-emerald-600 cursor-pointer transition-colors">Terms</span>
          <span className="hover:text-emerald-600 cursor-pointer transition-colors">Support</span>
        </div>
      </div>
    </footer>
  )
}