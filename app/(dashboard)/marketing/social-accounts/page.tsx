'use client'

import React, { useState, useEffect } from 'react'
import { SocialAccount } from '@/src/types/marketing/social-account'
import { SocialAccountsService } from '@/src/services/marketing/SocialAccountsService'
import { SocialAccountCard } from '@/src/components/marketing/social-accounts/AccountConnectionCard'
import { OAuthConnectButtons } from '@/src/components/marketing/social-accounts/OAuthConnectButtons'
import toast, { Toaster } from 'react-hot-toast'

export default function SocialAccountsPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([])

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    const data = await SocialAccountsService.getConnectedAccounts()
    setAccounts(data || [])
  }

  const handleDisconnect = async (id: string) => {
    await SocialAccountsService.disconnectAccount(id)
    setAccounts((prev) => prev.filter((a) => a._id !== id))
    toast.success('Account disconnected.')
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-900 font-sans space-y-6 max-w-5xl mx-auto">
      <Toaster position="top-right" />

      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Connected Social Accounts</h1>
        <p className="text-xs text-slate-500">Manage direct OAuth 2.0 authorizations for your Meta, LinkedIn, and Google platforms.</p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Add New Connection</h3>
        <OAuthConnectButtons />
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Authorized Accounts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {accounts.map((acc) => (
            <SocialAccountCard key={acc._id} account={acc} onDisconnect={handleDisconnect} />
          ))}
        </div>
      </div>
    </div>
  )
}