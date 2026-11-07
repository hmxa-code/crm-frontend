"use client";

import React, { useState } from "react";
import {
  FiLayout,
  FiSliders,
  FiSun,
  FiMoon,
  FiFeather,
  FiCheck,
  FiEye,
  FiCompass,
  FiSquare,
  FiCircle,
  FiMinimize2,
  FiMaximize2,
  FiTag,
  FiActivity,
  FiCalendar,
  FiAlignLeft,
  FiDroplet
} from "react-icons/fi";
import { CRMSettings } from "@/src/utils/crmSettings";
import toast from "react-hot-toast";

interface SidebarUICustomizerProps {
  settings: CRMSettings;
  onUpdate: (field: keyof CRMSettings, value: any) => void;
}

export function SidebarUICustomizer({ settings, onUpdate }: SidebarUICustomizerProps) {
  const [previewActiveTab, setPreviewActiveTab] = useState<string>("Deals");

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Sub Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: settings.primaryColor }}
          >
            <FiLayout className="text-base" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Interactive Sidebar UI & Architecture Customizer
            </h2>
            <p className="text-xs text-slate-500">
              Switch visual theme suits, active highlight designs, item border radius, and section group headers.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Live Real-Time Sync
        </span>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.7fr] gap-8">
          {/* LEFT: CONTROLS & PICKERS */}
          <div className="space-y-6">
            {/* 1. Theme Suit Selection (The 3 Professional Built-in Theme Suits) */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                1. Select Built-in Sidebar Theme Suit
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Suit 1: Enterprise Clean Slate */}
                <div
                  onClick={() => {
                    onUpdate("sidebarThemeSuit", "enterprise_slate");
                    toast.success("Enterprise Clean Slate Theme Applied");
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    settings.sidebarThemeSuit === "enterprise_slate"
                      ? "border-blue-600 bg-blue-50/30 ring-2 ring-blue-500/20 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center text-xs">
                          <FiSun />
                        </div>
                        <span className="text-xs font-bold text-slate-900">Enterprise Slate</span>
                      </div>
                      {settings.sidebarThemeSuit === "enterprise_slate" && (
                        <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                          <FiCheck />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      HubSpot & Salesforce style crisp corporate light canvas with subtle slate borders and high contrast.
                    </p>
                    <div className="mt-3 p-2 bg-white rounded-lg border border-slate-200 space-y-1">
                      <div className="h-2 w-12 bg-blue-600 rounded" />
                      <div className="h-1.5 w-20 bg-slate-200 rounded" />
                    </div>
                  </div>
                  <span className="mt-3 text-[9px] font-bold text-blue-600 uppercase tracking-wider">
                    Light SaaS Standard
                  </span>
                </div>

                {/* Suit 2: Executive Dark Obsidian */}
                <div
                  onClick={() => {
                    onUpdate("sidebarThemeSuit", "executive_dark");
                    toast.success("Executive Dark Obsidian Theme Applied");
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    settings.sidebarThemeSuit === "executive_dark"
                      ? "border-cyan-500 bg-[#0b1329] ring-2 ring-cyan-500/30 text-white shadow-md"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-slate-800 text-cyan-400 flex items-center justify-center text-xs">
                          <FiMoon />
                        </div>
                        <span className={`text-xs font-bold ${settings.sidebarThemeSuit === "executive_dark" ? "text-white" : "text-slate-900"}`}>
                          Executive Dark
                        </span>
                      </div>
                      {settings.sidebarThemeSuit === "executive_dark" && (
                        <span className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-[10px]">
                          <FiCheck />
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] leading-relaxed ${settings.sidebarThemeSuit === "executive_dark" ? "text-slate-300" : "text-slate-500"}`}>
                      Clean deep graphite canvas (`#0b1329`) with pro desk cyan highlights and high-contrast dark badges.
                    </p>
                    <div className="mt-3 p-2 bg-[#070d1e] rounded-lg border border-slate-800 space-y-1">
                      <div className="h-2 w-12 bg-cyan-400 rounded" />
                      <div className="h-1.5 w-20 bg-slate-800 rounded" />
                    </div>
                  </div>
                  <span className="mt-3 text-[9px] font-bold text-cyan-400 uppercase tracking-wider">
                    Pro Dark Desk
                  </span>
                </div>

                {/* Suit 3: Pure Liquid Glass (Modal & Water Glass Reflection) */}
                <div
                  onClick={() => {
                    onUpdate("sidebarThemeSuit", "glass_modern");
                    toast.success("Liquid Crystal Glass Theme Applied");
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    settings.sidebarThemeSuit === "glass_modern"
                      ? "border-slate-400 bg-white/70 ring-2 ring-slate-400/30 shadow-md backdrop-blur-2xl"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold">
                          <FiDroplet />
                        </div>
                        <span className="text-xs font-bold text-slate-900">
                          Liquid Crystal Glass
                        </span>
                      </div>
                      {settings.sidebarThemeSuit === "glass_modern" && (
                        <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">
                          <FiCheck />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Water transparent frosted glass (`backdrop-blur-3xl`) with realistic modal reflection, specular white glare, and crisp typography.
                    </p>
                    <div className="mt-3 p-2 bg-white/50 backdrop-blur-xl rounded-lg border border-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-1">
                      <div className="h-2 w-12 bg-white/90 rounded border border-white" />
                      <div className="h-1.5 w-20 bg-slate-200/60 rounded" />
                    </div>
                  </div>
                  <span className="mt-3 text-[9px] font-bold text-slate-800 uppercase tracking-wider">
                    Pure Water Glass
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Active Item Visual Style */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                2. Active Navigation Item Highlight UI
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "filled", label: "Solid Filled", desc: "Classic bold high-contrast background" },
                  { id: "pill", label: "Subtle Glow Pill", desc: "Modern semi-transparent soft tint" },
                  { id: "border_left", label: "Indicator Stripe", desc: "Left accent border line" },
                  { id: "subtle", label: "Minimalist Tint", desc: "Very subtle low-profile highlight" },
                ].map((item) => {
                  const isSelected = settings.sidebarActiveStyle === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onUpdate("sidebarActiveStyle", item.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/20 ring-2 ring-blue-500/20 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-900 block">{item.label}</span>
                      <span className="text-[10px] text-slate-400 block mt-1 leading-tight">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Corner Radius & Density */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  3. Navigation Item Corner Radius
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "sharp", label: "Sharp (0px)" },
                    { id: "rounded", label: "Rounded (12px)" },
                    { id: "full", label: "Pill (9999px)" },
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => onUpdate("sidebarCornerRadius", r.id)}
                      className={`py-2 text-xs font-bold border transition-all cursor-pointer ${
                        settings.sidebarCornerRadius === r.id
                          ? "border-blue-600 bg-white text-blue-600 shadow-xs ring-1 ring-blue-500/20"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      } ${r.id === "sharp" ? "rounded-none" : r.id === "full" ? "rounded-full" : "rounded-xl"}`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  4. Spacing & Density
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(["compact", "comfortable", "spacious"] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => onUpdate("sidebarDensity", d)}
                      className={`py-2 text-xs font-bold rounded-xl border capitalize transition-all cursor-pointer ${
                        settings.sidebarDensity === d
                          ? "border-blue-600 bg-white text-blue-600 shadow-xs ring-1 ring-blue-500/20"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Functional UI Element Toggles */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
                5. Feature & Widget Visibility Switches
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 cursor-pointer">
                  <div className="pr-2">
                    <span className="text-xs font-bold text-slate-800 block">Category Group Headers</span>
                    <span className="text-[10px] text-slate-500">Show "Core Operations", "Growth" section labels</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.sidebarShowGroupTitles}
                    onChange={(e) => onUpdate("sidebarShowGroupTitles", e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 cursor-pointer">
                  <div className="pr-2">
                    <span className="text-xs font-bold text-slate-800 block">Live Status Pulse</span>
                    <span className="text-[10px] text-slate-500">Real-time green pulsing dot beside company title</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.sidebarShowStatusPulse}
                    onChange={(e) => onUpdate("sidebarShowStatusPulse", e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 cursor-pointer">
                  <div className="pr-2">
                    <span className="text-xs font-bold text-slate-800 block">Menu Notification Badges</span>
                    <span className="text-[10px] text-slate-500">Display "Today", "Hot", "12" alert pills</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.sidebarShowBadges}
                    onChange={(e) => onUpdate("sidebarShowBadges", e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 cursor-pointer">
                  <div className="pr-2">
                    <span className="text-xs font-bold text-slate-800 block">Footer Schedule Widget</span>
                    <span className="text-[10px] text-slate-500">Display calendar focus card above user profile</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.sidebarShowQuickStats}
                    onChange={(e) => onUpdate("sidebarShowQuickStats", e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT: REAL-TIME INTERACTIVE MINI SIDEBAR PREVIEW */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 mb-4">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <FiEye className="text-blue-600" />
                  Live Sidebar UI Simulation
                </span>
                <span className="text-[10px] font-mono text-slate-400 capitalize">
                  {settings.sidebarThemeSuit}
                </span>
              </div>

              {/* Simulated Sidebar Frame */}
              <div
                className={`rounded-2xl border p-3.5 shadow-md transition-all duration-300 ${
                  settings.sidebarThemeSuit === "executive_dark"
                    ? "bg-[#0b1329] border-slate-800 text-slate-100"
                    : settings.sidebarThemeSuit === "glass_modern"
                    ? "bg-white/45 backdrop-blur-3xl border-white/80 text-slate-900 shadow-[0_8px_32px_0_rgba(31,38,135,0.08)]"
                    : "bg-white border-slate-200 text-slate-900"
                }`}
              >
                {/* Header */}
                <div className={`flex items-center justify-between pb-3 border-b ${
                  settings.sidebarThemeSuit === "executive_dark" 
                    ? "border-slate-800" 
                    : settings.sidebarThemeSuit === "glass_modern"
                    ? "border-white/60"
                    : "border-slate-200/60"
                }`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg font-bold text-[10px] flex items-center justify-center ${
                      settings.sidebarThemeSuit === "glass_modern"
                        ? "bg-white text-slate-900 font-extrabold shadow-sm border border-white"
                        : "bg-blue-600 text-white"
                    }`}>
                      W
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold">
                          {settings.companyName || "Wholcure CRM"}
                        </span>
                        {settings.sidebarShowStatusPulse && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                      </div>
                      <p className="text-[8px] leading-none text-slate-400">
                        Enterprise Platform
                      </p>
                    </div>
                  </div>
                </div>

                {/* Simulated Nav Items */}
                <div className="mt-3 space-y-2">
                  {settings.sidebarShowGroupTitles && (
                    <p className={`text-[8px] font-extrabold uppercase tracking-widest px-1 ${
                      settings.sidebarThemeSuit === "glass_modern" ? "text-slate-500" : "text-slate-400"
                    }`}>
                      Core Operations
                    </p>
                  )}

                  {[
                    { label: "Dashboard", badge: undefined },
                    { label: "Deals", badge: "Hot" },
                    { label: "Marketing", badge: "Drip" },
                    { label: "Tasks", badge: "12" },
                  ].map((item) => {
                    const isActive = previewActiveTab === item.label;
                    return (
                      <div
                        key={item.label}
                        onClick={() => setPreviewActiveTab(item.label)}
                        className={`flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold cursor-pointer transition-all ${
                          settings.sidebarCornerRadius === "sharp"
                            ? "rounded-none"
                            : settings.sidebarCornerRadius === "full"
                            ? "rounded-full"
                            : "rounded-lg"
                        }`}
                        style={
                          isActive
                            ? settings.sidebarActiveStyle === "pill"
                              ? {
                                  backgroundColor: settings.sidebarThemeSuit === "executive_dark" 
                                    ? "rgba(6, 182, 212, 0.2)" 
                                    : settings.sidebarThemeSuit === "glass_modern" 
                                    ? "rgba(255, 255, 255, 0.85)"
                                    : `${settings.primaryColor}20`,
                                  color: settings.sidebarThemeSuit === "executive_dark" 
                                    ? "#22d3ee" 
                                    : settings.sidebarThemeSuit === "glass_modern"
                                    ? "#0f172a"
                                    : settings.primaryColor,
                                  border: `1px solid ${settings.sidebarThemeSuit === "executive_dark" 
                                    ? "rgba(6, 182, 212, 0.4)" 
                                    : settings.sidebarThemeSuit === "glass_modern"
                                    ? "rgba(255, 255, 255, 0.95)"
                                    : `${settings.primaryColor}50`}`,
                                  boxShadow: settings.sidebarThemeSuit === "glass_modern" ? "0 4px 12px rgba(0,0,0,0.05)" : undefined
                                }
                              : settings.sidebarActiveStyle === "border_left"
                              ? {
                                  borderLeft: `3px solid ${settings.sidebarThemeSuit === "executive_dark" ? "#22d3ee" : settings.sidebarThemeSuit === "glass_modern" ? "#0f172a" : settings.primaryColor}`,
                                  backgroundColor: settings.sidebarThemeSuit === "glass_modern" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.04)",
                                  color: settings.sidebarThemeSuit === "glass_modern" ? "#0f172a" : undefined
                                }
                              : {
                                  backgroundColor: settings.sidebarThemeSuit === "executive_dark" 
                                    ? "#0284c7" 
                                    : settings.sidebarThemeSuit === "glass_modern"
                                    ? "#ffffff"
                                    : settings.primaryColor,
                                  color: settings.sidebarThemeSuit === "glass_modern" ? "#0f172a" : "#ffffff",
                                  boxShadow: settings.sidebarThemeSuit === "glass_modern" ? "0 4px 16px rgba(0,0,0,0.06), inset 0 1px 1px #fff" : undefined
                                }
                            : undefined
                        }
                      >
                        <span className={!isActive && settings.sidebarThemeSuit === "glass_modern" ? "text-slate-700 hover:text-slate-950" : ""}>
                          {item.label}
                        </span>
                        {settings.sidebarShowBadges && item.badge && (
                          <span
                            className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                              isActive 
                                ? settings.sidebarThemeSuit === "glass_modern" ? "bg-slate-900/10 text-slate-800" : "bg-white/20 text-white" 
                                : settings.sidebarThemeSuit === "executive_dark"
                                ? "bg-slate-800 text-cyan-300"
                                : settings.sidebarThemeSuit === "glass_modern"
                                ? "bg-white/70 text-slate-700 border border-white/80 shadow-2xs"
                                : "bg-slate-200/60 text-slate-600"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Simulated Schedule Focus Widget */}
                {settings.sidebarShowQuickStats && (
                  <div className={`mt-4 p-2 rounded-xl border text-[10px] ${
                    settings.sidebarThemeSuit === "executive_dark"
                      ? "bg-[#070d1e] border-slate-800 text-slate-300"
                      : settings.sidebarThemeSuit === "glass_modern"
                      ? "bg-white/45 border-white/80 text-slate-800 shadow-2xs backdrop-blur-xl"
                      : "bg-slate-100/60 border-slate-200/60 text-slate-700"
                  }`}>
                    <div className="flex items-center justify-between font-bold">
                      <span>Schedule Focus</span>
                      <span className={settings.sidebarThemeSuit === "executive_dark" ? "text-cyan-400" : settings.sidebarThemeSuit === "glass_modern" ? "text-slate-900" : "text-blue-600"}>
                        3 Today
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <p className="mt-4 text-[11px] text-slate-400 text-center">
              Click navigation items in the simulation to test active states. Changes apply automatically to the main CRM sidebar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
