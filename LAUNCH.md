# VFA Launch Plan

**Frontend:** Cloudflare Pages  
**Backend:** WordPress at `api.victoriafestivalofauthors.ca`  
**Target domain:** `victoriafestivalofauthors.ca`

---

## Phase 1 — Before touching DNS

Complete all of these before the DNS flip. Most can be done days in advance.

### Images
- [x] Compress and remove unused local assets (`src/assets/`) — done 2026-08-14
- [ ] Install **Smush** on WordPress admin → run Bulk Smush on the media library  
      _WP Admin → Plugins → Add New → search "Smush" → Install → Bulk Smush_

### SEO & discoverability
- [ ] Remove `noindex` from `index.html` — do this as the very last commit before DNS flip  
      Delete: `<meta name="robots" content="noindex, nofollow" />`
- [ ] Add `public/robots.txt`:
      ```
      User-agent: *
      Allow: /

      Sitemap: https://victoriafestivalofauthors.ca/sitemap.xml
      ```
- [ ] Add `public/sitemap.xml` with static routes (`/`, `/events`, `/authors`, `/interviews`, `/books`, `/venues`, `/kidsfest2026`, `/about`, etc.)
- [ ] Add Open Graph meta tags to `index.html`:
      ```html
      <meta name="description" content="Victoria Festival of Authors — celebrating the best in Canadian and international literature." />
      <meta property="og:title" content="Victoria Festival of Authors" />
      <meta property="og:description" content="Celebrating the best in Canadian and international literature." />
      <meta property="og:image" content="https://victoriafestivalofauthors.ca/og-image.jpg" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://victoriafestivalofauthors.ca" />
      <meta name="twitter:card" content="summary_large_image" />
      ```
- [ ] Create a 1200×630px `og-image.jpg` and place it in `public/`

### Data & backend
- [ ] Export all content from dev/staging WordPress (Tools → Export → All content)
- [ ] Import to production WordPress (Tools → Import → WordPress)
- [ ] Verify events, authors, venues, interviews, and books appear at `api.victoriafestivalofauthors.ca/wp-json/wp/v2/`
- [ ] Set aggressive cache headers for archived Q&A posts (they never change — 7-day TTL)
- [ ] Install a WP REST API caching plugin (e.g. WP REST Cache) with 30–60 min TTL for live content

### CORS
- [ ] Confirm WordPress sends `Access-Control-Allow-Origin: https://victoriafestivalofauthors.ca`
- [ ] Test by adding `victoriafestivalofauthors.ca` to `/etc/hosts` pointing at Cloudflare Pages, then loading the site and checking the Network tab for CORS errors

### Redirects
- [ ] Add any old WordPress URL 301 redirects to `public/_redirects` (e.g. `/about-us/` → `/about`)
- [ ] Confirm `www` redirect is handled in Cloudflare (www → apex or apex → www, pick one)

---

## Phase 2 — DNS cutover

**Do this in one focused session. Email must not go down.**

1. Log into your DNS provider and **write down every MX record** before touching anything
2. Set TTL to 300s on the A/CNAME records (do this 30 min before the flip so it propagates fast)
3. In Cloudflare Pages, add `victoriafestivalofauthors.ca` as a custom domain
4. Update only the **A/CNAME record** for the apex (`@`) and `www` — point to Cloudflare Pages
5. **Do not touch MX records**
6. Deploy the final build (with `noindex` removed) immediately after the DNS update
7. Verify propagation: `dig victoriafestivalofauthors.ca` and `curl -I https://victoriafestivalofauthors.ca`
8. After everything is stable, set TTL back to 3600

SSL is handled automatically by Cloudflare Pages — no action needed.

---

## Phase 3 — Smoke test checklist

Run these immediately after DNS propagates.

**Pages**
- [ ] Home page loads, event browser carousel shows events
- [ ] Authors page loads with author list
- [ ] Events page loads with upcoming events and filters work
- [ ] Single event detail page loads (test a `/events/[slug]` URL)
- [ ] Single author page loads
- [ ] Interviews grid loads
- [ ] Books page loads
- [ ] Venues page loads
- [ ] KidsFest page loads

**Functionality**
- [ ] Newsletter signup submits without error
- [ ] Eventbrite ticket links work
- [ ] No CORS errors in browser console (check Network tab)
- [ ] `loading="lazy"` images load as you scroll

**Infrastructure**
- [ ] Google Analytics: open GA4 Realtime and confirm your own visit is tracked
- [ ] Send yourself a test email to `@victoriafestivalofauthors.ca` — confirm mail still works
- [ ] `https://victoriafestivalofauthors.ca/robots.txt` returns the file
- [ ] Paste the URL into [Facebook Debugger](https://developers.facebook.com/tools/debug/) — confirm OG image and title appear
- [ ] SSL padlock shows in browser (should be automatic)
- [ ] Check a 404 URL — confirm it shows a reasonable error page, not a blank screen

---

## Caching reference

| Layer | Config | Status |
|---|---|---|
| React Query (client) | 1-hour staleTime + gcTime in production | ✅ Done |
| WordPress REST API | WP REST Cache plugin, 30–60 min TTL | ⬜ To do |
| Archived Q&A posts | 7-day TTL cache headers | ⬜ To do |
| Cloudflare CDN | Static JS/CSS/images cached automatically | ✅ Automatic |
| Cloudflare Polish (WebP) | Paid feature — not available on free plan | N/A |

**Testing the cache:**
- Open DevTools → Network → click a WP API request → check for `Cache-Control`, `Age`, `X-Cache` response headers
- To verify React Query's 1-hour client cache: navigate away and back — no new network request should fire within the hour
- To force a fresh load: open a private/incognito window (clears React Query memory cache)

---

## Things to watch post-launch

- Monitor GA4 for the first 48 hours for unexpected 404s or drop-off pages
- Check Cloudflare analytics for any spike in error rates after DNS cutover
- Watch for any broken image links from the WP media library (sign that Smush or CORS missed something)
