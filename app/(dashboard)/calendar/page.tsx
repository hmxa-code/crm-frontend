import React from 'react';
import CalendarView from '@/src/components/ui/calendar/CalendarView';
import DynamicViewWrapper from '@/src/components/layout/DynamicViewWrapper';

export default function CalendarRoutePage() {
  return (
    <DynamicViewWrapper currentRouteKey="calendar">
      <CalendarView />
    </DynamicViewWrapper>
  );
}