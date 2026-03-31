import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import messages from './locales/en.json';
import './styles/global.css';

import { AppProviders } from './AppProviders';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IntlProvider locale="en" messages={messages} defaultLocale="en">
      <AppProviders>
        <App />
      </AppProviders>
    </IntlProvider>
  </StrictMode>,
);
