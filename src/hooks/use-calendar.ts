'use client';

import { CalendarEvent } from '@/src/types/index';
import { useCalendarStore } from '@/src/components/ui/calendar/data/calendarStore';

/**
 * useCalendar Hook
 * Backwards-compatible wrapper around the centralized Zustand useCalendarStore
 */
export function useCalendar(initialEvents?: CalendarEvent[]) {
  const store = useCalendarStore();

  return {
    currentDate: store.currentDate,
    setCurrentDate: store.setCurrentDate,
    activeView: store.activeView,
    setActiveView: store.setActiveView,
    events: store.events,
    setEvents: store.setEvents,
    gridDays: store.gridDays,
    handleNext: store.handleNext,
    handlePrev: store.handlePrev,
    handleToday: store.handleToday,
    isModalOpen: store.isAddModalOpen,
    setIsModalOpen: (open: boolean) => {
      if (open) store.openAddModal();
      else store.closeAddModal();
    },
    addEvent: store.addEvent,
    deleteEvent: store.deleteEvent,
    updateEvent: store.updateEvent,
  };
}
