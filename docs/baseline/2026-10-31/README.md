# VFA live-site baseline: 2026-10-31

Lighthouse 13.6.0, local headless Chrome, mobile (default simulated throttling) unless noted. Site: https://victoriafestivalofauthors.ca. Nothing in the repo was modified.
Folder: `docs/baseline/2026-10-31/`. Captured before any of the 2027 improvements, as the "before" for comparison.
Files: one Lighthouse report per page (`lh-*.report.html`, open in a browser; the full JSON data is embedded in each), `metrics.json` (extracted numbers), `headers.txt` (security and cache headers), `api-timing.txt`. The raw `.report.json` files and helper scripts were not kept.

## Scores and Core Web Vitals (mobile)

| Page | Perf | A11y | BP | SEO | FCP s | LCP s | TBT ms | CLS | SI s |
|---|---|---|---|---|---|---|---|---|---|
| `/` (median of 3) | **59** (58/59/59) | 96 | 96 | 92 | 1.78 | **7.75** (8.31/7.58/7.75) | 9 | **0.315** | 2.86 |
| `/events` | 78 | 96 | 100 | 100 | 1.73 | 5.60 | 13 | 0.000 | 1.73 |
| `/authors` | 78 | 96 | 100 | 100 | 1.81 | 5.66 | 72 | 0.021 | 1.81 |
| `/interviews` | 79 | 96 | 100 | 100 | 1.88 | 5.44 | 22 | 0.000 | 1.88 |
| `/kidsfest2026` | 76 | 96 | 100 | 100 | 1.82 | 6.49 | 10 | 0.018 | 1.82 |
| `/events/in-conversation-with-ruth-ozeki` | 59 | 97 | 100 | 92 | 1.79 | 5.64 | 2 | **0.410** | 2.41 |
| `/people/paul-walde` (retry, see note) | 55 | 96 | 96 | 92 | 1.85 | 6.01 | 2 | **0.578** | 1.85 |
| `/people/rande-cook` (extra check) | 54 | 96 | 100 | 92 | 1.75 | 6.61 | 1 | **0.546** | 1.75 |
| `/interviews/qa-with-leilani-farha` | 60 | 96 | 100 | 100 | 1.86 | 5.24 | 10 | **0.454** | 1.86 |
| `/` **desktop** | 77 | 96 | 96 | 92 | 0.56 | 1.38 | 0 | **0.404** | 0.67 |

Notes:
- The first `/people/paul-walde` run (`lh-person.*`) finished while the page was still showing its loading spinner: A11y 93, Perf 83, LCP 4.49 s, with `landmark-one-main` and `skip-link` failing. So the person page's loading state renders no `<main id="main-content">`, which leaves the skip link with nothing to point at. The retry (`lh-person-retry.*`) rendered fully and is the number used above.
- TBT is low everywhere. On mobile, LCP is driven by simulated network: about 390 KB of JS has to arrive before anything renders, because the page is client-rendered.
- Best Practices: every page fails `valid-source-maps`. On `/`, `errors-in-console` also fails because 3 requests to `feeds.behold.so/o7gs84gZBeIjivEOMXEZ` (the Instagram feed widget) return **HTTP 402 Payment Required**.

## Page weight (mobile, transferred KiB)

| Page | Total | JS | Images | Fonts | CSS | Fetch/XHR | Requests | api.* reqs (wp-json / uploads) |
|---|---|---|---|---|---|---|---|---|
| `/` | **4,734** | 390 | **3,837** | 202 | 33 | 269 | 78–80 | 54 (5 / 49) |
| `/events` | 3,200 | 385 | 2,554 | 192 | 33 | 35 | 54 | 20 (1 / 19) |
| `/authors` | 2,874 | 385 | 2,145 | 232 | 33 | 76 | **139** | **103 (40 / 63)** |
| `/interviews` | 2,521 | 385 | 1,731 | 192 | 33 | 179 | 71 | 37 (1 / 36) |
| `/kidsfest2026` | 4,696 | 385 | 3,800 | 214 | 33 | 262 | 55 | 16 (4 / 12) |
| event detail | 1,915 | 385 | 1,262 | 192 | 33 | 42 | 45 | 6 (3 / 3) |
| person (retry) | 1,824 | 385 | 1,208 | 192 | 33 | — | 39 | 5 (4 / 1) |
| interview | 2,040 | 385 | 1,240 | 192 | 33 | 188 | 40 | 6 (4 / 2) |
| `/` desktop | **7,081** | 390 | **6,185** | 202 | 33 | 269 | 90 | 66 (5 / 61) |

