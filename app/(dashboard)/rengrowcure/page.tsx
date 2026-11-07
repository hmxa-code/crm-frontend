import React from 'react';
import DynamicViewWrapper from '@/src/components/layout/DynamicViewWrapper';
import RenGrowCureDashboardView from '@/src/components/ui/rengrowcure/RenGrowCureDashboardView';

export default function RenGrowCureMainPage() {
  return (
    <DynamicViewWrapper currentRouteKey="sales">
      <RenGrowCureDashboardView />
    </DynamicViewWrapper>
  );
}
