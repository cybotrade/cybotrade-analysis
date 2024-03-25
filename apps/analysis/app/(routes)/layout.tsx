import type { Metadata } from 'next';
import { headers } from 'next/headers';

import Header from '@app/_components/header';
import RadialMenu from '@app/_components/shared/RadialMenu';
import { ClientProvider } from '@app/_providers/client';
import '@app/globals.css';

export const metadata: Metadata = {
  title: 'Cybotrade Analysis',
  description: 'Most comprehensive and institutional grade backtest report',
  keywords: 'backtest, analysis, trading, crypto, bitcoin',
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en">
      <body className="flex min-h-screen min-w-screen transition-colors duration-200">
        <ClientProvider>
          <RadialMenu />
          <div className="font-sans overflow-hidden">
            <main className="absolute top-0 left-0 w-full h-full p-4">{children}</main>
          </div>
        </ClientProvider>
      </body>
    </html>
  );
}
