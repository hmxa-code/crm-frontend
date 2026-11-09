'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// Icons
import { 
  FiHome, 
  FiChevronLeft, 
  FiChevronDown, 
  FiCalendar, 
  FiSettings, 
  FiArrowRight,
  FiBarChart2,
  FiMessageSquare,
  FiTrendingUp,
  FiCheckCircle,
  FiBell,
  FiMail,
  FiActivity,
  FiZap,
  FiUsers,
  FiShield,
  FiGlobe,
  FiAward,
  FiGitCommit,
  FiLayers,
  FiCheckSquare,
  FiFolder,
  FiClock,
  FiFileText,
  FiPaperclip,
  FiTarget,
  FiX
} from "react-icons/fi";

// Utilities & Hooks
import { getAvatarUrl } from "@/src/utils/avatarHelper";
import { ACCOUNT_TYPE_LABELS, isAccountOwner, hasFeatureAccess, resolveAccountType } from '@/src/constants/roles';
import { MENU_FEATURE_MAP } from '@/src/constants/permissions';
import { useSidebar } from "@/src/hooks/use-sidebar";
import logo from "@/src/assets/crm-logo.png";
import { DEFAULT_CRM_SETTINGS, getCRMSettings, type CRMSettings } from "@/src/utils/crmSettings";

