// "use client"
// import React from 'react'
// import Image from 'next/image'
// import Link from 'next/link'
// import { FiArrowLeft } from 'react-icons/fi'
// import crmlogo from '@/src/assets/crm-logo.png'

// export const BrandPanel = () => {
//   return (
//     <div className="hidden lg:flex lg:w-[48%] bg-[#0F172A] relative overflow-hidden flex-col justify-between px-14 xl:px-20 py-12">
      
//       {/* Subtle grid */}
//       <div 
//         className="absolute inset-0 opacity-[0.06]"
//         style={{
//           backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
//           backgroundSize: '28px 28px'
//         }}
//       />

//       {/* Soft glows */}
//       <div className="absolute -top-24 -left-24 w-72 h-72 bg-sky-500/15 rounded-full blur-[100px]" />
//       <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-400/10 rounded-full blur-[100px]" />


//       {/* Middle Content */}
//       <div className="relative z-10 max-w-md">
//         {/* Logo */}
//         <div className="mb-10 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 inline-block">
//           <Image
//             src={crmlogo}
//             alt="CoreSphere"
//             className="h-10 w-auto object-contain"
//             priority
//           />
//         </div>

//         <h1 className="text-4xl xl:text-[42px] font-semibold text-white leading-[1.15] tracking-tight mb-5">
//           Welcome to the<br />
//           <span className="text-sky-400">workspace</span>
//         </h1>
        
//         <p className="text-slate-400 text-[15px] leading-relaxed">
//           Access your professional CRM dashboard and stay connected with your team.
//         </p>
//       </div>

//       {/* Empty bottom spacer for balance */}
//       <div className="h-8" />

//       {/* Bottom color bar */}
//       <div className="absolute bottom-0 left-0 right-0 h-[3px] flex">
//         <div className="flex-1 bg-red-500" />
//         <div className="flex-1 bg-sky-400" />
//         <div className="flex-1 bg-amber-400" />
//         <div className="flex-1 bg-emerald-400" />
//       </div>
//     </div>
//   )
// }

"use client"
import React from 'react'
import Image from 'next/image'
import crmlogo from '@/src/assets/crm-logo.png'

export const BrandPanel = () => {
  return (
    <div className="hidden lg:flex lg:w-[45%] bg-[#0F172A] relative overflow-hidden flex-col justify-between p-12">
      
      {/* Background Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Header Logo */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 p-2.5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
          <Image
            src={crmlogo}
            alt="WholCure CRM"
            className="h-7 w-auto object-contain"
            priority
          />
        </div>
      </div>

      {/* Hero Messaging */}
      <div className="relative z-10 max-w-sm">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#00AEEF]">Enterprise Workspace</span>
        <h1 className="text-3xl font-bold text-white leading-tight tracking-tight mt-2 mb-4">
          Automate your revenue motion with composed pipelines.
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          High-performance onboarding built for modern sales & operational teams.
        </p>

        {/* Status Indicators */}
        <div className="mt-8 space-y-3 border-t border-slate-800 pt-6">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#8DC63F]" /> 99.9% Uptime Architecture
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#00AEEF]" /> Role-Based Security & Permissions
          </div>
        </div>
      </div>

      {/* Bottom Color Bar */}
      <div className="relative z-10 flex items-center gap-2 pt-6 border-t border-slate-800/80">
        <span className="h-1.5 w-6 rounded-full bg-[#ED1C24]" />
        <span className="h-1.5 w-6 rounded-full bg-[#FFC20E]" />
        <span className="h-1.5 w-6 rounded-full bg-[#8DC63F]" />
        <span className="h-1.5 w-6 rounded-full bg-[#00AEEF]" />
      </div>
    </div>
  )
}