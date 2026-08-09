import { describe, it, expect } from 'vitest';
import { eventPath } from './eventPath';

describe('eventPath', () => {
  it('returns a slug-based path', () => {
    expect(eventPath('margaret-atwood-reading')).toBe('/events/margaret-atwood-reading');
  });

  it('returns a slug-based path for kidfest events', () => {
    expect(eventPath('kidfest-workshop')).toBe('/events/kidfest-workshop');
  });

  it('handles slugs with numbers and hyphens', () => {
    expect(eventPath('event-2026-01')).toBe('/events/event-2026-01');
  });

  it('returns the base path for an empty slug', () => {
    expect(eventPath('')).toBe('/events/');
  });
});
