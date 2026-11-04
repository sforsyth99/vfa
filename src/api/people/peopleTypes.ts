import { BASE_URL } from '../commonTypes.ts';

export const PEOPLE_PATH = 'people';
export const PEOPLE_URL = `${BASE_URL}/${PEOPLE_PATH}`;

/** A book as embedded in person lists: just enough for a cover and a link. */
export interface PersonBookSummary {
  id: number;
  /** Included by `people/authors`; not by event `authors`. */
  slug?: string;
  title: string;
  cover: [string, number, number, boolean] | null;
}

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
  photo_square: [string, number, number, boolean] | false | null;
  author_years: number[];
  moderator_years: number[];
  curator_years: number[];
  musician_years: number[];
  kidfest_years: number[];
  elder_years: number[];
  kidfest_photo: [string, number, number, boolean] | false;
  /** Books for the festival year, included by `people/authors` and event `authors`. */
  books?: PersonBookSummary[];
}

export interface Person {
  id: number;
  slug: string;
  title?: {
    rendered: string;
  };
  person_data: PersonData;
}
