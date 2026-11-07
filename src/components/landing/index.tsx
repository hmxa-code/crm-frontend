"use client"
import React from 'react'
import { LandingNavbar } from './navbar'
import { HeroSection } from './hero-section'
import { LandingFooter } from './footer'

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <LandingNavbar />
      <HeroSection />
      <LandingFooter />
    </div>
  )
}
