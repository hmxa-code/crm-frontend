// "use client"

// const MODULES = [
//  {
//  n: '01',
//  title: 'Pipeline & records',
//  body: 'Companies, contacts, and deals in a single narrative. Ownership stays attached as work moves.',
//  },
//  {
//  n: '02',
//  title: 'Tasks & workload',
//  body: 'Workstation, sprints, and time — so follow-through is not a side conversation in chat.',
//  },
//  {
//  n: '03',
//  title: 'Chat & calendar',
//  body: 'The room and the schedule live next to the record. Context does not leak into another tool.',
//  },
//  {
//  n: '04',
//  title: 'Marketing motion',
//  body: 'Campaigns, drips, and workflows that feed the same pipeline your sales team already trusts.',
//  },
// ]

// export const SuiteSection = () => {
//  return (
//  <section
//  id="suite"
//  className="scroll-mt-24 border-t border-[var(--lp-line)]"
//  >
//  <div className="lp-wrap py-20 lg:py-28">
//  <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
//  <div className="max-w-xl">
//  <p className="lp-kicker">Suite</p>

//  <h2 className="mt-4 text-[clamp(1.85rem,4.2vw,3.2rem)] leading-[1.05] tracking-[-0.03em] text-[var(--lp-ink)]">
//  One workspace. The whole commercial motion.
//  </h2>
//  </div>

//  <p className="max-w-sm text-sm leading-relaxed text-[var(--lp-muted)]">
//  Revenue teams should not assemble a CRM from five products.
//  WholCure holds the stack with composure.
//  </p>
//  </div>

//  <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-[1.35rem] border border-[var(--lp-line)] bg-[var(--lp-line)] sm:grid-cols-2">
//  {MODULES.map((mod) => (
//  <article
//  key={mod.n}
//  className="bg-[var(--lp-bg-mid)] p-6 sm:p-8"
//  >
//  <span className="font-mono text-[11px] text-[var(--lp-blue)]">
//  {mod.n}
//  </span>

//  <h3 className="mt-4 text-xl tracking-tight text-[var(--lp-ink)]">
//  {mod.title}
//  </h3>

//  <p className="mt-3 text-sm leading-relaxed text-[var(--lp-muted)]">
//  {mod.body}
//  </p>
//  </article>
//  ))}
//  </div>
//  </div>
//  </section>
//  )
// }

"use client"

const MODULES = [
  {
    n: '01',
    title: 'Pipeline & records',
    body: 'Companies, contacts, and deals in a single narrative. Ownership stays attached as work moves.',
    tag: 'Core Pipeline',
    color: 'text-[#00AEEF]',
  },
  {
    n: '02',
    title: 'Tasks & workload',
    body: 'Workstation, sprints, and time — so follow-through is not a side conversation in chat.',
    tag: 'Execution',
    color: 'text-[#8DC63F]',
  },
  {
    n: '03',
    title: 'Chat & calendar',
    body: 'The room and the schedule live next to the record. Context does not leak into another tool.',
    tag: 'Sync',
    color: 'text-[#FFC20E]',
  },
  {
    n: '04',
    title: 'Marketing motion',
    body: 'Campaigns, drips, and workflows that feed the same pipeline your sales team already trusts.',
    tag: 'Growth',
    color: 'text-[#ED1C24]',
  },
]

export const SuiteSection = () => {
  return (
    <section
      id="suite"
      className="scroll-mt-24 border-t border-slate-200 bg-white"
    >
      <div className="lp-wrap py-20 lg:py-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00AEEF]">Suite Architecture</p>

            <h2 className="mt-4 text-[clamp(1.85rem,4.2vw,3.2rem)] font-bold leading-[1.05] tracking-tight text-slate-900">
              One workspace. The whole commercial motion.
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-relaxed text-slate-600">
            Revenue teams should not assemble a CRM from five disjointed products. WholCure holds the stack with composure.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {MODULES.map((mod) => (
            <article
              key={mod.n}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 shadow-sm transition-all hover:border-slate-300"
            >
              <div className="flex items-center justify-between">
                <span className={`font-mono text-xs font-bold ${mod.color}`}>
                  MODULE {mod.n}
                </span>
                <span className="rounded-md bg-white px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 border border-slate-200">
                  {mod.tag}
                </span>
              </div>

              <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900">
                {mod.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {mod.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}