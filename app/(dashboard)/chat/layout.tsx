import React from 'react';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <div className="h-screen w-full overflow-hidden bg-slate-50">{children}</div>;
}