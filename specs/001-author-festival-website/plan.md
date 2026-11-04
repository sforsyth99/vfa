# Implementation Plan: Author's Festival Website

**Branch**: `001-author-festival-website` | **Date**: March 30, 2026 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-author-festival-website/spec.md`

## Summary

Build a modern, accessible, and inclusive festival website using React, TypeScript, Vite, pnpm, TanStack ReactQuery for REST API data fetching, Zustand for state management (if needed), CSS modules for styling, and en.json for all strings. The site will fetch and display events, authors, books, sponsors, and more, with a focus on accessibility, mobile usability, and cultural sensitivity.

## Technical Context

**Language/Version**: TypeScript (latest stable)
**Primary Dependencies**: React, Vite, pnpm, TanStack ReactQuery, Zustand (optional), react-router-dom, classnames, react-helmet-async, react-intl
**Storage**: N/A (frontend only, all data via REST API)
**Testing**: vitest, @testing-library/react, @testing-library/user-event, jest-axe (for a11y)
**Target Platform**: Modern browsers (desktop & mobile)
**Project Type**: Web application (SPA)
**Performance Goals**: Fast TTI (<1s on modern mobile), Lighthouse 90+ scores
**Constraints**: All styles in *.module.css, all strings in en.json (using react-intl), no circular dependencies, clean directory structure, WCAG 2.1 AA accessibility
**Scale/Scope**: 10-20 screens/components, 1-2k LOC, 5+ data entities

## Constitution Check

**Gates:**
- All UI as reusable, self-contained components
- All data fetched via REST API (no direct DB)
- Automated tests for all components/features
- Accessibility (WCAG 2.1 AA) and responsive design
- Simplicity, maintainability, and code review required
- No sensitive data in frontend
- All API endpoints documented
- Inclusiveness: support for diverse names, accessibility, cultural sensitivity

**Status:** All gates satisfied by plan and spec. Re-check after Phase 1 design.

## Project Structure

### Documentation (this feature)

```text
specs/001-author-festival-website/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```text
src/
  api/                # API clients (ReactQuery hooks, fetchers)
  components/         # Reusable UI components (Button, Card, etc.)
  features/           # Feature modules (Events, Authors, Books, Sponsors, etc.)
  pages/              # Route-level pages (Home, Event, Author, About, etc.)
  stores/             # Zustand stores (if needed)
  hooks/              # Custom React hooks
  utils/              # Utility functions
  assets/             # Static images, SVGs, etc.
  styles/             # Global styles, variables, resets
  locales/            # en.json (all UI strings)
  App.tsx             # App root
  main.tsx            # Entry point
```

**Notes:**
- All CSS in *.module.css files colocated with components/features
- All UI strings in src/locales/en.json, loaded via react-intl
- Use ReactQuery for all API data fetching
- Use Zustand only for client-side state not covered by ReactQuery
- Avoid circular dependencies by keeping feature modules independent and using index.ts barrel files only for leaf modules

## Next Steps
  
- Phase 0: Research API structure, accessibility patterns, and best practices for ReactQuery, Zustand, and react-intl i18n
- Phase 1: Data model, contracts, and quickstart guide
- Phase 2: Task breakdown and implementation
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
