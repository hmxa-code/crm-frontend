import React from 'react'
import { BrandPanel } from '@/src/components/auth-ui/login/BrandPanel'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-white font-sans antialiased">
      <BrandPanel />
      
      <div className="flex-1 flex items-center justify-center p-8 md:p-12 lg:p-16">
        {children}
      </div>
    </div>
  )
}