# VFA WordPress Plugins

This directory contains custom WordPress plugins for the VFA headless WordPress setup.
These plugins are installed on `api.victoriafestivalofauthors.ca` and expose structured
content via the WordPress REST API for consumption by the React frontend.

## Prerequisite Plugins

The following plugins must be installed and activated before using `vfa-custom-fields`:

### 1. CPT UI
- **Install from:** WordPress Plugin Directory (search "CPT UI")
- **Purpose:** Registers custom post types (e.g. Interviews, Author Profiles, Books)
- **Critical setting:** Each post type must have **Show in REST API** set to `True` and a REST API base slug set

### 2. Meta Box
- **Install from:** WordPress Plugin Directory (search "Meta Box")
- **Purpose:** Provides the admin UI for structured custom fields (text, image, URL, cloneable fields)
- **Note:** The free tier is sufficient — Meta Box Pro is not required

---

## vfa-custom-fields

A custom plugin that defines structured fields for each custom post type and exposes
them in the REST API under a dedicated key per post type.

### How it works

For each post type there are two parts:

1. **`rwmb_meta_boxes` filter** — defines the fields that appear in the WordPress admin editor
2. **`register_rest_field`** — exposes the saved field values in the REST API response

### Example: Interviews post type

The `interviews` post type has the following fields defined:

| Field | Type | Description |
|---|---|---|
| `author_name` | Text | Full name of the interviewed author |
| `interviewer_name` | Text | Full name of the interviewer |
| `author_photo` | Image | Photo of the author (returns URL, width, height) |
| `author_bio_url` | URL | Link to the author's bio page |
| `intro` | Textarea | Introductory paragraph about the author |
| `question` | Text (cloneable) | One entry per question, in order |
| `answer` | Textarea (cloneable) | One entry per answer, in order |

> **Note for editors:** Questions and answers are paired by position. Question 1 matches
> Answer 1, Question 2 matches Answer 2, etc. Always add them in the same order.

The REST API response for an interview post includes an `interview_data` key:

```json
{
  "id": 123,
  "slug": "qa-with-jane-smith",
  "title": { "rendered": "Q&A with Jane Smith" },
  "interview_data": {
    "author_name": "Jane Smith",
    "interviewer_name": "John Doe",
    "author_bio_url": "https://victoriafestivalofauthors.ca/authors/jane-smith",
    "intro": "Jane Smith is an award-winning poet from Victoria, BC.",
    "author_photo": ["https://api.victoriafestivalofauthors.ca/wp-content/uploads/jane.jpg", 1024, 588, true],
    "question": ["What inspired your latest collection?", "Who are your influences?"],
    "answer": ["Growing up on the coast...", "I have always admired..."]
  }
}
```

### Adding a new post type

To add fields for a new post type (e.g. `author_profiles`):

1. Register the post type in CPT UI with Show in REST API set to `True`
2. Add a new entry to the `rwmb_meta_boxes` filter in `vfa-custom-fields.php`
3. Add a new `register_rest_field` call for the new post type
4. Add corresponding TypeScript types and a fetch hook in the React frontend

---

## Going Live: Domain & Deployment Setup

### Architecture

| Domain | Purpose |
|---|---|
| `victoriafestivalofauthors.ca` | React frontend, served by Vercel |
| `api.victoriafestivalofauthors.ca` | WordPress REST API backend, served by cPanel hosting at `209.59.191.250` |

The `api.` subdomain stays on the cPanel hosting server permanently. Only the root domain is moved to Vercel.

---

### Step 1 — Add the domain in Vercel

1. Go to your Vercel project → **Settings → Domains**
2. Add `victoriafestivalofauthors.ca`
3. Optionally add `www.victoriafestivalofauthors.ca` as well
4. Vercel will display a DNS record to add — it will be either:
   - An **A record** pointing to a Vercel IP (e.g. `76.76.21.21`), or
   - A **CNAME record** pointing to `cname.vercel-dns.com`
5. Copy the record details before moving to cPanel

---

### Step 2 — Update DNS in cPanel

1. Log into cPanel and go to **Zone Editor**
2. Click **Manage** next to `victoriafestivalofauthors.ca`
3. Find the existing A record for the root domain (`victoriafestivalofauthors.ca`) currently pointing to `209.59.191.250`
4. Edit it to use the value Vercel provided in Step 1
5. **Do not touch** the A record for `api.victoriafestivalofauthors.ca` — it must stay pointing to `209.59.191.250`

---

### Step 3 — Deploy the React app

Push the latest code to your main branch and Vercel will deploy automatically:

```bash
git add .
git commit -m "Add interviews feature"
git push
```

---

### Step 4 — Verify

After DNS propagates (usually a few minutes, up to 24 hours):

- `https://victoriafestivalofauthors.ca` → React frontend
- `https://api.victoriafestivalofauthors.ca/wp-json/wp/v2/interviews` → WordPress REST API
- `https://api.victoriafestivalofauthors.ca/wp-admin` → WordPress admin for editors

---

### Notes

- DNS changes can take up to 24 hours to propagate globally, though usually much faster
- Vercel automatically provisions an SSL certificate for the custom domain
- The existing SSL on `api.victoriafestivalofauthors.ca` is unaffected by this change
