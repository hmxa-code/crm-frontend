'use client';

import { create } from 'zustand';
import { addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import { CalendarEvent, CalendarView } from '@/src/types/index';
import { generateMonthDays } from '@/src/utils/date-helper';
import { INITIAL_EVENTS } from '@/src/services/calendar/calendar-service';
import { useTaskSuiteStore } from '@/src/components/ui/tasks/data/taskSuiteStore';

// ---------------------------------------------------------------------------
// CALENDAR STORE INTERFACE
// ---------------------------------------------------------------------------
export interface CalendarStoreState {
  // Navigation & Date
  currentDate: Date;
  activeView: CalendarView;
  preselectedDate: Date | null;
  gridDays: Date[];

  // Events & Filter
  events: CalendarEvent[];
  filterCategory: string; // 'ALL' | 'SALES' | 'MARKETING' | 'SUPPORT' | 'GENERAL'
  searchQuery: string;

  // Modals & Drawers
  selectedEvent: CalendarEvent | null;
  isDetailDrawerOpen: boolean;
  isAddModalOpen: boolean;
  isMobileSidebarOpen: boolean;

  // Actions - Navigation
  setCurrentDate: (date: Date) => void;
  setActiveView: (view: CalendarView) => void;
  handleNext: () => void;
  handlePrev: () => void;
  handleToday: () => void;

  // Actions - Filter & Search
  setFilterCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;

  // Actions - Modals & Drawers (Clean state transitions)
  openEventDetail: (event: CalendarEvent) => void;
  closeEventDetail: () => void;
  openAddModal: (date?: Date) => void;
  closeAddModal: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;

  // Actions - Event CRUD
  setEvents: (events: CalendarEvent[] | ((prev: CalendarEvent[]) => CalendarEvent[])) => void;
  addEvent: (event: CalendarEvent, syncToTasks?: boolean) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (eventId: string) => void;
  updateEventStatus: (eventId: string, newStatus: string) => void;
  resetEventsToSeed: () => void;
}

export const useCalendarStore = create<CalendarStoreState>((set, get) => ({
  // Initial state
  currentDate: new Date(),
  activeView: 'month',
  preselectedDate: null,
  gridDays: generateMonthDays(new Date()),

  events: INITIAL_EVENTS,
  filterCategory: 'ALL',
  searchQuery: '',

  selectedEvent: null,
  isDetailDrawerOpen: false,
  isAddModalOpen: false,
  isMobileSidebarOpen: false,

  // Navigation Actions
  setCurrentDate: (date: Date) => {
    set({
      currentDate: date,
      gridDays: generateMonthDays(date),
    });
  },

  setActiveView: (view: CalendarView) => {
    set({ activeView: view });
  },

  handleNext: () => {
    const { currentDate, activeView } = get();
    let nextDate: Date;
    if (activeView === 'month') {
      nextDate = addMonths(currentDate, 1);
    } else if (activeView === 'week') {
      nextDate = addWeeks(currentDate, 1);
    } else {
      nextDate = addDays(currentDate, 1);
    }
    set({
      currentDate: nextDate,
      gridDays: generateMonthDays(nextDate),
    });
  },

  handlePrev: () => {
    const { currentDate, activeView } = get();
    let prevDate: Date;
    if (activeView === 'month') {
      prevDate = subMonths(currentDate, 1);
    } else if (activeView === 'week') {
      prevDate = subWeeks(currentDate, 1);
    } else {
      prevDate = subDays(currentDate, 1);
    }
    set({
      currentDate: prevDate,
      gridDays: generateMonthDays(prevDate),
    });
  },

  handleToday: () => {
    const today = new Date();
    set({
      currentDate: today,
      gridDays: generateMonthDays(today),
    });
  },

  // Filter Actions
  setFilterCategory: (category: string) => {
    set({ filterCategory: category });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  // Modal / Drawer Actions with Clean Mutex to prevent Modal Overlaps
  openEventDetail: (event: CalendarEvent) => {
    set({
      selectedEvent: event,
      isDetailDrawerOpen: true,
      isAddModalOpen: false, // Ensure Add modal is always closed
    });
  },

  closeEventDetail: () => {
    set({
      isDetailDrawerOpen: false,
      selectedEvent: null, // Cleanly reset selected event
    });
  },

  openAddModal: (date?: Date) => {
    const targetDate = date || get().currentDate || new Date();
    set({
      preselectedDate: targetDate,
      isAddModalOpen: true,
      isDetailDrawerOpen: false, // Ensure Detail drawer is closed
      selectedEvent: null, // Clear selected event so no state residue
    });
  },

  closeAddModal: () => {
    set({
      isAddModalOpen: false,
      preselectedDate: null,
    });
  },

  setMobileSidebarOpen: (open: boolean) => {
    set({ isMobileSidebarOpen: open });
  },

  toggleMobileSidebar: () => {
    set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen }));
  },

  // Event CRUD Actions
  setEvents: (updater) => {
    if (typeof updater === 'function') {
      set((state) => ({ events: updater(state.events) }));
    } else {
      set({ events: updater });
    }
  },

  addEvent: (newEvent: CalendarEvent, syncToTasks = true) => {
    set((state) => ({
      events: [...state.events, newEvent],
      isAddModalOpen: false,
      preselectedDate: null,
    }));

    // Bidirectional sync with Task Management Store
    if (syncToTasks) {
      try {
        const addTaskToTaskStore = useTaskSuiteStore.getState().addTask;
        if (addTaskToTaskStore) {
          addTaskToTaskStore({
            _id: newEvent.taskId || `task-${Date.now()}`,
            title: newEvent.title.replace(/^\[[A-Z]+\]\s*/, ''),
            description: newEvent.description,
            status: (newEvent.status as any) || 'TODO',
            priority: (newEvent.priority as any) || 'HIGH',
            moduleType: (newEvent.category as any) || 'SALES',
            assigneeId: 'u1',
            dueDate: (newEvent.startDate instanceof Date ? newEvent.startDate : new Date(newEvent.startDate)).toISOString(),
          });
        }
      } catch (err) {
        console.warn('Sync to Task store skipped:', err);
      }
    }
  },

  updateEvent: (updatedEvent: CalendarEvent) => {
    set((state) => ({
      events: state.events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)),
      selectedEvent: state.selectedEvent?.id === updatedEvent.id ? updatedEvent : state.selectedEvent,
    }));
  },

  deleteEvent: (eventId: string) => {
    set((state) => ({
      events: state.events.filter((e) => e.id !== eventId),
      isDetailDrawerOpen: state.selectedEvent?.id === eventId ? false : state.isDetailDrawerOpen,
      selectedEvent: state.selectedEvent?.id === eventId ? null : state.selectedEvent,
    }));
  },

  updateEventStatus: (eventId: string, newStatus: string) => {
    const { events } = get();
    const target = events.find((e) => e.id === eventId);
    if (!target) return;

    const updated = { ...target, status: newStatus };
    set((state) => ({
      events: state.events.map((e) => (e.id === eventId ? updated : e)),
      selectedEvent: state.selectedEvent?.id === eventId ? updated : state.selectedEvent,
    }));

    // Sync task status if linked
    if (target.taskId) {
      try {
        const updateTaskStatus = useTaskSuiteStore.getState().updateTaskStatus;
        if (updateTaskStatus) {
          updateTaskStatus(target.taskId, newStatus as any);
        }
      } catch (err) {
        console.warn('Sync status to Task store skipped:', err);
      }
    }
  },

  resetEventsToSeed: () => {
    set({
      events: INITIAL_EVENTS,
      selectedEvent: null,
      isDetailDrawerOpen: false,
      isAddModalOpen: false,
    });
  },
}));
