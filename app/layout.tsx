import './globals.css';
import { Footer } from '@/components/Footer';
import { BackToTop } from '@/components/BackToTop';
import { Toaster } from 'react-hot-toast';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { TransitionProvider } from '@/components/TransitionProvider';

const inter = Inter({ subsets: ['latin'] });

const siteTitle = 'InnerHue';
const siteDescription = 'Emotional Reflection Web App';

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://innerhue.vercel.app'),
  openGraph: {
    type: 'website',
    title: siteTitle,
    description: siteDescription,
    siteName: siteTitle,
  },
  twitter: {
    card: 'summary',
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <a 
          href="#main" 
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-purple-600 focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Skip to main content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TransitionProvider>
            {children}
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
          </TransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}