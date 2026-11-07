// "use client";

// import React from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';

// export default function UserLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const pathname = usePathname();

//   const tabs = [
//     { label: 'Sub-Accounts', href: '/user' },
//     { label: 'Manage', href: '/user/manage' },
//     { label: 'Roles Management', href: '/user/roles-access' },
//     { label: 'Profile', href: '/user/profile' },
//   ];

//   return (
//     <div className="w-full bg-[#f8fafc] min-h-screen">
//       <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
//         <div className="flex flex-wrap gap-2 items-center mb-6">
//           {tabs.map((tab) => (
//             <Link key={tab.href} href={tab.href} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${pathname === tab.href ? 'bg-[#00aaff] text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:border-[#00aaff] hover:text-[#00aaff]'}`}>
//               {tab.label}
//             </Link>
//           ))}
//         </div>

//         <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }

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
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 space-y-6">
        
        {/* --- Top Header & Navigation Container --- */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Section Title */}
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              User Management & Access Control
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Manage account hierarchies, user privileges, security roles, and profile settings.
            </p>
          </div>

          {/* Navigation Sub-Tabs */}
          <nav className="flex items-center gap-1 bg-slate-100/70 p-1 rounded-lg border border-slate-200/60 w-full sm:w-auto overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.href;

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-slate-900' : 'text-slate-400'} />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </nav>

        </div>

        {/* --- Main Content Panel --- */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-3xs p-6">
          {children}
        </div>

      </div>
    </div>
  );
}