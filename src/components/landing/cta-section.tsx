"use client"

import Link from 'next/link'

export const CtaSection = () => {
  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="lp-wrap py-16 sm:py-20 lg:py-24">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 px-6 py-12 text-center sm:px-12 sm:py-16 shadow-sm">
          <span aria-hidden="true" className="absolute left-1/2 top-0 h-1.5 w-28 -translate-x-1/2 rounded-b-full bg-[#00AEEF]" />

          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00AEEF]">Get started</p>

            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Request a workspace built around your team.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Tell us about your team. We’ll review your request, set up the right access, and help you get started with WholCure.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#00AEEF] px-7 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 transition-colors"
              >
                Request access
              </Link>

              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-7 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                I already have an account
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}