/**
 * Decodes HTML entities in a string (e.g., Q&amp;A → Q&A).
 * @param html HTML-encoded string
 * @returns Decoded string
 */
export function decodeHtmlEntities(html: string): string {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}
