'use client';

import { useGSAP } from '@gsap/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import gsap from 'gsap';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'react-hot-toast';

import { Error } from '@app/_components/error/error';
import { getQueryClient } from '@app/_utils/queryClient';

import ThemeProvider from './theme';

type ClientProviderProps = {
  children: React.ReactNode;
};

gsap.registerPlugin(useGSAP);

export const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  const queryClient = getQueryClient();

  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <Error error={error} reset={resetErrorBoundary} />
      )}
    >
      <Suspense>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            // defaultTheme="system"
            defaultTheme="light"
            enableSystem={false}
          >
            <Toaster />
            {children}
            <ReactQueryDevtools />
          </ThemeProvider>
        </QueryClientProvider>
      </Suspense>
    </ErrorBoundary>
  );
};
