import './globals.css';
import { Footer } from '@/components/Footer';
import { BackToTop } from '@/components/BackToTop';
import { Toaster } from 'react-hot-toast';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { TransitionProvider } from '@/components/TransitionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InnerHue',
  description: 'Emotional Reflection Web App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <TransitionProvider>
          {children}
        </TransitionProvider>
        <Footer />
        <BackToTop />
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#1f2937',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }
          }}
        />
      </body>
    </html>
  );
}