import React from 'react';
import ReportsCureModule from '@/src/components/ui/rengrowcure/reportscure/ReportsCureModule';
import DynamicViewWrapper from '@/src/components/layout/DynamicViewWrapper';

export default function ReportsCurePage() {
  return (
    <DynamicViewWrapper currentRouteKey="sales">
      <ReportsCureModule />
    </DynamicViewWrapper>
  );
}
