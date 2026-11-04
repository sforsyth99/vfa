import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { type EventData, FESTIVAL_EVENTS_PATH, FESTIVAL_EVENTS_URL } from './festivalEventTypes.ts';

/** Just enough of an event to order events and link to one. */
export interface FestivalEventNavItem {
  slug: string;
  title?: { rendered: string };
  event_data: Pick<EventData, 'event_date' | 'event_type' | 'time_start'>;
}

// WordPress returns only these fields: about 1 KB compressed instead of ~34 KB
// for the full list. Used for previous/next links on an event page.
const NAV_FIELDS = [
  'slug',
  'title.rendered',
  'event_data.event_date',
  'event_data.event_type',
  'event_data.time_start',
].join(',');

export function useGetFestivalEventsNav() {
  return useQuery<FestivalEventNavItem[]>({
    // Own key, so this trimmed list never replaces the full list's cache.
    queryKey: [FESTIVAL_EVENTS_PATH, 'nav'],
    queryFn: () => wretch(`${FESTIVAL_EVENTS_URL}?per_page=100&_fields=${NAV_FIELDS}`).get().json(),
  });
}
