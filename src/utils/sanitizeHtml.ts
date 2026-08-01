import DOMPurify from 'dompurify';
import { WP_ORIGIN } from '../api/commonTypes.ts';

export function sanitizeHtml(html: string): string {
  const rewritten = html.replaceAll(WP_ORIGIN, '');
  return DOMPurify.sanitize(rewritten);
}
