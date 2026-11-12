'use client';

import React from 'react';
import { CreateDripCampaignForm } from '@/src/components/ui/marketing/drip-campaigns/forms/CreateDripCampaignForm';

export default function CreateDripCampaignPage() {
  return (
    <div className="w-full bg-[#f8fafc] min-h-screen p-6 text-slate-900 font-sans antialiased">
      <div className="max-w-7xl mx-auto">
        <CreateDripCampaignForm />
      </div>
    </div>
  );
}
