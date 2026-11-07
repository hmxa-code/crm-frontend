"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiSettings,
  FiLayers,
  FiRotateCcw,
  FiSave,
  FiCheckCircle,
  FiExternalLink,
  FiSliders,
  FiShield,
  FiCalendar,
  FiGlobe,
  FiZap,
  FiHelpCircle,
  FiLayout
} from "react-icons/fi";
import {
  DEFAULT_CRM_SETTINGS,
  getCRMSettings,
  saveCRMSettings,
  getIntegrations,
  saveIntegrations,
  type CRMSettings,
  type IntegrationAddon,
  THEME_PRESETS
} from "@/src/utils/crmSettings";
import { IntegrationsHubModal } from "@/src/components/settings/IntegrationsHubModal";
import { BrandingSettingsPanel } from "@/src/components/settings/BrandingSettingsPanel";
import { SidebarUICustomizer } from "@/src/components/settings/SidebarUICustomizer";
import { AdminModulesPanels } from "@/src/components/settings/AdminModulesPanels";
import toast, { Toaster } from "react-hot-toast";

export default function CRMSettingsPage() {
  const [settings, setSettings] = useState<CRMSettings>(DEFAULT_CRM_SETTINGS);
  const [integrations, setIntegrations] = useState<IntegrationAddon[]>([]);
  const [isIntegrationsModalOpen, setIsIntegrationsModalOpen] = useState<boolean>(false);
  const [activeMainTab, setActiveMainTab] = useState<"all" | "sidebar_ui" | "branding" | "workflows" | "security">("all");
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  useEffect(() => {
    setSettings(getCRMSettings());
    setIntegrations(getIntegrations());

    const handleSettingsUpdate = () => {
      setSettings(getCRMSettings());
    };

    const handleIntegrationsUpdate = () => {
      setIntegrations(getIntegrations());
    };

    window.addEventListener("crm-settings-updated", handleSettingsUpdate);
    window.addEventListener("crm-integrations-updated", handleIntegrationsUpdate);

    return () => {
      window.removeEventListener("crm-settings-updated", handleSettingsUpdate);
      window.removeEventListener("crm-integrations-updated", handleIntegrationsUpdate);
    };
  }, []);

  const updateSetting = (field: keyof CRMSettings, value: any) => {
    const updated = { ...settings, [field]: value };
    setSettings(updated);
    saveCRMSettings({ [field]: value });
    setHasChanges(true);
  };

  const handleApplyPreset = (preset: typeof THEME_PRESETS[0]) => {
    const updated = {
      ...settings,
      primaryColor: preset.primaryColor,
      accentColor: preset.accentColor,
      sidebarBg: preset.sidebarBg,
      sidebarText: preset.sidebarText,
      cardBorder: preset.cardBorder,
    };
    setSettings(updated);
    saveCRMSettings(updated);
    setHasChanges(true);
    toast.success(`Theme "${preset.name}" applied across application!`);
  };

  const handleReset = () => {
    if (confirm("Reset all CRM settings back to factory defaults?")) {
      const reset = saveCRMSettings(DEFAULT_CRM_SETTINGS);
      setSettings(reset);
      setHasChanges(false);
      toast.success("Settings restored to factory defaults.");
    }
  };

  const handleSaveAll = () => {
    saveCRMSettings(settings);
    setHasChanges(false);
    toast.success("All CRM customizations persisted successfully!");
  };

  const connectedIntegrationsCount = integrations.filter((i) => i.status === "connected").length;

  return (
    <div className="min-h-screen pb-16 text-slate-900">
      <Toaster position="top-right" />

      {/* Hero Header Area */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200"
              style={{ color: settings.primaryColor }}
            >
              <FiSettings size={13} />
              Enterprise Administration Hub
            </div>
            <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              CRM Workspace Customization & Settings
            </h1>
            <p className="mt-1 text-sm text-slate-500 max-w-2xl leading-relaxed">
              Tailor company branding, customize the navigation sidebar architecture, calibrate calendar appointment rules, and connect third-party enterprise tools.
            </p>
          </div>

          {/* Action Header Group */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Prominent Trigger Button: Integration Add-ons Hub */}
            <button
              onClick={() => setIsIntegrationsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
              style={{
                backgroundColor: settings.primaryColor,
              }}
            >
              <FiLayers className="text-sm" />
              <span>Integration Add-ons Hub</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
                {connectedIntegrationsCount} Active
              </span>
            </button>

            <button
              onClick={handleSaveAll}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <FiSave size={13} />
              <span>Save Changes</span>
            </button>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Reset factory defaults"
            >
              <FiRotateCcw size={13} />
              <span>Reset</span>
            </button>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
            >
              <FiArrowLeft size={13} />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Global Filter Navigation Tabs */}
        <div className="mt-6 flex items-center gap-2 border-b border-slate-200/80 pb-3 flex-wrap">
          <button
            onClick={() => setActiveMainTab("all")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeMainTab === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            All Settings
          </button>
          <button
            onClick={() => setActiveMainTab("sidebar_ui")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMainTab === "sidebar_ui"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <FiLayout size={13} />
            <span>Sidebar UI & Suits</span>
          </button>
          <button
            onClick={() => setActiveMainTab("branding")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeMainTab === "branding"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Branding & Color Engine
          </button>
          <button
            onClick={() => setActiveMainTab("workflows")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeMainTab === "workflows"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Calendar & Workflows
          </button>
          <button
            onClick={() => setActiveMainTab("security")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeMainTab === "security"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Security & Access
          </button>
        </div>
      </div>

      {/* Main Settings Sections */}
      <div className="space-y-8">
        {/* Dedicated Sidebar UI & Architecture Customizer */}
        {(activeMainTab === "all" || activeMainTab === "sidebar_ui") && (
          <SidebarUICustomizer
            settings={settings}
            onUpdate={updateSetting}
          />
        )}

        {/* Branding, Logo, and Color Engine */}
        {(activeMainTab === "all" || activeMainTab === "branding") && (
          <BrandingSettingsPanel
            settings={settings}
            onUpdate={updateSetting}
            onApplyPreset={handleApplyPreset}
          />
        )}

        {/* Expanded Administration Modules */}
        {(activeMainTab === "all" ||
          activeMainTab === "workflows" ||
          activeMainTab === "security") && (
          <AdminModulesPanels settings={settings} onUpdate={updateSetting} />
        )}
      </div>

      {/* Large Modal / Overlay Marketplace */}
      <IntegrationsHubModal
        isOpen={isIntegrationsModalOpen}
        onClose={() => setIsIntegrationsModalOpen(false)}
        integrations={integrations}
        onUpdateIntegrations={(updated) => setIntegrations(updated)}
      />
    </div>
  );
}
