"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// Icons
import type { IconType } from "react-icons";
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
  FiX,
} from "react-icons/fi";

// Utilities & Hooks
import { getAvatarUrl } from "@/src/utils/avatarHelper";
import {
  ACCOUNT_TYPE_LABELS,
  isAccountOwner,
  hasFeatureAccess,
  resolveAccountType,
} from "@/src/constants/roles";
import { MENU_FEATURE_MAP } from "@/src/constants/permissions";
import { useSidebar } from "@/src/hooks/use-sidebar";
import logo from "@/src/assets/crm-logo.png";
import {
  DEFAULT_CRM_SETTINGS,
  contrastText,
  getCRMSettings,
  hexToRgba,
  isDarkHex,
  resolveCrmLogo,
  safeHex,
  type CRMSettings,
} from "@/src/utils/crmSettings";
import { FaRegHandshake } from "react-icons/fa6";

// Types
type SubMenuItem = {
  label: string;
  href: string;
  icon: IconType;
};

type NavItem = {
  icon: IconType;
  label: string;
  href: string;
  feature?: string;
  badge?: string;
  description?: string;
  requiresOwner?: boolean;
  submenu?: SubMenuItem[];
};

type NavGroup = {
  groupTitle: string;
  items: NavItem[];
};

const cn = (...classes: (string | boolean | undefined | null)[]) =>
  classes.filter(Boolean).join(" ");

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
  const [hoveredCollapsedItem, setHoveredCollapsedItem] = useState<
    string | null
  >(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [crmSettings, setCRMSettings] =
    useState<CRMSettings>(DEFAULT_CRM_SETTINGS);

  const loadUserData = () => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUserInfo(JSON.parse(storedUser));
        } catch (e) {
          console.error("Error parsing user info:", e);
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

    if (typeof window !== "undefined") {
      window.addEventListener("storage", loadUserData);
      window.addEventListener("userUpdated", loadUserData);
      window.addEventListener("crm-settings-updated", syncCRMSettings);

      return () => {
        window.removeEventListener("storage", loadUserData);
        window.removeEventListener("userUpdated", loadUserData);
        window.removeEventListener("crm-settings-updated", syncCRMSettings);
      };
    }
  }, []);

  const accountType = resolveAccountType(userInfo);
  const isAccountOwnerUser = isAccountOwner(accountType);
  const accountTypeLabel = accountType
    ? ACCOUNT_TYPE_LABELS[accountType] || accountType
    : undefined;

  const canSeeMenuItem = (href: string) => {
    if (!userInfo) return true;
    if (isAccountOwnerUser) return true;
    const featureKey = MENU_FEATURE_MAP[href];
    if (!featureKey) return true;
    return hasFeatureAccess(userInfo, featureKey);
  };

  const navGroups: NavGroup[] = [
    {
      groupTitle: "Core Operations",
      items: [
        {
          icon: FiHome,
          label: "Dashboard",
          href: "/dashboard",
          feature: "dashboard",
          badge: undefined,
        },
        {
          icon: FiUsers,
          label: "User Management",
          href: "/user",
          feature: "users",
          requiresOwner: true,
          badge: undefined,
        },
        {
          icon: FiCalendar,
          label: "Calendar",
          href: "/calendar",
          badge: "Today",
        },
        {
          icon: FiGitCommit,
          label: "Automation Workflows",
          href: "/workflows",
          feature: "automation-workflow",
          badge: "Flow",
          description: "Cross-CRM orchestration engine",
        },
      ],
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
            {
              label: "Social Accounts",
              href: "/marketing/social-accounts",
              icon: FiZap,
            },
            {
              label: "Content Engine",
              href: "/marketing/content-engine",
              icon: FiZap,
            },
            {
              label: "Drip Campaigns",
              href: "/marketing/drip-campaigns",
              icon: FiMail,
            },
          ],
        },
        // {
        //   icon: FiTrendingUp,
        //   label: "RenGrowCure",
        //   href: "/rengrowcure",
        //   feature: "rengrowcure",
        //   badge: "Hot",
        //   description: "Pipeline, follow-ups, and revenue tracking",
        //   submenu: [
        //     { label: "LeadIntel", href: "/rengrowcure/leadIntel", icon: FiAward },
        //     { label: "DistroEngine", href: "/rengrowcure/distroengine", icon: FiGitCommit },
        //     { label: "Outreach Sequences", href: "/rengrowcure/outreach-sequences", icon: FiLayers },
        //     { label: "Chronos", href: "/rengrowcure/chronos", icon: FiActivity },
        //     { label: "Kinetics", href: "/rengrowcure/kinetics", icon: FiCheckSquare },
        //     { label: "Reports & Analytics", href: "/rengrowcure/reportscure", icon: FiBarChart2 },
        //   ]
        // },
        {
          icon: FaRegHandshake,
          label: "Deal Flow",
          href: "/dealflow",
          feature: "dealflow_opportunity",
          badge: "Matrix",
          description: "Opportunity pipeline & deal venture matrix",
        },
      ],
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
          description:
            "Workstation, projects, intelligent OS tracking & productivity suite",
          submenu: [
            {
              label: "Task Workstation",
              href: "/tasks/task-workstation",
              icon: FiZap,
            },
            {
              label: "My Assigned Tasks",
              href: "/tasks/my-tasks",
              icon: FiCheckCircle,
            },
            {
              label: "Projects Portfolio",
              href: "/tasks/project-portfolio",
              icon: FiFolder,
            },
            {
              label: "Project Time Tracker",
              href: "/tasks/time-tracker",
              icon: FiClock,
            },
            {
              label: "Activity & Behavior Tracker",
              href: "/tasks/os-tracker",
              icon: FiActivity,
            },
            {
              label: "10-Min Summary Logs",
              href: "/tasks/behavior-logs",
              icon: FiFileText,
            },
            {
              label: "Task Resources & Vault",
              href: "/tasks/resources",
              icon: FiPaperclip,
            },
            {
              label: "Sprints & Milestones",
              href: "/tasks/sprints",
              icon: FiTarget,
            },
            {
              label: "Team Workload & Capacity",
              href: "/tasks/team-workload",
              icon: FiUsers,
            },
            {
              label: "Reports & Productivity Analytics",
              href: "/tasks/analytics",
              icon: FiBarChart2,
            },
          ],
        },
        {
          icon: FiUsers,
          label: "Roles Management",
          href: "/roles",
          feature: "roles",
          requiresOwner: true,
        },
        {
          icon: FiMessageSquare,
          label: "Chat Workspace",
          href: "/chat",
          feature: "chat",
          badge: "Live",
        },
        { icon: FiSettings, label: "CRM Settings", href: "/crm-settings" },
      ],
    },
  ];

  // Auto-expand active dropdown
  useEffect(() => {
    navGroups.forEach((g) => {
      (g?.items || []).forEach((item) => {
        if (
          item.submenu?.some(
            (sub) =>
              pathname === sub.href || pathname.startsWith(`${sub.href}/`),
          )
        ) {
          setOpenDropdown(item.label);
        }
      });
    });
  }, [pathname]);

  const fallbackLogo = typeof logo === "string" ? logo : logo.src;
  const sidebarLogoSrc = resolveCrmLogo(crmSettings, fallbackLogo);
  const scheduleDate = hasMounted
    ? new Date().toLocaleDateString("en", { month: "short", day: "numeric" })
    : "—";

  const sidebarBg = safeHex(crmSettings.sidebarBg, "#FFFFFF");
  const sidebarText = safeHex(crmSettings.sidebarText, "#1E293B");
  const sidebarBorder = safeHex(crmSettings.cardBorder, "#E2E8F0");
  const brandColor = safeHex(crmSettings.primaryColor, "#111827");
  const brandText = contrastText(brandColor);
  const darkSurface = isDarkHex(sidebarBg);
  const showOrgName = Boolean(crmSettings.showCompanyName);
  const showTagline = Boolean(crmSettings.showTagline);
  const taglineText = crmSettings.crmPurposeText || crmSettings.crmTagline;
  const logoAlign = crmSettings.logoAlignment || "left";

  // Density spacing classes
  const densityPadding =
    crmSettings.sidebarDensity === "compact"
      ? "py-1.5 px-2.5 text-[11px]"
      : crmSettings.sidebarDensity === "spacious"
        ? "py-3 px-3.5 text-xs"
        : "py-2 px-3 text-xs";

  // Corner Radius
  const cornerRadiusClass =
    crmSettings.sidebarCornerRadius === "sharp"
      ? "rounded-none"
      : crmSettings.sidebarCornerRadius === "full"
        ? "rounded-full"
        : "rounded-xl";

  // Active Item Style Calculator
  const getActiveStyle = (isActive: boolean) => {
    if (!isActive) {
      return {
        classes: "crm-nav-idle font-semibold",
        style: {
          color: sidebarText,
          backgroundColor: "transparent",
          border: "1px solid transparent",
        } as React.CSSProperties,
      };
    }

    const activeMode = crmSettings.sidebarActiveStyle || "filled";

    if (activeMode === "pill") {
      return {
        classes: "font-bold",
        style: {
          backgroundColor: hexToRgba(brandColor, 0.12),
          color: brandColor,
          border: `1px solid ${hexToRgba(brandColor, 0.4)}`,
        } as React.CSSProperties,
      };
    }

    if (activeMode === "border_left") {
      return {
        classes: "font-bold",
        style: {
          backgroundColor: hexToRgba(brandColor, 0.08),
          color: brandColor,
          borderLeft: `3px solid ${brandColor}`,
          borderRadius: "0 10px 10px 0",
        } as React.CSSProperties,
      };
    }

    if (activeMode === "subtle") {
      return {
        classes: "font-bold",
        style: {
          backgroundColor: hexToRgba(brandColor, 0.08),
          color: brandColor,
          border: "1px solid transparent",
        } as React.CSSProperties,
      };
    }

    return {
      classes: "font-bold shadow-sm",
      style: {
        backgroundColor: brandColor,
        color: brandText,
        border: "1px solid transparent",
      } as React.CSSProperties,
    };
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
          "h-screen border-r transition-all duration-300 ease-in-out flex flex-col select-none shrink-0",
          "hidden md:flex md:sticky md:top-0 md:left-0 md:z-40",
          isCollapsed ? "md:w-[72px]" : "md:w-[255px]",
          "fixed inset-y-0 left-0 z-[150] w-[270px] max-w-[85vw]",
          isMobileOpen
            ? "!flex translate-x-0 shadow-2xl"
            : "-translate-x-full md:translate-x-0",
        )}
        style={{
          backgroundColor: sidebarBg,
          color: sidebarText,
          borderColor: sidebarBorder,
        }}
      >
        <style>{`
          .crm-nav-idle:hover { background-color: ${hexToRgba(sidebarText, darkSurface ? 0.14 : 0.08)} !important; }
        `}</style>
        {/* Brand Header */}
        <div
          className="flex items-center justify-between px-3.5 relative py-3.5 border-b transition-colors"
          style={{ borderColor: sidebarBorder, backgroundColor: sidebarBg }}
        >
          {!isCollapsed || isMobileOpen ? (
            <Link
              href="/dashboard"
              className={cn(
                "flex flex-1 items-center pl-0.5 cursor-pointer overflow-hidden",
                logoAlign === "center" && "justify-center",
                logoAlign === "right" && "justify-end",
                logoAlign === "left" && "justify-start",
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="shrink-0">
                  <img
                    src={sidebarLogoSrc}
                    alt="CRM Logo"
                    style={{
                      maxHeight: crmSettings.logoHeight
                        ? `${crmSettings.logoHeight}px`
                        : "34px",
                      maxWidth: crmSettings.logoWidth
                        ? `${crmSettings.logoWidth}px`
                        : "140px",
                    }}
                    className="w-auto object-contain transition-all"
                  />
                </div>
                {(showOrgName || showTagline) && (
                  <div className="min-w-0 overflow-hidden text-left">
                    {showOrgName && (
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-xs font-extrabold tracking-tight truncate"
                          style={{ color: sidebarText }}
                        >
                          {crmSettings.companyName || "Workspace"}
                        </span>
                        {crmSettings.sidebarShowStatusPulse && (
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"
                            title="System Online & Synchronized"
                          />
                        )}
                      </div>
                    )}
                    {showTagline && taglineText && (
                      <p
                        className="text-[9px] font-medium leading-tight truncate"
                        style={{ color: sidebarText, opacity: 0.7 }}
                      >
                        {taglineText}
                      </p>
                    )}
                  </div>
                )}
                {!showOrgName && crmSettings.sidebarShowStatusPulse && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"
                    title="System Online & Synchronized"
                  />
                )}
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
                "hidden md:flex p-1.5 rounded-lg transition-all cursor-pointer border items-center justify-center shrink-0",
                isCollapsed ? "mx-auto w-7 h-7 mt-0" : "ml-2",
              )}
              style={{
                color: sidebarText,
                borderColor: sidebarBorder,
                backgroundColor: hexToRgba(sidebarText, 0.06),
              }}
            >
              <FiChevronLeft
                className={cn(
                  "text-xs transition-transform duration-300",
                  isCollapsed && "rotate-180",
                )}
              />
            </button>
          )}

          {/* Mobile Close Drawer Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg md:hidden transition ml-1 cursor-pointer shrink-0"
            style={{
              color: sidebarText,
              backgroundColor: hexToRgba(sidebarText, 0.08),
            }}
            title="Close Navigation"
            aria-label="Close navigation"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Main Navigation with Group Titles */}
        <nav className="flex-1 px-3 py-3 space-y-3 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300/40 [&::-webkit-scrollbar-thumb]:rounded-full">
          {navGroups.map((group, gIdx) => {
            const items = group?.items || [];
            const visibleItems = items.filter((item) => {
              if (item.label === "Dashboard" || item.href === "/dashboard")
                return true;
              if (!userInfo) return true;
              if (item.requiresOwner && !isAccountOwnerUser) return false;
              return canSeeMenuItem(item.href);
            });

            if (visibleItems.length === 0) return null;

            return (
              <div key={gIdx} className="space-y-1">
                {(!isCollapsed || isMobileOpen) &&
                  crmSettings.sidebarShowGroupTitles && (
                    <div className="px-2 pt-1 pb-1">
                      <p
                        className="text-[9px] font-extrabold uppercase tracking-widest"
                        style={{ color: sidebarText, opacity: 0.55 }}
                      >
                        {group.groupTitle}
                      </p>
                    </div>
                  )}

                {visibleItems.map((item, index) => {
                  const hasSubmenu = item.submenu && item.submenu.length > 0;
                  const isDropdownOpen = openDropdown === item.label;
                  const isSubmenuActive =
                    item.submenu?.some(
                      (sub) =>
                        pathname === sub.href ||
                        pathname.startsWith(`${sub.href}/`),
                    ) ?? false;
                  const isDirectActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" &&
                      pathname.startsWith(`${item.href}/`));
                  const isActive = isDirectActive || isSubmenuActive;
                  const activeStyleConfig = getActiveStyle(isActive);

                  return (
                    <div
                      key={index}
                      className="relative group"
                      onMouseEnter={() =>
                        isCollapsed &&
                        !isMobileOpen &&
                        setHoveredCollapsedItem(item.label)
                      }
                      onMouseLeave={() =>
                        isCollapsed &&
                        !isMobileOpen &&
                        setHoveredCollapsedItem(null)
                      }
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
                            activeStyleConfig.classes,
                          )}
                          style={activeStyleConfig.style}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <item.icon className="text-sm min-w-[16px]" />
                            {(!isCollapsed || isMobileOpen) && (
                              <span className="truncate">{item.label}</span>
                            )}
                          </div>

                          {(!isCollapsed || isMobileOpen) && (
                            <div className="flex items-center gap-1.5 shrink-0">
                              {crmSettings.sidebarShowBadges && item.badge && (
                                <span
                                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider border"
                                  style={
                                    isActive
                                      ? {
                                          backgroundColor:
                                            "rgba(255,255,255,0.18)",
                                          color: "inherit",
                                          borderColor: "transparent",
                                        }
                                      : {
                                          color: sidebarText,
                                          borderColor: sidebarBorder,
                                          backgroundColor: hexToRgba(
                                            sidebarText,
                                            0.06,
                                          ),
                                        }
                                  }
                                >
                                  {item.badge}
                                </span>
                              )}
                              <FiChevronDown
                                className={cn(
                                  "text-xs transition-transform duration-200",
                                  isDropdownOpen && "rotate-180",
                                  isActive ? "opacity-90" : "opacity-70",
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
                            activeStyleConfig.classes,
                          )}
                          style={activeStyleConfig.style}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <item.icon className="text-sm min-w-[16px]" />
                            {(!isCollapsed || isMobileOpen) && (
                              <span className="truncate">{item.label}</span>
                            )}
                          </div>

                          {(!isCollapsed || isMobileOpen) &&
                            crmSettings.sidebarShowBadges &&
                            item.badge && (
                              <span
                                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 border"
                                style={
                                  isActive
                                    ? {
                                        backgroundColor:
                                          "rgba(255,255,255,0.18)",
                                        color: "inherit",
                                        borderColor: "transparent",
                                      }
                                    : {
                                        color: sidebarText,
                                        borderColor: sidebarBorder,
                                        backgroundColor: hexToRgba(
                                          sidebarText,
                                          0.06,
                                        ),
                                      }
                                }
                              >
                                {item.badge}
                              </span>
                            )}
                        </Link>
                      )}

                      {(!isCollapsed || isMobileOpen) &&
                        hasSubmenu &&
                        isDropdownOpen && (
                          <div
                            className="mt-1 mb-2 ml-4 border-l pl-2.5 space-y-1 animate-in fade-in duration-200"
                            style={{ borderColor: sidebarBorder }}
                          >
                            {item.submenu?.map((subitem, subindex) => {
                              const isSubActive =
                                pathname === subitem.href ||
                                pathname.startsWith(`${subitem.href}/`);
                              return (
                                <Link
                                  key={subindex}
                                  href={subitem.href}
                                  className={cn(
                                    "block py-1 px-2 text-[11px] font-medium rounded-lg transition-all cursor-pointer",
                                    !isSubActive && "crm-nav-idle",
                                    isSubActive && "font-bold",
                                  )}
                                  style={
                                    isSubActive
                                      ? {
                                          backgroundColor: hexToRgba(
                                            brandColor,
                                            0.12,
                                          ),
                                          color: brandColor,
                                        }
                                      : { color: sidebarText }
                                  }
                                >
                                  {subitem.label}
                                </Link>
                              );
                            })}
                          </div>
                        )}

                      {isCollapsed &&
                        !isMobileOpen &&
                        hoveredCollapsedItem === item.label && (
                          <div
                            className="absolute left-full top-0 ml-2 z-50 border rounded-xl shadow-xl py-2 min-w-56 animate-in fade-in zoom-in-95 duration-150"
                            style={{
                              backgroundColor: darkSurface
                                ? "#0f172a"
                                : "#ffffff",
                              borderColor: sidebarBorder,
                              color: darkSurface ? "#ffffff" : "#0f172a",
                            }}
                          >
                            <div
                              className="px-3 py-1.5 border-b mb-1"
                              style={{ borderColor: sidebarBorder }}
                            >
                              <p className="text-xs font-bold">{item.label}</p>
                              {item.description && (
                                <p className="text-[10px] mt-0.5 leading-tight text-slate-400">
                                  {item.description}
                                </p>
                              )}
                            </div>
                            {hasSubmenu ? (
                              item.submenu?.map((subitem, subindex) => (
                                <Link
                                  key={subindex}
                                  href={subitem.href}
                                  className="block px-3 py-1 text-xs font-medium transition-colors"
                                  style={
                                    pathname === subitem.href
                                      ? { color: brandColor, fontWeight: 700 }
                                      : undefined
                                  }
                                >
                                  {subitem.label}
                                </Link>
                              ))
                            ) : (
                              <Link
                                href={item.href}
                                className="block px-3 py-1 text-xs font-medium"
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
        {(!isCollapsed || isMobileOpen) &&
          crmSettings.sidebarShowQuickStats && (
            <div className="mx-2.5 mb-2.5">
              <Link
                href="/calendar"
                className="block rounded-xl border p-2.5 transition-all cursor-pointer group shadow-2xs"
                style={{
                  borderColor: sidebarBorder,
                  backgroundColor: hexToRgba(brandColor, 0.06),
                  color: sidebarText,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="rounded-lg p-1.5 shadow-2xs border"
                      style={{
                        borderColor: sidebarBorder,
                        color: brandColor,
                        backgroundColor: darkSurface
                          ? "rgba(255,255,255,0.06)"
                          : "#ffffff",
                      }}
                    >
                      <FiCalendar size={12} />
                    </div>
                    <div>
                      <p
                        className="text-[9px] font-bold uppercase tracking-widest"
                        style={{ color: sidebarText, opacity: 0.6 }}
                      >
                        Schedule Focus
                      </p>
                      <p
                        className="text-xs font-bold leading-tight"
                        style={{ color: sidebarText }}
                      >
                        {scheduleDate}
                      </p>
                    </div>
                  </div>
                  <FiArrowRight
                    size={11}
                    className="group-hover:translate-x-0.5 transition-transform"
                    style={{ color: sidebarText, opacity: 0.6 }}
                  />
                </div>
                <p
                  className="mt-1.5 text-[10px] font-medium leading-snug"
                  style={{ color: sidebarText, opacity: 0.75 }}
                >
                  3 calls queued & 1 deal review today.
                </p>
              </Link>
            </div>
          )}

        {/* Footer User Info */}
        {(!isCollapsed || isMobileOpen) && userInfo && (
          <div
            className="p-2.5 border-t transition-colors"
            style={{ borderColor: sidebarBorder, backgroundColor: sidebarBg }}
          >
            <div
              className="flex items-center gap-2.5 p-1.5 rounded-xl border transition-all"
              style={{
                borderColor: sidebarBorder,
                backgroundColor: hexToRgba(sidebarText, 0.05),
              }}
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[10px] border border-white/80 overflow-hidden shrink-0 shadow-2xs bg-white text-slate-900">
                {userInfo?.avatar ? (
                  <img
                    src={getAvatarUrl(userInfo?.avatar, userInfo?.name)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="uppercase">
                    {userInfo?.name ? userInfo.name[0] : "U"}
                  </span>
                )}
              </div>
              <div className="overflow-hidden min-w-0 pr-1 flex-1">
                <p
                  className="text-[11px] font-bold truncate leading-tight"
                  style={{ color: sidebarText }}
                >
                  {userInfo?.name || "User"}
                </p>
                <p
                  className="text-[9px] font-semibold truncate uppercase tracking-wider mt-0.5"
                  style={{ color: sidebarText, opacity: 0.65 }}
                >
                  {userInfo?.roleDetails?.role_name ||
                    accountTypeLabel ||
                    accountType ||
                    "Member"}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
