import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { SessionProvider } from 'next-auth/react';
import { getBaseUrl } from '@/utils/base-url';

const roboto = Roboto({ weight: ['400', '500'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tascurator',
  description:
    'An app that streamlines the management of cleaning duties in shared houses, offering automated task rotation and progress tracking for tenants and landlords.',
  metadataBase: new URL(getBaseUrl()),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body
          className={cn(
            'flex justify-center items-start min-h-dvh bg-primary-lightest',
            roboto.className,
          )}
        >
          <main
            className={
              'max-w-screen-sm min-h-dvh w-full h-full bg-white relative'
            }
          >
            {children}
          </main>
          <Toaster />
        </body>
      </html>
    </SessionProvider>
  );
}
