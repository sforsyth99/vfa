import { describe, it, expect } from 'vitest';
import { isSafeUrl } from './isSafeUrl';

describe('isSafeUrl', () => {
  it('allows http and https', () => {
    expect(isSafeUrl('http://example.com')).toBe(true);
    expect(isSafeUrl('https://example.com/path?q=1')).toBe(true);
  });

  it('allows mailto and tel', () => {
    expect(isSafeUrl('mailto:hello@vfa.ca')).toBe(true);
    expect(isSafeUrl('tel:+12505551234')).toBe(true);
  });

  it('blocks javascript: URLs', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('JavaScript:alert(1)')).toBe(false);
  });

  it('blocks data: and other executable/opaque protocols', () => {
    expect(isSafeUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    expect(isSafeUrl('vbscript:msgbox(1)')).toBe(false);
  });

  it('returns false for unparseable input', () => {
    expect(isSafeUrl('')).toBe(false);
    expect(isSafeUrl('not a url')).toBe(false);
  });
});
