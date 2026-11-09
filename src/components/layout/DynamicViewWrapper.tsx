'use client';

import React, { useRef } from 'react';
import { useViewMode, ColumnKey, ALL_COLUMNS } from '@/src/context/ViewModeContext';
import MarketingView from '@/src/components/ui/marketing/MarketingView';
import CalendarView from '@/src/components/ui/calendar/CalendarView';
import SalesView from '@/src/components/ui/sales/SalesView';
import TasksView from '@/src/components/ui/tasks/TasksView';
import ChatWorkspaceView from '@/src/components/ui/chat/ChatWorkspaceView';
import { 
  FiColumns, 
  FiCheck, 
  FiEyeOff, 
  FiArrowLeft, 
  FiCalendar, 
  FiZap, 
  FiCheckSquare, 
  FiMessageSquare, 
  FiTrendingUp,
  FiSliders
} from 'react-icons/fi';
import { BsFillMegaphoneFill } from 'react-icons/bs';
import { LuPin } from 'react-icons/lu';

interface DynamicViewWrapperProps {
  children: React.ReactNode;
  currentRouteKey: string;
}

interface ColumnConfigItem {
  label: string;
  icon: React.ReactNode;
  component: React.ComponentType<Record<string, unknown>>;
}

// Maps legacy `/sales/*` or `/rengrowcure/*` route keys seamlessly
export const resolveRouteKey = (key: string): ColumnKey => {
  if (key === 'sales' || key === 'rengrowcure' || key.startsWith('rengrowcure')) {
    return 'sales';
  }
  if (key === 'opportunities' || key === 'venture-matrix') {
    return 'opportunities';
  }
  return (key as ColumnKey) || 'sales';
};

const COLUMN_CONFIG: Record<ColumnKey, ColumnConfigItem> = {
  marketing: {
    label: 'Marketing',
    icon: <BsFillMegaphoneFill size={15} className="text-amber-500" />,
    component: MarketingView as React.ComponentType<Record<string, unknown>>,
  },
  calendar: {
    label: 'Calendar',
    icon: <FiCalendar size={15} className="text-blue-500" />,
    component: CalendarView as React.ComponentType<Record<string, unknown>>,
  },
  sales: {
    label: 'RenGrowCure',
    icon: <FiZap size={15} className="text-emerald-500" />,
    component: SalesView as React.ComponentType<Record<string, unknown>>,
  },
  tasks: {
    label: 'Tasks',
    icon: <FiCheckSquare size={15} className="text-indigo-500" />,
    component: TasksView as React.ComponentType<Record<string, unknown>>,
  },
  chat: {
    label: 'Chat',
    icon: <FiMessageSquare size={15} className="text-purple-500" />,
    component: ChatWorkspaceView as React.ComponentType<Record<string, unknown>>,
  },
  opportunities: {
    label: 'Opportunities',
    icon: <FiTrendingUp size={15} className="text-cyan-500" />,
    component: SalesView as React.ComponentType<Record<string, unknown>>,
  },
};

