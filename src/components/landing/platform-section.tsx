"use client"

const FEATURES = [
  {
    title: 'Lead command',
    desc: 'Inbound, referral, and campaign contacts in one living record — owner, next action, and history without hunting.',
    span: 'md:col-span-2 lg:col-span-7',
    visual: 'leads',
  },
  {
    title: 'Role architecture',
    desc: 'Admins, managers, and operators see the slice they should. Permissions designed, not bolted on.',
    span: 'lg:col-span-5',
    visual: 'roles',
  },
  {
    title: 'Deal motion',
    desc: 'A pipeline that respects how revenue moves: stages, activity, and the details that close rooms.',
    span: 'sm:col-span-1 lg:col-span-4',
    visual: 'deal',
  },
  {
    title: 'Automation, restrained',
    desc: 'Follow-ups and sequences that fire with taste. No noise. No forgotten threads.',
    span: 'lg:col-span-4',
    visual: 'auto',
  },
  {
    title: 'Live insight',
    desc: 'What is slipping, who is carrying, and where the quarter is actually going.',
    span: 'lg:col-span-4',
    visual: 'insight',
  },
]

function FeatureVisual({ type }: { type: string }) {
  if (type === 'leads') {
    return (
      <div className="mt-8 space-y-2">
        {[
          ['Helix Distribution', 'Inbound', 'Hot', 'text-[#ED1C24]'],
          ['Harbor Medical', 'Referral', 'Warm', 'text-[#FFC20E]'],
          ['Aether Wellness', 'Campaign', 'New', 'text-[#00AEEF]'],
        ].map(([name, src, heat, color]) => (
          <div key={name} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
            <div>
              <p className="text-xs font-semibold text-slate-900">{name}</p>
              <p className="text-[10px] text-slate-500">{src}</p>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${color}`}>
              {heat}
            </span>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'roles') {
    return (
      <div className="mt-8 grid grid-cols-3 gap-2">
        {['Admin', 'Manager', 'Member'].map((role) => (
          <div key={role} className="rounded-xl border border-slate-200 bg-white px-2 py-5 text-center shadow-sm">
            <p className="text-xs font-semibold text-slate-700">{role}</p>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'deal') {
    return (
      <div className="mt-8 h-16 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex h-full">
          {['28%', '22%', '31%', '19%'].map((w, i) => (
            <div
              key={w}
              className="flex items-end justify-center pb-2 text-[10px] font-semibold text-slate-600"
              style={{
                width: w,
                background: i === 0 ? '#00aeef20' : i === 1 ? '#8dc63f20' : i === 2 ? '#ffc20e20' : '#ed1c2420',
              }}
            >
              {w}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (type === 'auto') {
    return (
      <div className="mt-8 space-y-2 font-mono text-xs text-slate-600">
        <p><span className="text-[#00AEEF] font-bold">if</span> stage → Proposal</p>
        <p className="text-slate-900 font-semibold"><span className="text-[#8DC63F] font-bold">then</span> sequence · Executive follow-up</p>
        <p><span className="text-[#ED1C24] font-bold">wait</span> 2 days · notify owner</p>
      </div>
    )
  }

  return (
    <div className="mt-8 grid grid-cols-3 gap-2">
      {['$841k', '34%', '18d'].map((n) => (
        <div key={n} className="rounded-xl border border-slate-200 bg-white py-3 text-center text-sm font-bold text-slate-900 shadow-sm">
          {n}
        </div>
      ))}
    </div>
  )
}

export const PlatformSection = () => {
  return (
    <section id="platform" className="scroll-mt-24 border-t border-slate-200 bg-slate-50 py-20 lg:py-28">
      <div className="lp-wrap">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00AEEF]">Platform Architecture</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything a serious CRM needs. Nothing it should not.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            WholCure is composed for operators: companies, contacts, pipeline, automation, and insight — in a surface your team will keep open.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {FEATURES.map((item) => (
            <article key={item.title} className={`lp-card p-6 sm:p-8 ${item.span}`}>
              <h3 className="text-xl font-bold tracking-tight text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.desc}</p>
              <FeatureVisual type={item.visual} />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}