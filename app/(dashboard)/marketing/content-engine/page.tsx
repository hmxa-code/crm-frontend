'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiList, 
  FiCalendar, 
  FiPieChart, 
  FiRotateCcw, 
} from 'react-icons/fi';
import { ContentItem, CreateContentPayload } from '@/src/types/marketing/content-engine';
import { SocialAccount } from '@/src/types/marketing/social-account';
import { ContentEngineService } from '@/src/services/marketing/ContentEngineService';
import { SocialAccountsService } from '@/src/services/marketing/SocialAccountsService';
import { ContentTableView } from '@/src/components/ui/marketing/content-engine/views/ContentTableView';
import { ContentCalendarView } from '@/src/components/ui/marketing/content-engine/views/ContentCalendarView';
import { ContentAnalyticsView } from '@/src/components/ui/marketing/content-engine/views/ContentAnalyticsView';
import { CreateContentDrawer } from '@/src/components/ui/marketing/content-engine/modals/CreateContentDrawer';
import { ContentPreviewSheet } from '@/src/components/ui/marketing/content-engine/modals/ContentPreviewSheet';
import toast, { Toaster } from 'react-hot-toast';

export default function ContentEnginePage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'calendar' | 'analytics'>('table');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedItems, fetchedAccounts] = await Promise.all([
        ContentEngineService.getAllContent(),
        SocialAccountsService.getConnectedAccounts(),
      ]);
      setItems(fetchedItems || []);
      setAccounts(fetchedAccounts || []);
    } catch {
      toast.error('Failed to load content engine data.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (payload: CreateContentPayload) => {
    const created = await ContentEngineService.createContent(payload);
    setItems((prev) => [created, ...prev]);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Permanently delete this content dispatch?')) {
      await ContentEngineService.deleteContent(id);
      setItems((prev) => prev.filter((i) => i._id !== id));
      toast.success('Content item removed.');
    }
  };

  const handlePublishNow = async (id: string) => {
    const published = await ContentEngineService.publishNow(id);
    if (published) {
      setItems((prev) => prev.map((i) => (i._id === id ? published : i)));
      toast.success('Post marked as Published & dispatched!');
    }
  };

  const handleDuplicate = async (id: string) => {
    const duplicated = await ContentEngineService.duplicateContent(id);
    if (duplicated) {
      setItems((prev) => [duplicated, ...prev]);
      toast.success('Draft duplicate created!');
    }
  };

  const handleResetBaseline = async () => {
    if (confirm('Reset content engine queue to pristine baseline?')) {
      const baseline = await ContentEngineService.resetToDefaultContent();
      setItems(baseline);
      toast.success('Content repository restored to baseline.');
    }
  };

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen p-4 sm:p-6 lg:p-8 text-slate-900 font-sans antialiased">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Executive Header Ribbon */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Content Engine
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Multi-channel post authoring, schedule timeline visualization, and cross-platform feed telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Pill Switcher */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <FiList size={13} />
                <span>Table</span>
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'calendar'
                    ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <FiCalendar size={13} />
                <span>Calendar</span>
              </button>
              <button
                onClick={() => setViewMode('analytics')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'analytics'
                    ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <FiPieChart size={13} />
                <span>Telemetry</span>
              </button>
            </div>

            <button
              onClick={handleResetBaseline}
              title="Reset content to initial seed"
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors cursor-pointer"
            >
              <FiRotateCcw size={14} />
            </button>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <FiPlus size={14} />
              <span>Compose Post</span>
            </button>
          </div>
        </div>

        {/* View Switch */}
        {viewMode === 'table' && (
          <ContentTableView 
            items={items} 
            onView={setSelectedItem} 
            onDelete={handleDelete}
            onPublishNow={handlePublishNow}
            onDuplicate={handleDuplicate}
          />
        )}

        {viewMode === 'calendar' && (
          <ContentCalendarView 
            items={items} 
            onView={setSelectedItem} 
            onNewPostClick={() => setIsDrawerOpen(true)}
          />
        )}

        {viewMode === 'analytics' && (
          <ContentAnalyticsView 
            items={items} 
            onViewItem={setSelectedItem}
          />
        )}

        {/* Modals & Drawers */}
        <CreateContentDrawer 
          isOpen={isDrawerOpen} 
          accounts={accounts} 
          onClose={() => setIsDrawerOpen(false)} 
          onSubmit={handleCreate} 
        />

        <ContentPreviewSheet 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
          onPublishNow={handlePublishNow}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
