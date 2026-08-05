import DOMPurify from 'dompurify';
import { WP_ORIGIN } from '../api/commonTypes.ts';

export function sanitizeHtml(html: string): string {
  const rewritten = html.replaceAll(WP_ORIGIN, '');
  return DOMPurify.sanitize(rewritten, {
    FORBID_TAGS: ['font'],
    FORBID_ATTR: ['style', 'color', 'face', 'size'],
  });
}

// Sanitizes plain-text newsletter content returned by the PHP endpoint.
// The excerpt is already extracted and truncated server-side; this is a
// safety net to ensure nothing unexpected comes through as HTML.
export function extractNewsletterExcerpt(text: string): string {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}
