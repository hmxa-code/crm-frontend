'use client';

import React, { useState } from 'react';
import { 
  FiPlus, 
  FiCheck, 
  FiX, 
  FiShield, 
  FiLock, 
  FiExternalLink,
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiTwitter,
  FiYoutube,
  FiMessageSquare,
  FiVideo,
  FiGlobe
} from 'react-icons/fi';
import { SocialPlatform, SocialAccount } from '@/src/types/marketing/social-account';
import { SocialAccountsService } from '@/src/services/marketing/SocialAccountsService';
import toast from 'react-hot-toast';

interface OAuthConnectButtonsProps {
  onAccountAdded?: (newAcc: SocialAccount) => void;
}

interface PlatformOption {
  platform: SocialPlatform;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accentColor: string;
  badgeBg: string;
}

const PLATFORM_OPTIONS: PlatformOption[] = [
  {
    platform: 'Instagram',
    label: 'Instagram Business',
    description: 'Auto-publish posts, reels & sync follower engagement',
    icon: FiInstagram,
    accentColor: 'text-pink-600',
    badgeBg: 'bg-pink-50 text-pink-700 border-pink-200 hover:border-pink-300',
  },
  {
    platform: 'LinkedIn',
    label: 'LinkedIn Organization',
    description: 'B2B thought leadership & company page updates',
    icon: FiLinkedin,
    accentColor: 'text-sky-700',
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200 hover:border-sky-300',
  },
  {
    platform: 'Facebook',
    label: 'Facebook Page',
    description: 'Sync health campaigns, comments & demographic reach',
    icon: FiFacebook,
    accentColor: 'text-blue-600',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-300',
  },
  {
    platform: 'Twitter',
    label: 'X / Twitter',
    description: 'Real-time advisories, community news & hashtag engagement',
    icon: FiTwitter,
    accentColor: 'text-slate-800',
    badgeBg: 'bg-slate-100 text-slate-800 border-slate-300 hover:border-slate-400',
  },
  {
    platform: 'YouTube',
    label: 'YouTube Channel',
    description: 'Upload video lectures, clinical insights & channel metrics',
    icon: FiYoutube,
    accentColor: 'text-red-600',
    badgeBg: 'bg-red-50 text-red-700 border-red-200 hover:border-red-300',
  },
  {
    platform: 'WhatsApp',
    label: 'WhatsApp Business API',
    description: 'Direct verified patient notification broadcasting',
    icon: FiMessageSquare,
    accentColor: 'text-emerald-600',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-300',
  },
  {
    platform: 'TikTok',
    label: 'TikTok Wellness',
    description: 'Short-form educational video distribution & viral reach',
    icon: FiVideo,
    accentColor: 'text-rose-600',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-300',
  },
  {
    platform: 'Google',
    label: 'Google Business Profile',
    description: 'Local clinic location updates & patient review sync',
    icon: FiGlobe,
    accentColor: 'text-indigo-600',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:border-indigo-300',
  },
];

export const OAuthConnectButtons: React.FC<OAuthConnectButtonsProps> = ({ onAccountAdded }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformOption | null>(null);
  const [accountName, setAccountName] = useState('');
  const [accountHandle, setAccountHandle] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleOpenModal = (opt: PlatformOption) => {
    setSelectedPlatform(opt);
    setAccountName(`Wholcure ${opt.platform} Account`);
    setAccountHandle(`@wholcure_${opt.platform.toLowerCase()}`);
  };

  const handleSimulateConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlatform) return;

    setIsConnecting(true);
    try {
      // Simulate OAuth handshake
      await new Promise((resolve) => setTimeout(resolve, 800));
      const created = await SocialAccountsService.connectSimulatedAccount(
        selectedPlatform.platform,
        accountName.trim() || undefined,
        accountHandle.trim() || undefined
      );
      toast.success(`Successfully connected ${selectedPlatform.label}!`);
      if (onAccountAdded) {
        onAccountAdded(created);
      }
      setSelectedPlatform(null);
    } catch {
      toast.error('Connection attempt failed.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Platform Connection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2.5">
        {PLATFORM_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.platform}
              type="button"
              onClick={() => handleOpenModal(opt)}
              className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between gap-2 cursor-pointer hover:shadow-xs active:scale-[0.98] ${opt.badgeBg}`}
            >
              <div className="flex items-center justify-between">
                <Icon size={18} className={opt.accentColor} />
                <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-0.5 opacity-80">
                  <FiPlus size={11} /> Connect
                </span>
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">{opt.label}</p>
                <p className="text-[10px] opacity-75 line-clamp-1 mt-0.5">{opt.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Simulated OAuth Modal Dialog */}
      {selectedPlatform && (
        <div className="fixed inset-0 z-[1100] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl bg-white border border-slate-200 shadow-2xs`}>
                  <selectedPlatform.icon size={20} className={selectedPlatform.accentColor} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Authorize {selectedPlatform.label}</h3>
                  <p className="text-[11px] text-slate-500">Official OAuth 2.0 Direct Access Integration</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPlatform(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSimulateConnect} className="p-5 space-y-4">
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-[11px] text-blue-900 flex items-start gap-2.5">
                <FiShield className="text-blue-600 shrink-0 mt-0.5" size={16} />
                <div>
                  <span className="font-bold">Enterprise Scopes Requested:</span>
                  <p className="text-blue-800 text-[10px] mt-0.5">
                    Read account metadata, publish scheduled content, and read audience engagement metrics via verified OAuth token.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Account Display Name</label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="e.g. Wholcure Health Official"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Channel Handle / Profile Link</label>
                <input
                  type="text"
                  value={accountHandle}
                  onChange={(e) => setAccountHandle(e.target.value)}
                  placeholder="e.g. @wholcure_health"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedPlatform(null)}
                  disabled={isConnecting}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isConnecting}
                  className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <FiLock size={12} />
                      <span>Authorize & Connect</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
