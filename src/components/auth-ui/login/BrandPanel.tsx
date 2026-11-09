"use client"
import React from 'react'
import Image from 'next/image'
import crmlogo from '@/src/assets/crm-logo.png'

export const BrandPanel = () => {
  return (
    <div className="hidden lg:flex lg:w-[48%] bg-[#0F172A] relative overflow-hidden flex-col justify-center px-14 xl:px-20">
      
      {/* Subtle grid */}
      <div 
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />

      {/* Soft glows */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#00AEEF]/15 rounded-full blur-[100px]" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#8DC63F]/10 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-md">
        {/* Logo */}
        <div className="mb-10 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 inline-block">
          <Image
            src={crmlogo}
            alt="WholCure CRM"
            className="h-10 w-auto object-contain"
            priority
          />
        </div>

        <h1 className="text-4xl xl:text-[42px] font-semibold text-white leading-[1.15] tracking-tight mb-5">
          Welcome to the<br />
          <span className="text-[#00AEEF]">workspace</span>
        </h1>
        
        <p className="text-slate-400 text-[15px] leading-relaxed">
          Access your professional CRM dashboard and stay connected with your team.
        </p>

        {/* Features List */}
        <div className="mt-8 space-y-3">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <div className="h-1.5 w-1.5 rounded-full bg-[#00AEEF]" />
            <span>Secure authentication</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <div className="h-1.5 w-1.5 rounded-full bg-[#8DC63F]" />
            <span>Real-time updates</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <div className="h-1.5 w-1.5 rounded-full bg-[#FFC20E]" />
            <span>Advanced analytics</span>
          </div>
        </div>
      </div>

      {/* Bottom color bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] flex">
        <div className="flex-1 bg-[#ED1C24]" />
        <div className="flex-1 bg-[#00AEEF]" />
        <div className="flex-1 bg-[#8DC63F]" />
        <div className="flex-1 bg-[#FFC20E]" />
      </div>
    </div>
  )
}