import {
  BASE_URL,
  type CuriesLink,
  type EmbeddableLink,
  type SelfLink,
  type TermLink,
  type VersionHistoryLink,
  type WPHrefLInk,
} from '../commonTypes.ts';

export const POSTS_PATH = 'posts';
export const POSTS_URL = `${BASE_URL}/${POSTS_PATH}`;

// Types for a single Post and an array of Posts returned by /posts
export interface Post {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: {
    _genesis_hide_title: boolean;
    _genesis_hide_breadcrumbs: boolean;
    _genesis_hide_singular_image: boolean;
    _genesis_hide_footer_widgets: boolean;
    _genesis_custom_body_class: string;
    _genesis_custom_post_class: string;
    _genesis_layout: string;
    footnotes: string;
  };
  categories: number[];
  tags: number[];
  class_list: string[];
  _links: {
    self: SelfLink[];
    collection: WPHrefLInk[];
    about: WPHrefLInk[];
    author: EmbeddableLink[];
    replies: EmbeddableLink[];
    'version-history': VersionHistoryLink[];
    'wp:attachment': WPHrefLInk[];
    'wp:term': TermLink[];
    curies: CuriesLink[];
  };
}

