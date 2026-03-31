import { useQuery } from '@tanstack/react-query';

export type TribeOrganizer = {
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
  _links: unknown;
};

export function useGetTribeOrganizers() {
  return useQuery<TribeOrganizer[]>({
    queryKey: ['tribe_organizers'],
    queryFn: async () => {
      const res = await fetch('https://victoriafestivalofauthors.ca/wp-json/wp/v2/tribe_organizer');
      if (!res.ok) throw new Error('Failed to fetch tribe organizers');
      return res.json();
    },
  });
}
