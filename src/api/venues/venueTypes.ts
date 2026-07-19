import { BASE_URL } from '../commonTypes.ts';

export const VENUES_PATH = 'venues';
export const VENUES_URL = `${BASE_URL}/${VENUES_PATH}`;

export interface VenueData {
  id: number;
  slug: string;
  name: string;
  alternate_name: string;
  building: string;
  room: string;
  street_address: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  phone: string;
  website_url: string;
  description: string;
}

export interface Venue {
  id: number;
  slug: string;
  title?: {
    rendered: string;
  };
  venue_data: VenueData;
}
