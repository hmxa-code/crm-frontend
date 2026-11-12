import React from 'react';
import { FiThumbsUp, FiMessageSquare, FiShare2 } from 'react-icons/fi';
import { MediaAsset } from '@/src/types/marketing/content-engine';

interface FacebookFeedPreviewProps {
  caption?: string;
  mediaAssets?: MediaAsset[];
  mediaUrl?: string;
  accountName?: string;
}

export const FacebookFeedPreview: React.FC<FacebookFeedPreviewProps> = ({
  caption = '',
  mediaAssets = [],
  mediaUrl,
  accountName = 'Wholcure Global',
}) => {
  const displayImage = mediaUrl || (mediaAssets && mediaAssets.length > 0 ? mediaAssets[0].url : undefined);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs max-w-sm w-full text-xs font-sans">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
          FB
        </div>
        <div>
          <h5 className="font-bold text-slate-900 leading-tight">{accountName}</h5>
          <span className="text-[10px] text-slate-400">Just now • 🌎</span>
        </div>
      </div>

      <p className="text-slate-800 mb-2.5 whitespace-pre-line line-clamp-4">
        {caption || 'Your Facebook post copy will preview here in real-time...'}
      </p>

      {displayImage && (
        <div className="rounded-lg overflow-hidden border border-slate-100 mb-2.5 max-h-48 bg-slate-900">
          <img src={displayImage} alt="FB preview" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-slate-500 font-semibold text-[11px]">
        <span className="flex items-center gap-1"><FiThumbsUp /> Like</span>
        <span className="flex items-center gap-1"><FiMessageSquare /> Comment</span>
        <span className="flex items-center gap-1"><FiShare2 /> Share</span>
      </div>
    </div>
  );
};
