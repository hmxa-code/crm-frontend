'use client';

import React from 'react';
import { FiPaperclip, FiFile, FiDownload, FiFolder, FiLock, FiExternalLink } from 'react-icons/fi';
import Link from 'next/link';

export default function ResourcesPage() {
  const resources = [
    {
      id: 'res-1',
      name: 'HIPAA & Compliance Architecture Whitepaper.pdf',
      project: 'Wholcure CRM Enterprise',
      size: '4.2 MB',
      date: '2026-10-18',
      type: 'PDF Document',
    },
    {
      id: 'res-2',
      name: 'Comketra Workstation Token Specifications.json',
      project: 'Comketra Real-Time Workspace',
      size: '240 KB',
      date: '2026-10-25',
      type: 'JSON Schema',
    },
    {
      id: 'res-3',
      name: 'Merchant Settlement API Swagger Spec.yaml',
      project: 'NashPay Digital Wallet Gateway',
      size: '1.1 MB',
      date: '2026-10-04',
      type: 'OpenAPI Spec',
    },
    {
      id: 'res-4',
      name: 'Apex Omnichannel Segmentation Matrix.xlsx',
      project: 'Apex Omnichannel Marketing Cloud',
      size: '880 KB',
      date: '2026-10-29',
      type: 'Spreadsheet',
    },
  ];

  return (
    <div className="p-3 sm:p-5 lg:p-6 bg-slate-50/40 min-h-screen space-y-4 sm:space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            <FiPaperclip className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              Task Resources & Vault
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Encrypted project assets, API specifications, compliance contracts, and documentation vault
            </p>
          </div>
        </div>

        <Link
          href="/tasks/project-portfolio"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold hover:bg-slate-800 transition shadow-xs self-start sm:self-auto" style={{color:'white'}}
        >
          View Projects
        </Link>
      </div>

      {/* Resources Table Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[750px]">
            <thead className="border-b border-slate-200 bg-slate-50/70 font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 sm:px-5 py-3">Asset Name</th>
                <th className="px-4 sm:px-5 py-3">Associated Project</th>
                <th className="px-4 sm:px-5 py-3">Type</th>
                <th className="px-4 sm:px-5 py-3">File Size</th>
                <th className="px-4 sm:px-5 py-3">Last Uploaded</th>
                <th className="px-4 sm:px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {resources.map((res) => (
                <tr key={res.id} className="transition hover:bg-slate-50/60">
                  <td className="px-4 sm:px-5 py-3.5 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <FiFile className="text-slate-400 shrink-0" size={14} />
                      <span className="truncate max-w-[220px] sm:max-w-xs">{res.name}</span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-5 py-3.5">
                    <span className="rounded bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 border border-sky-100 whitespace-nowrap">
                      {res.project}
                    </span>
                  </td>
                  <td className="px-4 sm:px-5 py-3.5 text-slate-600 whitespace-nowrap">{res.type}</td>
                  <td className="px-4 sm:px-5 py-3.5 font-mono text-slate-600 whitespace-nowrap">{res.size}</td>
                  <td className="px-4 sm:px-5 py-3.5 font-mono text-slate-500 whitespace-nowrap">{res.date}</td>
                  <td className="px-4 sm:px-5 py-3.5 text-right">
                    <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap shadow-xs">
                      <FiDownload size={11} /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}