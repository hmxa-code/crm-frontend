"use client";

import React, { useState } from 'react';
import { CalendarHeader } from '@/src/components/ui/calendar/calendar-header';
import { MonthView } from '@/src/components/ui/calendar/month-view';
import { WeekView } from '@/src/components/ui/calendar/week-view';
import { DayView } from '@/src/components/ui/calendar/day-view';
import { YearView } from '@/src/components/ui/calendar/year-view';
import { AgendaView } from '@/src/components/ui/calendar/agenda-view';
import { EventSidebar } from '@/src/components/ui/calendar/event-sidebar';
import { CalendarEvent } from '@/src/types/index';
import { useCalendar } from '@/src/hooks/use-calendar';
import { AddEventModal } from '@/src/components/ui/calendar/add-event-modal';
import { CalendarSidebar } from '@/src/components/ui/calendar/calendar-sidebar';
import { INITIAL_EVENTS } from '@/src/services/calendar/calendar-service';

interface CalendarViewProps {
  className?: string;
  events?: CalendarEvent[];
  onAddEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (id: string) => void;
  onShareInChat?: (event: CalendarEvent) => void;
}

export default function CalendarView({
  className,
  events: externalEvents,
  onAddEvent: externalAddEvent,
  onDeleteEvent: externalDeleteEvent,
  onShareInChat,
}: CalendarViewProps = {}) {
  const calendarData = useCalendar(INITIAL_EVENTS);
  const {
    currentDate,
    setCurrentDate,
    activeView,
    setActiveView,
    events: localEvents,
    gridDays,
    handleNext,
    handlePrev,
    handleToday,
    addEvent,
    deleteEvent,
  } = calendarData;

  const events = externalEvents || localEvents;

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [preselectedDate, setPreselectedDate] = useState<Date | null>(null);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsSidebarOpen(true);
  };

  const handleOpenAddEvent = (date?: Date) => {
    setPreselectedDate(date || new Date());
    setIsAddModalOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (externalDeleteEvent) {
      externalDeleteEvent(eventId);
    } else {
      deleteEvent(eventId);
    }
    setIsSidebarOpen(false);
  };

  const handleSaveEvent = (newEvent: CalendarEvent) => {
    if (externalAddEvent) {
      externalAddEvent(newEvent);
    } else {
      addEvent(newEvent);
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className={className || "flex h-[calc(100vh-140px)] min-h-[500px] bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden w-full"}>
      
      {/* LEFT PANEL */}
      <CalendarSidebar
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        events={events}
        onEventClick={handleEventClick}
        onAddEventClick={() => handleOpenAddEvent()}
      />

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-6 border-b border-slate-100 flex-none">
          <CalendarHeader
            currentDate={currentDate}
            activeView={activeView}
            setActiveView={setActiveView}
            onPrev={handlePrev}
            onNext={handleNext}
            onToday={handleToday}
          />
        </div>

        {/* View Switcher Engine */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {activeView === 'month' && (
            <MonthView
              gridDays={gridDays}
              currentDate={currentDate}
              events={events}
              onEventClick={handleEventClick}
              onDateClick={handleOpenAddEvent}
            />
          )}
          {activeView === 'week' && (
            <WeekView
              currentDate={currentDate}
              events={events}
              onEventClick={handleEventClick}
            />
          )}
          {activeView === 'day' && (
            <DayView
              currentDate={currentDate}
              events={events}
              onEventClick={handleEventClick}
            />
          )}
          {activeView === 'year' && (
            <YearView
              currentDate={currentDate}
              events={events}
              onMonthSelect={(date) => {
                setCurrentDate(date);
                setActiveView('month');
              }}
            />
          )}
          {activeView === 'agenda' && (
            <AgendaView
              currentDate={currentDate}
              events={events}
              onEventClick={handleEventClick}
            />
          )}
        </div>
      </div>

      {/* Popups & Drawer Overlay Elements */}
      <EventSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        event={selectedEvent}
        onDeleteEvent={handleDeleteEvent}
        onShareInChat={onShareInChat}
      />

      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        preselectedDate={preselectedDate}
        onSaveEvent={handleSaveEvent}
      />
    </div>
  );
}
