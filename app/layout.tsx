import './globals.css';
import { Footer } from '@/components/Footer';
import { BackToTop } from '@/components/BackToTop';
import { Providers } from '@/components/Providers';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

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
        <Providers>
          {children}
          <Footer />
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}