- About 1.1 MB of images shows up on every page, including the light ones. Most of it is the sponsor-logo footer: JPG/PNG logos of 30–150 KB each.
- `/authors` makes **40 wp-json calls**, which looks like an N+1 pattern (one request per author).
- `/` loads `festival_events?per_page=100`, `people/authors?year=2026`, `books?per_page=100`, `newsletter/latest` and `interviews?per_page=100`. That is 269 KB of JSON for the home page.
- Event detail and interview pages fetch the full `festival_events?per_page=100` or `interviews?per_page=100` list on top of the single item.

## LCP element and layout shifts

| Page | LCP element | Top layout shifts (score: element) |
|---|---|---|
| `/` mobile | `<section class="_section_obnrk_1" aria-labelledby="kidsfest-heading">` (KidsFest promo, background image) | 0.187: lineup `section._section_1vyc6_1`; 0.128: `div._carouselWrapper_1vyc6_47` (event carousel) |
| `/` desktop | hero `<img src="/assets/VFA-2026_Facebook-Cover-Photo-scaled-*.jpg">` | 0.350: lineup section; 0.052: carousel wrapper |
| `/events` | `<span class="_rowAuthors_blmmc_181">` (text) | none of note |
| `/authors` | `<p class="_bio_hfdsp_174">` (text) | ≤0.007 each: author list items |
| `/interviews` | header logo `VFA_Logo-*.png` | none |
| `/kidsfest2026` | `<section class="_hero_1u9sq_3">` | 0.014: `div._bandWhite_1u9sq_125` |
| event detail | `<h1 class="_pageTitle_148zl_1">` | **0.410: `footer._footer_zso89_1`** (footer pushed down when content loads) |
| person | `<img class="_authorPhotoMobile_w8wfp_124" loading="eager">` (no fetchpriority) | **0.375 + 0.184: footer**; rande-cook: 0.386 from `div._meta_w8wfp_227` hero, 0.161 from footer |
| interview | not reported (text) | **0.410: footer**; 0.044: `header._header_8jkrg_8` |

The detail pages (event, person, interview) all share one CLS pattern. The page first renders a short loading state, so the footer appears near the top. When the data arrives, the footer jumps down, giving CLS of 0.41–0.58 (the "good" threshold is under 0.1). On `/`, the shifts come from the lineup carousel section changing size as its data loads.

## Accessibility failures (failing node counts)

| Page | color-contrast | label-content-name-mismatch | other |
|---|---|---|---|
| `/` | 23 | 16 | — |
| `/` desktop | 19 | 16 | — |
| `/events` | 26 | — | — |
| `/authors` | 8 | — | — |
| `/interviews` | 8 | 36 | — |
| `/kidsfest2026` | 22 | 13 | — |
| event detail | 19 | — | — |
| person | 9 | — | loading state only: landmark-one-main 1, skip-link 1 |
| interview | 21 | — | — |

Most common contrast offenders, counted across all reports: `_footerNavHeading_zso89_61` (48), `_title_15qvo_5` (16), `_button_15qvo_55` (16), `_comingSoon_v5qsb_1` (13), `_footerNavLink_zso89_79` (12), `_footerCopyright_zso89_175` (12), `_detailLabel_obnrk_70` (12), `_eventSoldOut_1qvpw_133` (12), `_rowSoldOut_blmmc_205` (10), `_eyebrow_1qvpw_31` (8), `_dayHeading_blmmc_72` (7).
`label-content-name-mismatch` comes from interview cards (`a._card_1i73y_143`). Each card has `aria-label="Read interview with X"`, which doesn't contain the card's visible text (WCAG 2.5.3, Label in Name).

