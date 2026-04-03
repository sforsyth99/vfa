import { BASE_URL } from '../commonTypes.ts';

export const TAXONOMIES_PATH = 'taxonomies';
export const TAXONOMIES_URL = `${BASE_URL}/${TAXONOMIES_PATH}`;

//TODO this might not be a type since the values are dynamic based on the taxonomies registered on the site.
// export enum TaxonomyType {
//   POST = 'post',
//   TRIBE_EVENTS = 'tribe_events',
//   TEC_CALENDAR = 'tec_calendar',
//   NAV_MENU_ITEM = 'nav_menu_item',
// }


export interface TaxonomyCategory {
  name: string;
  slug: string;
  description: string;
  types: string[];
  hierarchical: boolean;
  rest_base: string;
  rest_namespace: string;
  _links: unknown;
}

export interface TaxonomyPostTag {
  name: string;
  slug: string;
  description: string;
  types: string[];
  hierarchical: boolean;
  rest_base: string;
  rest_namespace: string;
  _links: unknown;
}

export interface TaxonomyNavMenu {
  name: string;
  slug: string;
  description: string;
  types: string[];
  hierarchical: boolean;
  rest_base: string;
  rest_namespace: string;
  _links: unknown;
}

export interface TaxonomyWPPatternCategory {
  name: string;
  slug: string;
  description: string;
  types: string[];
  hierarchical: boolean;
  rest_base: string;
  rest_namespace: string;
  _links: unknown;
}

export interface Taxonomy {
  category: TaxonomyCategory;
  post_tag: TaxonomyPostTag;
  nav_menu: TaxonomyNavMenu;
  wp_pattern_category: TaxonomyWPPatternCategory;
  tribe_events_cat: unknown;
}