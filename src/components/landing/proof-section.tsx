"use client"

const STATS = [
  { v: '12m', l: 'Median time to first follow-up', color: 'text-[#00AEEF]' },
  { v: '3.1×', l: 'Faster qualification cycles', color: 'text-[#8DC63F]' },
  { v: '1', l: 'Workspace for the whole motion', color: 'text-[#FFC20E]' },
]

const QUOTES = [
  {
    q: 'We stopped running revenue from a mosaic of sheets. The pipeline finally matches how the team actually sells.',
    a: 'Director of Growth',
    c: 'Multi-site clinic group',
    badge: 'Verified Impact',
    topBar: 'bg-[#8DC63F]',
  },
  {
    q: 'Permissions were the reason we left the last CRM. WholCure gives managers the room, and operators the lane.',
    a: 'Revenue Operations',
    c: 'Distribution network',
    badge: 'Secure Access',
    topBar: 'bg-[#00AEEF]',
  },
  {
    q: 'It feels composed. That sounds small until you live in software eight hours a day.',
    a: 'Sales Lead',
    c: 'Wellness brand',
    badge: 'High Performance',
    topBar: 'bg-[#FFC20E]',
  },
]

const MARKS = [
  'Clinics',
  'Wellness',
  'Distribution',
  'Professional services',
  'Health groups',
  'Field teams',
  'Partnerships',
  'Inside sales',
]

export const ProofSection = () => {
  return (
    <section id="proof" className="scroll-mt-24 border-t border-slate-200 bg-white">
      <div className="overflow-hidden border-b border-slate-200 bg-slate-50 py-5">
        <div className="lp-marquee text-[12px] font-semibold uppercase tracking-[0.22em] text-slate-500 sm:text-[13px]">
          {[...MARKS, ...MARKS].map((m, i) => (
            <span key={`${m}-${i}`} className="flex items-center gap-8">
              {m}
              <span className="h-px w-8 bg-slate-300" />
            </span>
          ))}
        </div>
      </div>

      <div className="lp-wrap py-20 lg:py-28">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6">
          {STATS.map((s) => (
            <div key={s.l} className="border-t-2 border-slate-200 pt-6">
              <p className={`text-[clamp(2.4rem,5vw,3.5rem)] font-bold leading-none tracking-tight ${s.color}`}>
                {s.v}
              </p>
              <p className="mt-3 max-w-[16rem] text-sm font-medium text-slate-600">
                {s.l}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {QUOTES.map((item) => (
            <div
              key={item.a}
              className="relative overflow-hidden flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 shadow-sm"
            >
              {/* Clean professional top indicator bar */}
              <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1.5 ${item.topBar}`} />

              <div>
                <span className="inline-block rounded-md bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm border border-slate-200">
                  {item.badge}
                </span>
                <p className="mt-4 text-[15px] leading-relaxed text-slate-800">
                  “{item.q}”
                </p>
              </div>
              <footer className="mt-8 border-t border-slate-200/60 pt-4">
                <p className="text-sm font-bold text-slate-900">{item.a}</p>
                <p className="mt-0.5 text-xs text-slate-500">{item.c}</p>
              </footer>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}