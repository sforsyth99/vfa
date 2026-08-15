#!/usr/bin/env node
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE_URL = 'https://victoriafestivalofauthors.ca';
const API_BASE = 'https://api.victoriafestivalofauthors.ca/wp-json/wp/v2';

const STATIC_ROUTES = [
  { path: '/',               priority: '1.0', changefreq: 'daily' },
  { path: '/events',         priority: '0.9', changefreq: 'daily' },
  { path: '/authors',        priority: '0.9', changefreq: 'weekly' },
  { path: '/interviews',     priority: '0.9', changefreq: 'weekly' },
  { path: '/books',          priority: '0.8', changefreq: 'weekly' },
  { path: '/venues',         priority: '0.8', changefreq: 'monthly' },
  { path: '/kidsfest2026',   priority: '0.8', changefreq: 'weekly' },
  { path: '/who-we-are',     priority: '0.6', changefreq: 'monthly' },
  { path: '/strategic-plan', priority: '0.5', changefreq: 'monthly' },
  { path: '/archives',       priority: '0.5', changefreq: 'monthly' },
];

async function fetchAllSlugs(endpoint) {
  const slugs = [];
  let page = 1;
  while (true) {
    const res = await fetch(`${API_BASE}/${endpoint}?per_page=100&page=${page}&_fields=slug`);
    const items = await res.json().catch(() => []);
    if (!Array.isArray(items) || !items.length) break;
    slugs.push(...items.map((item) => item.slug).filter(Boolean));
    const total = parseInt(res.headers.get('X-WP-TotalPages') ?? '1', 10);
    if (page >= total) break;
    page++;
  }
  return slugs;
}

function urlEntry(path, priority, changefreq) {
  return `  <url>
    <loc>${BASE_URL}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function main() {
  console.log('Generating sitemap...');

  const [eventSlugs, peopleSlugs, interviewSlugs, venueSlugs, bookSlugs] = await Promise.all([
    fetchAllSlugs('festival_events'),
    fetchAllSlugs('people'),
    fetchAllSlugs('interviews'),
    fetchAllSlugs('venues'),
    fetchAllSlugs('books'),
  ]);

  console.log(`  ${eventSlugs.length} events, ${peopleSlugs.length} people, ${interviewSlugs.length} interviews, ${venueSlugs.length} venues, ${bookSlugs.length} books`);

  const entries = [
    ...STATIC_ROUTES.map(({ path, priority, changefreq }) => urlEntry(path, priority, changefreq)),
    ...eventSlugs.map((slug) => urlEntry(`/events/${slug}`, '0.8', 'weekly')),
    ...peopleSlugs.map((slug) => urlEntry(`/people/${slug}`, '0.7', 'monthly')),
    ...interviewSlugs.map((slug) => urlEntry(`/interviews/${slug}`, '0.7', 'monthly')),
    ...venueSlugs.map((slug) => urlEntry(`/venues/${slug}`, '0.6', 'monthly')),
    ...bookSlugs.map((slug) => urlEntry(`/books/${slug}`, '0.6', 'monthly')),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

  const outPath = join(__dirname, '../public/sitemap.xml');
  writeFileSync(outPath, xml, 'utf-8');
  console.log(`Sitemap written to public/sitemap.xml (${entries.length} URLs)`);
}

main().catch((err) => {
  console.error('Sitemap generation failed:', err.message);
  process.exit(1);
});
