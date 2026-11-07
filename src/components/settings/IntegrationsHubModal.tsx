"use client";

import React, { useState, useMemo } from "react";
import {
  FiX,
  FiSearch,
  FiCheck,
  FiExternalLink,
  FiRefreshCw,
  FiPower,
  FiActivity,
  FiSliders,
  FiPlus,
  FiInfo,
  FiZap,
  FiShield,
  FiLayers,
  FiDatabase,
  FiShare2,
  FiDollarSign,
  FiMail,
  FiGlobe,
  FiBarChart2,
  FiLock,
  FiAlertTriangle,
  FiClock,
  FiCpu
} from "react-icons/fi";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaGoogle,
  FaStripe,
  FaPaypal,
  FaSalesforce
} from "react-icons/fa6";
import { IntegrationAddon, saveIntegrations } from "@/src/utils/crmSettings";
import toast from "react-hot-toast";

interface IntegrationsHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  integrations: IntegrationAddon[];
  onUpdateIntegrations: (updated: IntegrationAddon[]) => void;
}

const CATEGORIES = [
  { id: "all", label: "All Integrations", icon: FiLayers, countLabel: "12" },
  { id: "social", label: "Social Channels", icon: FiShare2, countLabel: "4" },
  { id: "email", label: "Email Providers", icon: FiMail, countLabel: "2" },
  { id: "payments", label: "Payment Gateways", icon: FiDollarSign, countLabel: "2" },
  { id: "analytics", label: "Analytics & Sync", icon: FiBarChart2, countLabel: "2" },
  { id: "ads", label: "Ad Platforms", icon: FiZap, countLabel: "1" },
  { id: "webhooks", label: "Custom Webhooks", icon: FiGlobe, countLabel: "1" },
];

