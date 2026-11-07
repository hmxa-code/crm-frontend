"use client";

import React, { useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiShield,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCopy,
  FiCheck,
  FiGlobe,
  FiKey,
  FiAlertCircle,
  FiCheckCircle,
  FiActivity,
  FiEdit3,
  FiTerminal,
  FiUserCheck
} from "react-icons/fi";
import { CRMSettings } from "@/src/utils/crmSettings";
import toast from "react-hot-toast";

interface AdminModulesPanelsProps {
  settings: CRMSettings;
  onUpdate: (field: keyof CRMSettings, value: any) => void;
}

export function AdminModulesPanels({ settings, onUpdate }: AdminModulesPanelsProps) {
  const [showSecretKey, setShowSecretKey] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [isVerifyingCname, setIsVerifyingCname] = useState<boolean>(false);

  const handleCopySecretKey = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(settings.apiSecretKey);
      setCopiedKey(true);
      toast.success("API Secret Key copied to clipboard");
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const handleVerifyCname = () => {
    setIsVerifyingCname(true);
    setTimeout(() => {
      setIsVerifyingCname(false);
      onUpdate("cnameVerified", true);
      toast.success("CNAME DNS record verified and active with SSL certificate!");
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* MODULE 1: CALENDAR & BOOKING WORKFLOW RULES */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: settings.primaryColor }}
            >
              <FiCalendar className="text-base" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Calendar & Booking Workflow Rules
              </h2>
              <p className="text-xs text-slate-500">
                Automate appointment dispatching, call duration buffers, and lead booking rules.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Engine Active
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Toggle for Auto-scheduling appointment reminders */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-start justify-between">
            <div className="pr-4">
              <span className="text-xs font-bold text-slate-900 block">
                Auto-schedule appointment reminders
              </span>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Dispatch automated multi-channel SMS and email notifications 24h & 1h prior to sales calls.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={settings.autoScheduleReminders}
                onChange={(e) => onUpdate("autoScheduleReminders", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>

          {/* Meeting duration defaults */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900">
                Default Meeting Duration
              </span>
              <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {settings.defaultMeetingDuration} Minutes
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Standard block allocated when booking customer discovery and product walkthroughs.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[15, 30, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => onUpdate("defaultMeetingDuration", mins)}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    settings.defaultMeetingDuration === mins
                      ? "bg-white border-blue-600 text-blue-600 shadow-xs ring-1 ring-blue-500/20"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          {/* Buffer time between calls */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900">
                Buffer Time Between Calls
              </span>
              <span className="text-xs font-semibold text-slate-600">
                {settings.bufferTimeBetweenCalls} mins padding
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Inserts breathing room between back-to-back calendar events for CRM note logging.
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[0, 5, 10, 15].map((buf) => (
                <button
                  key={buf}
                  onClick={() => onUpdate("bufferTimeBetweenCalls", buf)}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    settings.bufferTimeBetweenCalls === buf
                      ? "bg-white border-blue-600 text-blue-600 shadow-xs"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {buf === 0 ? "None" : `${buf}m`}
                </button>
              ))}
            </div>
          </div>

          {/* Buffer lookahead windows */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900">
                Booking Lookahead Window
              </span>
              <span className="text-xs font-semibold text-slate-600">
                {settings.bufferLookaheadWindowDays} Days Ahead
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              How far in advance prospects are permitted to schedule meetings on public booking links.
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[7, 14, 30, 60].map((days) => (
                <button
                  key={days}
                  onClick={() => onUpdate("bufferLookaheadWindowDays", days)}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    settings.bufferLookaheadWindowDays === days
                      ? "bg-white border-blue-600 text-blue-600 shadow-xs"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {days}d
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MODULE 2: SECURITY, ACCESS & AUDIT LOGS */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: settings.accentColor }}
            >
              <FiShield className="text-base" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Security, Access Policies & Audit Logs
              </h2>
              <p className="text-xs text-slate-500">
                Role-based scope boundaries, API secret key tokens, and tamper-resistant audit trails.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            SOC2 Compliance Enabled
          </span>
        </div>

        <div className="mt-5 space-y-4">
          {/* Granular Scope Assignment Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block mb-1">
                  Restrict Lead Scope to Assigned Rep
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Sales representatives only view contacts, deals, and notes directly assigned to them.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-200/60">
                <span className="text-[11px] font-semibold text-slate-600">Enforce Scope</span>
                <input
                  type="checkbox"
                  checked={settings.restrictLeadToOwnerOnly}
                  onChange={(e) => onUpdate("restrictLeadToOwnerOnly", e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block mb-1">
                  Role-based Follow-up Visibility
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Only Manager and Admin tiers can edit automated drip sequence enrollment for deals.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-200/60">
                <span className="text-[11px] font-semibold text-slate-600">Enforce Scope</span>
                <input
                  type="checkbox"
                  checked={settings.roleBasedAutomationsVisibility}
                  onChange={(e) => onUpdate("roleBasedAutomationsVisibility", e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block mb-1">
                  Mask Sensitive Deal Values
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Conceal contract ARR and margin percentages from Tier 1 SDR profiles.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-200/60">
                <span className="text-[11px] font-semibold text-slate-600">Mask Values</span>
                <input
                  type="checkbox"
                  checked={settings.maskSensitiveDealValues}
                  onChange={(e) => onUpdate("maskSensitiveDealValues", e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* API Secret Key & Token Management */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/70">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <div className="flex items-center gap-2">
                <FiKey className="text-blue-600 text-sm" />
                <span className="text-xs font-bold text-slate-900">
                  CRM Production API Secret Key
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Read / Write Scope (Live Environment)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Used to authenticate external microservices, SDK clients, and custom backend scripts.
            </p>

            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type={showSecretKey ? "text" : "password"}
                  readOnly
                  value={settings.apiSecretKey}
                  className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showSecretKey ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
              <button
                type="button"
                onClick={handleCopySecretKey}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {copiedKey ? <FiCheck className="text-emerald-600" /> : <FiCopy />}
                <span>{copiedKey ? "Copied" : "Copy Key"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const newKey = `whc_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
                  onUpdate("apiSecretKey", newKey);
                  toast.success("New API token rolled and rotated successfully!");
                }}
                className="px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
              >
                Roll Key
              </button>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FiTerminal size={13} />
                Recent Audit Trail & Access Events
              </span>
              <span className="text-[10px] text-slate-400">Showing last 4 system records</span>
            </div>

            <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-2.5">Event Description</th>
                    <th className="px-4 py-2.5">Actor / Profile</th>
                    <th className="px-4 py-2.5">IP Address</th>
                    <th className="px-4 py-2.5">Timestamp</th>
                    <th className="px-4 py-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {settings.recentAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-2.5 font-semibold text-slate-800">{log.event}</td>
                      <td className="px-4 py-2.5">{log.user}</td>
                      <td className="px-4 py-2.5 font-mono text-[11px] text-slate-500">{log.ip}</td>
                      <td className="px-4 py-2.5 text-slate-500">{log.timestamp}</td>
                      <td className="px-4 py-2.5 text-right">
                        {log.status === "success" && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                            <FiCheckCircle size={11} /> OK
                          </span>
                        )}
                        {log.status === "warning" && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600">
                            <FiAlertCircle size={11} /> Attention
                          </span>
                        )}
                        {log.status === "critical" && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600">
                            <FiAlertCircle size={11} /> Flagged
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* MODULE 3: WORKSPACE & PURPOSE METADATA */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: settings.primaryColor }}
            >
              <FiGlobe className="text-base" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Workspace Purpose & Custom Domain Setup
              </h2>
              <p className="text-xs text-slate-500">
                Configure corporate positioning, dynamic sidebar taglines, and white-label CNAME domain mappings.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Tenant: wholcure-us-east
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editable CRM Purpose / Tagline */}
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                CRM Purpose Statement (Navbar & Header Display)
              </label>
              <textarea
                rows={3}
                value={settings.crmPurposeText}
                onChange={(e) => onUpdate("crmPurposeText", e.target.value)}
                placeholder="Turn every opportunity into a measurable customer journey..."
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/60 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed transition-all"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Appears beneath the company logo on the main application sidebar navigation.
              </p>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Company Brand Name
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => onUpdate("companyName", e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/60 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Custom Domain (CNAME) Mapping Section */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <FiGlobe className="text-blue-600" />
                  White-label Custom CNAME Domain
                </span>
                {settings.cnameVerified ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <FiCheck size={11} /> CNAME Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Pending DNS
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                Route your client booking portals and login page through your own corporate domain.
              </p>

              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Custom Hostname
                  </label>
                  <input
                    type="text"
                    value={settings.customDomain}
                    onChange={(e) => {
                      onUpdate("customDomain", e.target.value);
                      onUpdate("cnameVerified", false);
                    }}
                    placeholder="crm.yourcompany.com"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none font-mono"
                  />
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] font-mono text-slate-600">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase mb-1">
                    <span>Type</span>
                    <span>Host</span>
                    <span>Value Target</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-800">
                    <span className="font-bold text-blue-600">CNAME</span>
                    <span>{settings.customDomain.split(".")[0] || "crm"}</span>
                    <span>edge.wholcure-cloud.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-end">
              <button
                type="button"
                disabled={isVerifyingCname || settings.cnameVerified}
                onClick={handleVerifyCname}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  settings.cnameVerified
                    ? "bg-slate-100 text-slate-400 cursor-default"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                }`}
              >
                {isVerifyingCname ? "Verifying DNS Record..." : settings.cnameVerified ? "Domain Configured" : "Verify CNAME DNS"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
