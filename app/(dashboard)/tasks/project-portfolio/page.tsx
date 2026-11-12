'use client';

import React from 'react';
import ProjectsPortfolioView from '@/src/components/ui/tasks/project-portfolio/ProjectsPortfolioView';

export default function ProjectsPortfolioPage() {
  return (
    <div className="p-3 sm:p-5 lg:p-6 bg-slate-50/40 min-h-screen overflow-x-hidden">
      <ProjectsPortfolioView />
    </div>
  );
}