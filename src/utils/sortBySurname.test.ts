import { describe, it, expect } from 'vitest';
import { sortBySurname, bySurname } from './sortBySurname';

describe('sortBySurname', () => {
  it('sorts people by surname alphabetically', () => {
    const people = [
      { name: 'Margaret Atwood' },
      { name: 'Alice Munro' },
      { name: 'Michael Ondaatje' },
    ];
    const sorted = sortBySurname(people);
    expect(sorted.map((p) => p.name)).toEqual([
      'Margaret Atwood',
      'Alice Munro',
      'Michael Ondaatje',
    ]);
  });

  it('is case-insensitive', () => {
    const people = [{ name: 'Zara zane' }, { name: 'Alan Abel' }];
    expect(sortBySurname(people).map((p) => p.name)).toEqual(['Alan Abel', 'Zara zane']);
  });

  it('does not mutate the original array', () => {
    const people = [{ name: 'Bob Ziegler' }, { name: 'Amy Adams' }];
    const original = [...people];
    sortBySurname(people);
    expect(people).toEqual(original);
  });

  it('handles single-word names', () => {
    const people = [{ name: 'Zara' }, { name: 'Alice' }];
    expect(sortBySurname(people).map((p) => p.name)).toEqual(['Alice', 'Zara']);
  });

  it('handles names with multiple spaces (uses last word as surname)', () => {
    const people = [
      { name: 'Mary Jo Young' },
      { name: 'Jean-Paul Dupont' },
      { name: 'Anna Berg' },
    ];
    expect(sortBySurname(people).map((p) => p.name)).toEqual([
      'Anna Berg',
      'Jean-Paul Dupont',
      'Mary Jo Young',
    ]);
  });

  it('returns an empty array unchanged', () => {
    expect(sortBySurname([])).toEqual([]);
  });

  it('preserves extra fields on the objects', () => {
    const people = [
      { name: 'Bob Ziegler', id: 2 },
      { name: 'Amy Adams', id: 1 },
    ];
    expect(sortBySurname(people)[0]).toEqual({ name: 'Amy Adams', id: 1 });
  });
});

describe('bySurname comparator', () => {
  it('returns negative when a comes before b', () => {
    expect(bySurname({ name: 'Amy Adams' }, { name: 'Bob Ziegler' })).toBeLessThan(0);
  });

  it('returns positive when a comes after b', () => {
    expect(bySurname({ name: 'Bob Ziegler' }, { name: 'Amy Adams' })).toBeGreaterThan(0);
  });

  it('returns zero for identical surnames', () => {
    expect(bySurname({ name: 'Ann Smith' }, { name: 'John Smith' })).toBe(0);
  });
});
