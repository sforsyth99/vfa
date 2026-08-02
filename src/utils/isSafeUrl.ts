/**
 * Returns true only for absolute URLs whose protocol is safe to place in an href.
 * Blocks javascript:, data:, and other executable/opaque protocols so
 * attacker-controlled URLs from the API can't run script when clicked.
 * Intended for external links (author websites, event URLs) which should always
 * be absolute; relative/malformed input returns false.
 */
export function isSafeUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(protocol);
  } catch {
    return false;
  }
}
