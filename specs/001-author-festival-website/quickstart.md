# Quickstart: Author's Festival Website

## Prerequisites
- Node.js (LTS recommended)
- pnpm (latest)

## Setup

```sh
pnpm install
```

## Development

```sh
pnpm run dev
```

- Open http://localhost:5173 in your browser.

## Project Structure

- `src/` — Main source code
  - `api/` — API clients (ReactQuery hooks, fetchers)
  - `components/` — Reusable UI components
  - `features/` — Feature modules (Events, Authors, Books, Sponsors, etc.)
  - `pages/` — Route-level pages (Home, Event, Author, About, etc.)
  - `stores/` — Zustand stores (if needed)
  - `hooks/` — Custom React hooks
  - `utils/` — Utility functions
  - `assets/` — Static images, SVGs, etc.
  - `styles/` — Global styles, variables, resets
  - `locales/` — en.json (all UI strings, via react-intl)
  - `App.tsx` — App root
  - `main.tsx` — Entry point

## Scripts
- `pnpm run dev` — Start development server
- `pnpm run build` — Build for production
- `pnpm run preview` — Preview production build
- `pnpm run test` — Run tests

## Testing
- Uses vitest, @testing-library/react, @testing-library/user-event, jest-axe

## Linting & Formatting
- ESLint and Prettier are recommended

## i18n
- All UI strings are in `src/locales/en.json` and loaded via `react-intl`

## Accessibility
- Follows WCAG 2.1 AA guidelines
- Automated and manual accessibility testing required

## API
- All dynamic data fetched via REST API using TanStack ReactQuery

## Newsletter
- Newsletter signup integrated with MailChimp

---

*See plan.md and tasks.md for detailed implementation steps.*
