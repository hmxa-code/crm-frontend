"use client"
import React from 'react'
import Link from 'next/link'
import { FiArrowRight, FiUsers, FiLayout, FiTrendingUp, FiShield, FiZap, FiCheckCircle } from 'react-icons/fi'

export const HeroSection = () => {
  return (
    <>
      {/* HERO */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-emerald-50/50 via-slate-50/40 to-transparent blur-3xl rounded-full" />
        </div>

        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
            <FiCheckCircle size={14} /> WHOLCURE CRM Platform v1.0
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
            Manage your <span className="text-emerald-500">Leads</span> &{" "}
            <span className="text-slate-700">Opportunities</span> smarter.
          </h1>

          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            The all-in-one platform for modern teams. Track companies, manage contacts, automate workflows, and close deals with real-time insights.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* ////////// */}
            <Link
            href="/register"
            className="relative inline-flex items-center justify-center px-5 py-2.5 rounded text-sm font-semibold text-white
                       bg-gradient-to-r from-slate-900 to-slate-700
                       shadow-[0_2px_10px_rgba(15,23,42,0.25)]
                       hover:shadow-[0_6px_20px_rgba(15,23,42,0.35)]
                       hover:from-slate-800 hover:to-slate-600
                       active:scale-95
                       transition-all duration-200 ease-out"
          >
            Get Started Free
          </Link>
            {/* ////////// */}
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 rounded-2xl font-semibold text-sm border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Everything you need</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Powerful tools designed to help your team work faster and close more deals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <FiUsers />,
              color: "emerald",
              title: "Lead Management",
              desc: "Track and nurture contacts from first touch to closed deal with powerful pipeline tools."
            },
            {
              icon: <FiLayout />,
              color: "sky",
              title: "Role-Based Access",
              desc: "Granular permissions for Admins, Managers and team members with secure views."
            },
            {
              icon: <FiTrendingUp />,
              color: "amber",
              title: "Deal Pipeline",
              desc: "Visual opportunity tracking, activity logs and automated follow-ups."
            },
            {
              icon: <FiShield />,
              color: "red",
              title: "Secure & Reliable",
              desc: "Enterprise-grade security with role-based permissions and audit logs."
            },
            {
              icon: <FiZap />,
              color: "emerald",
              title: "Automation Engine",
              desc: "Automate follow-ups, tasks and workflows so your team stays focused."
            },
            {
              icon: <FiCheckCircle />,
              color: "sky",
              title: "Real-time Insights",
              desc: "Live dashboards and reports that help you make better decisions faster."
            }
          ].map((item, i) => (
            <div
              key={i}
              className="group p-7 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
              style={{
                borderColor: item.color === 'emerald' ? 'rgba(16, 185, 129, 0.1)' :
                             item.color === 'sky' ? 'rgba(71, 85, 105, 0.1)' :
                             item.color === 'amber' ? 'rgba(245, 158, 11, 0.1)' :
                             'rgba(239, 68, 68, 0.1)'
              }}
            >
              <div className={`w-12 h-12 mb-5 rounded-xl flex items-center justify-center text-xl
                ${item.color === "emerald" && "bg-emerald-100 text-emerald-600"}
                ${item.color === "sky" && "bg-slate-100 text-slate-600"}
                ${item.color === "amber" && "bg-amber-100 text-amber-600"}
                ${item.color === "red" && "bg-red-100 text-red-600"}
              `}>
                {item.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-emerald-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY SECTION */}
      <section id="why" className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold uppercase tracking-widest mb-4">
                <FiCheckCircle size={14} /> For Modern Teams
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-5 leading-tight">
                Built for teams that want <span className="text-emerald-500">clarity</span> and <span className="text-slate-700">control</span>
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Wholcure gives your organization a single source of truth for leads, opportunities, and team activity — without the complexity of traditional CRMs.
              </p>
              <ul className="space-y-4">
                {[
                  "Centralized company & contact management",
                  "Role-based dashboards for every team member",
                  "Automated follow-ups and task sequences",
                  "Clean, modern interface your team will actually use"
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <FiCheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                    <span className="text-sm font-medium">{text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
            href="/register"
            className="relative inline-flex items-center justify-center px-5 py-2.5 rounded text-sm font-semibold text-white
                       bg-gradient-to-r from-slate-900 to-slate-700
                       shadow-[0_2px_10px_rgba(15,23,42,0.25)]
                       hover:shadow-[0_6px_20px_rgba(15,23,42,0.35)]
                       hover:from-slate-800 hover:to-slate-600
                       active:scale-95
                       transition-all duration-200 ease-out"
          >
            Request Access
          </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <h3 className="font-bold text-slate-900 mb-4 text-xl">Ready to transform your business?</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Request access today and our team will set up your workspace. We'll review your requirements and get you onboarded quickly with full onboarding support.
              </p>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}
