'use client';

import React from 'react';
import TenMinuteSummaryView from '@/src/components/ui/tasks/behavior-logs/TenMinuteSummaryView';

export default function BehaviorLogsPage() {
  return (
    <div className="p-3 sm:p-5 lg:p-6 bg-slate-50/40 min-h-screen overflow-x-hidden">
      <TenMinuteSummaryView />
    </div>
  );
}