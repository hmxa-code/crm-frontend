"use client"

import Link from 'next/link'
import Image from 'next/image'
import crmlogo from '@/src/assets/crm-logo.png'

const MAIN_LINKS = [
  { label: 'Platform', href: '#platform', color: '#ED1C24' },
  { label: 'Suite', href: '#suite', color: '#FFC20E' },
  { label: 'Pipeline', href: '#pipeline', color: '#8DC63F' },
  { label: 'Proof', href: '#proof', color: '#00AEEF' },
]

export const LandingFooter = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="lp-wrap flex flex-col gap-10 py-12 lg:flex-row lg:items-start lg:justify-between">
        
        {/* Left Brand Column */}
        <div className="max-w-sm">
          <Image src={crmlogo} alt="WholCure CRM" className="h-8 w-auto object-contain" />
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Solutions that grow your world. A clean, reliable CRM for teams who take their pipeline and revenue seriously.
          </p>
        </div>

        {/* Right Navigation & Links Columns */}
        <div className="flex flex-wrap gap-x-12 gap-y-6 text-sm font-semibold text-slate-600">
          
          {/* Navigation Section */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Ecosystem</span>
            <div className="flex flex-wrap lg:flex-col gap-x-6 gap-y-2.5">
              {MAIN_LINKS.map((link) => (
                <a 
                  key={link.href} 
                  href={link.href} 
                  className="transition-colors hover:text-[#00AEEF] flex items-center gap-2"
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: link.color }} />
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Workspace Access Section */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Workspace</span>
            <div className="flex flex-col gap-2.5">
              <Link href="/login" className="transition-colors hover:text-[#FFC20E] flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFC20E]" />
                <span>Sign in</span>
              </Link>
              <Link href="/register" className="transition-colors hover:text-[#8DC63F] flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8DC63F]" />
                <span>Request access</span>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-slate-100 bg-slate-50/50">
        <div className="lp-wrap py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} WholCure. All rights reserved.</p>
          <div className="flex items-center gap-4 font-medium">
            <span className="hover:text-[#ED1C24] transition-colors cursor-pointer">Privacy</span>
            <span>•</span>
            <span className="hover:text-[#FFC20E] transition-colors cursor-pointer">Terms</span>
            <span>•</span>
            <span className="hover:text-[#00AEEF] transition-colors cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  )
}