"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/src/services/authService';
import { LandingPage } from '@/src/components/landing';

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuth = AuthService.isAuthenticated();
      if (isAuth) {
        // Retrieve the exact last route the user visited before closing browser
        const lastRoute = localStorage.getItem('last_visited_crm_route') || '/dashboard';
        router.replace(lastRoute);
        return;
      }
    }
    setChecking(false);
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#05060a] flex items-center justify-center">
        <div className="w-7 h-7 rounded-full border-2 border-[#d7b07a] border-t-transparent animate-spin" />
      </div>
    );
  }

  return <LandingPage />;
}