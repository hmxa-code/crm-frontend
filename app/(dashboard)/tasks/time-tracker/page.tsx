'use client';

import React from 'react';
import ProjectTimeTrackerView from '@/src/components/ui/tasks/time-tracker/ProjectTimeTrackerView';

export default function TimeTrackerPage() {
  return (
    <div className="p-3 sm:p-5 lg:p-6 bg-slate-50/40 min-h-screen overflow-x-hidden">
      <ProjectTimeTrackerView />
    </div>
  );
}