const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(" ");

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, toggle, isMobileOpen, setMobileOpen } = useSidebar();
  const [userInfo, setUserInfo] = useState<any>(null);

  // Close mobile sidebar whenever user navigates
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hoveredCollapsedItem, setHoveredCollapsedItem] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [crmSettings, setCRMSettings] = useState<CRMSettings>(DEFAULT_CRM_SETTINGS);

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
    setHasMounted(true);
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

  const accountType = resolveAccountType(userInfo);
  const isAccountOwnerUser = isAccountOwner(accountType);
  const accountTypeLabel = accountType ? ACCOUNT_TYPE_LABELS[accountType] || accountType : undefined;

  const canSeeMenuItem = (href: string) => {
    if (!userInfo) return true;
    if (isAccountOwnerUser) return true;
    const featureKey = MENU_FEATURE_MAP[href];
    if (!featureKey) return true;
    return hasFeatureAccess(userInfo, featureKey);
  };

  const navGroups = [
    {
      groupTitle: "Core Operations",
      items: [
        { icon: FiHome, label: "Dashboard", href: "/dashboard", feature: "dashboard", badge: undefined },
        { icon: FiUsers, label: "User Management", href: "/user", feature: "users", requiresOwner: true, badge: undefined },
        { icon: FiCalendar, label: "Calendar", href: "/calendar", badge: "Today" },
        { icon: FiGitCommit, label: "Automation Workflows", href: "/workflows", feature: "automation-workflow", badge: "Flow", description: "Cross-CRM orchestration engine" },
      ]
    },
    {
      groupTitle: "Growth & Engagement",
      items: [
        {
          icon: FiMail,
          label: "Marketing",
          href: "/marketing",
          feature: "marketing",
          badge: "Drip",
          description: "Campaigns and social outreach",
          submenu: [
            { label: "Campaigns", href: "/marketing/campaigns", icon: FiZap },
            { label: "Social Accounts", href: "/marketing/social-accounts", icon: FiZap },
            { label: "Content Engine", href: "/marketing/content-engine", icon: FiZap },
            { label: "Drip Campaigns", href: "/marketing/drip-campaigns", icon: FiMail },
          ],
        },
        // sales management change now
        {
  icon: FiTrendingUp,
  label: "RenGrowCure",
  href: "/rengrowcure",
  feature: "rengrowcure",
  badge: "Hot",
  description: "Pipeline, follow-ups, and revenue tracking",
  submenu: [
    { label: "LeadIntel", href: "/rengrowcure/leadIntel", icon: FiAward },
    { label: "DistroEngine", href: "/rengrowcure/distroengine", icon: FiGitCommit },
    { label: "Venture Matrix", href: "/rengrowcure/venture-matrix", icon: FiTrendingUp },
    { label: "Outreach Sequences", href: "/rengrowcure/outreach-sequences", icon: FiLayers },
    { label: "Chronos", href: "/rengrowcure/chronos", icon: FiActivity },
    { label: "Kinetics", href: "/rengrowcure/kinetics", icon: FiCheckSquare },
    { label: "Reports & Analytics", href: "/rengrowcure/reportscure", icon: FiBarChart2 },
  ]
}
      ]
    },
    {
      groupTitle: "Productivity & Workspace",
      items: [
        {
  icon: FiCheckCircle,
  label: "Task Management",
  href: "/tasks",
  feature: "tasks",
  badge: "12",
  description: "Workstation, projects, intelligent OS tracking & productivity suite",
  submenu: [
    // --- CORE WORKFLOWS ---
    { label: "Task Workstation", href: "/tasks/task-workstation", icon: FiZap },
    { label: "My Assigned Tasks", href: "/tasks/my-tasks", icon: FiCheckCircle },
    { label: "Projects Portfolio", href: "/tasks/project-portfolio", icon: FiFolder },
    { label: "Project Time Tracker", href: "/tasks/time-tracker", icon: FiClock },
    
    // --- INTELLIGENT OS & TIME TRACKING ---
    { label: "Activity & Behavior Tracker", href: "/tasks/os-tracker", icon: FiActivity },
    { label: "10-Min Summary Logs", href: "/tasks/behavior-logs", icon: FiFileText },
    
    // --- RESOURCES & COLLABORATION ---
    { label: "Task Resources & Vault", href: "/tasks/resources", icon: FiPaperclip },
    { label: "Sprints & Milestones", href: "/tasks/sprints", icon: FiTarget },
    
    // --- TEAM & ANALYTICS ---
    { label: "Team Workload & Capacity", href: "/tasks/team-workload", icon: FiUsers },
    { label: "Reports & Productivity Analytics", href: "/tasks/analytics", icon: FiBarChart2 },
  ],
},
        { icon: FiUsers, label: "Roles Management", href: "/roles", feature: "roles", requiresOwner: true },
        { icon: FiMessageSquare, label: "Chat Workspace", href: "/chat", feature: "chat", badge: "Live" },
        { icon: FiSettings, label: "CRM Settings", href: "/crm-settings" },
      ]
    }
  ];

  // Auto-expand active dropdown
  useEffect(() => {
    navGroups.forEach((g) => {
      g.items.forEach((item) => {
        if (item.submenu?.some((sub: any) => pathname === sub.href || pathname.startsWith(`${sub.href}/`))) {
          setOpenDropdown(item.label);
        }
      });
    });
  }, [pathname]);

  const sidebarLogoSrc = crmSettings.logoUploadData || crmSettings.logoUrl || (typeof logo === 'string' ? logo : logo.src);
  const scheduleDate = hasMounted
    ? new Date().toLocaleDateString('en', { month: 'short', day: 'numeric' })
    : '—';

  // THEME SUIT COMPUTATION
  const suit = crmSettings.sidebarThemeSuit || "enterprise_slate";
  const isDarkSuit = suit === "executive_dark";
  const isGlassSuit = suit === "glass_modern";

  // Density spacing classes
  const densityPadding = crmSettings.sidebarDensity === "compact"
    ? "py-1.5 px-2.5 text-[11px]"
    : crmSettings.sidebarDensity === "spacious"
    ? "py-3 px-3.5 text-xs"
    : "py-2 px-3 text-xs";

  // Corner Radius
  const cornerRadiusClass = crmSettings.sidebarCornerRadius === "sharp"
    ? "rounded-none"
    : crmSettings.sidebarCornerRadius === "full"
    ? "rounded-full"
    : "rounded-xl";

  // Active Item Style Calculator
  const getActiveStyle = (isActive: boolean) => {
    if (!isActive) {
      if (isDarkSuit) {
        return {
          classes: "text-slate-400 hover:bg-slate-800/80 hover:text-slate-100",
          style: undefined
        };
      }
      if (isGlassSuit) {
        return {
          classes: "text-slate-700 hover:bg-white/50 hover:text-slate-950 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:backdrop-blur-md transition-all",
          style: undefined
        };
      }
      return {
        classes: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        style: undefined
      };
    }

    const activeMode = crmSettings.sidebarActiveStyle || "filled";

    if (isDarkSuit) {
      switch (activeMode) {
        case "pill":
          return {
            classes: "font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/80 shadow-sm",
            style: undefined
          };
        case "border_left":
          return {
            classes: "font-bold text-white bg-slate-850 border-l-4 border-cyan-400",
            style: { borderRadius: "0 10px 10px 0" }
          };
        case "subtle":
          return {
            classes: "font-bold text-cyan-300 bg-slate-800/90",
            style: undefined
          };
        case "filled":
        default:
          return {
            classes: "font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md",
            style: undefined
          };
      }
    }

    if (isGlassSuit) {
      switch (activeMode) {
        case "pill":
          return {
            classes: "font-bold text-slate-950 bg-white/75 border border-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-xl",
            style: undefined
          };
        case "border_left":
          return {
            classes: "font-bold text-slate-950 bg-white/60 border-l-4 border-slate-900/80 shadow-sm backdrop-blur-xl",
            style: { borderRadius: "0 10px 10px 0" }
          };
        case "subtle":
          return {
            classes: "font-bold text-slate-900 bg-white/50 shadow-xs backdrop-blur-md border border-white/60",
            style: undefined
          };
        case "filled":
        default:
          return {
            classes: "font-bold text-slate-950 bg-white/85 border border-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.07),inset_0_1px_2px_rgba(255,255,255,1)] backdrop-blur-2xl",
            style: undefined
          };
      }
    }

    switch (activeMode) {
      case "pill":
        return {
          classes: "font-bold shadow-xs",
          style: {
            backgroundColor: `${crmSettings.primaryColor}14`,
            color: crmSettings.primaryColor,
            border: `1px solid ${crmSettings.primaryColor}35`,
          }
        };
      case "border_left":
        return {
          classes: "font-bold text-slate-900 bg-slate-100/90",
          style: {
            borderLeft: `4px solid ${crmSettings.primaryColor}`,
            borderRadius: "0 10px 10px 0"
          }
        };
      case "subtle":
        return {
          classes: "font-bold text-slate-900 bg-slate-100",
          style: undefined
        };
      case "filled":
      default:
        return {
          classes: "font-bold text-white shadow-sm",
          style: {
            backgroundColor: crmSettings.primaryColor,
            color: "#ffffff"
          }
        };
    }
  };

  return (
    <>
      {/* Mobile Off-canvas Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[140] md:hidden transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "h-screen border-r transition-all duration-300 ease-in-out flex flex-col select-none",
          // Desktop positioning
          "md:sticky md:top-0 md:left-0 md:z-40",
          isCollapsed ? "md:w-[72px]" : "md:w-[255px]",
          // Mobile Off-canvas Drawer (highest priority layer)
          "fixed inset-y-0 left-0 z-[150] w-[270px] max-w-[85vw]",
          isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0",
          isDarkSuit && "bg-[#0b1329] text-slate-100 border-slate-800/80 shadow-2xl",
          isGlassSuit && "bg-white/35 backdrop-blur-3xl text-slate-800 border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]",
          (!isDarkSuit && !isGlassSuit) && "bg-white text-slate-900 border-slate-200 shadow-xs"
        )}
      >
      {/* Brand Header */}
      <div 
        className={cn(
          "flex items-center justify-between px-3.5 relative py-3.5 border-b transition-colors",
          isDarkSuit && "border-slate-800 bg-[#070d1e]",
          isGlassSuit && "border-white/50 bg-white/30 backdrop-blur-2xl shadow-[inset_0_-1px_0_rgba(255,255,255,0.5)]",
          (!isDarkSuit && !isGlassSuit) && "border-slate-100 bg-white"
        )}
      >
        {!isCollapsed ? (
          <Link href="/dashboard" className="flex flex-1 items-center justify-start pl-0.5 cursor-pointer overflow-hidden">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={cn(
                "shrink-0 p-1 rounded-xl border shadow-2xs",
                isDarkSuit 
                  ? "bg-slate-850 border-slate-700/60" 
                  : isGlassSuit
                  ? "bg-white/60 border-white/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl"
                  : "bg-white border-slate-100"
              )}>
                <img
                  src={sidebarLogoSrc}
                  alt="CRM Logo"
                  style={{
                    maxHeight: crmSettings.logoHeight ? `${crmSettings.logoHeight}px` : "34px",
                    maxWidth: crmSettings.logoWidth ? `${crmSettings.logoWidth}px` : "140px"
                  }}
                  className="w-auto object-contain transition-all"
                />
              </div>
              <div className="min-w-0 overflow-hidden text-left">
                <div className="flex items-center gap-1.5">
                  <span className={cn(
                    "text-xs font-extrabold tracking-tight truncate",
                    isDarkSuit ? "text-white" : "text-slate-900"
                  )}>
                    {crmSettings.companyName || "Wholcure CRM"}
                  </span>
                  {crmSettings.sidebarShowStatusPulse && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" title="System Online & Synchronized" />
                  )}
                </div>
                {crmSettings.crmPurposeText && (
                  <p className={cn(
                    "text-[9px] font-medium leading-tight truncate",
                    isDarkSuit ? "text-slate-400" : "text-slate-500"
                  )}>
                    {crmSettings.crmPurposeText}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ) : (
          <div className="mx-auto shrink-0">
            <img
              src={sidebarLogoSrc}
              alt="Logo"
              className="h-7 w-7 object-contain rounded-lg"
            />
          </div>
        )}
        
        {crmSettings.sidebarCollapsible && (
          <button 
            onClick={toggle} 
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "p-1.5 rounded-lg transition-all cursor-pointer border flex items-center justify-center shrink-0",
              isDarkSuit
                ? "text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border-slate-800"
                : isGlassSuit
                ? "text-slate-600 hover:text-slate-900 bg-white/50 hover:bg-white/80 border-white/60 shadow-2xs"
                : "text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border-slate-200",
              isCollapsed ? "mx-auto w-7 h-7 mt-2" : "ml-2"
            )}
          >
            <FiChevronLeft className={cn("text-xs transition-transform duration-300", isCollapsed && "rotate-180")} />
          </button>
        )}

        {/* Mobile Close Drawer Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className={cn(
            "p-1.5 rounded-lg md:hidden transition ml-1 cursor-pointer",
            isDarkSuit
              ? "text-slate-400 hover:text-white bg-slate-800"
              : "text-slate-400 hover:text-slate-800 bg-slate-100"
          )}
          title="Close Navigation"
          aria-label="Close navigation"
        >
          <FiX size={16} />
        </button>
      </div>

      {/* Main Navigation with Group Titles */}
      <nav className="flex-1 px-3 py-3 space-y-3 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300/40 [&::-webkit-scrollbar-thumb]:rounded-full">
        {navGroups.map((group, gIdx) => {
          const visibleItems = group.items.filter((item) => {
            if (item.label === "Dashboard" || item.href === "/dashboard") return true;
            if (!userInfo) return true;
            if (item.requiresOwner && !isAccountOwnerUser) return false;
            return canSeeMenuItem(item.href);
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={gIdx} className="space-y-1">
              {!isCollapsed && crmSettings.sidebarShowGroupTitles && (
                <div className="px-2 pt-1 pb-1">
                  <p className={cn(
                    "text-[9px] font-extrabold uppercase tracking-widest",
                    isDarkSuit ? "text-slate-400" : isGlassSuit ? "text-slate-500/80" : "text-slate-400"
                  )}>
                    {group.groupTitle}
                  </p>
                </div>
              )}

              {visibleItems.map((item, index) => {
                const hasSubmenu = item.submenu && item.submenu.length > 0;
                const isDropdownOpen = openDropdown === item.label;
                const isSubmenuActive = item.submenu?.some((sub: any) => pathname === sub.href || pathname.startsWith(`${sub.href}/`));
                const isDirectActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));
                const isActive = isDirectActive || isSubmenuActive;
                const activeStyleConfig = getActiveStyle(isActive);

                return (
                  <div 
                    key={index} 
                    className="relative group"
                    onMouseEnter={() => isCollapsed && setHoveredCollapsedItem(item.label)}
                    onMouseLeave={() => isCollapsed && setHoveredCollapsedItem(null)}
                  >
                    {hasSubmenu ? (
                      <button
                        type="button"
                        onClick={() => {
                          setOpenDropdown(isDropdownOpen ? null : item.label);
                          if (item.href) {
                            router.push(item.href);
                          }
                        }}
                        className={cn(
                          "w-full flex items-center justify-between cursor-pointer transition-all duration-150 relative font-semibold tracking-tight",
                          densityPadding,
                          cornerRadiusClass,
                          activeStyleConfig.classes
                        )}
                        style={activeStyleConfig.style}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <item.icon className={cn(
                            "text-sm min-w-[16px]",
                            isActive 
                              ? (isGlassSuit ? "text-slate-900 font-bold" : isDarkSuit ? "text-cyan-400" : "text-white") 
                              : isDarkSuit 
                              ? "text-slate-400" 
                              : "text-slate-500"
                          )} />
                          {!isCollapsed && <span className="truncate">{item.label}</span>}
                        </div>

                        {!isCollapsed && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            {crmSettings.sidebarShowBadges && item.badge && (
                              <span className={cn(
                                "text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider",
                                isActive 
                                  ? (isGlassSuit ? "bg-slate-900/10 text-slate-800" : "bg-white/20 text-white")
                                  : isDarkSuit 
                                  ? "bg-slate-800 text-cyan-300 border border-slate-700" 
                                  : isGlassSuit
                                  ? "bg-white/60 text-slate-700 border border-white/80 shadow-2xs"
                                  : "bg-slate-100 text-slate-600 border border-slate-200"
                              )}>
                                {item.badge}
                              </span>
                            )}
                            <FiChevronDown 
                              className={cn(
                                "text-xs transition-transform duration-200", 
                                isDropdownOpen && "rotate-180",
                                isActive ? (isGlassSuit ? "text-slate-700" : "opacity-80") : "text-slate-400"
                              )} 
                            />
                          </div>
                        )}
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "w-full flex items-center justify-between cursor-pointer transition-all duration-150 font-semibold tracking-tight",
                          densityPadding,
                          cornerRadiusClass,
                          activeStyleConfig.classes
                        )}
                        style={activeStyleConfig.style}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <item.icon className={cn(
                            "text-sm min-w-[16px]",
                            isActive 
                              ? (isGlassSuit ? "text-slate-900 font-bold" : isDarkSuit ? "text-cyan-400" : "text-white") 
                              : isDarkSuit 
                              ? "text-slate-400" 
                              : "text-slate-500"
                          )} />
                          {!isCollapsed && <span className="truncate">{item.label}</span>}
                        </div>

                        {!isCollapsed && crmSettings.sidebarShowBadges && item.badge && (
                          <span className={cn(
                            "text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0",
                            isActive 
                              ? (isGlassSuit ? "bg-slate-900/10 text-slate-800" : "bg-white/20 text-white")
                              : isDarkSuit 
                              ? "bg-slate-800 text-cyan-300 border border-slate-700" 
                              : isGlassSuit
                              ? "bg-white/60 text-slate-700 border border-white/80 shadow-2xs"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          )}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )}

                    {!isCollapsed && hasSubmenu && isDropdownOpen && (
                      <div className={cn(
                        "mt-1 mb-2 ml-4 border-l pl-2.5 space-y-1 animate-in fade-in duration-200",
                        isDarkSuit ? "border-slate-800" : isGlassSuit ? "border-white/60" : "border-slate-200"
                      )}>
                        {item.submenu?.map((subitem: any, subindex: number) => {
                          const isSubActive = pathname === subitem.href || pathname.startsWith(`${subitem.href}/`);
                          return (
                            <Link 
                              key={subindex}
                              href={subitem.href}
                              className={cn(
                                "block py-1 px-2 text-[11px] font-medium rounded-lg transition-all cursor-pointer",
                                isSubActive 
                                  ? isDarkSuit
                                    ? "font-bold bg-slate-800 text-cyan-400"
                                    : isGlassSuit
                                    ? "font-bold bg-white/70 text-slate-950 shadow-2xs border border-white/80"
                                    : "font-bold bg-slate-100 text-slate-900" 
                                  : isDarkSuit
                                  ? "text-slate-400 hover:text-white hover:bg-slate-850"
                                  : isGlassSuit
                                  ? "text-slate-600 hover:text-slate-900 hover:bg-white/40"
                                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                              )}
                            >
                              {subitem.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}

                    {isCollapsed && hoveredCollapsedItem === item.label && (
                      <div className={cn(
                        "absolute left-full top-0 ml-2 z-50 border rounded-xl shadow-xl py-2 min-w-56 animate-in fade-in zoom-in-95 duration-150",
                        isDarkSuit 
                          ? "bg-[#0f172a] border-slate-700 text-white" 
                          : isGlassSuit
                          ? "bg-white/80 backdrop-blur-3xl border-white/80 text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                          : "bg-white border-slate-200 text-slate-900"
                      )}>
                        <div className={cn(
                          "px-3 py-1.5 border-b mb-1",
                          isGlassSuit ? "border-slate-200/50" : "border-slate-150"
                        )}>
                          <p className="text-xs font-bold">{item.label}</p>
                          {item.description && (
                            <p className="text-[10px] mt-0.5 leading-tight text-slate-400">
                              {item.description}
                            </p>
                          )}
                        </div>
                        {hasSubmenu ? (
                          item.submenu?.map((subitem: any, subindex: number) => (
                            <Link
                              key={subindex}
                              href={subitem.href}
                              className={cn(
                                "block px-3 py-1 text-xs font-medium transition-colors",
                                pathname === subitem.href
                                  ? (isGlassSuit ? "font-bold text-slate-950 bg-white/90 shadow-2xs" : "font-bold text-blue-500 bg-blue-50/10")
                                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
                              )}
                            >
                              {subitem.label}
                            </Link>
                          ))
                        ) : (
                          <Link
                            href={item.href}
                            className="block px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
                          >
                            Open Module
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Quick Schedule */}
      {!isCollapsed && crmSettings.sidebarShowQuickStats && (
        <div className="mx-2.5 mb-2.5">
          <Link 
            href="/calendar" 
            className={cn(
              "block rounded-xl border p-2.5 transition-all cursor-pointer group shadow-2xs",
              isDarkSuit 
                ? "bg-[#070d1e] border-slate-800/90 hover:border-slate-700" 
                : isGlassSuit
                ? "bg-white/40 border-white/60 hover:bg-white/60 shadow-[0_2px_12px_rgba(0,0,0,0.03)] backdrop-blur-xl"
                : "bg-slate-50 border-slate-200 hover:bg-slate-100/80"
            )} 
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "rounded-lg p-1.5 shadow-2xs border",
                  isDarkSuit 
                    ? "bg-slate-850 border-slate-700 text-cyan-400" 
                    : isGlassSuit
                    ? "bg-white/70 border-white/80 text-slate-800"
                    : "bg-white border-slate-200 text-slate-900"
                )}>
                  <FiCalendar size={12} />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Schedule Focus</p>
                  <p className={cn("text-xs font-bold leading-tight", isDarkSuit ? "text-white" : "text-slate-900")}>
                    {scheduleDate}
                  </p>
                </div>
              </div>
              <FiArrowRight size={11} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className={cn("mt-1.5 text-[10px] font-medium leading-snug", isDarkSuit ? "text-slate-400" : "text-slate-600")}>
              3 calls queued & 1 deal review today.
            </p>
          </Link>
        </div>
      )}

      {/* Footer User Info */}
      {!isCollapsed && userInfo && (
        <div className={cn(
          "p-2.5 border-t transition-colors",
          isDarkSuit && "border-slate-800 bg-[#070d1e]",
          isGlassSuit && "border-white/50 bg-white/30 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]",
          (!isDarkSuit && !isGlassSuit) && "border-slate-100 bg-white"
        )}>
          <div className={cn(
            "flex items-center gap-2.5 p-1.5 rounded-xl border transition-all",
            isDarkSuit 
              ? "bg-[#0b1329] border-slate-800" 
              : isGlassSuit
              ? "bg-white/50 border-white/70 shadow-2xs backdrop-blur-md"
              : "bg-slate-50 border-slate-200/70"
          )}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[10px] border border-white/80 overflow-hidden shrink-0 shadow-2xs bg-white text-slate-900">
              {userInfo?.avatar ? (
                <img src={getAvatarUrl(userInfo?.avatar, userInfo?.name)} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="uppercase">{userInfo?.name ? userInfo.name[0] : 'U'}</span>
              )}
            </div>
            <div className="overflow-hidden min-w-0 pr-1 flex-1">
              <p className={cn("text-[11px] font-bold truncate leading-tight", isDarkSuit ? "text-white" : "text-slate-900")}>
                {userInfo?.name || 'User'}
              </p>
              <p className={cn(
                "text-[9px] font-semibold truncate uppercase tracking-wider mt-0.5",
                isDarkSuit ? "text-cyan-400" : "text-slate-400"
              )}>
                {userInfo?.roleDetails?.role_name || accountTypeLabel || accountType || 'Member'}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  </>
  );
};