import type { Metadata } from 'next';

import Header from '@app/_components/header';
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
      <body className="flex min-h-screen transition-colors duration-200 min-w-full">
        <ClientProvider>
          <div className="p-16 font-sans overflow-hidden w-full">
            <Header />
            <main>{children}</main>
          </div>
        </ClientProvider>
      </body>
    </html>
  );
}
