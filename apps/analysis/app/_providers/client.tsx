'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'react-hot-toast';

import { Error } from '@app/_components/error/error';

import ThemeProvider from './theme';

type ClientProviderProps = {
  children: React.ReactNode;
};

gsap.registerPlugin(useGSAP);

export const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <Error error={error} reset={resetErrorBoundary} />
      )}
    >
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
