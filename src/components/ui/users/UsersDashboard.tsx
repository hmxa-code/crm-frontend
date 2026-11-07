'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { UserTable } from '@/src/components/ui/users/UserTable'
import RolesTable from '@/src/components/ui/RolesTable'
import UserAttendanceLedger from '@/src/components/ui/users/UserAttendanceLedger'
import { FiUsers, FiShield, FiClock } from 'react-icons/fi'

type TabKey = 'members' | 'attendance' | 'roles'

const UsersDashboard = () => {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState<TabKey>('members')

  useEffect(() => {
    if (pathname?.includes('roles-access')) {
      setActiveTab('roles')
    } else if (pathname?.includes('attendance')) {
      setActiveTab('attendance')
    } else {
      setActiveTab('members')
    }
  }, [pathname])

  const tabs = [
    { key: 'members' as TabKey, label: 'Sub-Accounts', icon: FiUsers },
    { key: 'attendance' as TabKey, label: 'Check In / Out & Attendance', icon: FiClock },
    { key: 'roles' as TabKey, label: 'Roles Management', icon: FiShield },
  ]

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen p-6 text-slate-900 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* --- Header Section --- */}
        <div className="bg-white border border-slate-200/80 rounded-xl px-5 py-4 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">User Management & Access Control</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Super Admin and Admin can manage sub-accounts, remote work check-in / check-out attendance, and security roles.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="inline-flex p-1 bg-slate-100 border border-slate-200/60 rounded-lg gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-3xs border border-slate-200/80'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* --- Tab Content --- */}
        <div>
          {activeTab === 'members' ? (
            <UserTable />
          ) : activeTab === 'attendance' ? (
            <UserAttendanceLedger />
          ) : (
            <RolesTable embedded />
          )}
        </div>

      </div>
    </div>
  )
}

export default UsersDashboard