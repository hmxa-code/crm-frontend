'use client';

import React from 'react';
import ProjectTimeTrackerView from '@/src/components/ui/tasks/time-tracker/ProjectTimeTrackerView';

export default function TimeTrackerPage() {
  return (
    <div className="p-4 md:p-6 bg-slate-50/30 min-h-screen">
      <ProjectTimeTrackerView />
    </div>
  );
}
