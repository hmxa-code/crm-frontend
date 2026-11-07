'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ViewMode = 'single' | 'multi';

export type ColumnKey =
  | 'marketing'
  | 'calendar'
  | 'sales'
  | 'tasks'
  | 'chat'
  | 'opportunities';

export const ALL_COLUMNS: ColumnKey[] = [
  'marketing',
  'calendar',
  'sales',
  'tasks',
  'chat',
  'opportunities',
];

interface ViewModeContextType {
  mode: ViewMode;
  activeColumns: ColumnKey[];
  toggleMode: (targetMode?: ViewMode) => void;
  toggleColumn: (key: ColumnKey) => void;
  setMode: (mode: ViewMode) => void;
  setActiveColumns: React.Dispatch<React.SetStateAction<ColumnKey[]>>;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

const STORAGE_MODE_KEY = 'crm_view_mode';
const STORAGE_COLUMNS_KEY = 'crm_active_columns';

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ViewMode>('multi');
  const [activeColumns, setActiveColumnsState] = useState<ColumnKey[]>(ALL_COLUMNS);

  useEffect(() => {
    try {
      const savedMode = localStorage.getItem(STORAGE_MODE_KEY) as ViewMode | null;
      if (savedMode === 'single' || savedMode === 'multi') {
        setModeState(savedMode);
      } else {
        setModeState('multi');
      }

      const savedCols = localStorage.getItem(STORAGE_COLUMNS_KEY);
      if (savedCols) {
        const parsed = JSON.parse(savedCols);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter((col: any): col is ColumnKey => ALL_COLUMNS.includes(col));
          if (valid.length > 0) {
            setActiveColumnsState(valid);
          }
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const setMode = (newMode: ViewMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(STORAGE_MODE_KEY, newMode);
    } catch {
      // Ignore
    }
  };

  const setActiveColumns: React.Dispatch<React.SetStateAction<ColumnKey[]>> = (action) => {
    setActiveColumnsState((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      try {
        localStorage.setItem(STORAGE_COLUMNS_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const toggleMode = (targetMode?: ViewMode) => {
    const nextMode = targetMode ?? (mode === 'single' ? 'multi' : 'single');
    setMode(nextMode);
  };

  const toggleColumn = (key: ColumnKey) => {
    setActiveColumns((prev) => {
      if (prev.includes(key)) {
        if (prev.length <= 1) {
          // Keep at least one column active
          return prev;
        }
        return prev.filter((col) => col !== key);
      } else {
        return [...prev, key];
      }
    });
  };

  return (
    <ViewModeContext.Provider
      value={{
        mode,
        activeColumns,
        toggleMode,
        toggleColumn,
        setMode,
        setActiveColumns,
      }}
    >
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
}
