import React from 'react';
import OutreachSequencesModule from '@/src/components/ui/rengrowcure/outreach-sequences/OutreachSequencesModule';
import DynamicViewWrapper from '@/src/components/layout/DynamicViewWrapper';

export default function OutreachSequencesPage() {
  return (
    <DynamicViewWrapper currentRouteKey="sales">
      <OutreachSequencesModule />
    </DynamicViewWrapper>
  );
}
