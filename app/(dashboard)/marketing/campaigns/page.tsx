'use client';

import React from 'react';
import { MarketingCampaignsHub } from '@/src/components/ui/marketing/campaigns/MarketingCampaignsHub';

export default function CampaignsPage() {
  return (
    <div className="w-full bg-[#f8fafc] min-h-screen p-4 sm:p-6 lg:p-8 text-slate-900 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-5">
        <MarketingCampaignsHub />
      </div>
    </div>
  );
}
