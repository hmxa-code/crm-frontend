import React from 'react';
import ChronosModule from '@/src/components/ui/rengrowcure/chronos/ChronosModule';
import DynamicViewWrapper from '@/src/components/layout/DynamicViewWrapper';

export default function ChronosPage() {
  return (
    <DynamicViewWrapper currentRouteKey="sales">
      <ChronosModule />
    </DynamicViewWrapper>
  );
}
