import React from 'react';
import DistroEngineModule from '@/src/components/ui/rengrowcure/distroengine/DistroEngineModule';
import DynamicViewWrapper from '@/src/components/layout/DynamicViewWrapper';

export default function DistroEnginePage() {
  return (
    <DynamicViewWrapper currentRouteKey="sales">
      <DistroEngineModule />
    </DynamicViewWrapper>
  );
}
