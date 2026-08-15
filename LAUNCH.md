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
- [x] Add `public/robots.txt` — done 2026-08-15
- [x] Add `public/sitemap.xml` — done 2026-08-15; run `npm run generate-sitemap` again after WP data migration to add all dynamic slugs
- [x] Add Open Graph meta tags to `index.html` — done 2026-08-15
      ```html
      <meta name="description" content="Victoria Festival of Authors — celebrating the best in Canadian and international literature." />
      <meta property="og:title" content="Victoria Festival of Authors" />
      <meta property="og:description" content="Celebrating the best in Canadian and international literature." />
      <meta property="og:image" content="https://victoriafestivalofauthors.ca/og-image.jpg" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://victoriafestivalofauthors.ca" />
      <meta name="twitter:card" content="summary_large_image" />
      ```
- [x] Create OG image — using Facebook cover photo at `public/og-image.jpg`, done 2026-08-15

### Data & backend
- [x] Production WordPress data is live at `api.victoriafestivalofauthors.ca` — no migration needed
- [ ] Set aggressive cache headers for archived Q&A posts (they never change — 7-day TTL)
- [ ] Upload and activate vfa-cache plugin (see Caching section below for setup steps)

### CORS
- [x] Confirmed WordPress sends `Access-Control-Allow-Origin: https://victoriafestivalofauthors.ca` — done 2026-08-15

### Redirects
- [ ] Add any old WordPress URL 301 redirects to `public/_redirects` (e.g. `/about-us/` → `/about`)
- [ ] Confirm `www` redirect is handled in Cloudflare (www → apex or apex → www, pick one)

---

## Phase 2 — DNS cutover

**Infrastructure context:**
- Domain registered at canspace.ca
- DNS/nameservers managed in cPanel at exacthosting (Island Hosting)
- Email is hosted externally — MX points to `mx.victoriafestivalofauthors.ca.cust.A.hostedemail.com`
- Backend WordPress stays at exacthosting (`api` A record → `209.59.191.250`) — never touch this
- Frontend moves from exacthosting → Cloudflare Pages

**Email is safe as long as the MX record is never touched.** Incoming mail delivery depends only on MX, not the apex A record.

---

### Step 0 — Write down everything before touching anything

Before any changes, record these so you can revert:
- Log into cPanel → note the current nameservers (e.g. `ns1.islandhosting.com`)
- Screenshot or copy the full DNS zone from cPanel (you already have this from our conversation)
- Confirm the old WordPress site is still loading at `http://209.59.191.250` directly (by IP) — this means exacthosting is still serving it and the revert target is intact

**To revert at any point:** Go to canspace.ca and change the nameservers back to the exacthosting ones. Because TTL will be 300s, the old site comes back within 5–10 minutes. The old WordPress site at exacthosting is never deleted during this process — it stays running the whole time.

---

### Step 1 — Fix mail subdomains in cPanel (do this first, any time, zero risk)

`mail`, `smtp`, and `imap` currently CNAME to the apex. Once the apex changes they'll break. Fix them before anything else:

In cPanel Zone Editor, change these from CNAME → A records:
- `mail.victoriafestivalofauthors.ca` → A → `209.59.191.250`
- `smtp.victoriafestivalofauthors.ca` → A → `209.59.191.250`
- `imap.victoriafestivalofauthors.ca` → A → `209.59.191.250`

After this step, email is fully independent of the apex. ✓

---

### Step 1b — Fix SSL for api subdomain (do before nameserver transfer)

The current wildcard cert (`*.victoriafestivalofauthors.ca`) expires **Sep 17 2026**. After nameserver transfer, cPanel can't auto-renew it because wildcard renewal requires DNS challenge and cPanel won't have access to Cloudflare's DNS.

Fix: in cPanel → SSL/TLS → request a **non-wildcard cert for `api.victoriafestivalofauthors.ca` only**. Non-wildcard certs use HTTP challenge and will auto-renew as long as `api` is grey cloud (DNS-only) in Cloudflare.

Do this before changing nameservers. Once it's issued, the `api` subdomain has its own independent cert that never depends on cPanel DNS access.

---

### Step 2 — Add site to Cloudflare DNS (do before changing nameservers)

1. Go to cloudflare.com → Add a site → enter `victoriafestivalofauthors.ca`
2. Cloudflare scans and imports existing DNS records
3. **Verify these records came through correctly before proceeding:**
   - MX → `mx.victoriafestivalofauthors.ca.cust.A.hostedemail.com` (priority 0)
   - `api` A → `209.59.191.250`
   - SPF TXT → `v=spf1 include:spf.exacthosting.com include:relay.mailchannels.net ~all`
   - `default._domainkey` TXT (long DKIM key)
   - `k2._domainkey` CNAME → `dkim2.mcsv.net` (Mailchimp)
   - `k3._domainkey` CNAME → `dkim3.mcsv.net` (Mailchimp)
   - `he._domainkey` CNAME → `_domainkey.exacthosting.com`
   - DMARC TXT → `v=DMARC1; p=none;`
