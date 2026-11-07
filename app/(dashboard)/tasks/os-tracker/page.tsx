'use client';

import React from 'react';
import ActivityTrackerView from '@/src/components/ui/tasks/os-tracker/ActivityTrackerView';

export default function OsTrackerPage() {
  return (
    <div className="p-4 md:p-6 bg-slate-50/30 min-h-screen">
      <ActivityTrackerView />
    </div>
  );
}
