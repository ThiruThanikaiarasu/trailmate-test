import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderResult } from '@testing-library/react';
import type { Locale } from '@trailmate/shared';
import type { ReactElement } from 'react';
import { LocaleProvider } from '../i18n/LocaleProvider';

export function renderWithProviders(ui: ReactElement, { locale = 'en' }: { locale?: Locale } = {}): RenderResult {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <LocaleProvider initialLocale={locale}>{ui}</LocaleProvider>
    </QueryClientProvider>,
  );
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}
