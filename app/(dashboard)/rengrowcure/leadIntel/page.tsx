import React from 'react';
import LeadIntelModule from '@/src/components/ui/rengrowcure/leadintel/LeadIntelModule';
import DynamicViewWrapper from '@/src/components/layout/DynamicViewWrapper';

export default function LeadIntelPage() {
  return (
    <DynamicViewWrapper currentRouteKey="sales">
      <LeadIntelModule />
    </DynamicViewWrapper>
  );
}
