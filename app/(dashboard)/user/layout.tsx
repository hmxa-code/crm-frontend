"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiUsers, FiUserCheck, FiShield, FiUser } from 'react-icons/fi';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { label: 'Sub-Accounts', href: '/user', icon: FiUsers },
    { label: 'Manage Users', href: '/user/manage', icon: FiUserCheck },
    { label: 'Roles Management', href: '/user/roles-access', icon: FiShield },
    { label: 'My Profile', href: '/user/profile', icon: FiUser },
  ];

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen text-slate-900 font-sans antialiased">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 space-y-3 sm:space-y-4">
        
        {/* --- Top Header & Navigation Container --- */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 sm:p-4 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
          
          {/* Section Title */}
          <div>
            <h1 className="text-[13px] sm:text-base font-bold text-slate-900 tracking-tight">
              User Management & Access Control
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5">
              Manage account hierarchies, user privileges, security roles, and profile settings.
            </p>
          </div>

          {/* Navigation Sub-Tabs - Responsive */}
          <nav className="flex items-center gap-1 bg-slate-100/70 p-1 rounded-lg border border-slate-200/60 w-full md:w-auto overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.href;

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-md text-[10px] sm:text-xs font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-slate-900' : 'text-slate-400'} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">
                    {tab.label === 'Sub-Accounts' && 'Sub-Accts'}
                    {tab.label === 'Manage Users' && 'Manage'}
                    {tab.label === 'Roles Management' && 'Roles'}
                    {tab.label === 'My Profile' && 'Profile'}
                  </span>
                </Link>
              );
            })}
          </nav>

        </div>

        {/* --- Main Content Panel --- */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-3xs p-2 sm:p-3.5 md:p-6 overflow-hidden">
          {children}
        </div>

      </div>
    </div>
  );
}