import type { CuriesLink, EmbeddableLink, SelfLink, TermLink, WPHrefLInk } from '../commonTypes.ts';
import { BASE_URL } from '../commonTypes.ts';

export const MENUS_PATH = 'menus';
export const MENUS_URL = `${BASE_URL}/${MENUS_PATH}`;
export const MENU_ITEMS_PATH = 'menu-items';
export const MENU_ITEMS_URL = `${BASE_URL}/${MENU_ITEMS_PATH}`;
export const MENU_LOCATIONS_PATH = 'menu-locations';
export const MENU_LOCATIONS_URL = `${BASE_URL}/${MENU_LOCATIONS_PATH}`;

export interface MenuItemLinks {
  self?: SelfLink[];
  collection?: WPHrefLInk[];
  about?: WPHrefLInk[];
  'wp:term'?: TermLink[];
  curies?: CuriesLink[];

  [key: string]: unknown;
}

export interface MenuItem {
  id: number;
  order: number;
  parent: number;
  title: { rendered: string };
  url: string;
  attr_title?: string;
  description?: string;
  type: string;
  object: string;
  object_id: number;
  classes: string[];
  xfn: string[];
  target?: string;
  _links: MenuItemLinks;
}

export interface MenuLinks {
  self?: SelfLink[];
  collection?: WPHrefLInk[];
  about?: WPHrefLInk[];
  'wp:post_type'?: WPHrefLInk[];
  'wp:menu-location'?: EmbeddableLink[];
  curies?: CuriesLink[];

  [key: string]: unknown;
}

export interface Menu {
  id: number;
  description: string;
  name: string;
  slug: string;
  meta: unknown[];
  locations: unknown[];
  auto_add: boolean;
  _links: MenuLinks;
}

export interface MenuLocationLinks {
  self?: SelfLink[];
  collection?: WPHrefLInk[];

  [key: string]: unknown;
}

export interface MenuLocation {
  name: string;
  description: string;
  menu: number;
  _links: MenuLocationLinks;
}