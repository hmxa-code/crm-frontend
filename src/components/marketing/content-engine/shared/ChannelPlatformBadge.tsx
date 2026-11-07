import React from 'react';
import { FiFacebook, FiInstagram, FiLinkedin, FiGlobe, FiTwitter } from 'react-icons/fi';
import { SocialPlatform } from '@/src/types/marketing/social-account';

interface ChannelPlatformBadgeProps {
  platform: SocialPlatform;
  showName?: boolean;
}

export const ChannelPlatformBadge: React.FC<ChannelPlatformBadgeProps> = ({ platform, showName = true }) => {
  const getPlatformIcon = () => {
    switch (platform) {
      case 'Facebook':
        return { Icon: FiFacebook, color: 'text-blue-600 bg-blue-50 border-blue-100' };
      case 'Instagram':
        return { Icon: FiInstagram, color: 'text-pink-600 bg-pink-50 border-pink-100' };
      case 'LinkedIn':
        return { Icon: FiLinkedin, color: 'text-sky-700 bg-sky-50 border-sky-100' };
      case 'Twitter':
        return { Icon: FiTwitter, color: 'text-slate-800 bg-slate-100 border-slate-200' };
      case 'Google':
      default:
        return { Icon: FiGlobe, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
    }
  };

  const { Icon, color } = getPlatformIcon();

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] font-bold ${color}`}>
      <Icon size={12} />
      {showName && <span>{platform}</span>}
    </span>
  );
};