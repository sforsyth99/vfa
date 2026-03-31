// Media type for WP REST API media/attachments
export interface Media {
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
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: Record<string, unknown>;
  class_list: string[];
  jetpack_sharing_enabled: boolean;
  jetpack_shortlink: string;
  description: { rendered: string };
  caption: { rendered: string };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    filesize?: number;
    sizes?: Record<string, {
      file: string;
      width: number;
      height: number;
      filesize?: number;
      mime_type: string;
      source_url: string;
    }>;
    image_meta?: Record<string, unknown>;
  };
  post: number;
  source_url: string;
  _links: Record<string, unknown>;
}
