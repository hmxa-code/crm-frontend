'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FiBell, 
  FiMoon, 
  FiSun, 
  FiSettings, 
  FiUser, 
  FiLogOut, 
  FiChevronDown, 
  FiSearch, 
  FiCheckCircle, 
  FiArrowRight 
} from "react-icons/fi";
import { AuthService } from '@/src/services/authService';
import { getAvatarUrl } from '@/src/utils/avatarHelper';
import { ACCOUNT_TYPE_LABELS, resolveAccountType } from '@/src/constants/roles';
import { DEFAULT_CRM_SETTINGS, getCRMSettings, type CRMSettings } from '@/src/utils/crmSettings';

export const Navbar = () => {
  const router = useRouter();
  const [profileInfo, setProfileInfo] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [crmSettings, setCRMSettings] = useState<CRMSettings>(DEFAULT_CRM_SETTINGS);

  const accountType = resolveAccountType(userInfo);
  const accountTypeLabel = accountType ? ACCOUNT_TYPE_LABELS[accountType] || accountType : 'Member';

  const loadUserData = () => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUserInfo(JSON.parse(storedUser));
        } catch (e) {
          console.error('Error parsing user info:', e);
        }
      }
    }
  };

  useEffect(() => {
    setIsClient(true);
    loadUserData();

    const syncCRMSettings = () => {
      setCRMSettings(getCRMSettings());
    };

    syncCRMSettings();

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', loadUserData);
      window.addEventListener('userUpdated', loadUserData);
      window.addEventListener('crm-settings-updated', syncCRMSettings);

      return () => {
        window.removeEventListener('storage', loadUserData);
        window.removeEventListener('userUpdated', loadUserData);
        window.removeEventListener('crm-settings-updated', syncCRMSettings);
      };
    }
  }, []);

  const handleLogout = async () => {
    await AuthService.logout();
    router.push('/login');
  };

  if (!isClient) {
    return (
      <header className="h-[65px] bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-[100]">
        <div className="w-48 h-8 bg-slate-100 rounded-lg animate-pulse" />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-100 rounded-lg" />
          <div className="w-8 h-8 bg-slate-100 rounded-lg" />
        </div>
      </header>
    );
  }

  return (
    <header className="h-[65px] bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-[100]">
      
      {/* Quick Search */}
      <div className="flex items-center gap-3">
        <div className="relative hidden md:flex items-center">
          <FiSearch className="absolute left-3 text-slate-400 text-sm pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search leads, users, features..."
            className="w-64 pl-9 pr-12 py-1.5 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs text-slate-900 placeholder-slate-400 border border-slate-200 rounded-lg transition-all outline-none focus:ring-2 focus:ring-[var(--crm-primary)]/20 focus:border-[var(--crm-primary)]"
          />
          <kbd className="absolute right-2.5 text-[10px] font-medium text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Navigation Controls */}
      <div className="flex items-center gap-3">
        
        {/* Theme Toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle mode"
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
        >
          {darkMode ? <FiSun size={17} className="text-amber-500" /> : <FiMoon size={17} />}
        </button>
        
        {/* Notification Popover */}
        <div className="relative">
          <button 
            onClick={() => {
              setIsNotifyOpen(!isNotifyOpen);
              setProfileInfo(false);
            }}
            className={`p-2 rounded-lg transition-all relative cursor-pointer ${
              isNotifyOpen 
                ? "bg-slate-100 text-slate-900" 
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
            title="Notifications"
          >
            <FiBell size={17} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full ring-2 ring-white" style={{ backgroundColor: "var(--crm-primary)" }} />
          </button>

          {isNotifyOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsNotifyOpen(false)} />
              <div className="absolute top-full right-0 mt-2.5 w-84 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3.5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-xs tracking-tight">Notifications</h4>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: "var(--crm-primary)" }}>
                      2
                    </span>
                  </div>
                  <button className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
                    <FiSettings size={14}/>
                  </button>
                </div>
                 
                <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-100">
                  <div className="p-3.5 hover:bg-slate-50 cursor-pointer flex gap-3 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 border border-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-[10px]">
                      SW
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                        Application of <span className="font-bold text-slate-900">Sarah Williams</span> is pending review.
                      </p>
                      <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Today • 10:14 PM</p>
                    </div>
                  </div>

                  <div className="p-3.5 hover:bg-slate-50 cursor-pointer flex gap-3 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex-shrink-0 flex items-center justify-center font-bold text-[10px]">
                      <FiCheckCircle size={14} />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                        New lead assignment <span className="font-bold text-slate-900">Apex Global Corp</span> closed.
                      </p>
                      <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Yesterday • 04:30 PM</p>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 text-center bg-slate-50 border-t border-slate-100">
                  <button className="text-[11px] font-bold text-slate-900 hover:text-slate-700 transition-all cursor-pointer flex items-center justify-center gap-1.5 w-full">
                    <span>View All Notifications</span>
                    <FiArrowRight size={12} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => {
              setProfileInfo(!profileInfo);
              setIsNotifyOpen(false);
            }}
            className="flex items-center gap-2.5 p-1 pl-1.5 pr-2 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold border border-slate-200 text-slate-900 overflow-hidden flex-shrink-0 bg-slate-100 shadow-2xs">
                {userInfo?.avatar ? (
                  <img src={getAvatarUrl(userInfo?.avatar, userInfo?.name)} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs uppercase font-bold tracking-wider">{userInfo?.name ? userInfo.name[0] : 'U'}</span>
                )}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
            </div>

            <div className="hidden md:block text-left pr-0.5">
              <p className="text-xs font-bold text-slate-900 leading-tight">{userInfo?.name || 'User'}</p>
              <p className="text-[10px] font-semibold text-slate-400 tracking-tight mt-0.5">
                {userInfo?.roleDetails?.role_name || accountTypeLabel}
              </p>
            </div>
            
            <FiChevronDown size={13} className={`text-slate-400 transition-transform duration-200 ${profileInfo ? 'rotate-180' : ''}`} />
          </button>

          {profileInfo && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setProfileInfo(false)} />
              <div className="absolute top-full right-0 mt-2.5 w-56 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5 z-20 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100 mb-1 bg-slate-50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Logged In As</p>
                  <p className="text-xs font-bold text-slate-900 truncate mt-0.5">{userInfo?.email || userInfo?.name || 'user@crm.com'}</p>
                </div>
                 
                <Link 
                  href="/user/profile" 
                  onClick={() => setProfileInfo(false)} 
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 transition-all hover:bg-slate-50 rounded-lg mx-1.5"
                >
                  <FiUser size={15} className="text-slate-400" />
                  <span>My Profile</span>
                </Link>
                 
                <Link 
                  href="/crm-settings" 
                  onClick={() => setProfileInfo(false)} 
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 transition-all hover:bg-slate-50 rounded-lg mx-1.5"
                >
                  <FiSettings size={15} style={{ color: crmSettings.primaryColor }} />
                  <span>CRM Settings</span>
                </Link>

                <div className="my-1.5 border-t border-slate-100" />

                <button 
                  onClick={() => { setProfileInfo(false); handleLogout(); }}
                  className="w-[calc(100%-12px)] flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-all rounded-lg mx-1.5 cursor-pointer"
                >
                  <FiLogOut size={15} />
                  <span>Terminate Session</span>
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </header>
  );
};