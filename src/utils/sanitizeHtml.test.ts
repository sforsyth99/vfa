import { describe, it, expect } from 'vitest';
import { sanitizeHtml } from './sanitizeHtml';
import { WP_ORIGIN } from '../api/commonTypes';

describe('sanitizeHtml', () => {
  it('passes through safe HTML unchanged', () => {
    const html = '<p>Hello <strong>world</strong></p>';
    expect(sanitizeHtml(html)).toBe(html);
  });

  it('strips script tags', () => {
    const result = sanitizeHtml('<p>Safe</p><script>alert("xss")</script>');
    expect(result).not.toContain('<script>');
    expect(result).toContain('<p>Safe</p>');
  });

  it('strips dangerous event attributes', () => {
    const result = sanitizeHtml('<a href="#" onclick="evil()">Click</a>');
    expect(result).not.toContain('onclick');
  });

  it('strips javascript: hrefs', () => {
    const result = sanitizeHtml('<a href="javascript:evil()">Click</a>');
    expect(result).not.toContain('javascript:');
  });

  it('rewrites absolute WP_ORIGIN URLs to relative paths', () => {
    const html = `<img src="${WP_ORIGIN}/wp-content/uploads/photo.jpg" />`;
    const result = sanitizeHtml(html);
    expect(result).not.toContain(WP_ORIGIN);
    expect(result).toContain('/wp-content/uploads/photo.jpg');
  });

  it('handles multiple WP_ORIGIN occurrences in one string', () => {
    const html = `<img src="${WP_ORIGIN}/a.jpg" /><img src="${WP_ORIGIN}/b.jpg" />`;
    const result = sanitizeHtml(html);
    expect(result).not.toContain(WP_ORIGIN);
  });

  it('returns an empty string for empty input', () => {
    expect(sanitizeHtml('')).toBe('');
  });
});
