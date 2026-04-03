import {
  BASE_URL,
  type CuriesLink,
  type EmbeddableLink,
  type SelfLink,
  StatusType,
  type TermLink,
  type WPHrefLInk,
} from '../commonTypes.ts';

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
  // '"wp:menu-item-object": '?: EmbeddableLink[];
  curies?: CuriesLink[];

  [key: string]: unknown;
}

export enum MenuItemType {
  CUSTOM = 'custom', //custom links
  POST_TYPE = 'post_type', //posts and pages
  TAXONOMY = 'taxonomy', //categories
}


export enum MenuObjectType {
  PAGE = 'page',
  CUSTOM = 'custom',
  CATEGORY = 'category',
  TRIBE_EVENTS = 'tribe_events',
}

export enum MenuLocationType {
  PRIMARY = 'primary',
  //TODO there are more. Are these theme-specific? If so, we might want to just make this a string instead of an enum
}

export interface MenuItem {
  id: number;
  title: { rendered: string };
  status: StatusType;
  url: string;
  attr_title?: string;
  description?: string;
  type: MenuItemType;
  type_label: string;
  object: MenuObjectType;
  object_id: number;
  parent: number;
  menu_order: number;
  target?: string;
  classes: string[];
  xfn: string[];
  invalid: boolean;
  menus: number;
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
  locations: MenuLocationType[];
  auto_add: boolean;
  _links: MenuLinks;
}

export interface MenuLocationLinks {
  self?: SelfLink[];
  collection?: WPHrefLInk[];

  [key: string]: unknown;
}

export interface MenuLocation {
  name: MenuLocationType; //TODO this might just be a string
  description: string;
  menu: number;
  _links: MenuLocationLinks;
}