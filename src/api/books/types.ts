export interface OsomBook {
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
  featured_media: number;
  parent: number;
  comment_status: string;
  ping_status: string;
  template: string;
  'book-authors': number[];
  'book-series': number[];
  'book-tags': number[];
  class_list: string[];
  jetpack_sharing_enabled: boolean;
  _links: any;
}
