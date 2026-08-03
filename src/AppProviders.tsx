import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

// Content changes rarely, so cache aggressively in production. In dev we keep data
// always-stale so edits show on reload — use the React Query Devtools panel (dev only)
// to Invalidate/Refetch individual queries without a reload.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: import.meta.env.DEV ? 0 : 60 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
    },
  },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
        {/* Dev-gated so Vite strips it from the production bundle entirely */}
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </HelmetProvider>
  );
}
