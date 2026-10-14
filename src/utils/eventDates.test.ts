import { describe, it, expect } from 'vitest';
import { getPacificToday, FESTIVAL_SEASON_START } from './eventDates';

describe('eventDates', () => {
  it('returns today as a YYYY-MM-DD string', () => {
    expect(getPacificToday()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('exposes the season start as a YYYY-MM-DD string', () => {
    expect(FESTIVAL_SEASON_START).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
