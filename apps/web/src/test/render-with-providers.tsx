import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider as ReduxProvider } from 'react-redux';
import { makeStore } from '@/store/store';

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  const store = makeStore();
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 30_000 } },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ReduxProvider>
    );
  }

  return { ...render(ui, { wrapper: Wrapper, ...options }), store };
}
