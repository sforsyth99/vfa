import { BASE_URL } from '../commonTypes.ts';

export const PEOPLE_PATH = 'people';
export const PEOPLE_URL = `${BASE_URL}/${PEOPLE_PATH}`;

export interface PersonData {
  id: number;
  name: string;
  alternate_name: string;
  bio: string;
  website_url: string;
  photo: [string, number, number, boolean] | false;
}

export interface Person {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  person_data: PersonData;
}
