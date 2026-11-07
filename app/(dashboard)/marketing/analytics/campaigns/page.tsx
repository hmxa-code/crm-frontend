'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { FaDownload } from 'react-icons/fa'
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md'
import Link from 'next/link'
import { CampaignsService, Campaign } from '@/src/services/marketing/CampaignsService'
import ExcelJS from 'exceljs'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function CampaignAnalyticsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCampaigns() {
      setLoading(true)
      try {
        const data = await CampaignsService.getAllCampaigns()
        setCampaigns(data)
      } catch (error) {
        console.error('Error loading campaign analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCampaigns()
  }, [])

  const averageOpenRate = useMemo(() => {
    if (!campaigns.length) return 0
    return Number((campaigns.reduce((sum, campaign) => sum + (campaign.open_rate ?? 0), 0) / campaigns.length).toFixed(1))
  }, [campaigns])

  const averageClickRate = useMemo(() => {
    if (!campaigns.length) return 0
    return Number((campaigns.reduce((sum, campaign) => sum + (campaign.click_rate ?? 0), 0) / campaigns.length).toFixed(1))
  }, [campaigns])

  const averageConversionRate = useMemo(() => {
    if (!campaigns.length) return 0
    return Number(
      (
        campaigns.reduce(
          (sum, campaign) => sum + (campaign.conversion_rate ?? campaign.conversation_rate ?? 0),
          0,
        ) / campaigns.length
      ).toFixed(1),
    )
  }, [campaigns])

  const totalRecipients = useMemo(
    () => campaigns.reduce((sum, campaign) => sum + (campaign.recipient_count ?? 0), 0),
    [campaigns],
  )

  const totalBudget = useMemo(
    () => campaigns.reduce((sum, campaign) => sum + (campaign.budget ?? 0), 0),
    [campaigns],
  )

  const campaignRows = useMemo(
    () =>
      campaigns.map((campaign) => ({
        name: campaign.campaign_name,
        type: campaign.campaign_type,
        recipients: campaign.recipient_count ?? 0,
        openRate: campaign.open_rate ?? 0,
        clickRate: campaign.click_rate ?? 0,
        conversionRate: campaign.conversion_rate ?? campaign.conversation_rate ?? 0,
      })),
    [campaigns],
  )

  const exportXlsx = async () => {
    const workbook = new ExcelJS.Workbook()
    const ws = workbook.addWorksheet('Campaign Analytics')

    ws.columns = [
      { header: 'Campaign', key: 'name', width: 32 },
      { header: 'Type', key: 'type', width: 16 },
      { header: 'Recipients', key: 'recipients', width: 14 },
      { header: 'Open Rate', key: 'openRate', width: 12 },
      { header: 'Click Rate', key: 'clickRate', width: 12 },
      { header: 'Conversion Rate', key: 'conversionRate', width: 16 },
    ]

    campaignRows.forEach((row) => {
      ws.addRow({
        name: row.name,
        type: row.type,
        recipients: row.recipients,
        openRate: `${row.openRate}%`,
        clickRate: `${row.clickRate}%`,
        conversionRate: `${row.conversionRate}%`,
      })
    })

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `campaign_analytics_${new Date().toISOString().slice(0, 10)}.xlsx`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const exportPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'letter' })
    doc.setFontSize(16)
    doc.text('Campaign Analytics Report', 40, 40)
    doc.setFontSize(10)
    doc.text(
      `Campaigns: ${campaigns.length} · Recipients: ${totalRecipients.toLocaleString()} · Avg Open Rate: ${averageOpenRate}% · Avg Click Rate: ${averageClickRate}% · Avg Conversion Rate: ${averageConversionRate}%`,
      40,
      60,
    )

    autoTable(doc, {
      head: [[
        'Campaign',
        'Type',
        'Recipients',
        'Open Rate',
        'Click Rate',
        'Conversion Rate',
      ]],
      body: campaignRows.map((row) => [
        row.name,
        row.type,
        row.recipients,
        `${row.openRate}%`,
        `${row.clickRate}%`,
        `${row.conversionRate}%`,
      ]),
      startY: 80,
      theme: 'grid',
      headStyles: { fillColor: [241, 245, 249], textColor: [51, 65, 85] },
      styles: { fontSize: 9, cellPadding: 6 },
    })

    doc.save(`campaign_analytics_${new Date().toISOString().slice(0, 10)}.pdf`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <Link href="/marketing/analytics" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <MdOutlineKeyboardArrowLeft size={20} />
          Back to Analytics
        </Link>

        <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Campaign Analytics</h1>
            <p className="text-slate-600">Detailed performance metrics for all campaigns.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportXlsx}
              disabled={loading || campaigns.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaDownload size={20} />
              Export XLSX
            </button>
            <button
              onClick={exportPdf}
              disabled={loading || campaigns.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaDownload size={20} />
              Export PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Campaign Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Campaign</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Type</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Recipients</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Open Rate</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Click Rate</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Conversion Rate</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">Loading campaign analytics…</td>
                  </tr>
                ) : campaigns.length > 0 ? (
                  campaigns.map((campaign) => (
                    <tr key={campaign._id ?? campaign.campaign_name} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-900">{campaign.campaign_name}</td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {campaign.campaign_type}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-600">{(campaign.recipient_count ?? 0).toLocaleString()}</td>
                      <td className="py-4 px-6 text-slate-900 font-medium">{campaign.open_rate ?? 0}%</td>
                      <td className="py-4 px-6 text-slate-900 font-medium">{campaign.click_rate ?? 0}%</td>
                      <td className="py-4 px-6 text-slate-900 font-medium">{campaign.conversion_rate ?? campaign.conversation_rate ?? 0}%</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">No campaign analytics available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Email Performance Trends</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { metric: 'Avg. Open Rate', value: `${averageOpenRate}%`, subtitle: `${campaigns.length} campaigns` },
              { metric: 'Avg. Click Rate', value: `${averageClickRate}%`, subtitle: `${campaigns.length} campaigns` },
              { metric: 'Avg. Conversion Rate', value: `${averageConversionRate}%`, subtitle: `${campaigns.length} campaigns` },
              { metric: 'Total Recipients', value: totalRecipients.toLocaleString(), subtitle: `Budget $${totalBudget.toLocaleString()}` },
            ].map((item) => (
              <div key={item.metric} className="p-4 border border-slate-200 rounded-lg">
                <p className="text-sm text-slate-600 mb-2">{item.metric}</p>
                <p className="text-2xl font-bold text-slate-900 mb-1">{item.value}</p>
                <p className="text-sm text-slate-500">{item.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
