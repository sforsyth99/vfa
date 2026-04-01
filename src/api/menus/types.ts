import { BASE_URL } from '../types.ts';

export const MENUS_PATH = 'menus';
export const MENUS_URL = `${BASE_URL}/${MENUS_PATH}`;
export const MENU_ITEMS_PATH = 'menu-items';
export const MENU_ITEMS_URL = `${BASE_URL}/${MENU_ITEMS_PATH}`;
export const MENU_LOCATIONS_PATH = 'menu-locations';
export const MENU_LOCATIONS_URL = `${BASE_URL}/${MENU_LOCATIONS_PATH}`;

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
  _links: Record<string, any>;
}


export interface Menu {
  id: number;
  description: string;
  name: string;
  slug: string;
  meta: any[];
  locations: any[];
  auto_add: boolean;
  _links: Record<string, any>;
}

export interface MenuLocation {
  name: string;
  description: string;
  menu: number;
  _links: Record<string, any>;
}

// Menu location
// {
//   "name": "primary",
//   "description": "Header Menu",
//   "menu": 90,
//   "_links": {
//   "self": [
//     {
//       "href": "https://victoriafestivalofauthors.ca/wp-json/wp/v2/menu-locations/primary",
//       "targetHints": {
//         "allow": [
//           "GET"
//         ]
//       }
//     }
//   ],
//     "collection": [
//     {
//       "href": "https://victoriafestivalofauthors.ca/wp-json/wp/v2/menu-locations"
//     }
//   ],
//     "wp:menu": [
//     {
//       "embeddable": true,
//       "href": "https://victoriafestivalofauthors.ca/wp-json/wp/v2/menus/90"
//     }
//   ],
//     "curies": [
//     {
//       "name": "wp",
//       "href": "https://api.w.org/{rel}",
//       "templated": true
//     }
//   ]
// }
// }