import type { CuriesLink, EmbeddableLink, SelfLink, WPHrefLInk } from '../types.ts';

export interface VersionHistoryLink {
  href: string;
  count: number;
}

export interface PredecessorVersionLink {
  id: number;
  href: string;
}

export interface OrganizerLinks {
  self?: SelfLink[];
  collection?: WPHrefLInk[];
  about?: WPHrefLInk[];
  author?: EmbeddableLink[];
  'version-history'?: VersionHistoryLink[];
  'predecessor-version'?: PredecessorVersionLink[];
  'wp:attachment'?: WPHrefLInk[];
  curies?: CuriesLink[];
}


export interface VenueLinks {
  self?: SelfLink[];
  collection?: WPHrefLInk[];
  about?: WPHrefLInk[];
  author?: EmbeddableLink[];
  'version-history'?: VersionHistoryLink[];
  'wp:attachment'?: WPHrefLInk[];
  curies?: CuriesLink[];
}

export interface EventLinks {
  self?: SelfLink[];
  collection?: WPHrefLInk[];
  about?: WPHrefLInk[];
  author?: EmbeddableLink[];
  'version-history'?: VersionHistoryLink[];
  'predecessor-version'?: PredecessorVersionLink[];
  'wp:attachment'?: WPHrefLInk[];
  'wp:term'?: WPHrefLInk[];
  curies?: CuriesLink[];
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
  _links: EventLinks;
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
  _links: OrganizerLinks;
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