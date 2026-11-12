import React from 'react';
import { FiThumbsUp, FiMessageSquare, FiRepeat, FiSend } from 'react-icons/fi';
import { MediaAsset } from '@/src/types/marketing/content-engine';

interface LinkedInFeedPreviewProps {
  caption?: string;
  mediaAssets?: MediaAsset[];
  mediaUrl?: string;
  persona?: string;
  accountName?: string;
}

export const LinkedInFeedPreview: React.FC<LinkedInFeedPreviewProps> = ({
  caption = '',
  mediaAssets = [],
  mediaUrl,
  persona,
  accountName = 'Wholcure Technologies',
}) => {
  const displayImage = mediaUrl || (mediaAssets && mediaAssets.length > 0 ? mediaAssets[0].url : undefined);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs max-w-sm w-full text-xs font-sans">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-md bg-sky-700 text-white font-bold flex items-center justify-center text-xs">
          in
        </div>
        <div>
          <h5 className="font-bold text-slate-900 leading-tight">{accountName}</h5>
          <span className="text-[10px] text-slate-400">{persona ? `Target: ${persona} • ` : ''}Promoted • 🌐</span>
        </div>
      </div>

      <p className="text-slate-800 mb-2 whitespace-pre-line line-clamp-4">
        {caption || 'LinkedIn corporate announcement copy...'}
      </p>

      {displayImage && (
        <div className="rounded-md overflow-hidden border border-slate-200 mb-2 bg-slate-900 max-h-40">
          <img src={displayImage} alt="LinkedIn asset" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-slate-500 font-semibold text-[10px]">
        <span className="flex items-center gap-1"><FiThumbsUp /> Like</span>
        <span className="flex items-center gap-1"><FiMessageSquare /> Comment</span>
        <span className="flex items-center gap-1"><FiRepeat /> Repost</span>
        <span className="flex items-center gap-1"><FiSend /> Send</span>
      </div>
    </div>
  );
};
