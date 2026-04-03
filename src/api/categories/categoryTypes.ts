import type { CuriesLink, SelfLink, WPHrefLInk } from '../commonTypes.ts';
import { BASE_URL } from '../commonTypes.ts';

export const CATEGORIES_PATH = 'categories';
export const CATEGORIES_URL = `${BASE_URL}/${CATEGORIES_PATH}`;

export enum TaxonomyType {
  CATEGORY = 'category',
}

export interface CategoryLinks {
  self?: SelfLink[];
  collection?: WPHrefLInk[];
  about?: WPHrefLInk[];
  'wp:post_type'?: WPHrefLInk[];
  curies?: CuriesLink[];

  [key: string]: unknown;
}

export interface Category {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: TaxonomyType;
  parent: number;
  meta: unknown[];
  _links: CategoryLinks;
}