export default function DynamicViewWrapper({
  children,
  currentRouteKey,
}: DynamicViewWrapperProps) {
  const { mode, activeColumns, toggleMode, toggleColumn } = useViewMode();
  const normalizedKey = resolveRouteKey(currentRouteKey);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Safe lookup with fallback type guard
  const activeRouteConfig = COLUMN_CONFIG[normalizedKey] || {
    label: 'RenGrowCure',
    icon: <LuPin size={16} className="text-slate-500" />,
    component: (() => null) as React.ComponentType<Record<string, unknown>>,
  };

  const scrollToColumn = (colKey: string) => {
    if (!scrollContainerRef.current) return;
    const colElement = document.getElementById(`col-card-${colKey}`);
    if (colElement) {
      colElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  if (mode === 'single') {
    return (
      <div className="flex flex-col w-full h-full space-y-3 sm:space-y-4">
        {/* Single View Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-semibold text-slate-800 capitalize flex items-center gap-2">
              <span className="flex items-center">{activeRouteConfig.icon}</span>
              <span>{activeRouteConfig.label} Workspace</span>
            </span>
            <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
              Single-Window
            </span>
          </div>

          <button
            type="button"
            onClick={() => toggleMode('multi')}
            className="flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
            title="Switch to Multi-Window View"
          >
            <FiColumns size={14} />
            <span>Switch to Multi-Window View</span>
          </button>
        </div>

        {/* Single View Content Container */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    );
  }

  // Multi-Window Mode
  return (
    <div className="flex flex-col w-full h-[calc(100vh-130px)] sm:h-[calc(100vh-120px)] space-y-3">
      {/* Multi-Window Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-white border border-slate-200/80 rounded-xl px-4 py-3 shadow-xs flex-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
            <FiColumns size={16} />
          </div>
          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate">
              Business Development & Commercial Multi-Window
            </h1>
            <p className="text-[10px] sm:text-[11px] text-slate-500">
              Comparative workspace • {activeColumns.length} active columns
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Column toggles */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-1 overflow-x-auto max-w-full">
            {ALL_COLUMNS.map((colKey) => {
              const isColActive = activeColumns.includes(colKey);
              const conf = COLUMN_CONFIG[colKey];
              if (!conf) return null;

              return (
                <button
                  key={colKey}
                  type="button"
                  onClick={() => toggleColumn(colKey)}
                  title={`${isColActive ? 'Hide' : 'Show'} ${conf.label}`}
                  className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded text-[10px] sm:text-[11px] font-semibold transition-all cursor-pointer shrink-0 ${
                    isColActive
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <span className="flex items-center">{conf.icon}</span>
                  <span className="hidden sm:inline">{conf.label}</span>
                  {isColActive ? (
                    <FiCheck size={11} className="text-emerald-500 ml-0.5" />
                  ) : (
                    <FiEyeOff size={11} className="ml-0.5 text-slate-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Switch back button */}
          <button
            type="button"
            onClick={() => toggleMode('single')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
            title="Switch back to Single View"
          >
            <FiArrowLeft size={13} />
            <span className="hidden sm:inline">Back to Single View</span>
            <span className="sm:hidden">Single View</span>
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Quick Column Focus Jump Bar */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto px-1 py-1 bg-white/80 border border-slate-200/80 rounded-xl flex-none scrollbar-none">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 shrink-0">
          Jump To:
        </span>
        {activeColumns.map((colKey) => {
          const conf = COLUMN_CONFIG[colKey];
          if (!conf) return null;
          return (
            <button
              key={colKey}
              type="button"
              onClick={() => scrollToColumn(colKey)}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 shrink-0 transition"
            >
              <span>{conf.icon}</span>
              <span>{conf.label}</span>
            </button>
          );
        })}
      </div>

      {/* Horizontal Scrollable Multi-Column Container with Mobile Touch Snap */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto overflow-y-hidden flex gap-3 sm:gap-4 p-2 sm:p-4 bg-slate-100/70 border border-slate-200/80 rounded-2xl scrollbar-thin snap-x snap-mandatory"
      >
        {activeColumns.map((colKey) => {
          const conf = COLUMN_CONFIG[colKey];
          if (!conf) return null;
          const ComponentToRender = conf.component;
          const isCurrentRoute = colKey === normalizedKey;

          return (
            <div
              id={`col-card-${colKey}`}
              key={colKey}
              className={`w-[86vw] sm:w-[380px] md:w-[420px] min-w-[280px] flex-shrink-0 h-full bg-white border rounded-xl shadow-xs flex flex-col overflow-hidden transition-all duration-200 snap-center ${
                isCurrentRoute
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {/* Column Header */}
              <div
                className={`flex items-center justify-between px-3.5 py-2.5 border-b flex-none transition-colors ${
                  isCurrentRoute
                    ? 'bg-indigo-50/70 border-indigo-100'
                    : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="flex items-center">{conf.icon}</span>
                  <span className="text-xs font-bold text-slate-800 tracking-tight">
                    {conf.label}
                  </span>
                  {isCurrentRoute && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-600 text-white leading-none">
                      Active Route
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => toggleColumn(colKey)}
                    className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded cursor-pointer transition-colors"
                    title={`Hide ${conf.label} column`}
                  >
                    <FiEyeOff size={13} />
                  </button>
                </div>
              </div>

              {/* Column Content Area */}
              <div className="flex-1 overflow-y-auto p-2 sm:p-3 scrollbar-thin">
                <ComponentToRender />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
