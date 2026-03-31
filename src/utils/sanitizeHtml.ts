import DOMPurify from 'dompurify';

/**
 * Sanitize HTML string for safe rendering.
 * @param html Raw HTML string
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html);
}
