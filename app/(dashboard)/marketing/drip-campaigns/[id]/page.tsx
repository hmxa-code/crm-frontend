'use client';

import React from 'react';
import { DripCampaignDetail } from '@/src/components/marketing/drip-campaigns/DripCampaignDetail';

export default function DripCampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  
  return (
    <div className="w-full bg-[#f8fafc] min-h-screen p-6 text-slate-900 font-sans antialiased">
      <div className="max-w-7xl mx-auto">
        <DripCampaignDetail campaignId={id} />
      </div>
    </div>
  );
}
