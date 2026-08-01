import { describe, it, expect } from 'vitest';
import { eventPath } from './eventPath';

describe('eventPath', () => {
  it('returns the KidsFest path when isKidfest is true', () => {
    expect(eventPath('any-slug', true)).toBe('/kidsfest2026');
  });

  it('ignores the slug when isKidfest is true', () => {
    expect(eventPath('', true)).toBe('/kidsfest2026');
  });

  it('returns a slug-based path when isKidfest is false', () => {
    expect(eventPath('margaret-atwood-reading', false)).toBe('/festival-events/margaret-atwood-reading');
  });

  it('handles slugs with numbers and hyphens', () => {
    expect(eventPath('event-2026-01', false)).toBe('/festival-events/event-2026-01');
  });

  it('returns the base path for an empty slug when isKidfest is false', () => {
    expect(eventPath('', false)).toBe('/festival-events/');
  });
});
