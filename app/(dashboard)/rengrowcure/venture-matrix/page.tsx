import React from 'react';
import VentureMatrixModule from '@/src/components/ui/rengrowcure/venture-matrix/VentureMatrixModule';
import DynamicViewWrapper from '@/src/components/layout/DynamicViewWrapper';

export default function VentureMatrixPage() {
  return (
    <DynamicViewWrapper currentRouteKey="sales">
      <VentureMatrixModule />
    </DynamicViewWrapper>
  );
}
