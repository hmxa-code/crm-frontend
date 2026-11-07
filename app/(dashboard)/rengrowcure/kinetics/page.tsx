import React from 'react';
import KineticsModule from '@/src/components/ui/rengrowcure/kinetics/KineticsModule';
import DynamicViewWrapper from '@/src/components/layout/DynamicViewWrapper';

export default function KineticsPage() {
  return (
    <DynamicViewWrapper currentRouteKey="sales">
      <KineticsModule />
    </DynamicViewWrapper>
  );
}
