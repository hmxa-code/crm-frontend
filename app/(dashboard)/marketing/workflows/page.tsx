'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MarketingWorkflowsRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/workflows')
  }, [router])

  return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="h-6 w-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Navigating to Unified Workflows...</p>
      </div>
    </div>
  )
}
