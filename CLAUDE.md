# VFA Project Rules

## Accessibility

Every component and page must meet WCAG 2.1 AA. Apply these as you write — do not defer to a follow-up pass.

**Interactive elements**
- Buttons and links without visible text must have `aria-label={intl.formatMessage({ id: '...' })}`. Add the key to `en.json` first.
- Toggle/disclosure buttons must have `aria-expanded` and `aria-controls` pointing to the controlled element's `id`.
- Filter/toggle buttons (e.g. year filters) must have `aria-pressed={isActive}`.
- External links that open in a new tab already have `target="_blank" rel="noopener noreferrer"` — no further label needed unless the visible text is ambiguous.

**Images**
- Meaningful images: `alt` = a concise description of what the image communicates (not "photo of …").
- Decorative images (background blur, purely visual): `alt="" aria-hidden="true"`.
- Never omit `alt` entirely.

**Semantic HTML**
- Use `<main id="main-content">` as the page wrapper on every page (already consistent — keep it).
- Use `<nav aria-label="…">` for navigation regions; distinguish primary nav from footer nav via different labels.
- Use `<th scope="col">` on column headers and `<th scope="row">` on row headers in data tables.
- Use `<ul>`/`<ol>` for lists of items, not `<div>` stacks.

**Dynamic content**
- Status messages that appear after a user action (form submission, filter change) must live inside a container with `aria-live="polite" aria-atomic="true"` that exists in the DOM before the message appears.
- Loading/error states in page sections should use `role="status"` so screen readers announce them.

**Forms**
- Every `<input>` must have either an associated `<label>` (via `htmlFor`/`id`) or an `aria-label`. Placeholder text alone is not a label.
- Honeypot fields must have `aria-hidden="true"` and `tabIndex={-1}` (already consistent — keep it).

## Code standards (summary — see memory for full detail)

- Components: `src/components/ComponentName/ComponentName.tsx` + `ComponentName.module.css`
- Pages: `src/pages/PageName/PageName.tsx` + `PageName.module.css`
- Strings: `src/locales/en.json` via `useIntl()` / `<FormattedMessage>` — no hardcoded English in TSX
- Colors: `var(--vfa-*)` tokens from `src/styles/default.css` — no hardcoded hex in CSS files
- Styles: CSS Modules (`styles.className`) — no inline `style={{}}` except runtime-computed values
- Mobile: every new CSS file needs a `@media (max-width: 640px)` block
