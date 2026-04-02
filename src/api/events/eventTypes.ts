import {
  BASE_URL,
  type CuriesLink,
  type EmbeddableLink,
  type PredecessorVersionLink,
  type SelfLink,
  type VersionHistoryLink,
  type WPHrefLInk,
} from '../commonTypes.ts';

export const TRIBE_EVENTS_PATH = 'tribe_events';
export const TRIBE_EVENTS_URL = `${BASE_URL}/${TRIBE_EVENTS_PATH}`;
export const TRIBE_VENUE_PATH = 'tribe_venue';
export const TRIBE_VENUE_URL = `${BASE_URL}/${TRIBE_VENUE_PATH}`;
export const TRIBE_ORGANIZER_PATH = 'tribe_organizer';
export const TRIBE_ORGANIZER_URL = `${BASE_URL}/${TRIBE_ORGANIZER_PATH}`;


export interface VenueLinks {
  self?: SelfLink[];
  collection?: WPHrefLInk[];
  about?: WPHrefLInk[];
  author?: EmbeddableLink[];
  'version-history'?: VersionHistoryLink[];
  'wp:attachment'?: WPHrefLInk[];
  curies?: CuriesLink[];

  [key: string]: unknown;

}

export interface TribeVenue {
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
  author: number;
  featured_media: number;
  template: string;
  meta: {
    _genesis_hide_title: boolean;
    _genesis_hide_breadcrumbs: boolean;
    _genesis_hide_singular_image: boolean;
    _genesis_hide_footer_widgets: boolean;
    _genesis_custom_body_class: string;
    _genesis_custom_post_class: string;
    _genesis_layout: string;
    jetpack_post_was_ever_published: boolean;
    footnotes: string;
  };
  _links: VenueLinks;
}


export interface TribeEventLinks {
  self?: SelfLink[];
  collection?: WPHrefLInk[];
  about?: WPHrefLInk[];
  author?: EmbeddableLink[];
  'version-history'?: VersionHistoryLink[];
  'predecessor-version'?: PredecessorVersionLink[];
  'wp:attachment'?: WPHrefLInk[];
  'wp:term'?: WPHrefLInk[];
  curies?: CuriesLink[];

  [key: string]: unknown;
}

export interface TribeEvent {
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
  author: number;
  featured_media: number;
  template: string;
  meta: Record<string, unknown>;
  tags: number[];
  tribe_events_cat: number[];
  class_list: string[];
  jetpack_sharing_enabled: boolean;
  _links: TribeEventLinks;
}

export interface TribeOrganizerLinks {
  self?: SelfLink[];
  collection?: WPHrefLInk[];
  about?: WPHrefLInk[];
  author?: EmbeddableLink[];
  'version-history'?: VersionHistoryLink[];
  'predecessor-version'?: PredecessorVersionLink[];
  'wp:attachment'?: WPHrefLInk[];
  curies?: CuriesLink[];

  [key: string]: unknown;
}

export interface TribeOrganizer {
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
  author: number;
  featured_media: number;
  template: string;
  meta: {
    _genesis_hide_title: boolean;
    _genesis_hide_breadcrumbs: boolean;
    _genesis_hide_singular_image: boolean;
    _genesis_hide_footer_widgets: boolean;
    _genesis_custom_body_class: string;
    _genesis_custom_post_class: string;
    _genesis_layout: string;
    jetpack_post_was_ever_published: boolean;
    footnotes: string;
  };
  _links: TribeOrganizerLinks;
}

