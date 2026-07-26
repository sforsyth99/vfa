import type { Preview } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { mswLoader } from 'msw-storybook-addon/csf3';
import messages from '../src/locales/en.json';
import '../src/styles/default.css';
import '../src/styles/global.css';
import { mswHandlers } from './msw-handlers';

function makeQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

const preview: Preview = {
  decorators: [
    (Story) => (
      <HelmetProvider>
        <QueryClientProvider client={makeQueryClient()}>
          <MemoryRouter>
            <IntlProvider locale="en" messages={messages} defaultLocale="en">
              <Story />
            </IntlProvider>
          </MemoryRouter>
        </QueryClientProvider>
      </HelmetProvider>
    ),
  ],
  loaders: [mswLoader()],
  parameters: {
    msw: mswHandlers,
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