export function IntegrationsHubModal({
  isOpen,
  onClose,
  integrations,
  onUpdateIntegrations,
}: IntegrationsHubModalProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationAddon | null>(null);
  const [isConfiguring, setIsConfiguring] = useState<boolean>(false);
  const [topUpModalApp, setTopUpModalApp] = useState<IntegrationAddon | null>(null);

  if (!isOpen) return null;

  const filteredIntegrations = integrations.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getPlatformIcon = (iconName: string) => {
    switch (iconName) {
      case "facebook":
        return <FaFacebook className="text-[#1877F2] text-3xl" />;
      case "instagram":
        return (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white">
            <FaInstagram className="text-xl" />
          </div>
        );
      case "linkedin":
        return <FaLinkedin className="text-[#0A66C2] text-3xl" />;
      case "youtube":
        return <FaYoutube className="text-[#FF0000] text-3xl" />;
      case "google":
        return <FaGoogle className="text-[#EA4335] text-3xl" />;
      case "stripe":
        return <FaStripe className="text-[#635BFF] text-3xl" />;
      case "paypal":
        return <FaPaypal className="text-[#003087] text-3xl" />;
      case "salesforce":
        return <FaSalesforce className="text-[#00A1E0] text-3xl" />;
      case "sendgrid":
        return <FiMail className="text-[#1A82E2] text-3xl" />;
      case "ads":
        return <FiZap className="text-[#FABB05] text-3xl" />;
      case "webhook":
        return <FiGlobe className="text-[#10B981] text-3xl" />;
      default:
        return <FiCpu className="text-slate-600 text-3xl" />;
    }
  };

  const handleToggleConnection = (app: IntegrationAddon) => {
    const nextStatus = app.status === "connected" ? "disconnected" : "connected";
    const updated = integrations.map((item) =>
      item.id === app.id
        ? {
            ...item,
            status: nextStatus as any,
            lastSynced: nextStatus === "connected" ? "Just now" : item.lastSynced,
            authAccountName:
              nextStatus === "connected"
                ? item.authAccountName || "Authenticated Profile"
                : undefined,
          }
        : item
    );
    onUpdateIntegrations(updated);
    saveIntegrations(updated);
    toast.success(
      nextStatus === "connected"
        ? `${app.name} connected successfully!`
        : `${app.name} disconnected.`
    );
  };

  const handleToggleFeature = (appId: string, featureId: string) => {
    const updated = integrations.map((app) => {
      if (app.id !== appId) return app;
      return {
        ...app,
        features: app.features.map((f) =>
          f.id === featureId ? { ...f, enabled: !f.enabled } : f
        ),
      };
    });
    onUpdateIntegrations(updated);
    saveIntegrations(updated);
    toast.success("Permission updated");
  };

  const handleTopUpTokens = (appId: string) => {
    const updated = integrations.map((item) => {
      if (item.id === appId) {
        return {
          ...item,
          apiCallLimit: item.apiCallLimit + 25000,
          status: (item.status === "token_expired" ? "connected" : item.status) as any,
        };
      }
      return item;
    });
    onUpdateIntegrations(updated);
    saveIntegrations(updated);
    setTopUpModalApp(null);
    toast.success("+25,000 API Quota tokens added!");
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-6xl h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600">
              <FiLayers className="text-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Integration Add-ons Hub
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                  Enterprise Marketplace
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Connect external CRMs, marketing ad engines, communication channels, and webhooks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search platforms, APIs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 sm:w-64 pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Close modal"
            >
              <FiX className="text-lg" />
            </button>
          </div>
        </div>

        {/* Main Body with Sidebar + Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar Categories */}
          <div className="w-56 sm:w-64 border-r border-slate-200/80 bg-slate-50/70 p-3 space-y-1 overflow-y-auto shrink-0">
            <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Categories
            </p>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={isActive ? "text-blue-600" : "text-slate-400"} />
                    <span>{cat.label}</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? "bg-blue-50 text-blue-600" : "text-slate-400 bg-slate-200/60"
                    }`}
                  >
                    {cat.countLabel}
                  </span>
                </button>
              );
            })}

            {/* Quick Helper Badge */}
            <div className="mt-8 mx-1 p-3.5 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-indigo-50/50">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-xs">
                <FiZap className="text-sm" />
                <span>Enterprise SLA</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                All connected endpoints feature encrypted OAuth 2.0 tokens with automated rate-limiting guards.
              </p>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="flex-1 overflow-y-auto p-6 bg-white">
            {filteredIntegrations.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <FiSearch className="text-4xl text-slate-300 mb-3" />
                <h3 className="text-sm font-bold text-slate-800">No integrations found</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Try adjusting your search criteria or switch category filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {filteredIntegrations.map((app) => {
                  const percentUsed = Math.min(
                    100,
                    Math.round((app.apiCallsTotal / app.apiCallLimit) * 100)
                  );
                  const isExpiringSoon = percentUsed > 80;

                  return (
                    <div
                      key={app.id}
                      className="border border-slate-200/80 hover:border-slate-300 rounded-xl p-5 bg-white shadow-xs transition-all hover:shadow-md flex flex-col justify-between"
                    >
                      {/* Top App Header */}
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                              {getPlatformIcon(app.iconName)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-slate-900">{app.name}</h3>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                                {app.description}
                              </p>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="shrink-0">
                            {app.status === "connected" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Connected
                              </span>
                            )}
                            {app.status === "token_expired" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <FiAlertTriangle className="text-xs" />
                                Token Expired
                              </span>
                            )}
                            {app.status === "disconnected" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                Disconnected
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Account Name & Last Synced */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                          <div className="flex items-center gap-1.5">
                            <FiActivity className="text-slate-400" />
                            <span>
                              {app.authAccountName ? (
                                <strong className="text-slate-700 font-semibold">
                                  {app.authAccountName}
                                </strong>
                              ) : (
                                "No account connected"
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FiClock className="text-slate-400" />
                            <span>Synced: {app.lastSynced}</span>
                          </div>
                        </div>

                        {/* Traffic & API Call Telemetry Snippet */}
                        <div className="mt-3 bg-slate-50 rounded-lg p-2.5 border border-slate-150">
                          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-600 mb-1.5">
                            <span>Monthly API Quota Utilization</span>
                            <span className={isExpiringSoon ? "text-amber-600 font-bold" : "text-slate-700"}>
                              {app.apiCallsTotal.toLocaleString()} / {app.apiCallLimit.toLocaleString()} ({percentUsed}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                app.status === "token_expired"
                                  ? "bg-amber-500"
                                  : isExpiringSoon
                                  ? "bg-amber-500"
                                  : "bg-blue-600"
                              }`}
                              style={{ width: `${percentUsed}%` }}
                            />
                          </div>
                        </div>

                        {/* Platform Feature Permission Toggles */}
                        {app.features && app.features.length > 0 && (
                          <div className="mt-3.5 space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Platform Features & Permissions
                            </p>
                            <div className="space-y-1.5 bg-white rounded-lg border border-slate-100 p-2">
                              {app.features.map((feat) => (
                                <label
                                  key={feat.id}
                                  className="flex items-center justify-between cursor-pointer hover:bg-slate-50/70 p-1 rounded-md transition-colors"
                                >
                                  <div className="pr-3">
                                    <p className="text-xs font-semibold text-slate-800">
                                      {feat.label}
                                    </p>
                                    <p className="text-[10px] text-slate-400 leading-tight">
                                      {feat.description}
                                    </p>
                                  </div>
                                  <input
                                    type="checkbox"
                                    checked={feat.enabled}
                                    disabled={app.status === "disconnected"}
                                    onChange={() => handleToggleFeature(app.id, feat.id)}
                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-40"
                                  />
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Bottom Action Buttons */}
                      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedIntegration(app);
                              setIsConfiguring(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <FiSliders className="text-xs" />
                            Configure
                          </button>
                          <button
                            onClick={() => setTopUpModalApp(app)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
                            title="Top Up API Tokens"
                          >
                            <FiZap className="text-xs" />
                            Top Up
                          </button>
                        </div>

                        <button
                          onClick={() => handleToggleConnection(app)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                            app.status === "connected"
                              ? "text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100"
                              : app.status === "token_expired"
                              ? "text-amber-800 bg-amber-100 hover:bg-amber-200"
                              : "text-white bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          <FiPower className="text-xs" />
                          {app.status === "connected"
                            ? "Disconnect"
                            : app.status === "token_expired"
                            ? "Re-authenticate"
                            : "Connect Profile"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Top Up Modal Sub-overlay */}
        {topUpModalApp && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FiZap className="text-amber-500 text-lg" />
                  <h3 className="font-bold text-sm text-slate-900">
                    Rebuy & Top Up API Tokens
                  </h3>
                </div>
                <button
                  onClick={() => setTopUpModalApp(null)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <FiX />
                </button>
              </div>

              <div className="py-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  You are topping up API quota for{" "}
                  <strong className="text-slate-900">{topUpModalApp.name}</strong>.
                  Enterprise tier adds +25,000 monthly calls to prevent webhook drops or rate-limit throttles.
                </p>

                <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-amber-900">Standard Pack (+25k calls)</p>
                    <p className="text-[10px] text-amber-700">Immediate automated quota provision</p>
                  </div>
                  <span className="text-sm font-extrabold text-amber-900">$19 / mo</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setTopUpModalApp(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleTopUpTokens(topUpModalApp.id)}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Confirm & Provision Tokens
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Configuration Drawer/Modal */}
        {isConfiguring && selectedIntegration && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FiSliders className="text-blue-600 text-lg" />
                  <h3 className="font-bold text-sm text-slate-900">
                    Configure {selectedIntegration.name}
                  </h3>
                </div>
                <button
                  onClick={() => setIsConfiguring(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <FiX />
                </button>
              </div>

              <div className="py-4 space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                    Authenticated Account / Identifier
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedIntegration.authAccountName || "Primary Org Channel"}
                    className="mt-1.5 w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {selectedIntegration.webhookEndpoint && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                      Webhook Listener Target URL
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={selectedIntegration.webhookEndpoint}
                      className="mt-1.5 w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-600 font-mono"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                    Telemetry Ingestion Rate
                  </label>
                  <select className="mt-1.5 w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none">
                    <option>Real-time Webhook Streaming (0s latency)</option>
                    <option>5-minute Scheduled Polling batch</option>
                    <option>Hourly Aggregation</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setIsConfiguring(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsConfiguring(false);
                    toast.success("Endpoint configuration saved!");
                  }}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
