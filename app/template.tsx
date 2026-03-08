'use client';

import { ReactNode } from 'react';
import { PageTransition } from '@/components/PageTransition';

interface TemplateProps {
  children: ReactNode;
}

export default function Template({ children }: TemplateProps) {
  return <PageTransition>{children}</PageTransition>;
}
