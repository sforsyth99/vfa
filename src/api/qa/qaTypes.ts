import { VFA_API_BASE } from '../commonTypes.ts';

export const QA_CATEGORIES_URL = `${VFA_API_BASE}/qa-categories`;
export const QA_POSTS_URL = `${VFA_API_BASE}/qa-posts`;

export interface QACategory {
  id: number;
  label: string;
  slug: string;
  count: number;
}

export interface QAPost {
  id: number;
  slug: string;
  title: string;
  link: string;
}

export interface QAPage {
  items: QAPost[];
  total: number;
  total_pages: number;
  page: number;
}

export interface QAPostWithYear extends QAPost {
  year: number | null;
}
