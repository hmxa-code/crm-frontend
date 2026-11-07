'use client';

import React from 'react';
import TenMinuteSummaryView from '@/src/components/ui/tasks/behavior-logs/TenMinuteSummaryView';

export default function BehaviorLogsPage() {
  return (
    <div className="p-4 md:p-6 bg-slate-50/30 min-h-screen">
      <TenMinuteSummaryView />
    </div>
  );
}
