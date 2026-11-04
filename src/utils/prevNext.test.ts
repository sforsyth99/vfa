import { describe, it, expect } from 'vitest';
import { getEventNeighbours, getInterviewNeighbours } from './prevNext';
import type { FestivalEventNavItem } from '../api/festivalEvents/useGetFestivalEventsNav';
import type { InterviewNavItem } from '../api/interviews/useGetInterviewsNav';

const ev = (slug: string, event_date: string, time_start = '', event_type = 'panel') =>
  ({ slug, event_data: { event_date, time_start, event_type } }) as FestivalEventNavItem;

const iv = (slug: string, date: string, festival_year: number | null, kids = false) =>
  ({
    slug,
    date,
    interview_data: { authors: [], festival_year, interviewer_age: kids ? 10 : null },
  }) as InterviewNavItem;

describe('getEventNeighbours', () => {
  const today = '2026-10-10';
  const events = [
    ev('late', '2026-10-12', '19:00'),
    ev('past', '2026-10-01', '10:00'),
    ev('early', '2026-10-12', '09:00'),
    ev('fair', '2026-10-11', '12:00', 'author_fair'),
    ev('first', '2026-10-10', '18:00'),
    ev('no-time', '2026-10-13'),
  ];

  it('orders upcoming events by date then start time, leaving out past events and author fairs', () => {
    const { items } = getEventNeighbours(events, 'early', today);
    expect(items.map((e) => e.slug)).toEqual(['first', 'early', 'late', 'no-time']);
  });

  it('links to the events either side', () => {
    const { prev, next, currentIndex } = getEventNeighbours(events, 'early', today);
    expect(currentIndex).toBe(1);
    expect(prev?.slug).toBe('first');
    expect(next?.slug).toBe('late');
  });

  it('wraps around at both ends', () => {
    expect(getEventNeighbours(events, 'first', today).prev?.slug).toBe('no-time');
    expect(getEventNeighbours(events, 'no-time', today).next?.slug).toBe('first');
  });

  it('reports -1 for a past event or an author fair, so the page shows its browse link', () => {
    expect(getEventNeighbours(events, 'past', today).currentIndex).toBe(-1);
    expect(getEventNeighbours(events, 'fair', today).currentIndex).toBe(-1);
  });
});

describe('getInterviewNeighbours', () => {
  const interviews = [
    iv('a-2026', '2026-10-01T10:00:00', 2026),
    iv('b-2026', '2026-10-03T10:00:00', 2026),
    iv('c-2026', '2026-10-02T10:00:00', 2026),
    iv('kid-2026', '2026-10-04T10:00:00', 2026, true),
    iv('kid2-2026', '2026-10-05T10:00:00', 2026, true),
    iv('old', '2025-10-01T10:00:00', 2025),
    iv('no-year', '2026-10-06T10:00:00', null),
  ];

  it('keeps the same festival year and adult interviews, newest first', () => {
    const { items } = getInterviewNeighbours(interviews, 'c-2026', 2026, false);
    expect(items.map((i) => i.slug)).toEqual(['b-2026', 'c-2026', 'a-2026']);
  });

  it("keeps kids' interviews separate", () => {
    const { items } = getInterviewNeighbours(interviews, 'kid-2026', 2026, true);
    expect(items.map((i) => i.slug)).toEqual(['kid2-2026', 'kid-2026']);
  });

  it('wraps around at both ends', () => {
    expect(getInterviewNeighbours(interviews, 'b-2026', 2026, false).prev?.slug).toBe('a-2026');
    expect(getInterviewNeighbours(interviews, 'a-2026', 2026, false).next?.slug).toBe('b-2026');
  });

  it('has no neighbours when the interview has no festival year', () => {
    const { items, currentIndex } = getInterviewNeighbours(interviews, 'no-year', null, false);
    expect(items).toEqual([]);
    expect(currentIndex).toBe(-1);
  });
});