4. **Set `api.victoriafestivalofauthors.ca` to orange cloud (proxied)** — this lets Cloudflare cache API responses, which the vfa-cache plugin then purges on content save. Set Cloudflare SSL mode for the zone to **Full** (not Full Strict) so it doesn't validate the origin cert.
5. Add the Cloudflare Pages custom domain (`victoriafestivalofauthors.ca`) in Pages → Custom domains
6. Cloudflare will add the correct apex and www records automatically in its DNS

---

### Step 3 — Change nameservers at canspace.ca

1. Log into canspace.ca
2. Find nameserver settings for `victoriafestivalofauthors.ca`
3. Replace the exacthosting nameservers with the two Cloudflare provides (e.g. `xxx.ns.cloudflare.com`)
4. Save — propagation takes up to 24–48 hours but often faster

During propagation: the old site may show briefly, then Cloudflare takes over. Email is unaffected throughout.

---

### Step 4 — Remove noindex and deploy

Once Cloudflare DNS is active and the site is resolving correctly:
1. Delete this line from `index.html`: `<meta name="robots" content="noindex, nofollow" />`
2. Push to GitHub — Cloudflare Pages auto-deploys
3. Verify at `https://victoriafestivalofauthors.ca`

SSL is handled automatically by Cloudflare — no action needed.

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

## Caching setup and testing

### How the layers work

| Layer | What it caches | How long | How it clears |
|---|---|---|---|
| Cloudflare CDN | WP API responses (`api.*`) + frontend assets | Until purged | vfa-cache plugin purges on every WP save |
| React Query (browser) | API data per visitor | 1 hour | Expires automatically; incognito window bypasses it |
| Cloudflare Pages | JS/CSS/image files | Until next deploy | Auto-cleared on every GitHub push |

---

### Step A — Configure the vfa-cache plugin

Upload `vfa-cache.zip` via WP Admin → Plugins → Add New → Upload Plugin → Activate.

Then add three lines to `wp-config.php` on exacthosting (above "That's all, stop editing"):

```php
define('VFA_CLOUDFLARE_ZONE_ID',    'your-zone-id');
define('VFA_CLOUDFLARE_API_TOKEN',  'your-api-token');
define('VFA_CLOUDFLARE_DEPLOY_HOOK','https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/...');
```

**Where to find each value:**
- **Zone ID:** Cloudflare dashboard → `victoriafestivalofauthors.ca` → Overview → right sidebar
- **API Token:** Cloudflare → My Profile → API Tokens → Create Token → use "Edit zone DNS" template → scope to this zone → change permission to **Zone → Cache Purge** only
- **Deploy Hook:** Cloudflare Pages → your project → Settings → Build & deployments → Deploy hooks → Create hook (name it "WP content publish") → copy the URL

---

### Step B — Verify the cache purge is working

1. Go to WP Admin → Tools → VFA Cache
2. Confirm status shows **✓ Configured** for both credentials and deploy hook
3. Click **Purge entire cache now** — it should show "✓ Success · X seconds ago"
4. Open DevTools → Network in your browser
5. Load `https://api.victoriafestivalofauthors.ca/wp-json/wp/v2/festival_events?per_page=1`
6. Check the response headers — you should see:
   - `CF-Cache-Status: HIT` (Cloudflare served a cached response) after the first load
   - After a purge: `CF-Cache-Status: MISS` on the next request, then `HIT` again after that

---

### Step C — Verify the deploy hook is working

1. WP Admin → Tools → VFA Cache → click **Trigger deploy now**
2. Should show "✓ Deploy triggered (build ID: ...)"
3. Go to Cloudflare Pages → your project → Deployments — you should see a new build starting within 30 seconds
4. The build takes ~1–2 minutes; when complete, the sitemap will have been regenerated

**What triggers a deploy automatically:** saving, publishing, or deleting an interview, event, author, venue, or book in WordPress.

---

### What to expect after publishing new content

| Who | What they see | Why |
|---|---|---|
| New visitor | Fresh content immediately | Cloudflare cache was purged on save |
| Visitor already on the site | Old content for up to 1 hour | React Query client cache hasn't expired |
| Google (sitemap) | New URL within 2–3 minutes | Deploy hook triggered a rebuild |

**To see changes immediately as a logged-in editor:** open an incognito window — this bypasses React Query's browser cache.

**To manually bust everything:** WP Admin → Tools → VFA Cache → Purge entire cache now.

---

## Things to watch post-launch

- Monitor GA4 for the first 48 hours for unexpected 404s or drop-off pages
- Check Cloudflare analytics for any spike in error rates after DNS cutover
- Watch for any broken image links from the WP media library (sign that Smush or CORS missed something)
