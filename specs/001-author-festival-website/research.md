# Research: Author's Festival Website

## 1. Best Practices for Author Festival Websites

### 1.1 Homepage & Event Listings
- How do leading festivals (e.g., Vancouver Writers Fest, Toronto International Festival of Authors, Edinburgh International Book Festival) structure their homepages?
- How are featured, upcoming, and off-season events highlighted?
- How are Eventbrite or other ticketing links integrated?

### 1.2 Author Interviews & Bios
- How are author interviews presented (text, video, audio)?
- How are author bios and multiple authors per book handled?

### 1.3 Accessibility, Mobile, and Inclusiveness
- What accessibility features are prominent (skip links, ARIA, color contrast, etc.)?
- How is mobile usability ensured?
- How are diverse names, languages, and cultural elements represented?

### 1.4 Sponsors & Partners
- How are sponsors displayed (logos, tiers, links)?

## 2. Technical Patterns

### 2.1 ReactQuery with REST APIs
- Best practices for data fetching, caching, and error handling.

### 2.2 react-intl for i18n
- How to structure en.json and use react-intl for all UI strings.

### 2.3 Accessibility Patterns
- Implementing skip-to-content, keyboard navigation, and ARIA roles.

### 2.4 Mobile-First Responsive Design
- Layouts and components that adapt to all devices.

## 3. Integration Research

### 3.1 MailChimp Newsletter Signup
- Best practices for integrating MailChimp signup forms in React SPAs.

### 3.2 Eventbrite Ticket Links
- How to provide seamless ticket purchase experiences.

## 4. Decision Log

| Topic                | Decision / Rationale | Alternatives Considered |
|----------------------|----------------------|------------------------|
| i18n                 | Use react-intl with en.json | LinguiJS, react-i18next |
| Newsletter           | Use MailChimp        | Custom backend, other SaaS |
| Data Fetching        | TanStack ReactQuery  | SWR, Apollo Client      |
| State Management     | Zustand (if needed)  | Redux, Jotai            |
| Accessibility        | WCAG 2.1 AA, jest-axe, manual QA | None (must have) |

## 5. Open Questions

- Are there any unique features from other festivals that should be considered?
- What are the most common accessibility complaints from festival site users?
- Are there preferred patterns for displaying dual-language or Indigenous place names?

---

*Update this file as research is completed and decisions are made.*
