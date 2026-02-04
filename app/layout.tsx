import './globals.css';
import { ClientLayout } from '@/components/ClientLayout';
import { BackToTop } from '@/components/BackToTop';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InnerHue',
  description: 'Emotional Reflection Web App',
    appleWebApp: {
    capable: true,
    title: 'InnerHue',
    statusBarStyle: 'black-translucent',
  },

  
  icons: {
    apple: '/',
  },
};

import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
        <BackToTop />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
