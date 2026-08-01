import { BASE_URL } from '../commonTypes.ts';
import type { PersonData } from '../people/peopleTypes.ts';

export const VFA_BOOKS_PATH = 'books';
export const VFA_BOOKS_URL = `${BASE_URL}/${VFA_BOOKS_PATH}`;

export interface BookData {
  authors: PersonData[];
  subtitle: string;
  additional_authors: string;
  illustrators: string;
  age_min: number | null;
  age_max: number | null;
  categories: string[];
  cover_image: [string, number, number, boolean] | false;
  description: string;
  munros_url: string;
  festival_year: number | null;
}

export interface Book {
  id: number;
  slug: string;
  title?: {
    rendered: string;
  };
  book_data: BookData;
}
