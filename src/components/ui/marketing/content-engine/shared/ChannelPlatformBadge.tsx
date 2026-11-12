import React from 'react';
import { 
  FiFacebook, 
  FiInstagram, 
  FiLinkedin, 
  FiGlobe, 
  FiTwitter, 
  FiYoutube, 
  FiMessageSquare,
  FiVideo
} from 'react-icons/fi';
import { SocialPlatform } from '@/src/types/marketing/social-account';

interface ChannelPlatformBadgeProps {
  platform: SocialPlatform;
  showName?: boolean;
  size?: 'sm' | 'md';
}

export const ChannelPlatformBadge: React.FC<ChannelPlatformBadgeProps> = ({ 
  platform, 
  showName = true,
  size = 'md' 
}) => {
  const getPlatformDetails = () => {
    switch (platform) {
      case 'Facebook':
        return { Icon: FiFacebook, color: 'text-blue-600 bg-blue-50 border-blue-200' };
      case 'Instagram':
        return { Icon: FiInstagram, color: 'text-pink-600 bg-pink-50 border-pink-200' };
      case 'LinkedIn':
        return { Icon: FiLinkedin, color: 'text-sky-700 bg-sky-50 border-sky-200' };
      case 'Twitter':
        return { Icon: FiTwitter, color: 'text-slate-800 bg-slate-100 border-slate-300' };
      case 'YouTube':
        return { Icon: FiYoutube, color: 'text-red-600 bg-red-50 border-red-200' };
      case 'WhatsApp':
        return { Icon: FiMessageSquare, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
      case 'TikTok':
        return { Icon: FiVideo, color: 'text-rose-600 bg-rose-50 border-rose-200' };
      case 'Google':
      default:
        return { Icon: FiGlobe, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' };
    }
  };

  const { Icon, color } = getPlatformDetails();
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-[11px]';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border font-bold ${sizeClasses} ${color}`}>
      <Icon size={size === 'sm' ? 11 : 13} />
      {showName && <span>{platform}</span>}
    </span>
  );
};