## Opportunities (mobile; consistent across pages)

| Opportunity | `/` | `/events` | `/authors` | `/interviews` | kidsfest | event | person | interview |
|---|---|---|---|---|---|---|---|---|
| Unused JS (KiB / est. LCP ms) | 180 / 850–1150 | 185 / 950 | 188 / 1050 | 189 / 900 | 182 / 1000 | 173 / 750 | 188 | 184 / 950 |
| Render-blocking (est. FCP ms) | 970 | 940 | 980 | 1030 | 990 | 970 | 1000 | 1020 |
| Image delivery, total (KiB) | 1,567 | 1,102 | 2,019 | 1,595 | 1,361 | 1,186 | 1,165 | 1,181 |
|   of which properly size images (KiB) | 1,489 | 1,090 | 1,984 | 1,569 | 1,186 | 1,108 | 1,090 | 1,169 |
|   of which modern formats (KiB) | 228 | 242 | 451 | 297 | 444 | 306 | 305 | 242 |
| Unused CSS (KiB) | 25 | 28 | 28 | 29 | 25 | 26 | 28 | 28 |
| Cache TTL (KiB) | 1,960 | 967 | 689 | 407 | 177 | 86 | 51 | 73 |
| Legacy JS (KiB) | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 |

Desktop `/`: image delivery savings 4,556 KiB, cache 3,556 KiB, render-blocking 310 ms.
The sizing and format numbers overlap, so they don't add up to the total.
- Render-blocking: the Google Fonts CSS (Courier Prime + DM Sans + Inter, about 820 ms) plus `index-*.css` (about 150 ms).
- Cache: images under `api.../wp-content/uploads` have a 4 h TTL (14,400,000 ms). For example, the Ozeki photo is 377 KB and Griffin cover `683x1024` is 170 KB but displays at 183×275.
- LCP discovery: the LCP resource is missing `fetchpriority=high` and isn't discoverable from the initial HTML, as expected for an SPA.

## Security headers

| Header | Site (`/`) | API (`/wp-json/...`) |
|---|---|---|
| Content-Security-Policy | **absent** | **absent** |
| Strict-Transport-Security | **absent** (http→https 301 exists) | **absent** |
| X-Content-Type-Options | nosniff | nosniff |
| Referrer-Policy | strict-origin-when-cross-origin | **absent** |
| Permissions-Policy | **absent** | **absent** |
| X-Frame-Options | **absent** | **absent** |
| Cache-Control | `public, max-age=0, must-revalidate` | GET: `public, max-age=600, s-maxage=600, stale-while-revalidate=86400` (HEAD responses carry no Cache-Control) |
| cf-cache-status | DYNAMIC | **DYNAMIC on all 4+ consecutive calls**. The API JSON is never served from the Cloudflare edge cache despite `s-maxage=600`. |

- The site also sends `access-control-allow-origin: *`. The API sends `x-robots-tag: noindex`.
- `GET /wp-json/wp/v2/users`: **exposed**. HTTP 200 with **3 users** (`x-wp-total: 3`); names not recorded.
- `/xmlrpc.php`: **blocked**. GET and POST (`system.listMethods`) both return a 404 HTML page.

## API timing (3 runs each, gzip, from Victoria-area YVR edge)

| Endpoint | Status | Transfer (gzip) | Uncompressed | total time runs (s) | Median |
|---|---|---|---|---|---|
| `/wp-json/wp/v2/festival_events?per_page=100` (21 items) | 200 | 33.5 KB | 190.0 KB | 0.421 / 0.359 / 0.385 | **385 ms** |
| `/wp-json/vfa/v1/people/authors?year=2026` | 200 | 9.1 KB | 48.4 KB | 0.196 / 0.185 / 0.206 | **196 ms** |

TTFB makes up almost all of the time (for example 0.419 of 0.421 s), so the wait is server work at the WordPress origin, not transfer. `cf-cache-status: DYNAMIC` confirms every request reaches the origin.
