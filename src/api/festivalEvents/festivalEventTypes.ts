import { BASE_URL } from '../commonTypes.ts';
import type { PersonData } from '../people/peopleTypes.ts';
import type { VenueData } from '../venues/venueTypes.ts';

export const FESTIVAL_EVENTS_PATH = 'festival_events';
export const FESTIVAL_EVENTS_URL = `${BASE_URL}/${FESTIVAL_EVENTS_PATH}`;

export interface EventData {
  event_date: string;
  time_start: string;
  time_end: string;
  event_image: [string, number, number, boolean] | false;
  description: string;
  venue: VenueData | null;
  ticket_tier: string[];
  ticket_price: string[];
  authors: PersonData[];
  moderator: PersonData | null;
  curator: PersonData | null;
  musician: PersonData | null;
}

export interface FestivalEvent {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  event_data: EventData;
}
