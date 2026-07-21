import { BASE_URL } from '../commonTypes.ts';

export const PEOPLE_PATH = 'people';
export const PEOPLE_URL = `${BASE_URL}/${PEOPLE_PATH}`;

export interface PersonData {
  id: number;
  slug?: string;
  name: string;
  alternate_name: string;
  name_pronunciation: string;
  pronouns: string;
  pronouns_other: string;
  bio: string;
  website_url: string;
  photo: [string, number, number, boolean] | false;
  author_years: number[];
  moderator_years: number[];
  curator_years: number[];
  musician_years: number[];
  kidfest_years: number[];
  kidfest_photo: [string, number, number, boolean] | false;
}

export interface Person {
  id: number;
  slug: string;
  title?: {
    rendered: string;
  };
  person_data: PersonData;
}
