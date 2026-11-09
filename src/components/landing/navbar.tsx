"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import crmlogo from '@/src/assets/crm-logo.png'

const LINKS = [
  { href: '#platform', label: 'Platform' },
  { href: '#suite', label: 'Suite' },
  { href: '#pipeline', label: 'Pipeline' },
  { href: '#proof', label: 'Proof' },
]

export const LandingNavbar = () => {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={`sticky top-0 z-[60] transition-all duration-300 ${
      scrolled || open 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-slate-200/60' 
        : 'bg-white/70 backdrop-blur-sm shadow-sm border-b border-slate-100/50'
    }`}>
      {/* Top Bar (Scrolled State) */}
      <div className={`transition-all duration-300 ${scrolled ? 'py-0' : 'py-0'}`}>
        <div className="lp-wrap flex h-16 lg:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-50 flex items-center gap-3 py-1" onClick={() => setOpen(false)}>
            <div className="flex h-10 items-center rounded-xl bg-slate-50 px-3 border border-slate-200/60 shadow-sm">
              <Image src={crmlogo} alt="WholCure CRM" className="h-6 w-auto object-contain" priority />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {LINKS.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-[#00AEEF] hover:bg-[#00AEEF]/5 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link 
              href="/login" 
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
            >
              Sign in
            </Link>
            <Link 
              href="/register" 
              className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#00AEEF] to-[#0084C7] text-white shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 hover:scale-105 transition-all duration-200"
            >
              Request access
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="relative z-[70] flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 lg:hidden bg-white shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
            aria-label="Toggle menu"
            onClick={() => setOpen((val) => !val)}
          >
            <span className="relative block h-5 w-5">
              <span className={`absolute left-0.5 h-0.5 w-[18px] bg-current transition-all duration-300 ${open ? 'top-2.5 rotate-45' : 'top-1'}`} />
              <span className={`absolute left-0.5 top-2.5 h-0.5 w-[18px] bg-current transition-opacity duration-300 ${open ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`absolute left-0.5 h-0.5 w-[18px] bg-current transition-all duration-300 ${open ? 'top-2.5 -rotate-45' : 'top-4'}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Sidebar */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out ${
        open 
          ? 'max-h-[calc(100dvh-80px)] opacity-100' 
          : 'max-h-0 opacity-0'
      } overflow-hidden bg-white border-b border-slate-100 shadow-xl`}>
        <nav className="flex flex-col py-6 px-6 gap-1">
          {LINKS.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="group relative overflow-hidden rounded-xl px-4 py-4 text-base font-bold text-slate-700 hover:text-[#00AEEF] hover:bg-[#00AEEF]/5 transition-all duration-200"
            >
              <span className="relative z-10">{link.label}</span>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-[#00AEEF] transition-colors">
                →
              </span>
              {index === 0 && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#00AEEF]" />
              )}
            </Link>
          ))}
        </nav>

        <div className="border-t border-slate-100 px-6 py-6 flex flex-col gap-3 bg-slate-50/50">
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 h-12 rounded-xl border border-slate-300 bg-white font-semibold text-slate-700 hover:border-[#00AEEF] hover:text-[#00AEEF] hover:shadow-md transition-all duration-200"
          >
            <span>Sign in</span>
          </Link>
          <Link
            href="/register"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center h-12 rounded-xl bg-gradient-to-r from-[#00AEEF] to-[#0084C7] font-semibold text-white shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 hover:scale-[1.02] transition-all duration-200"
          >
            <span>Get Started Free</span>
          </Link>
        </div>
        
      </div>
    </header>
  )
}