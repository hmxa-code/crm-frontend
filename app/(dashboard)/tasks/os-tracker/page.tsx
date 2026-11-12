'use client';

import React from 'react';
import ActivityTrackerView from '@/src/components/ui/tasks/os-tracker/ActivityTrackerView';

export default function OsTrackerPage() {
  return (
    <div className="p-3 sm:p-5 lg:p-6 bg-slate-50/40 min-h-screen overflow-x-hidden">
      <ActivityTrackerView />
    </div>
  );
}