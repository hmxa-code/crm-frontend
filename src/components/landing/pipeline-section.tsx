"use client"

const STEPS = [
 {
 n: '01',
 title: 'Capture once',
 body: 'Leads land from forms, imports, and your team — assigned, scored, and visible without a second system.',
 },
 {
 n: '02',
 title: 'Move with intent',
 body: 'Stages are a narrative, not a graveyard. Activity, owners, and next steps travel with every opportunity.',
 },
 {
 n: '03',
 title: 'Close, then compound',
 body: 'Won deals feed insight. Lost deals teach the room. The workspace gets sharper every cycle.',
 },
]

export const PipelineSection = () => {
 return (
 <section
 id="pipeline"
 className="scroll-mt-24 border-t border-[var(--lp-line)]"
 >
 <div className="lp-wrap grid grid-cols-1 gap-12 py-20 lg:grid-cols-12 lg:gap-16 lg:py-28">
 <div className="lg:col-span-5">
 <p className="lp-kicker">Pipeline</p>

 <h2 className="mt-4 text-[clamp(1.85rem,4vw,3.1rem)] leading-[1.08] tracking-[-0.03em] text-[var(--lp-paper)]">
 Built for teams that want{' '}
 <em className="italic text-[var(--lp-blue)]">clarity</em> and
 control.
 </h2>

 <p className="mt-5 text-sm leading-relaxed text-[var(--lp-muted)] sm:text-base">
 A single source of truth for companies, contacts, and the motion
 between them — without the ceremony of legacy CRMs.
 </p>

 <ul className="mt-8 space-y-4">
 {[
 'Centralized company and contact records',
 'Role-aware dashboards for every seat',
 'Automated follow-ups that stay quiet until they matter',
 'An interface designed to be lived in, not demoed once',
 ].map((line) => (
 <li
 key={line}
 className="flex gap-3 text-sm text-[var(--lp-ink)]"
 >
 <span
 aria-hidden="true"
 className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--lp-blue)]"
 />
 {line}
 </li>
 ))}
 </ul>
 </div>

 <div className="lg:col-span-7">
 <div className="grid gap-3">
 {STEPS.map((step) => (
 <article
 key={step.n}
 className="grid grid-cols-[auto_1fr] gap-5 rounded-[1.35rem] border border-[var(--lp-line)] bg-[var(--lp-elev)] p-5 sm:p-7"
 >
 <span className="font-mono text-xs text-[var(--lp-blue)]">
 {step.n}
 </span>

 <div>
 <h3 className="text-lg text-[var(--lp-paper)]">
 {step.title}
 </h3>
 <p className="mt-2 text-sm leading-relaxed text-[var(--lp-muted)]">
 {step.body}
 </p>
 </div>
 </article>
 ))}
 </div>
 </div>
 </div>
 </section>
 )
}
