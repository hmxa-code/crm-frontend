"use client";

import { useState, useMemo } from 'react';
import { CalendarEvent, CalendarView } from '@/src/types/index';
import { generateMonthDays } from '@/src/utils/date-helper';
import { addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';

export function useCalendar(initialEvents: CalendarEvent[] = []) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [activeView, setActiveView] = useState<CalendarView>('month');
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Memoized grid generator
  const gridDays = useMemo(() => {
    return generateMonthDays(currentDate);
  }, [currentDate]);

  // Clean navigation logic using date-fns
  const handleNext = () => {
    if (activeView === 'month') {
      setCurrentDate((prev) => addMonths(prev, 1));
    } else if (activeView === 'week') {
      setCurrentDate((prev) => addWeeks(prev, 1));
    } else {
      setCurrentDate((prev) => addDays(prev, 1));
    }
  };

  const handlePrev = () => {
    if (activeView === 'month') {
      setCurrentDate((prev) => subMonths(prev, 1));
    } else if (activeView === 'week') {
      setCurrentDate((prev) => subWeeks(prev, 1));
    } else {
      setCurrentDate((prev) => subDays(prev, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const addEvent = (newEvent: CalendarEvent) => {
    setEvents((prev) => [...prev, newEvent]);
  };

  const deleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  const updateEvent = (updatedEvent: CalendarEvent) => {
    setEvents((prev) => prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
  };

  return {
    currentDate,
    setCurrentDate,
    activeView,
    setActiveView,
    events,
    setEvents,
    gridDays,
    handleNext,
    handlePrev,
    handleToday,
    isModalOpen,
    setIsModalOpen,
    addEvent,
    deleteEvent,
    updateEvent,
  };
}