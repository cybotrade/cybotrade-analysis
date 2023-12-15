import '@app/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@app/_components/header';
import { ClientProvider } from '@app/_providers/client';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Cybotrade backtest',
    description: '-',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}): JSX.Element {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ClientProvider>
                    <div className="p-16 font-sans overflow-hidden">
                        <Header />
                        {children}
                    </div>
                </ClientProvider>
            </body>
        </html>
    );
}
