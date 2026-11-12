import React from 'react';
import { FiHeart, FiMessageCircle, FiSend, FiBookmark } from 'react-icons/fi';
import { MediaAsset } from '@/src/types/marketing/content-engine';

interface InstagramFeedPreviewProps {
  caption?: string;
  mediaAssets?: MediaAsset[];
  mediaUrl?: string;
  accountName?: string;
}

export const InstagramFeedPreview: React.FC<InstagramFeedPreviewProps> = ({
  caption = '',
  mediaAssets = [],
  mediaUrl,
  accountName = 'wholcure_global',
}) => {
  const displayImage = mediaUrl || (mediaAssets && mediaAssets.length > 0 ? mediaAssets[0].url : undefined);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs max-w-sm w-full text-xs font-sans">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-pink-600 p-0.5">
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-bold text-[9px]">
            IG
          </div>
        </div>
        <span className="font-bold text-slate-900 text-xs">{accountName}</span>
      </div>

      <div className="aspect-square rounded-lg bg-slate-100 border border-slate-200 overflow-hidden mb-2 flex items-center justify-center">
        {displayImage ? (
          <img src={displayImage} alt="IG Preview" className="w-full h-full object-cover" />
        ) : (
          <span className="text-[10px] text-slate-400 font-medium">Add media for Instagram Feed</span>
        )}
      </div>

      <div className="flex items-center justify-between text-slate-700 text-sm mb-1.5">
        <div className="flex items-center gap-3">
          <FiHeart /> <FiMessageCircle /> <FiSend />
        </div>
        <FiBookmark />
      </div>

      <p className="text-slate-800 text-[11px] line-clamp-3">
        <span className="font-bold mr-1">{accountName}</span>
        {caption || 'Instagram post caption preview...'}
      </p>
    </div>
  );
};
