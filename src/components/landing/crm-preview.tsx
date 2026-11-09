"use client"

export const CrmPreview = () => {
  return (
    <div className="group relative w-full max-w-[500px] mx-auto rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xl shadow-[#00AEEF]/5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-[#ED1C24] sm:h-2.5 sm:w-2.5" />
            <div className="h-2 w-2 rounded-full bg-[#FFC20E] sm:h-2.5 sm:w-2.5" />
            <div className="h-2 w-2 rounded-full bg-[#8DC63F] sm:h-2.5 sm:w-2.5" />
          </div>
          <span className="ml-2 text-[9px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
            WholCure Workspace v2.4
          </span>
        </div>
        <span className="rounded-md bg-[#00AEEF]/10 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-[#00AEEF]">
          Live Pipeline
        </span>
      </div>

      {/* Stats Grid - Stack on mobile, grid on desktop */}
      <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-2 sm:gap-3">
        <div className="rounded-lg sm:rounded-xl border border-slate-100 bg-slate-50 p-2 sm:p-3 hover:bg-white transition-colors duration-300">
          <p className="text-[9px] sm:text-[10px] font-medium text-slate-500 uppercase tracking-wide">Qualified Deals</p>
          <p className="mt-1 text-lg sm:text-xl font-bold text-slate-900">$1.42M</p>
          <div className="mt-1.5 sm:mt-2 flex items-center gap-1 text-[9px] sm:text-[10px] font-bold">
            <span className="flex items-center text-[#8DC63F]">
              <svg className="mr-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +14.2%
            </span>
            <span className="text-[8px] sm:text-[10px] text-slate-500">this week</span>
          </div>
        </div>

        <div className="rounded-lg sm:rounded-xl border border-slate-100 bg-slate-50 p-2 sm:p-3 hover:bg-white transition-colors duration-300">
          <p className="text-[9px] sm:text-[10px] font-medium text-slate-500 uppercase tracking-wide">Pending</p>
          <p className="mt-1 text-lg sm:text-xl font-bold text-slate-900">24</p>
          <div className="mt-1.5 sm:mt-2 flex items-center gap-1 text-[9px] sm:text-[10px] font-bold">
            <span className="flex items-center text-[#FFC20E]">
              <svg className="mr-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              4 urgent
            </span>
            <span className="text-[8px] sm:text-[10px] text-slate-500">today</span>
          </div>
        </div>

        <div className="rounded-lg sm:rounded-xl border border-slate-100 bg-slate-50 p-2 sm:p-3 hover:bg-white transition-colors duration-300">
          <p className="text-[9px] sm:text-[10px] font-medium text-slate-500 uppercase tracking-wide">SLA</p>
          <p className="mt-1 text-lg sm:text-xl font-bold text-slate-900">99.4%</p>
          <div className="mt-1.5 sm:mt-2 flex items-center gap-1 text-[9px] sm:text-[10px] font-bold">
            <span className="flex items-center text-[#00AEEF]">
              <svg className="mr-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Optimal
            </span>
            <span className="text-[8px] sm:text-[10px] text-slate-500">perf</span>
          </div>
        </div>
      </div>

      {/* Main Pipeline Card */}
      <div className="mt-4 sm:mt-5 rounded-lg sm:rounded-xl border border-slate-100 bg-gradient-to-r from-slate-50 to-white p-3 sm:p-5 hover:border-slate-200 transition-colors duration-300">
        <div className="flex items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-md sm:rounded-lg bg-gradient-to-br from-[#00AEEF] to-[#0084C7] text-white font-bold shadow-lg shadow-[#00AEEF]/20 flex-shrink-0">
              <span className="text-sm sm:text-base font-bold">H</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base font-bold text-slate-900 truncate">Helix Distribution</span>
                <span className="rounded-full bg-[#ED1C24]/10 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold text-[#ED1C24] flex-shrink-0">
                  High Priority
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 truncate">Contract Review • Enterprise</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-base sm:text-xl font-bold text-slate-900">$85K</p>
            <p className="text-[8px] sm:text-[10px] text-slate-500">Expected</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 sm:mt-4">
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-semibold text-slate-500 mb-1.5 sm:mb-2">
            <span>Progress</span>
            <span className="text-[#00AEEF]">75%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div 
              className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#00AEEF] via-[#8DC63F] to-[#FFC20E]"
            />
          </div>
        </div>

        {/* Activity Indicators */}
        <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 sm:gap-2 rounded-md sm:rounded-lg bg-slate-50 px-2 sm:px-3 py-1.5 sm:py-2">
            <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#8DC63F] animate-pulse" />
            <span className="text-[9px] sm:text-[10px] font-medium text-slate-500">Auto-synced</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-md sm:rounded-lg bg-slate-50 px-2 sm:px-3 py-1.5 sm:py-2">
            <svg className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#00AEEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="text-[9px] sm:text-[10px] font-medium text-slate-500">3 activities</span>
          </div>
        </div>
      </div>
    </div>
  )
}