'use client';

import React from 'react';
import { DripCampaignsHub } from '@/src/components/ui/marketing/drip-campaigns/DripCampaignsHub';

export default function DripCampaignsPage() {
  return (
    <div className="w-full bg-[#f8fafc] min-h-screen p-6 text-slate-900 font-sans antialiased">
      <div className="max-w-7xl mx-auto">
        <DripCampaignsHub />
      </div>
    </div>
  );
}
