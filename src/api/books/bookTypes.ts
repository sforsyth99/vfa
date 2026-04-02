import {
  BASE_URL,
  type CuriesLink,
  type EmbeddableLink,
  type SelfLink,
  type TermLink,
  type WPHrefLInk,
} from '../commonTypes.ts';

export const OSOM_BOOKS_PATH = 'books';
export const OSOM_BOOKS_URL = `${BASE_URL}/${OSOM_BOOKS_PATH}`;

export interface BookLinks {
  self?: SelfLink[];
  collection?: WPHrefLInk[];
  about?: WPHrefLInk[];
  replies?: EmbeddableLink[];
  'wp:featuredmedia'?: EmbeddableLink[];
  'wp:attachment'?: WPHrefLInk[];
  'wp:term'?: TermLink[];
  curies?: CuriesLink[];
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
  _links: BookLinks;
}
