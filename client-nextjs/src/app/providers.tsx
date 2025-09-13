'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { WalletProvider } from '@/contexts/WalletContext';
import { SocketProvider } from '@/contexts/SocketContext';
import { useState } from 'react';
import { useIsClient } from '@/hooks/useIsClient';

export function Providers({ children }: { children: React.ReactNode }) {
  const isClient = useIsClient();
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <SocketProvider>
          {children}
          {isClient && (
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1f2937',
                  color: '#fff',
                  border: '1px solid #374151',
                },
              }}
            />
          )}
        </SocketProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
}
