import {
  BASE_URL,
  type CuriesLink,
  type EmbeddableLink,
  type SelfLink,
  type TermLink,
  type WPHrefLInk,
} from '../commonTypes.ts';
import type { PersonData } from '../people/peopleTypes.ts';

export const OSOM_BOOKS_PATH = 'books';
export const OSOM_BOOKS_URL = `${BASE_URL}/${OSOM_BOOKS_PATH}`;

export interface OsomBookLinks {
  self?: SelfLink[];
  collection?: WPHrefLInk[];
  about?: WPHrefLInk[];
  replies?: EmbeddableLink[];
  'wp:featuredmedia'?: EmbeddableLink[];
  'wp:attachment'?: WPHrefLInk[];
  'wp:term'?: TermLink[];
  curies?: CuriesLink[];

  [key: string]: unknown;

}

export interface OsomBook {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  featured_media: number;
  parent: number;
  comment_status: string;
  ping_status: string;
  template: string;
  'book-authors': number[];
  'book-series': number[];
  'book-tags': number[];
  class_list: string[];
  jetpack_sharing_enabled: boolean;
  _links: OsomBookLinks;
}

// VFA Books CPT
export const VFA_BOOKS_PATH = 'books';
export const VFA_BOOKS_URL = `${BASE_URL}/${VFA_BOOKS_PATH}`;

export interface BookData {
  authors: PersonData[];
  cover_image: [string, number, number, boolean] | false;
  description: string;
  munros_url: string;
}

export interface Book {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  book_data: BookData;
}
