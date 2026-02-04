'use client';

import { ReactNode } from 'react';
import { TransitionProvider } from '@/components/TransitionProvider';

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <TransitionProvider>
      {children}
    </TransitionProvider>
  );
}
