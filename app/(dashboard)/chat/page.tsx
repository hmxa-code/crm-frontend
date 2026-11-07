'use client';

import React from 'react';
import DynamicViewWrapper from '@/src/components/layout/DynamicViewWrapper';
import ChatView from '@/src/components/ui/chat/ChatView';

export default function ChatPage() {
  return (
    <DynamicViewWrapper currentRouteKey="chat">
      <ChatView />
    </DynamicViewWrapper>
  );
}