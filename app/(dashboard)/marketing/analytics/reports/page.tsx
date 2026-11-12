'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { FaDownload } from 'react-icons/fa'
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md'
import { IoFilter } from 'react-icons/io5'
import { CampaignsService, Campaign } from '@/src/services/marketing/CampaignsService'
import ExcelJS from 'exceljs'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

type ReportType = 'summary' | 'detailed' | 'roi' | 'leadScore'

export default function CustomReportsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [reportType, setReportType] = useState<ReportType>('summary')
  const [dateRange, setDateRange] = useState('Last 30 days')
  const [selectedCampaign, setSelectedCampaign] = useState('all')
  const [loading, setLoading] = useState(true)
  const [generatedReport, setGeneratedReport] = useState<{
    name: string
    created: string
    status: string
  } | null>(null)

  type ReportRow = {
    name: string
    sent: number
    openRate: number
    clickRate: number
    conversionRate: number
    budget: number
  }

  useEffect(() => {
    async function loadCampaigns() {
      setLoading(true)
      try {
        const data = await CampaignsService.getAllCampaigns()
        setCampaigns(data)
      } catch (error) {
        console.error('Error loading campaigns for reports:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCampaigns()
  }, [])

  const reportTypeLabels = useMemo(
    (): Record<ReportType, string> => ({
      summary: 'Campaign Summary',
      detailed: 'Detailed Analytics',
      roi: 'ROI Analysis',
      leadScore: 'Lead Scoring Report',
    }),
    [],
  )

  const getRangeStart = (range: string) => {
    const now = Date.now()
    switch (range) {
      case 'Last 7 days':
        return now - 7 * 24 * 60 * 60 * 1000
      case 'Last 30 days':
        return now - 30 * 24 * 60 * 60 * 1000
      case 'Last 90 days':
        return now - 90 * 24 * 60 * 60 * 1000
      case 'This month': {
        const date = new Date()
        date.setDate(1)
        date.setHours(0, 0, 0, 0)
        return date.getTime()
      }
      case 'This year': {
        const date = new Date()
        date.setMonth(0, 0)
        date.setHours(0, 0, 0, 0)
        return date.getTime()
      }
      default:
        return now - 30 * 24 * 60 * 60 * 1000
    }
  }

  const selectedCampaignData = useMemo(() => {
    if (selectedCampaign === 'all') return null
    return campaigns.find((campaign) => campaign._id === selectedCampaign) ?? null
  }, [campaigns, selectedCampaign])

  const filteredCampaigns = useMemo(() => {
    if (selectedCampaign !== 'all') {
      return selectedCampaignData ? [selectedCampaignData] : []
    }

    const threshold = getRangeStart(dateRange)
    return campaigns.filter((campaign) => {
      const startTime = new Date(campaign.start_date).getTime()
      return Number.isFinite(startTime) && startTime >= threshold
    })
  }, [campaigns, selectedCampaign, selectedCampaignData, dateRange])

  const reportMetrics = useMemo(() => {
    const campaignSet = filteredCampaigns
    const totalCampaigns = campaignSet.length
    const totalRecipients = campaignSet.reduce((sum, campaign) => sum + (campaign.recipient_count ?? 0), 0)
    const avgOpenRate = totalCampaigns
      ? Number((campaignSet.reduce((sum, campaign) => sum + (campaign.open_rate ?? 0), 0) / totalCampaigns).toFixed(1))
      : 0
    const avgClickRate = totalCampaigns
      ? Number((campaignSet.reduce((sum, campaign) => sum + (campaign.click_rate ?? 0), 0) / totalCampaigns).toFixed(1))
      : 0
    const avgConversionRate = totalCampaigns
      ? Number(
          (
            campaignSet.reduce(
              (sum, campaign) => sum + (campaign.conversion_rate ?? campaign.conversation_rate ?? 0),
              0,
            ) / totalCampaigns
          ).toFixed(1),
        )
      : 0
    const totalBudget = campaignSet.reduce((sum, campaign) => sum + (campaign.budget ?? 0), 0)

    return { totalCampaigns, totalRecipients, avgOpenRate, avgClickRate, avgConversionRate, totalBudget }
  }, [filteredCampaigns])

  const selectedLabel = useMemo(
    () => (selectedCampaign === 'all' ? 'All Campaigns' : selectedCampaignData?.campaign_name ?? 'All Campaigns'),
    [selectedCampaign, selectedCampaignData],
  )

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${month}/${day}/${year}`
  }

  const reportTitle = `${reportTypeLabels[reportType]} - ${selectedLabel} (${dateRange})`

  const reportPreview = useMemo(() => {
    const reportRows = filteredCampaigns.map((campaign) => ({
      name: campaign.campaign_name,
      sent: campaign.recipient_count ?? 0,
      openRate: campaign.open_rate ?? 0,
      clickRate: campaign.click_rate ?? 0,
      conversionRate: campaign.conversion_rate ?? campaign.conversation_rate ?? 0,
      budget: campaign.budget ?? 0,
    }))

    if (reportType === 'summary') {
      return {
        header: reportTitle,
        description: `Summary for ${selectedLabel} over ${dateRange}. Showing ${reportMetrics.totalCampaigns} ${reportMetrics.totalCampaigns === 1 ? 'campaign' : 'campaigns'} with ${reportMetrics.totalRecipients.toLocaleString()} recipients and an average open rate of ${reportMetrics.avgOpenRate}%.`,
        rows: reportRows.slice(0, 4),
      }
    }

    if (reportType === 'detailed') {
      return {
        header: reportTitle,
        description: `Detailed campaign analytics for ${selectedLabel} during ${dateRange}.`,
        rows: reportRows,
      }
    }

    if (reportType === 'roi') {
      const estimatedRevenue = Math.round(reportMetrics.totalRecipients * (reportMetrics.avgConversionRate / 100) * 10)
      return {
        header: reportTitle,
        description: `ROI report for ${selectedLabel}: total budget $${reportMetrics.totalBudget.toLocaleString()} and estimated revenue $${estimatedRevenue.toLocaleString()}.`,
        rows: reportRows.slice(0, 4),
      }
    }

    return {
      header: reportTitle,
      description: `Lead scoring summary for ${selectedLabel} over ${dateRange}.`,
      rows: reportRows.sort((a, b) => b.conversionRate - a.conversionRate).slice(0, 5),
    }
  }, [reportType, reportTitle, selectedLabel, dateRange, filteredCampaigns, reportMetrics])

  const generatedReports = useMemo(() => (generatedReport ? [generatedReport] : []), [generatedReport])

  const handleGenerateReport = () => {
    const reportName = `${reportTypeLabels[reportType]} - ${selectedLabel} (${dateRange})`
    setGeneratedReport({ name: reportName, created: formatDate(new Date()), status: filteredCampaigns.length ? 'Ready' : 'No Data' })
  }

  const downloadXlsx = async () => {
    const workbook = new ExcelJS.Workbook()
    const ws = workbook.addWorksheet('Custom Report')

    ws.columns = [
      { header: 'Campaign', key: 'campaign', width: 32 },
      { header: 'Sent', key: 'sent', width: 12 },
      { header: 'Open Rate', key: 'openRate', width: 12 },
      { header: 'Click Rate', key: 'clickRate', width: 12 },
      { header: 'Conversion Rate', key: 'conversionRate', width: 16 },
      { header: 'Budget', key: 'budget', width: 14 },
    ]

    reportPreview.rows.forEach((row) => {
      ws.addRow({
        campaign: row.name,
        sent: row.sent,
        openRate: `${row.openRate}%`,
        clickRate: `${row.clickRate}%`,
        conversionRate: `${row.conversionRate}%`,
        budget: `$${row.budget.toFixed(2)}`,
      })
    })

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${reportTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.xlsx`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const downloadPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'letter' })
    doc.setFontSize(14)
    doc.text(reportPreview.header, 40, 40)
    doc.setFontSize(10)
    const descriptionLines = doc.splitTextToSize(reportPreview.description, 520)
    doc.text(descriptionLines, 40, 60)

    autoTable(doc, {
      head: [[
        'Campaign',
        'Sent',
        'Open Rate',
        'Click Rate',
        'Conversion Rate',
        'Budget',
      ]],
      body: reportPreview.rows.map((row) => [
        row.name,
        row.sent,
        `${row.openRate}%`,
        `${row.clickRate}%`,
        `${row.conversionRate}%`,
        `$${row.budget.toFixed(2)}`,
      ]),
      startY: 90,
      theme: 'grid',
      headStyles: { fillColor: [241, 245, 249], textColor: [51, 65, 85] },
      styles: { fontSize: 9, cellPadding: 6 },
    })

    doc.save(`${reportTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`)
  }

  const campaignOptions = useMemo(
    () => [{ _id: 'all', campaign_name: 'All Campaigns', campaign_type: 'Email', status: 'Draft', start_date: Date.now(), target_audience: '', target_count: 0, recipient_count: 0, open_rate: 0, click_rate: 0, created_by: '' }, ...campaigns],
    [campaigns],
  )

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Link href="/marketing/analytics" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold">
          <MdOutlineKeyboardArrowLeft size={20} />
          Back to Analytics
        </Link>

        <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Marketing Reports</p>
              <h1 className="mt-3 text-3xl font-bold text-slate-900">Build custom marketing reports quickly</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Choose the campaign set, time period, and report type to preview and export results with a single click.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                onClick={handleGenerateReport}
                className="inline-flex items-center justify-center gap-2 rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
              >
                <IoFilter size={18} />
                Generate
              </button>
              <button
                onClick={downloadXlsx}
                className="inline-flex items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition"
              >
                <FaDownload size={18} />
                XLSX
              </button>
              <button
                onClick={downloadPdf}
                className="inline-flex items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition"
              >
                <FaDownload size={18} />
                PDF
              </button>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.65fr_0.95fr]">
          <div className="space-y-6">
            <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 mb-5">Report Builder</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">Report Type</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as ReportType)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="summary">Campaign Summary</option>
                    <option value="detailed">Detailed Analytics</option>
                    <option value="roi">ROI Analysis</option>
                    <option value="leadScore">Lead Scoring Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">Date Range</label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                    <option>This month</option>
                    <option>This year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">Campaign</label>
                  <select
                    value={selectedCampaign}
                    onChange={(e) => setSelectedCampaign(e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    {campaignOptions.map((campaign) => (
                      <option key={campaign._id ?? 'all'} value={campaign._id ?? 'all'}>
                        {campaign.campaign_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Detailed Report Preview</h2>
                  <p className="mt-2 text-sm text-slate-500">Preview the current report before exporting it.</p>
                </div>
                <div className="rounded-3xl bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                  {reportMetrics.totalCampaigns} campaigns selected
                </div>
              </div>

              {loading ? (
                <div className="py-12 text-center text-slate-500">Preparing preview…</div>
              ) : campaigns.length === 0 ? (
                <div className="py-12 text-center text-slate-500">No campaign data to preview.</div>
              ) : (
                <div className="mt-6 space-y-5">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">{reportPreview.header}</p>
                    <p className="mt-2 text-sm text-slate-600">{reportPreview.description}</p>
                  </div>

                  <div className="overflow-x-auto rounded-3xl border border-slate-200">
                    <table className="w-full min-w-180 text-left border-separate border-spacing-0">
                      <thead>
                        <tr className="bg-slate-100 text-sm uppercase tracking-[0.2em] text-slate-600">
                          <th className="px-5 py-4">Campaign</th>
                          <th className="px-5 py-4">Sent</th>
                          <th className="px-5 py-4">Open Rate</th>
                          <th className="px-5 py-4">Click Rate</th>
                          <th className="px-5 py-4">Conversion</th>
                          <th className="px-5 py-4">Budget</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportPreview.rows.length > 0 ? (
                          reportPreview.rows.map((row) => (
                            <tr key={row.name} className="border-b border-slate-200 transition hover:bg-slate-50">
                              <td className="px-5 py-4 font-semibold text-slate-900">{row.name}</td>
                              <td className="px-5 py-4 text-slate-600">{row.sent.toLocaleString()}</td>
                              <td className="px-5 py-4 font-semibold text-slate-900">{row.openRate}%</td>
                              <td className="px-5 py-4 font-semibold text-slate-900">{row.clickRate}%</td>
                              <td className="px-5 py-4 font-semibold text-slate-900">{row.conversionRate}%</td>
                              <td className="px-5 py-4 font-semibold text-slate-900">${row.budget.toLocaleString()}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-slate-500">No data available for the selected filter.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 mb-5">Report Summary</h2>
              {loading ? (
                <div className="py-12 text-center text-slate-500">Loading report summary…</div>
              ) : campaigns.length === 0 ? (
                <div className="py-12 text-center text-slate-500">No campaign data available yet.</div>
              ) : (
                <div className="grid gap-4">
                  {[
                    { label: 'Selected Campaign', value: selectedLabel },
                    { label: 'Campaigns Included', value: `${reportMetrics.totalCampaigns}` },
                    { label: 'Total Recipients', value: reportMetrics.totalRecipients.toLocaleString() },
                    { label: 'Avg. Open Rate', value: `${reportMetrics.avgOpenRate}%` },
                  ].map((item) => (
                    <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">{item.label}</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{item.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Recent Reports</h2>
                  <p className="text-sm text-slate-500">Keep track of the latest exports.</p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{generatedReports.length} saved</span>
              </div>
              {generatedReports.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                  No reports generated yet. Use the report builder to create one.
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedReports.map((report) => (
                    <div key={report.name} className="rounded-3xl border border-slate-200 p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{report.name}</p>
                          <p className="text-sm text-slate-500">Created {report.created}</p>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                          {report.status}
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          onClick={downloadXlsx}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition"
                        >
                          <FaDownload size={16} />
                          Download XLSX
                        </button>
                        <button
                          onClick={downloadPdf}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition"
                        >
                          <FaDownload size={16} />
                          Download PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}