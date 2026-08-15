import { BASE_URL } from '../commonTypes.ts';
import type { PersonData } from '../people/peopleTypes.ts';
import type { VenueData } from '../venues/venueTypes.ts';

export const FESTIVAL_EVENTS_PATH = 'festival_events';
export const FESTIVAL_EVENTS_URL = `${BASE_URL}/${FESTIVAL_EVENTS_PATH}`;

export interface RelatedEventSummary {
  id: number;
  slug: string;
  title: string;
  event_date: string;
  time_start: string;
  event_type: string;
  is_kidfest: boolean;
  venue_name: string | null;
  eventbrite_url: string;
}

export interface EventData {
  is_featured: boolean;
  is_kidfest: boolean;
  event_type: string;
  hosts: PersonData[];
  hosted_by: string;
  age_range: string;
  extra_info: string;
  summary: string;
  event_date: string;
  time_start: string;
  time_end: string;
  event_image: [string, number, number, boolean] | false;
  eventbrite_image: [string, number, number, boolean] | false;
  description: string;
  venue: VenueData | null;
  online_url: string;
  eventbrite_url: string;
  tickets_live_date?: string | null;
  tickets: { type: string; tier: string; price_min: number | null; price_max: number | null }[];
  authors: PersonData[];
  moderator: PersonData[];
  curator: PersonData[];
  musician: PersonData[];
  related_events?: RelatedEventSummary[];
}

export interface FestivalEvent {
  id: number;
  slug: string;
  title?: {
    rendered: string;
  };
  event_data: EventData;
}
