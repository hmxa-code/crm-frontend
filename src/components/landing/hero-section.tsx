// "use client"

// import Link from 'next/link'
// import { CrmPreview } from './crm-preview'

// export const HeroSection = () => {
//   return (
//     <section className="relative overflow-hidden bg-gradient-to-br from-[#f8fafc] to-[#e0f2fe] py-10 lg:py-15">
//       {/* Background Gradient Elements */}
//       <div className="absolute inset-0 z-0 opacity-40">
//         <div className="absolute -top-20 -right-20 h-[500px] w-[500px] rounded-full bg-[#00AEEF]/20 blur-[100px]" />
//         <div className="absolute top-1/3 -left-20 h-[400px] w-[400px] rounded-full bg-[#8DC63F]/15 blur-[100px]" />
//       </div>

//       <div className="lp-wrap relative z-10">
//         <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
//           {/* Left Content */}
//           <div className="lg:col-span-5">
//             {/* Badge */}
//             <div className="inline-flex items-center gap-2 rounded-full bg-[#00AEEF]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#00AEEF] border border-[#00AEEF]/20 backdrop-blur-sm">
//               <span className="h-2 w-2 rounded-full bg-[#8DC63F] animate-pulse" />
//               WholCure CRM Enterprise
//             </div>

//             {/* Main Heading */}
//             <h1 className="mt-8 text-[clamp(2.8rem,7vw,4.8rem)] font-bold tracking-tight leading-[1.02] text-slate-900">
//               The operating system for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00AEEF] via-[#8DC63F] to-[#FFC20E]">revenue.</span>
//             </h1>

//             {/* Subheading */}
//             <p className="mt-6 text-base lg:text-lg leading-relaxed text-slate-600 max-w-lg">
//               Pipeline, people, tasks, and follow-through in one composed workspace. Built for operators who need a CRM that behaves like a high-performance product.
//             </p>

//             {/* CTA Buttons */}
//             <div className="mt-10 flex flex-col sm:flex-row gap-4">
//               <Link
//                 href="/register"
//                 className="group inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00AEEF] to-[#0084C7] px-8 text-sm font-bold text-white shadow-xl shadow-[#00AEEF]/20 hover:shadow-[#00AEEF]/30 hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300"
//               >
//                 <span>Start Free Trial</span>
//                 <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                 </svg>
//               </Link>

//               <Link
//                 href="/login"
//                 className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-8 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-400 hover:scale-[1.02] transition-all duration-300"
//               >
//                 <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
//                 </svg>
//                 <span>Sign in to Workspace</span>
//               </Link>
//             </div>

//             {/* Social Proof */}
//             <div className="mt-12 flex items-center gap-4 border-t border-slate-200 pt-8">
//               <div className="flex -space-x-2">
//                 {[1, 2, 3, 4].map((i) => (
//                   <div 
//                     key={i}
//                     className="h-10 w-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden"
//                   >
//                     <div className="h-full w-full flex items-center justify-center text-[10px] font-bold text-slate-600">
//                       {i}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-sm font-bold text-slate-900">500+ Companies</span>
//                 <span className="text-xs text-slate-500">Trust WholCure CRM</span>
//               </div>
//             </div>
//           </div>

//           {/* Right Content - CRM Preview */}
//           <div className="lg:col-span-7">
//             <div className="relative">
//               <CrmPreview />
              
//               {/* Floating badges */}
//               <div className="absolute -right-4 top-1/4 hidden lg:block animate-bounce" style={{ animationDuration: '3s' }}>
//                 <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-900 shadow-xl border border-slate-200">
//                   <span className="h-2 w-2 rounded-full bg-[#8DC63F]" />
//                   Real-time Sync
//                 </div>
//               </div>
              
//               <div className="absolute -left-4 bottom-1/4 hidden lg:block animate-bounce" style={{ animationDuration: '4s' }}>
//                 <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-900 shadow-xl border border-slate-200">
//                   <span className="h-2 w-2 rounded-full bg-[#00AEEF]" />
//                   AI Insights
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

"use client"

import Link from 'next/link'
import { CrmPreview } from './crm-preview'

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#f8fafc] to-[#e0f2fe] py-8 sm:py-12 lg:py-16">
      {/* Background Gradient Elements */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute -top-20 -right-20 h-[300px] sm:h-[500px] w-[300px] sm:w-[500px] rounded-full bg-[#00AEEF]/20 blur-[80px] sm:blur-[100px]" />
        <div className="absolute top-1/3 -left-20 h-[250px] sm:h-[400px] w-[250px] sm:w-[400px] rounded-full bg-[#8DC63F]/15 blur-[80px] sm:blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          
          {/* Left Content */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[#00AEEF]/10 px-3.5 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#00AEEF] border border-[#00AEEF]/20 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[#8DC63F] animate-pulse shrink-0" />
              WholCure CRM Enterprise
            </div>

            {/* Main Heading */}
            <h1 className="mt-5 sm:mt-6 text-[clamp(2.2rem,5.5vw,4.2rem)] font-bold tracking-tight leading-[1.08] text-slate-900 break-words w-full">
              The operating system for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00AEEF] via-[#8DC63F] to-[#FFC20E]">revenue.</span>
            </h1>

            {/* Subheading */}
            <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 max-w-xl">
              Pipeline, people, tasks, and follow-through in one composed workspace. Built for operators who need a CRM that behaves like a high-performance product.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto">
              <Link
                href="/register"
                className="group inline-flex h-12 sm:h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00AEEF] to-[#0084C7] px-6 sm:px-8 text-xs sm:text-sm font-bold text-white shadow-xl shadow-[#00AEEF]/20 hover:shadow-[#00AEEF]/30 hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300"
              >
                <span>Start Free Trial</span>
                <svg className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              <Link
                href="/login"
                className="inline-flex h-12 sm:h-14 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 sm:px-8 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-400 hover:scale-[1.02] transition-all duration-300 shadow-2xs"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Sign in to Workspace</span>
              </Link>
            </div>

          </div>

          {/* Right Content - CRM Preview */}
          <div className="lg:col-span-6 w-full">
            <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
              <CrmPreview />
              
              {/* Floating badges */}
              <div className="absolute -right-2 sm:-right-4 top-1/4 hidden xl:block animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-900 shadow-xl border border-slate-200">
                  <span className="h-2 w-2 rounded-full bg-[#8DC63F]" />
                  Real-time Sync
                </div>
              </div>
              
              <div className="absolute -left-2 sm:-left-4 bottom-1/4 hidden xl:block animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-900 shadow-xl border border-slate-200">
                  <span className="h-2 w-2 rounded-full bg-[#00AEEF]" />
                  AI Insights
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}