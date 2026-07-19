import { BASE_URL } from '../commonTypes.ts';
import type { PersonData } from '../people/peopleTypes.ts';
import type { VenueData } from '../venues/venueTypes.ts';

export const FESTIVAL_EVENTS_PATH = 'festival_events';
export const FESTIVAL_EVENTS_URL = `${BASE_URL}/${FESTIVAL_EVENTS_PATH}`;

export interface EventData {
  is_kidfest: boolean;
  age_range: string;
  extra_info: string;
  summary: string;
  event_date: string;
  time_start: string;
  time_end: string;
  has_online_option: boolean;
  timezone: string;
  event_image: [string, number, number, boolean] | false;
  eventbrite_image: [string, number, number, boolean] | false;
  description: string;
  venue: VenueData | null;
  online_url: string;
  eventbrite_url: string;
  tickets: { type: string; tier: string; price: string }[];
  authors: PersonData[];
  moderator: PersonData[];
  curator: PersonData[];
  musician: PersonData[];
}

export interface FestivalEvent {
  id: number;
  slug: string;
  title?: {
    rendered: string;
  };
  event_data: EventData;
}
