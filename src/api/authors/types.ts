import type { CuriesLink, SelfLink, WPHrefLInk } from '../types.ts';

export interface OsomAuthorLinks {
  self?: SelfLink[];
  collection?: WPHrefLInk[];
  about?: WPHrefLInk[];
  'wp:post_type'?: WPHrefLInk[];
  curies?: CuriesLink[];
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