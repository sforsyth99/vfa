# Tasks: Author's Festival Website

**Input**: plan.md, spec.md

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Create project structure per implementation plan
- [x] T002 Initialize React + TypeScript project with Vite and pnpm
- [x] T003 [P] Configure linting, formatting, and pre-commit hooks
- [x] T004 [P] Set up src/ directory structure (api/, components/, features/, pages/, stores/, hooks/, utils/, assets/, styles/, locales/)
- [x] T005 [P] Add en.json for UI strings in src/locales/ and set up react-intl integration
- [x] T006 [P] Set up CSS modules and global styles in src/styles/
- [x] T007 [P] Install and configure TanStack ReactQuery, Zustand, react-router-dom, classnames, react-helmet-async
- [x] T008 [P] Set up vitest, @testing-library/react, @testing-library/user-event, jest-axe for testing

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T009 Create API client structure in src/api/ for REST endpoints
- [ ] T010 [P] Define TypeScript types for all entities (Event, Author, Book, Sponsor, Facilitator, Musician, Curator, Interview) in src/api/types.ts
- [ ] T011 [P] Set up ReactQueryProvider and Zustand store (if needed) in App.tsx
- [ ] T012 [P] Configure i18n loading for en.json using react-intl
- [ ] T013 [P] Add accessibility helpers and global skip-to-content link

## Phase 3: User Story 1 - Discover and Attend Events (P1)

- [x] T014 [P] [US1] Implement Events feature module in src/features/events/
- [x] T015 [P] [US1] Create EventCard and EventList components in src/components/
- [x] T016 [P] [US1] Fetch and display featured/upcoming events on Home page (src/pages/Home.tsx)
- [x] T017 [P] [US1] Add Eventbrite ticket links to event cards
- [x] T018 [US1] Handle no upcoming events (show message, suggest past events/newsletter)
- [x] T019 [US1] Support event format (physical/online) and dual location names

## Phase 4: User Story 2 - Explore Author Interviews (P2)

- [ ] T020 [P] [US2] Implement Authors feature module in src/features/authors/
- [ ] T021 [P] [US2] Create AuthorCard and AuthorList components in src/components/
- [ ] T022 [P] [US2] Display author interviews, bios, and profile photos
- [ ] T023 [US2] Support books with multiple authors and display all attributions

## Phase 5: User Story 3 - View Sponsors (P3)

- [ ] T024 [P] [US3] Implement Sponsors feature module in src/features/sponsors/
- [ ] T025 [P] [US3] Display sponsor logos and links in a dedicated section

## Phase 6: User Story 4 - Newsletter & Donation (P4)

- [ ] T026 [P] [US4] Add newsletter signup form and integrate with MailChimp newsletter backend/service
- [ ] T027 [P] [US4] Add CanadaHelps donation link/button

## Phase 7: User Story 5 - Access Information (P5)

- [ ] T028 [P] [US5] Implement About and Accessibility pages in src/pages/
- [ ] T029 [US5] Populate About page with organizational information and mission
- [ ] T030 [US5] Populate Accessibility page with detailed accessibility resources and contact info

## Phase 8: User Story 6 - Social Media & Land Acknowledgement (P6)

- [ ] T031 [P] [US6] Add social media links to site-wide layout (header/footer)
- [ ] T032 [US6] Display land acknowledgement on every page

## Final Phase: Polish & Cross-Cutting

- [ ] T032 [P] Add mobile responsiveness and test on multiple devices
- [ ] T033 [P] Validate accessibility (WCAG 2.1 AA) with automated and manual tests
- [ ] T034 [P] Refactor for code clarity, maintainability, and remove circular dependencies
- [ ] T035 [P] Ensure all UI strings are in en.json (via react-intl) and all styles are in *.module.css
- [ ] T036 [P] Add/Update documentation and quickstart guide

## Dependencies

- User Story 1 (Events) must be completed before User Stories 2-6 can be fully tested
- Foundational setup must be completed before any feature work

## Parallel Execution Examples

- T004, T005, T006, T007, T008 can be done in parallel
- T014, T020, T024, T026, T028, T030 can be started in parallel after foundational setup

## MVP Scope

- Complete through User Story 1 (Events) for a minimal, testable product

## Implementation Strategy

- MVP first, then incremental delivery by user story
- Each phase is independently testable and deliverable
