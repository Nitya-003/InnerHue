'use client';

import { ReactNode } from 'react';
import { TransitionProvider } from '@/components/TransitionProvider';
import { Footer } from '@/components/Footer';

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <TransitionProvider>
      {children}
      <Footer />
    </TransitionProvider>
  );
}
