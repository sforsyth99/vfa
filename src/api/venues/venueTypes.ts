import { BASE_URL } from '../commonTypes.ts';

export const VENUES_PATH = 'venues';
export const VENUES_URL = `${BASE_URL}/${VENUES_PATH}`;

export interface VenueData {
  id: number;
  slug: string;
  name: string;
  alternate_name: string;
  address: string;
  online_url: string;
  description: string;
}

export interface Venue {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  venue_data: VenueData;
}
