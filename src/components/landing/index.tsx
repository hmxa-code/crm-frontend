"use client"

import { useEffect } from 'react'
import { Outfit } from 'next/font/google'
import { LandingNavbar } from './navbar'
import { HeroSection } from './hero-section'
import { PlatformSection } from './platform-section'
import { SuiteSection } from './suite-section'
import { PipelineSection } from './pipeline-section'
import { ProofSection } from './proof-section'
import { CtaSection } from './cta-section'
import { LandingFooter } from './footer'
import './landing.css'

const sans = Outfit({
  subsets: ['latin'],
  display: 'swap',
})

export const LandingPage = () => {
  useEffect(() => {
    const html = document.documentElement
    const body = document.body

    html.setAttribute('data-landing', 'true')
    const previousBackground = body.style.background
    const previousColor = body.style.color

    body.style.background = '#ffffff'
    body.style.color = '#0f172a'

    return () => {
      html.removeAttribute('data-landing')
      body.style.background = previousBackground
      body.style.color = previousColor
    }
  }, [])

  return (
    <div className={`lp-root ${sans.className}`}>
      <LandingNavbar />
      <main>
        <HeroSection />
        <PlatformSection />
        <SuiteSection />
        <PipelineSection />
        <ProofSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}