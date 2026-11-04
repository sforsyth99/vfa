import type { FestivalEventNavItem } from '../api/festivalEvents/useGetFestivalEventsNav';
import type { InterviewNavItem } from '../api/interviews/useGetInterviewsNav';

export interface Neighbours<T> {
  /** Items in navigation order. */
  items: T[];
  /** Position of the current item in `items`, or -1 if it isn't there. */
  currentIndex: number;
  prev: T | undefined;
  next: T | undefined;
}

function wrapAround<T>(items: T[], currentIndex: number): Pick<Neighbours<T>, 'prev' | 'next'> {
  return {
    prev: currentIndex > 0 ? items[currentIndex - 1] : items[items.length - 1],
    next: currentIndex < items.length - 1 ? items[currentIndex + 1] : items[0],
  };
}

/**
 * Upcoming events (today or later, Pacific), author fairs left out, in date
 * then start-time order. Previous/next wrap around.
 */
export function getEventNeighbours<T extends FestivalEventNavItem>(
  events: T[],
  slug: string | undefined,
  today: string,
): Neighbours<T> {
  const items = events
    .filter((e) => e.event_data.event_date >= today && e.event_data.event_type !== 'author_fair')
    .sort((a, b) => {
      const d = a.event_data.event_date.localeCompare(b.event_data.event_date);
      return d !== 0
        ? d
        : (a.event_data.time_start ?? '').localeCompare(b.event_data.time_start ?? '');
    });
  const currentIndex = items.findIndex((e) => e.slug === slug);
  return { items, currentIndex, ...wrapAround(items, currentIndex) };
}

/**
 * Interviews from the same festival year, kids' and adult interviews kept
 * apart, newest first. Previous/next wrap around.
 */
export function getInterviewNeighbours<T extends InterviewNavItem>(
  interviews: T[],
  slug: string | undefined,
  festivalYear: number | null,
  isKidsInterview: boolean,
): Neighbours<T> {
  const items = interviews
    .filter(
      (iv) =>
        iv.interview_data.festival_year === festivalYear &&
        festivalYear !== null &&
        (iv.interview_data.interviewer_age != null) === isKidsInterview,
    )
    .sort((a, b) => b.date.localeCompare(a.date));
  const currentIndex = items.findIndex((iv) => iv.slug === slug);
  return { items, currentIndex, ...wrapAround(items, currentIndex) };
}
