import DOMPurify from 'dompurify';

const WP_ORIGIN = 'https://api.victoriafestivalofauthors.ca';

export function sanitizeHtml(html: string): string {
  const rewritten = html.replaceAll(WP_ORIGIN, '');
  return DOMPurify.sanitize(rewritten);
}
