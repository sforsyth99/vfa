# Migration & Switchover Instructions

## 1. Set Up Staging WordPress Backend

- In cPanel, create an `api` subdomain (e.g., `api.victoriafestivalofauthors.com`) and route it to a new `api` folder.
- Install a fresh WordPress instance in this folder.

## 2. Migrate Content

- Use the migration plugin to export content from the original site and import it into the new staging site.

## 3. Point Frontend to Staging API

- Update your Vercel (React) frontend to use the new API endpoint (`api.victoriafestivalofauthors.com`) for development
  and testing.

## 4. Make Major Changes on API

- Log in to the API WordPress site.
- Remove extra media, posts, plugins.

## 5. Prepare for Launch

- Freeze content on the live site to prevent new changes.
- If needed, manually sync any last content updates to staging.

## 6. Update DNS

- Point your main domain to the Vercel frontend.
- Ensure email (MX) records are not modified during DNS changes.

## 7. Post-Launch

- Monitor the new site for issues.
- Be ready to revert DNS if necessary.

---

**Note:** Double-check DNS settings to avoid disrupting email services.
