'use client';

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
    <div className="mx-auto max-w-7xl">
      {children}
    </div>
  );
}
