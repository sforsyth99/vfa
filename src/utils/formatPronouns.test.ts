import { describe, it, expect } from 'vitest';
import { formatPronouns } from './formatPronouns';

describe('formatPronouns', () => {
  it('returns null for an empty string', () => {
    expect(formatPronouns('')).toBeNull();
  });

  it('returns null when pronouns is "other" and pronounsOther is not provided', () => {
    expect(formatPronouns('other')).toBeNull();
  });

  it('returns null when pronouns is "other" and pronounsOther is an empty string', () => {
    expect(formatPronouns('other', '')).toBeNull();
  });

  it('returns pronounsOther when pronouns is "other"', () => {
    expect(formatPronouns('other', 'ze/zir')).toBe('ze/zir');
  });

  it('replaces underscore with slash for standard pronoun pairs', () => {
    expect(formatPronouns('he_him')).toBe('he/him');
    expect(formatPronouns('she_her')).toBe('she/her');
    expect(formatPronouns('they_them')).toBe('they/them');
  });
});
