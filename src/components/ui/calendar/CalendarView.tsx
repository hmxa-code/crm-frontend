'use client';

import React, { useMemo } from 'react';
import { CalendarHeader } from '@/src/components/ui/calendar/calendar-header';
import { MonthView } from '@/src/components/ui/calendar/month-view';
import { WeekView } from '@/src/components/ui/calendar/week-view';
import { DayView } from '@/src/components/ui/calendar/day-view';
import { YearView } from '@/src/components/ui/calendar/year-view';
import { AgendaView } from '@/src/components/ui/calendar/agenda-view';
import { EventSidebar } from '@/src/components/ui/calendar/event-sidebar';
import { CalendarEvent } from '@/src/types/index';
import { AddEventModal } from '@/src/components/ui/calendar/add-event-modal';
import { CalendarSidebar } from '@/src/components/ui/calendar/calendar-sidebar';
import { convertTaskToCalendarEvent } from '@/src/services/calendar/calendar-service';
import { useTaskSuiteStore } from '@/src/components/ui/tasks/data/taskSuiteStore';
import { useCalendarStore } from '@/src/components/ui/calendar/data/calendarStore';
import { FiPlus, FiSidebar, FiX } from 'react-icons/fi';

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
  // 1. Central Zustand Calendar Store
  const {
    currentDate,
    setCurrentDate,
    activeView,
    setActiveView,
    events: storeEvents,
    gridDays,
    handleNext,
    handlePrev,
    handleToday,
    selectedEvent,
    isDetailDrawerOpen,
    isAddModalOpen,
    isMobileSidebarOpen,
    preselectedDate,
    filterCategory,
    setFilterCategory,
    openEventDetail,
    closeEventDetail,
    openAddModal,
    closeAddModal,
    setMobileSidebarOpen,
    toggleMobileSidebar,
    addEvent,
    deleteEvent,
    updateEvent,
    updateEventStatus,
  } = useCalendarStore();

  // 2. Sync live with the Task Management Store
  const taskSuiteTasks = useTaskSuiteStore((s) => s.tasks);
  const addTaskToTaskSuite = useTaskSuiteStore((s) => s.addTask);
  const updateTaskStatusInSuite = useTaskSuiteStore((s) => s.updateTaskStatus);

  // 3. Merge store tasks dynamically with calendar events
  const combinedEvents = useMemo(() => {
    const base = externalEvents || storeEvents;
    const taskEventIds = new Set(base.map((e) => e.taskId || e.id));
    
    // Add any tasks created in task store that aren't yet in base
    const extraTaskEvents: CalendarEvent[] = [];
    for (const task of taskSuiteTasks) {
      if (!taskEventIds.has(task._id) && !taskEventIds.has(`evt-task-${task._id}`)) {
        extraTaskEvents.push(convertTaskToCalendarEvent(task));
      }
    }

    const all = [...base, ...extraTaskEvents];

    if (filterCategory && filterCategory !== 'ALL') {
      return all.filter((evt) => (evt.category || '').toUpperCase() === filterCategory.toUpperCase());
    }

    return all;
  }, [externalEvents, storeEvents, taskSuiteTasks, filterCategory]);

  // Clean event handlers driven through Zustand
  const handleEventClick = (event: CalendarEvent) => {
    openEventDetail(event);
  };

  const handleOpenAddEvent = (date?: Date) => {
    openAddModal(date);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (externalDeleteEvent) {
      externalDeleteEvent(eventId);
    }
    deleteEvent(eventId);
    closeEventDetail();
  };

  const handleSaveEvent = (newEvent: CalendarEvent, syncToTasks = true) => {
    if (externalAddEvent) {
      externalAddEvent(newEvent);
    }
    addEvent(newEvent, syncToTasks);

    // Sync to Task Management Store if requested
    if (syncToTasks) {
      try {
        addTaskToTaskSuite({
          _id: newEvent.taskId || `task-${Date.now()}`,
          title: newEvent.title.replace(/^\[[A-Z]+\]\s*/, ''),
          description: newEvent.description,
          status: (newEvent.status as any) || 'TODO',
          priority: (newEvent.priority as any) || 'HIGH',
          moduleType: (newEvent.category as any) || 'SALES',
          assigneeId: 'u1',
          dueDate: newEvent.startDate.toISOString(),
        });
      } catch (err) {
        console.warn('Sync to task store error:', err);
      }
    }

    closeAddModal();
  };

  const handleUpdateEventStatus = (eventId: string, newStatus: string) => {
    updateEventStatus(eventId, newStatus);

    const evt = combinedEvents.find((e) => e.id === eventId);
    if (evt?.taskId) {
      try {
        updateTaskStatusInSuite(evt.taskId, newStatus as any);
      } catch (err) {
        console.warn('Sync status error:', err);
      }
    }
  };

  return (
    <div className={className || "flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-140px)] min-h-[600px] bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden w-full relative"}>
      
      {/* Mobile / Tablet Quick Bar for Mini Calendar & Add */}
      <div className="lg:hidden flex items-center justify-between p-3.5 border-b border-slate-200 bg-slate-50/80 flex-none gap-2">
        <button
          type="button"
          onClick={toggleMobileSidebar}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer shrink-0"
        >
          <FiSidebar size={14} className="text-sky-600" />
          <span className="truncate max-w-[160px] sm:max-w-none">{isMobileSidebarOpen ? 'Hide Mini Calendar' : 'Show Mini Calendar'}</span>
        </button>

        <button
          type="button"
          onClick={() => handleOpenAddEvent()}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs hover:bg-slate-800 transition cursor-pointer shrink-0"
        >
          <FiPlus size={14} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Desktop Left Sidebar Panel */}
      <div className="hidden lg:block">
        <CalendarSidebar
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          events={combinedEvents}
          onEventClick={handleEventClick}
          onAddEventClick={() => handleOpenAddEvent()}
          filterCategory={filterCategory}
          onFilterCategoryChange={setFilterCategory}
        />
      </div>

      {/* Mobile/Tablet Slide-out Drawer for Sidebar */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
            onClick={() => setMobileSidebarOpen(false)} 
          />
          <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-left duration-200 flex flex-col">
            <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <button 
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition cursor-pointer shrink-0"
                title="Go Back"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-xs font-bold text-slate-800 ml-4">Mini Calendar & Tasks</span>
              <button 
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer ml-auto"
              >
                <FiX size={16} />
              </button>
            </div>
            <CalendarSidebar
              currentDate={currentDate}
              setCurrentDate={(d) => {
                setCurrentDate(d);
                setMobileSidebarOpen(false);
              }}
              events={combinedEvents}
              onEventClick={(evt) => {
                handleEventClick(evt);
                setMobileSidebarOpen(false);
              }}
              onAddEventClick={() => {
                setMobileSidebarOpen(false);
                handleOpenAddEvent();
              }}
              filterCategory={filterCategory}
              onFilterCategoryChange={(cat) => {
                setFilterCategory(cat);
              }}
            />
          </div>
        </div>
      )}

      {/* RIGHT MAIN CALENDAR PANEL */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Calendar Header with Navigation & Views */}
        <div className="p-3 sm:p-6 border-b border-slate-100 flex-none bg-white">
          <CalendarHeader
            currentDate={currentDate}
            activeView={activeView}
            setActiveView={setActiveView}
            onPrev={handlePrev}
            onNext={handleNext}
            onToday={handleToday}
          />
        </div>

        {/* View Switcher Engine with Responsive Overflow */}
        <div className="flex-1 overflow-y-auto px-2 sm:px-6 pb-6 pt-2 sm:pt-4">
          {activeView === 'month' && (
            <MonthView
              gridDays={gridDays}
              currentDate={currentDate}
              events={combinedEvents}
              onEventClick={handleEventClick}
              onDateClick={handleOpenAddEvent}
            />
          )}
          {activeView === 'week' && (
            <WeekView
              currentDate={currentDate}
              events={combinedEvents}
              onEventClick={handleEventClick}
            />
          )}
          {activeView === 'day' && (
            <DayView
              currentDate={currentDate}
              events={combinedEvents}
              onEventClick={handleEventClick}
            />
          )}
          {activeView === 'year' && (
            <YearView
              currentDate={currentDate}
              events={combinedEvents}
              onMonthSelect={(date) => {
                setCurrentDate(date);
                setActiveView('month');
              }}
            />
          )}
          {activeView === 'agenda' && (
            <AgendaView
              currentDate={currentDate}
              events={combinedEvents}
              onEventClick={handleEventClick}
            />
          )}
        </div>
      </div>

      {/* Popups & Drawer Overlay Elements (Isolated through Zustand) */}
      <EventSidebar
        isOpen={isDetailDrawerOpen}
        onClose={closeEventDetail}
        event={selectedEvent}
        onDeleteEvent={handleDeleteEvent}
        onShareInChat={onShareInChat}
        onUpdateEventStatus={handleUpdateEventStatus}
      />

      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        preselectedDate={preselectedDate}
        onSaveEvent={handleSaveEvent}
      />
    </div>
  );
}
