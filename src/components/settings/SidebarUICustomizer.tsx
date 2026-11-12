"use client";

import React, { useState } from "react";
import { FiLayout, FiEye, FiCheck, FiSliders } from "react-icons/fi";
import { CRMSettings } from "@/src/utils/crmSettings";

interface SidebarUICustomizerProps {
  settings: CRMSettings;
  onUpdate: (field: keyof CRMSettings, value: any) => void;
}

const colorFields = [
  { field: "primaryColor", label: "Active & Brand Color", help: "Selected navigation item and sidebar accents.", fallback: "#111827" },
  { field: "sidebarBg", label: "Sidebar Background", help: "Main navigation panel background.", fallback: "#FFFFFF" },
  { field: "sidebarText", label: "Text & Icon Color", help: "Default menu labels and icons.", fallback: "#1E293B" },
  { field: "cardBorder", label: "Borders & Dividers", help: "Sidebar outlines and separators.", fallback: "#E2E8F0" },
] as const;

type ColorField = typeof colorFields[number]["field"];

export function SidebarUICustomizer({ settings, onUpdate }: SidebarUICustomizerProps) {
  const [previewActiveTab, setPreviewActiveTab] = useState("Deals");
  const bg = settings.sidebarBg || "#FFFFFF";
  const text = settings.sidebarText || "#1E293B";
  const border = settings.cardBorder || "#E2E8F0";
  const primary = settings.primaryColor || "#111827";
  const activeStyle = settings.sidebarActiveStyle || "filled";
  const radius = settings.sidebarCornerRadius === "sharp" ? "rounded-none" : settings.sidebarCornerRadius === "full" ? "rounded-full" : "rounded-lg";

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white"><FiLayout /></span>
          <div><h2 className="text-base font-bold text-slate-900">Sidebar Appearance & Layout</h2><p className="text-xs text-slate-500">Customize each navigation color independently.</p></div>
        </div>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">Live Preview</span>
      </header>

      <div className="grid grid-cols-1 gap-6 p-4 sm:gap-8 sm:p-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <section>
            <div className="mb-3 flex items-center justify-between"><h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600"><FiSliders /> Sidebar Brand Colors</h3><span className="text-[11px] text-slate-400">Custom HEX / picker</span></div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {colorFields.map((item) => {
                const value = (settings[item.field] as string) || item.fallback;
                const valid = /^#[0-9a-fA-F]{6}$/.test(value);
                return <div key={item.field} className="rounded-xl border border-slate-200 p-4">
                  <div className="mb-2 flex items-center justify-between"><label htmlFor={`crm-${item.field}`} className="text-xs font-bold text-slate-800">{item.label}</label><span className="h-6 w-6 rounded-md border border-black/10" style={{backgroundColor: valid ? value : item.fallback}} /></div>
                  <p className="mb-3 min-h-8 text-[11px] text-slate-500">{item.help}</p>
                  <div className="flex items-center gap-2">
                    <input id={`crm-${item.field}`} type="color" value={valid ? value : item.fallback} onChange={e => onUpdate(item.field as ColorField, e.target.value)} className="h-10 w-11 cursor-pointer rounded-lg border border-slate-200 bg-white p-1" />
                    <input type="text" value={value} maxLength={7} spellCheck={false} onChange={e => onUpdate(item.field as ColorField, e.target.value)} onBlur={e => { if (!/^#[0-9a-fA-F]{6}$/.test(e.target.value.trim())) onUpdate(item.field as ColorField, item.fallback); }} className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 px-3 font-mono text-xs uppercase text-slate-700 outline-none focus:border-slate-500" />
                  </div>
                </div>;
              })}
            </div>
            <p className="mt-3 text-[11px] text-slate-400">The factory default uses a professional charcoal active color, not bright blue.</p>
          </section>

          <section className="border-t border-slate-100 pt-5">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-600">Active Menu Appearance</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[{id:"filled",label:"Solid Fill",desc:"Full background"},{id:"border_left",label:"Side Indicator",desc:"Left accent line"},{id:"pill",label:"Soft Outline",desc:"Subtle outline"},{id:"subtle",label:"Minimal Tint",desc:"Quiet highlight"}].map(x => <button type="button" key={x.id} onClick={() => onUpdate("sidebarActiveStyle", x.id)} className={`rounded-xl border p-3 text-left ${activeStyle===x.id?"border-slate-700 bg-slate-50 ring-1 ring-slate-300":"border-slate-200 hover:bg-slate-50"}`}><span className="flex items-center justify-between text-xs font-bold text-slate-800">{x.label}{activeStyle===x.id&&<FiCheck className="text-emerald-600"/>}</span><span className="mt-1 block text-[10px] text-slate-500">{x.desc}</span></button>)}
            </div>
          </section>

          <section className="grid grid-cols-1 gap-5 border-t border-slate-100 pt-5 md:grid-cols-2">
            <div><h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-600">Item Corner Radius</h3><div className="grid grid-cols-3 gap-2">{[{id:"sharp",label:"Sharp"},{id:"rounded",label:"Rounded"},{id:"full",label:"Pill"}].map(x=><button type="button" key={x.id} onClick={()=>onUpdate("sidebarCornerRadius",x.id)} className={`border px-2 py-2 text-xs font-semibold ${settings.sidebarCornerRadius===x.id?"border-slate-700 bg-slate-50":"border-slate-200"} ${x.id==="sharp"?"rounded-none":x.id==="full"?"rounded-full":"rounded-xl"}`}>{x.label}</button>)}</div></div>
            <div><h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-600">Spacing & Density</h3><div className="grid grid-cols-3 gap-2">{["compact","comfortable","spacious"].map(x=><button type="button" key={x} onClick={()=>onUpdate("sidebarDensity",x)} className={`rounded-xl border px-2 py-2 text-xs font-semibold capitalize ${settings.sidebarDensity===x?"border-slate-700 bg-slate-50":"border-slate-200"}`}>{x}</button>)}</div></div>
          </section>

          <section className="border-t border-slate-100 pt-5"><h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-600">Navigation Features</h3><div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[{field:"sidebarShowGroupTitles",title:"Category Group Headers"},{field:"sidebarShowStatusPulse",title:"Live Status Indicator"},{field:"sidebarShowBadges",title:"Menu Notification Badges"},{field:"sidebarShowQuickStats",title:"Footer Schedule Card"}].map(x=><label key={x.field} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-xs font-semibold text-slate-700"><span>{x.title}</span><input type="checkbox" checked={Boolean(settings[x.field as keyof CRMSettings])} onChange={e=>onUpdate(x.field as keyof CRMSettings,e.target.checked)} className="h-4 w-4 accent-slate-900"/></label>)}
          </div></section>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold text-slate-800"><FiEye/> Live Sidebar Preview</div>
          <div className="rounded-2xl border p-4 shadow-sm" style={{backgroundColor:bg,borderColor:border,color:text}}>
            <div className="flex items-center gap-2 border-b pb-3" style={{borderColor:border}}>
              {settings.logoUploadData||settings.logoUrl ? <img src={settings.logoUploadData||settings.logoUrl} alt="Workspace logo" className="h-7 max-w-28 object-contain"/> : <span className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white" style={{backgroundColor:primary}}>W</span>}
              <div className="min-w-0">{settings.showCompanyName&&<p className="truncate text-xs font-extrabold">{settings.companyName||"Workspace"}</p>}{settings.showTagline&&<p className="truncate text-[9px] opacity-60">{settings.crmPurposeText||settings.crmTagline}</p>}</div>
            </div>
            <div className="mt-4 space-y-2">{settings.sidebarShowGroupTitles&&<p className="px-1 text-[8px] font-bold uppercase tracking-widest opacity-50">Core Operations</p>}{["Dashboard","Deals","Marketing","Tasks"].map(label=>{const active=previewActiveTab===label; const bgActive=activeStyle==="filled"?primary:activeStyle==="border_left"?`${primary}10`:activeStyle==="pill"?`${primary}18`:`${primary}0D`;return <button type="button" key={label} onClick={()=>setPreviewActiveTab(label)} className={`flex w-full items-center rounded-lg px-2.5 py-2 text-left text-xs font-semibold ${radius}`} style={{backgroundColor:active?bgActive:"transparent",color:active&&activeStyle==="filled"?"#FFFFFF":active?primary:text,border:active&&activeStyle==="pill"?`1px solid ${primary}66`:"1px solid transparent",borderLeft:active&&activeStyle==="border_left"?`3px solid ${primary}`:undefined}}>{label}</button>})}</div>
            {settings.sidebarShowQuickStats&&<div className="mt-4 rounded-xl border p-2.5 text-[10px]" style={{borderColor:border,backgroundColor:`${primary}08`}}>Schedule Focus <strong className="float-right" style={{color:primary}}>3 Today</strong></div>}
          </div>
          <p className="mt-4 text-center text-[11px] text-slate-400">Preview updates as soon as you change a setting.</p>
        </aside>
      </div>
    </section>
  );
}
