import './globals.css';
import { Footer } from '@/components/Footer';
import { BackToTop } from '@/components/BackToTop';
import { Providers } from '@/components/Providers';
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
        <Providers>
          {children}
          <Footer />
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}