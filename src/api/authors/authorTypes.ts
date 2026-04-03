import { BASE_URL, type CuriesLink, type SelfLink, type WPHrefLInk } from '../commonTypes.ts';

export const OSOM_AUTHORS_PATH = 'book-authors';
export const OSOM_AUTHORS_URL = `${BASE_URL}/${OSOM_AUTHORS_PATH}`;

export interface OsomAuthorLinks {
  self?: SelfLink[];
  collection?: WPHrefLInk[];
  about?: WPHrefLInk[];
  'wp:post_type'?: WPHrefLInk[];
  curies?: CuriesLink[];

  [key: string]: unknown;


}

export interface OsomAuthor {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: unknown[];
  _links: OsomAuthorLinks;
}