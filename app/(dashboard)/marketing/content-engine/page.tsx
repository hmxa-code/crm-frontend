'use client'

import React, { useState, useEffect } from 'react'
import { FiPlus, FiList, FiCalendar, FiPieChart } from 'react-icons/fi'
import { ContentItem, CreateContentPayload } from '@/src/types/marketing/content-engine'
import { SocialAccount } from '@/src/types/marketing/social-account'
import { ContentEngineService } from '@/src/services/marketing/ContentEngineService'
import { SocialAccountsService } from '@/src/services/marketing/SocialAccountsService'
import { ContentTableView } from '@/src/components/marketing/content-engine/views/ContentTableView'
import { ContentCalendarView } from '@/src/components/marketing/content-engine/views/ContentCalendarView'
import { ContentAnalyticsView } from '@/src/components/marketing/content-engine/views/ContentAnalyticsView'
import { CreateContentDrawer } from '@/src/components/marketing/content-engine/modals/CreateContentDrawer'
import { ContentPreviewSheet } from '@/src/components/marketing/content-engine/modals/ContentPreviewSheet'
import toast, { Toaster } from 'react-hot-toast'

export default function ContentEnginePage() {
  const [items, setItems] = useState<ContentItem[]>([])
  const [accounts, setAccounts] = useState<SocialAccount[]>([])
  const [viewMode, setViewMode] = useState<'table' | 'calendar' | 'analytics'>('table')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [fetchedItems, fetchedAccounts] = await Promise.all([
      ContentEngineService.getAllContent(),
      SocialAccountsService.getConnectedAccounts(),
    ])
    setItems(fetchedItems || [])
    setAccounts(fetchedAccounts || [])
  }

  const handleCreate = async (payload: CreateContentPayload) => {
    const created = await ContentEngineService.createContent(payload)
    setItems((prev) => [created, ...prev])
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await ContentEngineService.deleteContent(id)
      setItems((prev) => prev.filter((i) => i._id !== id))
      toast.success('Content item removed.')
    }
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-900 font-sans space-y-5 max-w-7xl mx-auto">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Content Engine Hub</h1>
          <p className="text-xs text-slate-500">Multi-channel post scheduling and live feed previews.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-200/80 p-1 rounded-xl flex gap-1 text-xs font-bold">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
            >
              <FiList className="inline mr-1" /> Table
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg ${viewMode === 'calendar' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
            >
              <FiCalendar className="inline mr-1" /> Calendar
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`px-3 py-1.5 rounded-lg ${viewMode === 'analytics' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
            >
              <FiPieChart className="inline mr-1" /> Telemetry
            </button>
          </div>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 shadow-sm"
          >
            <FiPlus /> New Content Post
          </button>
        </div>
      </div>

      {/* View Switch */}
      {viewMode === 'table' && <ContentTableView items={items} onView={setSelectedItem} onDelete={handleDelete} />}
      {viewMode === 'calendar' && <ContentCalendarView items={items} onView={setSelectedItem} />}
      {viewMode === 'analytics' && <ContentAnalyticsView items={items} />}

      {/* Modals */}
      <CreateContentDrawer isOpen={isDrawerOpen} accounts={accounts} onClose={() => setIsDrawerOpen(false)} onSubmit={handleCreate} />
      <ContentPreviewSheet item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  )
}