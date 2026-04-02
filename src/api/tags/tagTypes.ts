import type { CuriesLink, SelfLink, WPHrefLInk } from '../commonTypes.ts';
import { BASE_URL } from '../commonTypes.ts';

export const TAGS_PATH = 'tags';
export const TAGS_URL = `${BASE_URL}/${TAGS_PATH}`;

export interface TagLinks {
  self?: SelfLink[];
  collection?: WPHrefLInk[];
  about?: WPHrefLInk[];
  'wp:post_type'?: WPHrefLInk[];
  curies?: CuriesLink[];

  [key: string]: unknown;
}

export interface Tag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: unknown[];
  _links: TagLinks;
}