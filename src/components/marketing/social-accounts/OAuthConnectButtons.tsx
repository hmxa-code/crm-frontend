import React from 'react'
import { SocialPlatform } from '@/src/types/marketing/social-account'
import { SocialAccountsService } from '@/src/services/marketing/SocialAccountsService'

const PLATFORMS: SocialPlatform[] = ['Facebook', 'Instagram', 'LinkedIn', 'Google']

export const OAuthConnectButtons: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-2">
      {PLATFORMS.map((p) => (
        <button
          key={p}
          onClick={() => SocialAccountsService.initiateOAuthFlow(p)}
          className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Connect {p}
        </button>
      ))}
    </div>
  )
}