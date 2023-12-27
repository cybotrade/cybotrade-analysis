'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'react-hot-toast';

import { ErrorPage } from '@app/_components/error';

import ThemeProvider from './theme';

type ClientProviderProps = {
  children: React.ReactNode;
};

export const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  return (
    <ErrorBoundary fallbackRender={({ error }) => <ErrorPage error={error} />}>
      <Suspense>
        <ThemeProvider
          attribute="class"
          // defaultTheme="system"
          defaultTheme="light"
          enableSystem={false}
        >
          <Toaster />
          {children}
        </ThemeProvider>
      </Suspense>
    </ErrorBoundary>
  );
};
