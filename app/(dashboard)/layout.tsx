'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from "@/src/components/layout/sidebar";
import { Navbar } from "@/src/components/layout/navbar";
import { ViewModeProvider } from "@/src/context/ViewModeContext";
import { AuthService } from "@/src/services/authService";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const isChatRoute = pathname === '/chat' || pathname.startsWith('/chat/');
  const isWorkflowCanvasRoute = 
    (pathname.startsWith('/workflows/') && pathname !== '/workflows') ||
    (pathname.startsWith('/marketing/workflows/') && pathname !== '/marketing/workflows');
  const isImmersiveRoute = isChatRoute || isWorkflowCanvasRoute;

  // Authentication persistence check & route memory tracker
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = AuthService.isAuthenticated();
      if (!auth) {
        // Save where the user wanted to go before redirecting
        if (pathname && !pathname.includes('/login')) {
          localStorage.setItem('last_visited_crm_route', pathname);
        }
        setIsAuthenticated(false);
        router.replace('/login');
      } else {
        setIsAuthenticated(true);
        // Track the current route in memory so reopening browser returns to this exact page
        if (pathname && !pathname.includes('/login') && !pathname.includes('/register')) {
          localStorage.setItem('last_visited_crm_route', pathname);
        }
      }
    }
  }, [pathname, router]);

  if (isAuthenticated === null || isAuthenticated === false) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#f4f7fa]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Restoring CRM session...</p>
        </div>
      </div>
    );
  }

  return (
    <ViewModeProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[#f4f7fa] m-0 p-0">
        {/* Sidebar - Hidden on Chat & Workflow Canvas Immersive Routes */}
        {!isImmersiveRoute && <Sidebar />}

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
          {/* Navbar - Hidden on Chat & Workflow Canvas Immersive Routes */}
          {!isImmersiveRoute && <Navbar />}

          {/* Main Content Area */}
          <main
            className={`flex-1 overflow-hidden relative ${
              isImmersiveRoute
                ? 'p-0 m-0 h-full w-full'
                : 'overflow-y-auto p-6 md:p-10'
            }`}
          >
            {isImmersiveRoute ? (
              children
            ) : (
              <div className="max-w-[1600px] mx-auto">
                {children}
              </div>
            )}
          </main>
        </div>
      </div>
    </ViewModeProvider>
  );
}