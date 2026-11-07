"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiMenu, FiX } from 'react-icons/fi'

export const LandingNavbar = () => {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/wholcure.png"
            alt="Wholcure"
            width={140}
            height={36}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Features
          </a>
          <a href="#why" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Why Wholcure
          </a>
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Login
          </Link>
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 space-y-3">
          <a href="#features" className="block text-sm font-medium text-slate-700 hover:text-slate-900" onClick={() => setOpen(false)}>
            Features
          </a>
          <a href="#why" className="block text-sm font-medium text-slate-700 hover:text-slate-900" onClick={() => setOpen(false)}>
            Why Wholcure
          </a>
          <Link href="/login" className="block text-sm font-medium text-slate-700 hover:text-slate-900" onClick={() => setOpen(false)}>
            Login
          </Link>
          <Link
            href="/register"
            className="block w-full text-center px-5 py-3 text-sm font-semibold text-white
                       bg-gradient-to-r from-slate-900 to-slate-700
                       shadow-[0_2px_10px_rgba(15,23,42,0.25)]
                       active:scale-95 transition-all"
            onClick={() => setOpen(false)}
          >
            Request Access
          </Link>
        </div>
      )}
    </nav>
  )
}