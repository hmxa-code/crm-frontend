'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isWorkflowCanvas = pathname.startsWith('/marketing/workflows/') && pathname !== '/marketing/workflows';

  if (isWorkflowCanvas) {
    return <>{children}</>;
  }

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] font-sans antialiased">
      {/* Main Content View Container */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}