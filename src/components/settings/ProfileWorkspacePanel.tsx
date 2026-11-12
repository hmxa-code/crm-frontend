"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FiUser,
  FiBriefcase,
  FiUploadCloud,
  FiTrash2,
  FiSave,
  FiLink
} from "react-icons/fi";
import { CRMSettings } from "@/src/utils/crmSettings";
import logo from "@/src/assets/crm-logo.png";
import toast from "react-hot-toast";

interface ProfileWorkspacePanelProps {
  settings: CRMSettings;
  onUpdate: (field: keyof CRMSettings, value: any) => void;
  onUpdateMany?: (patch: Partial<CRMSettings>) => void;
}

const isPublicImageUrl = (value: string) =>
  /^https?:\/\/\S+$/i.test(value);

export function ProfileWorkspacePanel({ settings, onUpdate, onUpdateMany }: ProfileWorkspacePanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // User Profile state (loaded from localStorage user)
  const [profileName, setProfileName] = useState("Alex Rivera");
  const [profileEmail, setProfileEmail] = useState("alex@wholcure.com");
  const [profileRole, setProfileRole] = useState("Workspace Administrator");

  // Workspace state
  const [companyName, setCompanyName] = useState(settings.companyName || "Wholcure Global CRM");
  const [tagline, setTagline] = useState(settings.crmPurposeText || "");
  const [customDomain, setCustomDomain] = useState(settings.customDomain || "crm.wholcure.com");
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || "");

  useEffect(() => {
    setCompanyName(settings.companyName || "Wholcure Global CRM");
    setTagline(settings.crmPurposeText || "");
    setCustomDomain(settings.customDomain || "crm.wholcure.com");
    setLogoUrl(settings.logoUrl || "");
  }, [settings.companyName, settings.crmPurposeText, settings.customDomain, settings.logoUrl]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.name) setProfileName(parsed.name);
          if (parsed.email) setProfileEmail(parsed.email);
          if (parsed.roleDetails?.role_name) {
            setProfileRole(parsed.roleDetails.role_name);
          } else if (parsed.role) {
            setProfileRole(parsed.role);
          }
        } catch (e) {
          console.error("Error loading profile:", e);
        }
      }
    }
  }, []);

  const handleSaveProfile = () => {
    if (typeof window !== "undefined") {
      let existing: any = {};
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          existing = JSON.parse(stored);
        } catch {
          existing = {};
        }
      }

      const updated = {
        ...existing,
        name: profileName,
        email: profileEmail,
        roleDetails: {
          ...existing.roleDetails,
          role_name: profileRole,
        },
      };

      localStorage.setItem("user", JSON.stringify(updated));
      window.dispatchEvent(new Event("userUpdated"));
      toast.success("Profile updated successfully!");
    }
  };

  const applyPatch = (patch: Partial<CRMSettings>) => {
    if (onUpdateMany) {
      onUpdateMany(patch);
      return;
    }
    (Object.keys(patch) as (keyof CRMSettings)[]).forEach((field) => {
      onUpdate(field, patch[field]);
    });
  };

  const handleSaveWorkspace = () => {
    const trimmedLogo = logoUrl.trim();
    if (trimmedLogo && !isPublicImageUrl(trimmedLogo)) {
      toast.error("Paste a public image URL that starts with http:// or https://.");
      return;
    }

    applyPatch({
      companyName,
      crmPurposeText: tagline,
      customDomain,
      logoUrl: trimmedLogo,
      ...(trimmedLogo ? { logoUploadData: "" } : {}),
    });
    toast.success(trimmedLogo ? "Workspace saved. Sidebar logo updated from the image URL." : "Workspace details updated!");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, SVG, JPG, WEBP).");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo must be 2MB or smaller.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        applyPatch({ logoUploadData: reader.result, logoUrl: "" });
        setLogoUrl("");
        toast.success("Logo uploaded and updated in the sidebar and top navigation.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    applyPatch({ logoUploadData: "", logoUrl: "" });
    setLogoUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.success("Custom logo removed. Default logo restored.");
  };

  const fallbackLogo = typeof logo === "string" ? logo : logo.src;
  const draftLogo = logoUrl.trim();
  const activeLogoSrc = draftLogo || settings.logoUploadData || settings.logoUrl || fallbackLogo;
  const usingCustomLogo = Boolean(draftLogo || settings.logoUploadData || settings.logoUrl);

  return (
    <div className="space-y-6">
      {/* 1. User Profile Details */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-4 py-4 sm:px-6 border-b border-slate-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs shrink-0">
              <FiUser className="text-lg" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-slate-900">User Profile Settings</h2>
              <p className="text-xs text-slate-500">
                Manage your personal identity, contact email, and active workspace role.
              </p>
            </div>
          </div>
          <button
            onClick={handleSaveProfile}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer shadow-xs shrink-0"
          >
            <FiSave size={13} />
            <span>Save Profile</span>
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Rendered on the sidebar footer card
              </span>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Work Email Address
              </label>
              <input
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                placeholder="alex@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Account login and lead assignment notifications
              </span>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Assigned Role / Title
              </label>
              <input
                type="text"
                value={profileRole}
                onChange={(e) => setProfileRole(e.target.value)}
                placeholder="e.g. Workspace Administrator"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Defines role badge displayed in the sidebar
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Workspace & Branding Identity */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-4 py-4 sm:px-6 border-b border-slate-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs shrink-0">
              <FiBriefcase className="text-lg" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-slate-900">Workspace & Company Identity</h2>
              <p className="text-xs text-slate-500">
                Configure your company name, mission tagline, and custom domain.
              </p>
            </div>
          </div>
          <button
            onClick={handleSaveWorkspace}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer shadow-xs shrink-0"
          >
            <FiSave size={13} />
            <span>Save Workspace</span>
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Company / Organization Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Wholcure Global CRM"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Displayed in the sidebar header and browser title
              </span>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Custom Subdomain / Domain
              </label>
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="crm.yourcompany.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Verified CNAME routing destination
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
              Workspace Mission / Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Turn every opportunity into a measurable customer journey."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <span className="text-[11px] text-slate-400 block mt-1">
              Sub-header text displayed beneath your company name in the sidebar
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
              <span><span className="block text-xs font-bold text-slate-800">Show organization name</span><span className="text-[11px] text-slate-500">Hidden by default in the sidebar.</span></span>
              <input type="checkbox" checked={Boolean(settings.showCompanyName)} onChange={e => onUpdate("showCompanyName", e.target.checked)} className="h-4 w-4 accent-slate-900" />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
              <span><span className="block text-xs font-bold text-slate-800">Show workspace tagline</span><span className="text-[11px] text-slate-500">Hidden by default in the sidebar.</span></span>
              <input type="checkbox" checked={Boolean(settings.showTagline)} onChange={e => onUpdate("showTagline", e.target.checked)} className="h-4 w-4 accent-slate-900" />
            </label>
          </div>

          {/* Logo Management */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
              Company Logo (Sidebar & Top Navigation)
            </span>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 sm:gap-5 p-3 sm:p-4 rounded-xl border border-slate-200 bg-white">
              {/* Preview stays on a light surface so the logo never sits on a black plate. */}
              <div
                className="w-full md:w-48 h-20 rounded-xl border border-slate-200 flex items-center justify-center p-2.5 shadow-2xs"
                style={{ backgroundColor: "#ffffff" }}
              >
                <img
                  src={activeLogoSrc}
                  alt="Company Logo Preview"
                  style={{
                    maxHeight: `${settings.logoHeight || 34}px`,
                    maxWidth: `${settings.logoWidth || 140}px`,
                  }}
                  className="w-auto object-contain"
                />
              </div>

              {/* Upload & Clear Controls */}
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/png, image/svg+xml, image/jpeg, image/webp"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
                  >
                    <FiUploadCloud size={14} />
                    <span>Upload New Logo</span>
                  </button>

                  {usingCustomLogo && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-colors cursor-pointer"
                    >
                      <FiTrash2 size={13} />
                      <span>Reset to Default</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Recommended size: 180 &times; 44 px. Transparent PNG or SVG works best.
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_auto]">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Logo image URL</label>
                <div className="flex items-center gap-2">
                  <FiLink className="text-slate-400" />
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={e => setLogoUrl(e.target.value)}
                    onBlur={() => {
                      const trimmed = logoUrl.trim();
                      if (trimmed === (settings.logoUrl || "").trim()) return;
                      if (trimmed && !isPublicImageUrl(trimmed)) return;
                      applyPatch({
                        logoUrl: trimmed,
                        ...(trimmed ? { logoUploadData: "" } : {}),
                      });
                    }}
                    placeholder="https://example.com/logo.png"
                    className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-slate-500 focus:outline-none"
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">Paste a publicly accessible image URL, then select Save Workspace.</p>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Header logo alignment</label>
                <div className="flex flex-wrap gap-1 rounded-xl border border-slate-200 p-1">
                  {[{id:"left",label:"Left"},{id:"center",label:"Center"},{id:"right",label:"Right"}].map(x=><button type="button" key={x.id} onClick={()=>onUpdate("logoAlignment",x.id)} className={`rounded-lg px-3 py-2 text-xs font-semibold ${settings.logoAlignment===x.id?"bg-slate-900 text-white":"text-slate-600 hover:bg-slate-50"}`}>{x.label}</button>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
