import React from 'react'
import { SocialAccount } from '@/src/types/marketing/social-account'
import { ChannelPlatformBadge } from '../content-engine/shared/ChannelPlatformBadge'

interface SocialAccountCardProps {
  account: SocialAccount
  onDisconnect: (id: string) => void
}

export const SocialAccountCard: React.FC<SocialAccountCardProps> = ({ account, onDisconnect }) => {
  return (
    <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs flex items-center justify-between">
      <div className="flex items-center gap-3">
        <ChannelPlatformBadge platform={account.platform} />
        <div>
          <h4 className="text-xs font-bold text-slate-900">{account.account_name}</h4>
          <span className="text-[10px] text-slate-400">
            {account.followers_count?.toLocaleString()} Followers • Status: {account.status}
          </span>
        </div>
      </div>
      <button
        onClick={() => onDisconnect(account._id)}
        className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100"
      >
        Disconnect
      </button>
    </div>
  )
}