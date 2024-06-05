import type { Metadata } from 'next';

import { BacktestDataProvider } from '@app/_providers/backtest';
import { ClientProvider } from '@app/_providers/client';
import { FileDataProvider } from '@app/_providers/file';
import '@app/globals.css';

export const metadata: Metadata = {
  title: 'Cybotrade Analysis',
  description: 'Most comprehensive and institutional grade backtest report',
  keywords: 'backtest, analysis, trading, crypto, bitcoin',
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en">
      <body className="flex min-w-screen min-h-screen transition-colors duration-200">
        <ClientProvider>
          <FileDataProvider>
            <BacktestDataProvider>
              <div className="font-sans overflow-x-hidden">
                <main className="absolute top-0 left-0 w-full h-full p-4">{children}</main>
              </div>
            </BacktestDataProvider>
          </FileDataProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
