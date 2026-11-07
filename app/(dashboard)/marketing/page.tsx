import React from 'react';
import MarketingView from '@/src/components/ui/marketing/MarketingView';
import DynamicViewWrapper from '@/src/components/layout/DynamicViewWrapper';

export default function MarketingPage() {
  return (
    <DynamicViewWrapper currentRouteKey="marketing">
      <MarketingView />
    </DynamicViewWrapper>
  );
}