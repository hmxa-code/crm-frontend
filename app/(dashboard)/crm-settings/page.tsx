"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiSliders,
  FiRotateCcw,
  FiSave,
  FiLayout,
  FiUser
} from "react-icons/fi";
import {
  DEFAULT_CRM_SETTINGS,
  getCRMSettings,
  saveCRMSettings,
  type CRMSettings,
} from "@/src/utils/crmSettings";
import { SidebarUICustomizer } from "@/src/components/settings/SidebarUICustomizer";
import { ProfileWorkspacePanel } from "@/src/components/settings/ProfileWorkspacePanel";
import toast, { Toaster } from "react-hot-toast";

export default function CRMSettingsPage() {
  const [settings, setSettings] = useState<CRMSettings>(DEFAULT_CRM_SETTINGS);
  const [activeTab, setActiveTab] = useState<"sidebar" | "profile">("sidebar");
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  useEffect(() => {
    setSettings(getCRMSettings());

    const handleSettingsUpdate = () => {
      setSettings(getCRMSettings());
    };

    window.addEventListener("crm-settings-updated", handleSettingsUpdate);

    return () => {
      window.removeEventListener("crm-settings-updated", handleSettingsUpdate);
    };
  }, []);

  const updateSetting = (field: keyof CRMSettings, value: any) => {
    updateMany({ [field]: value });
  };

  const updateMany = (patch: Partial<CRMSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
    const saved = saveCRMSettings(patch);
    setSettings(saved);
    setHasChanges(true);
  };

  const handleReset = () => {
    if (confirm("Reset sidebar and workspace settings back to factory defaults?")) {
      const reset = saveCRMSettings(DEFAULT_CRM_SETTINGS);
      setSettings(reset);
      setHasChanges(false);
      toast.success("Settings restored to factory defaults.");
    }
  };

  const handleSaveAll = () => {
    saveCRMSettings(settings);
    setHasChanges(false);
    toast.success("All preferences persisted successfully!");
  };

  return (
    <div className="min-h-screen pb-16 text-slate-900">
      <Toaster position="top-right" />

      {/* Hero Header Area */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              <FiSliders size={13} />
              Workspace Preferences
            </div>
            <h1 className="mt-2 text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              CRM Workspace & Sidebar Customization
            </h1>
            <p className="mt-1 text-sm text-slate-500 max-w-2xl leading-relaxed">
              Personalize your navigation sidebar theme, view layout options, and update workspace profile settings.
            </p>
          </div>

          {/* Action Header Group */}
          <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-3 lg:flex lg:items-center lg:shrink-0">
            <button
              onClick={handleSaveAll}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <FiSave size={13} />
              <span>Save Changes</span>
            </button>

            <button
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Reset factory defaults"
            >
              <FiRotateCcw size={13} />
              <span>Reset</span>
            </button>

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
            >
              <FiArrowLeft size={13} />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 flex items-center gap-2 border-b border-slate-200/80 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab("sidebar")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === "sidebar"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <FiLayout size={14} />
            <span>Sidebar Customization</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === "profile"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <FiUser size={14} />
            <span>Profile & Workspace</span>
          </button>
        </div>
      </div>

      {/* Main Settings Sections */}
      <div className="space-y-8">
        {activeTab === "sidebar" && (
          <SidebarUICustomizer
            settings={settings}
            onUpdate={updateSetting}
          />
        )}

        {activeTab === "profile" && (
          <ProfileWorkspacePanel
            settings={settings}
            onUpdate={updateSetting}
            onUpdateMany={updateMany}
          />
        )}
      </div>
    </div>
  );
}
