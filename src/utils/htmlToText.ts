/**
 * Extracts plain text from an HTML string, for previews/excerpts.
 * Uses DOMParser, which is inert — it never executes scripts or loads resources,
 * so this is safe to run on untrusted HTML from the API.
 */
export function htmlToText(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim();
}
