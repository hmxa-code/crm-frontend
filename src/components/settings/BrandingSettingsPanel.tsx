"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FiCheck,
  FiUploadCloud,
  FiImage,
  FiTrash2,
  FiMaximize2,
  FiSliders,
  FiRefreshCw,
  FiEye,
  FiLayout,
  FiExternalLink,
  FiLayers,
  FiMoon,
  FiSun,
  FiFeather,
  FiActivity
} from "react-icons/fi";
import { CRMSettings, THEME_PRESETS } from "@/src/utils/crmSettings";
import toast from "react-hot-toast";

interface BrandingSettingsPanelProps {
  settings: CRMSettings;
  onUpdate: (field: keyof CRMSettings, value: any) => void;
  onApplyPreset: (preset: typeof THEME_PRESETS[0]) => void;
}

export function BrandingSettingsPanel({
  settings,
  onUpdate,
  onApplyPreset,
}: BrandingSettingsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"colors" | "sidebar_suits" | "logo" | "preview">("colors");

  // Local state for debounced color sliders
  const [localPrimary, setLocalPrimary] = useState(settings.primaryColor);
  const [localAccent, setLocalAccent] = useState(settings.accentColor);
  const [localSidebarBg, setLocalSidebarBg] = useState(settings.sidebarBg);
  const [localSidebarText, setLocalSidebarText] = useState(settings.sidebarText);
  const [localCardBorder, setLocalCardBorder] = useState(settings.cardBorder);

  useEffect(() => {
    setLocalPrimary(settings.primaryColor);
    setLocalAccent(settings.accentColor);
    setLocalSidebarBg(settings.sidebarBg);
    setLocalSidebarText(settings.sidebarText);
    setLocalCardBorder(settings.cardBorder);
  }, [settings.primaryColor, settings.accentColor, settings.sidebarBg, settings.sidebarText, settings.cardBorder]);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleColorChange = (field: keyof CRMSettings, value: string) => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (field === "primaryColor") {
        root.style.setProperty("--crm-primary", value);
        root.style.setProperty("--primary", value);
        root.style.setProperty("--crm-primary-soft", `${value}22`);
      } else if (field === "accentColor") {
        root.style.setProperty("--crm-accent", value);
        root.style.setProperty("--accent", value);
      } else if (field === "sidebarBg") {
        root.style.setProperty("--sidebar-bg", value);
      } else if (field === "sidebarText") {
        root.style.setProperty("--sidebar-text", value);
      } else if (field === "cardBorder") {
        root.style.setProperty("--card-border", value);
      }
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      onUpdate(field, value);
    }, 120);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, SVG, JPG, WEBP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onUpdate("logoUploadData", reader.result);
        toast.success("Logo uploaded and updated in real-time!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onUpdate("faviconUrl", reader.result);
        toast.success("Favicon updated successfully!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onUpdate("logoUploadData", reader.result);
          toast.success("Logo dropped and applied!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const currentDisplayLogo = settings.logoUploadData || settings.logoUrl;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Panel Sub-Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: settings.primaryColor }}
          >
            <FiSliders className="text-base" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Branding & Global Theme Customization
            </h2>
            <p className="text-xs text-slate-500">
              Zero-lag color engine, 2 built-in sidebar theme suits, and white-label asset scaling.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("colors")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === "colors"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Color Engine
          </button>
          <button
            onClick={() => setActiveTab("sidebar_suits")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === "sidebar_suits"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Sidebar Suits (Themes)
          </button>
          <button
            onClick={() => setActiveTab("logo")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === "logo"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Header & Logos
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === "preview"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Live Component Preview
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* TAB 1: COLOR SYSTEM */}
        {activeTab === "colors" && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Enterprise Color Presets
                </span>
                <span className="text-xs text-slate-400">Click to instantly calibrate palette</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {THEME_PRESETS.map((preset) => {
                  const isCurrent =
                    settings.primaryColor === preset.primaryColor &&
                    settings.accentColor === preset.accentColor;
                  return (
                    <button
                      key={preset.name}
                      onClick={() => onApplyPreset(preset)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer relative ${
                        isCurrent
                          ? "border-blue-600 bg-blue-50/20 ring-2 ring-blue-500/20 shadow-xs"
                          : "border-slate-200/80 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-900">{preset.name}</span>
                        {isCurrent && (
                          <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                            <FiCheck />
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 my-2">
                        <div
                          className="w-5 h-5 rounded-md border border-black/10 shadow-2xs"
                          style={{ backgroundColor: preset.primaryColor }}
                          title="Primary"
                        />
                        <div
                          className="w-5 h-5 rounded-md border border-black/10 shadow-2xs"
                          style={{ backgroundColor: preset.accentColor }}
                          title="Accent"
                        />
                        <div
                          className="w-5 h-5 rounded-md border border-black/10 shadow-2xs"
                          style={{ backgroundColor: preset.sidebarBg }}
                          title="Sidebar Background"
                        />
                        <div
                          className="w-5 h-5 rounded-md border border-black/10 shadow-2xs"
                          style={{ backgroundColor: preset.sidebarText }}
                          title="Sidebar Text"
                        />
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-1">
                        {preset.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Smooth Dynamic Color Calibration (60fps CSS Var Updates)
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Lag-free live hardware acceleration
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200/70 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-800">Primary Brand Color</span>
                    <span className="text-[10px] font-mono text-slate-400">--crm-primary</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Active navigation links, primary buttons, badges, and focus rings.
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={localPrimary}
                      onChange={(e) => {
                        setLocalPrimary(e.target.value);
                        handleColorChange("primaryColor", e.target.value);
                      }}
                      className="h-9 w-9 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white shadow-2xs shrink-0"
                    />
                    <input
                      type="text"
                      value={localPrimary}
                      onChange={(e) => {
                        setLocalPrimary(e.target.value);
                        handleColorChange("primaryColor", e.target.value);
                      }}
                      className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg bg-white uppercase"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200/70 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-800">Accent Color</span>
                    <span className="text-[10px] font-mono text-slate-400">--crm-accent</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">
                    High-contrast text highlights, secondary accents, and dark tags.
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={localAccent}
                      onChange={(e) => {
                        setLocalAccent(e.target.value);
                        handleColorChange("accentColor", e.target.value);
                      }}
                      className="h-9 w-9 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white shadow-2xs shrink-0"
                    />
                    <input
                      type="text"
                      value={localAccent}
                      onChange={(e) => {
                        setLocalAccent(e.target.value);
                        handleColorChange("accentColor", e.target.value);
                      }}
                      className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg bg-white uppercase"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200/70 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-800">Sidebar Background</span>
                    <span className="text-[10px] font-mono text-slate-400">--sidebar-bg</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Left navigation panel canvas background color.
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={localSidebarBg}
                      onChange={(e) => {
                        setLocalSidebarBg(e.target.value);
                        handleColorChange("sidebarBg", e.target.value);
                      }}
                      className="h-9 w-9 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white shadow-2xs shrink-0"
                    />
                    <input
                      type="text"
                      value={localSidebarBg}
                      onChange={(e) => {
                        setLocalSidebarBg(e.target.value);
                        handleColorChange("sidebarBg", e.target.value);
                      }}
                      className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg bg-white uppercase"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200/70 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-800">Sidebar Text & Icons</span>
                    <span className="text-[10px] font-mono text-slate-400">--sidebar-text</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Default font and icon color on the left navigation bar.
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={localSidebarText}
                      onChange={(e) => {
                        setLocalSidebarText(e.target.value);
                        handleColorChange("sidebarText", e.target.value);
                      }}
                      className="h-9 w-9 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white shadow-2xs shrink-0"
                    />
                    <input
                      type="text"
                      value={localSidebarText}
                      onChange={(e) => {
                        setLocalSidebarText(e.target.value);
                        handleColorChange("sidebarText", e.target.value);
                      }}
                      className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg bg-white uppercase"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200/70 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-800">Card & Panel Borders</span>
                    <span className="text-[10px] font-mono text-slate-400">--card-border</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Subtle borders for dashboard cards, tables, and dropdowns.
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={localCardBorder}
                      onChange={(e) => {
                        setLocalCardBorder(e.target.value);
                        handleColorChange("cardBorder", e.target.value);
                      }}
                      className="h-9 w-9 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white shadow-2xs shrink-0"
                    />
                    <input
                      type="text"
                      value={localCardBorder}
                      onChange={(e) => {
                        setLocalCardBorder(e.target.value);
                        handleColorChange("cardBorder", e.target.value);
                      }}
                      className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg bg-white uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SIDEBAR THEME SUITS */}
        {activeTab === "sidebar_suits" && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Sidebar Visual Theme Suits
              </span>
              <p className="text-xs text-slate-500 mb-4">
                Choose between built-in enterprise layouts or fine-tune custom spacing and telemetry badges.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  onClick={() => {
                    onUpdate("sidebarThemeSuit", "enterprise_slate");
                    toast.success("Switched to Enterprise Clean Slate sidebar suit");
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    settings.sidebarThemeSuit === "enterprise_slate"
                      ? "border-blue-600 bg-blue-50/30 ring-2 ring-blue-500/20 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                          <FiSun />
                        </div>
                        <span className="text-xs font-bold text-slate-900">Enterprise Clean Slate</span>
                      </div>
                      {settings.sidebarThemeSuit === "enterprise_slate" && (
                        <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                          <FiCheck />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      HubSpot & Salesforce style high-contrast light background with subtle slate borders and crisp category typography.
                    </p>

                    <div className="mt-4 p-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1.5">
                      <div className="h-3 w-16 bg-blue-600 rounded" />
                      <div className="h-2 w-28 bg-slate-100 rounded" />
                      <div className="h-2 w-20 bg-slate-100 rounded" />
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-150 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Default Corporate Standard</span>
                    <span className="font-semibold text-blue-600">Built-in Suit 1</span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    onUpdate("sidebarThemeSuit", "executive_dark");
                    toast.success("Switched to Executive Dark Obsidian sidebar suit");
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    settings.sidebarThemeSuit === "executive_dark"
                      ? "border-cyan-500 bg-slate-900 ring-2 ring-cyan-500/30 text-white shadow-md"
                      : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-800 text-cyan-400 flex items-center justify-center text-xs font-bold">
                          <FiMoon />
                        </div>
                        <span className={`text-xs font-bold ${settings.sidebarThemeSuit === "executive_dark" ? "text-white" : "text-slate-900"}`}>
                          Executive Dark Obsidian
                        </span>
                      </div>
                      {settings.sidebarThemeSuit === "executive_dark" && (
                        <span className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-[10px]">
                          <FiCheck />
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] leading-relaxed ${settings.sidebarThemeSuit === "executive_dark" ? "text-slate-300" : "text-slate-500"}`}>
                      Deep graphite `#0b1329` navigation bar designed for high-focus trading desks, dark-mode workflows, and SaaS command centers.
                    </p>

                    <div className="mt-4 p-2.5 rounded-xl border border-slate-800 bg-[#070d1e] shadow-2xs space-y-1.5">
                      <div className="h-3 w-16 bg-cyan-400 rounded" />
                      <div className="h-2 w-28 bg-slate-800 rounded" />
                      <div className="h-2 w-20 bg-slate-800 rounded" />
                    </div>
                  </div>
                  <div className={`mt-4 pt-3 border-t flex items-center justify-between text-[10px] ${settings.sidebarThemeSuit === "executive_dark" ? "border-slate-800 text-slate-400" : "border-slate-150 text-slate-400"}`}>
                    <span>High Focus Pro Desk</span>
                    <span className="font-semibold text-cyan-400">Built-in Suit 2</span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    onUpdate("sidebarThemeSuit", "glass_modern");
                    toast.success("Switched to Modern Glass Frosted sidebar suit");
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    settings.sidebarThemeSuit === "glass_modern"
                      ? "border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-500/20 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                          <FiFeather />
                        </div>
                        <span className="text-xs font-bold text-slate-900">Modern Glass Frosted</span>
                      </div>
                      {settings.sidebarThemeSuit === "glass_modern" && (
                        <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                          <FiCheck />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Sleek semi-translucent backdrop-blur acrylic feel with subtle border highlights for hyper-modern workspace experiences.
                    </p>

                    <div className="mt-4 p-2.5 rounded-xl border border-indigo-200/60 bg-gradient-to-r from-indigo-50/50 to-white/50 backdrop-blur-sm shadow-2xs space-y-1.5">
                      <div className="h-3 w-16 bg-indigo-600 rounded" />
                      <div className="h-2 w-28 bg-indigo-100/60 rounded" />
                      <div className="h-2 w-20 bg-indigo-100/60 rounded" />
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-150 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Acrylic Aero Styling</span>
                    <span className="font-semibold text-indigo-600">Built-in Suit 3</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
                Granular Sidebar UX Customization
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-slate-200/70 bg-slate-50/50">
                  <span className="text-xs font-bold text-slate-800 block mb-1">Navigation Density</span>
                  <p className="text-[11px] text-slate-500 mb-3">Item row height and padding.</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(["compact", "comfortable", "spacious"] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => onUpdate("sidebarDensity", mode)}
                        className={`py-1.5 text-[11px] font-bold rounded-lg border capitalize transition-all cursor-pointer ${
                          settings.sidebarDensity === mode
                            ? "bg-white border-blue-600 text-blue-600 shadow-xs"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200/70 bg-slate-50/50 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block mb-1">Live Online Pulse</span>
                    <p className="text-[11px] text-slate-500">Show real-time glowing green sync dot beside company name.</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <span className="text-[11px] font-semibold text-slate-600">Enabled</span>
                    <input
                      type="checkbox"
                      checked={settings.sidebarShowStatusPulse}
                      onChange={(e) => onUpdate("sidebarShowStatusPulse", e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200/70 bg-slate-50/50 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block mb-1">Feature Tag Badges</span>
                    <p className="text-[11px] text-slate-500">Display "Today", "Hot", and "Live" indicators beside menu items.</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <span className="text-[11px] font-semibold text-slate-600">Show Badges</span>
                    <input
                      type="checkbox"
                      checked={settings.sidebarShowBadges}
                      onChange={(e) => onUpdate("sidebarShowBadges", e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200/70 bg-slate-50/50 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block mb-1">Footer Schedule Widget</span>
                    <p className="text-[11px] text-slate-500">Render bottom calendar summary card with upcoming meetings count.</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <span className="text-[11px] font-semibold text-slate-600">Show Widget</span>
                    <input
                      type="checkbox"
                      checked={settings.sidebarShowQuickStats}
                      onChange={(e) => onUpdate("sidebarShowQuickStats", e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HEADER & LOGO MANAGEMENT */}
        {activeTab === "logo" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Direct Image URL
                  </label>
                  <input
                    type="url"
                    value={settings.logoUrl}
                    onChange={(e) => onUpdate("logoUrl", e.target.value)}
                    placeholder="https://company.com/assets/logo.png"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/60 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Paste an HTTPS link to an SVG, PNG, or WEBP asset hosted on your CDN.
                  </p>
                </div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Or Drag & Drop Logo Asset
                    </label>
                    {settings.logoUploadData && (
                      <button
                        onClick={() => onUpdate("logoUploadData", "")}
                        className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <FiTrash2 size={12} />
                        Clear uploaded file
                      </button>
                    )}
                  </div>

                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/60 hover:bg-blue-50/20 rounded-xl p-6 text-center cursor-pointer transition-all"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <FiUploadCloud className="mx-auto text-3xl text-slate-400 mb-2" />
                    <p className="text-xs font-bold text-slate-700">
                      Click to upload or drag & drop file
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      SVG, PNG, JPG or WEBP (Max 2MB). Transparent background recommended.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Browser Tab Favicon
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
                      {settings.faviconUrl ? (
                        <img
                          src={settings.faviconUrl}
                          alt="Favicon"
                          className="w-6 h-6 object-contain"
                        />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold">ICO</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        ref={faviconInputRef}
                        type="file"
                        accept="image/x-icon,image/png,image/svg+xml"
                        onChange={handleFaviconUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => faviconInputRef.current?.click()}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Upload Favicon (.ico / .png)
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-4">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <FiEye className="text-slate-500" />
                      Live Logo Preview in Sidebar Header
                    </span>
                    <span className="text-[10px] text-slate-400">Dynamic Scaling</span>
                  </div>

                  <div
                    className="p-4 rounded-xl border shadow-inner flex flex-col items-center justify-center min-h-[140px] transition-colors"
                    style={{
                      backgroundColor: settings.sidebarThemeSuit === "executive_dark" ? "#0b1329" : settings.sidebarBg,
                      borderColor: settings.sidebarThemeSuit === "executive_dark" ? "#1e293b" : settings.cardBorder,
                    }}
                  >
                    {currentDisplayLogo ? (
                      <img
                        src={currentDisplayLogo}
                        alt="Company Brand Logo"
                        style={{
                          width: `${settings.logoWidth}px`,
                          maxHeight: `${settings.logoHeight}px`,
                        }}
                        className="object-contain transition-all"
                      />
                    ) : (
                      <div className="text-center py-4">
                        <FiImage className="mx-auto text-2xl text-slate-300 mb-1" />
                        <p className={`text-xs font-semibold ${settings.sidebarThemeSuit === "executive_dark" ? "text-slate-300" : "text-slate-500"}`}>
                          Wholcure Global CRM (Default)
                        </p>
                      </div>
                    )}
                    <p
                      className="mt-2 text-[10px] font-medium text-center"
                      style={{ color: settings.primaryColor }}
                    >
                      {settings.crmPurposeText || "Your workspace tagline here"}
                    </p>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>Max Width Constraint</span>
                        <span className="font-mono text-slate-500">{settings.logoWidth} px</span>
                      </div>
                      <input
                        type="range"
                        min="80"
                        max="220"
                        step="5"
                        value={settings.logoWidth}
                        onChange={(e) => onUpdate("logoWidth", Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>Max Height Constraint</span>
                        <span className="font-mono text-slate-500">{settings.logoHeight} px</span>
                      </div>
                      <input
                        type="range"
                        min="24"
                        max="64"
                        step="2"
                        value={settings.logoHeight}
                        onChange={(e) => onUpdate("logoHeight", Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Changes apply to main navigation automatically.</span>
                  <button
                    onClick={() => {
                      onUpdate("logoWidth", 140);
                      onUpdate("logoHeight", 34);
                    }}
                    className="text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                  >
                    Reset dimensions
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LIVE COMPONENT PREVIEW */}
        {activeTab === "preview" && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Verify how your configured primary, accent, and border tokens look across standard CRM components.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className="p-4 rounded-xl border bg-white shadow-xs space-y-3"
                style={{ borderColor: settings.cardBorder }}
              >
                <span className="text-xs font-bold text-slate-800 block">Buttons & Actions</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    Primary Action
                  </button>
                  <button
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white"
                    style={{ backgroundColor: settings.accentColor }}
                  >
                    Dark Accent
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                    style={{
                      backgroundColor: `${settings.primaryColor}18`,
                      color: settings.primaryColor,
                    }}
                  >
                    High Intent
                  </span>
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                    style={{
                      backgroundColor: `${settings.accentColor}18`,
                      color: settings.accentColor,
                    }}
                  >
                    Closed Won
                  </span>
                </div>
              </div>

              <div
                className="p-4 rounded-xl border shadow-xs"
                style={{
                  backgroundColor: settings.sidebarThemeSuit === "executive_dark" ? "#0b1329" : settings.sidebarBg,
                  borderColor: settings.cardBorder,
                  color: settings.sidebarThemeSuit === "executive_dark" ? "#f8fafc" : settings.sidebarText,
                }}
              >
                <span className="text-xs font-bold block mb-2 opacity-80">
                  Active Nav Link Preview ({settings.sidebarThemeSuit})
                </span>
                <div
                  className="px-3 py-2 rounded-lg text-xs font-bold text-white shadow-xs flex items-center justify-between"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  <span>Deals & Pipeline</span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">14</span>
                </div>
                <div
                  className="mt-2 px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between opacity-80 hover:opacity-100"
                  style={{ color: settings.sidebarThemeSuit === "executive_dark" ? "#94a3b8" : settings.sidebarText }}
                >
                  <span>Marketing Campaigns</span>
                  <span className="text-[10px] opacity-60">Active</span>
                </div>
              </div>

              <div
                className="p-4 rounded-xl border bg-white shadow-xs space-y-2"
                style={{ borderColor: settings.cardBorder }}
              >
                <span className="text-xs font-bold text-slate-800 block">Form Focus State</span>
                <input
                  type="text"
                  placeholder="Interactive input with focused outline..."
                  className="w-full text-xs px-3 py-2 border rounded-lg outline-none"
                  style={{
                    borderColor: settings.primaryColor,
                    boxShadow: `0 0 0 3px ${settings.primaryColor}25`,
                  }}
                />
                <p className="text-[10px] text-slate-400">
                  Global focus rings automatically inherit your chosen primary color.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}