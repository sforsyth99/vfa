// src/api/types.ts


export interface Author {
  id: string;
  name: string;
  bio: string;
  profilePhotoUrl: string;
  pronouns?: string;
  interviews: Interview[];
  books: Book[];
}

export interface Book {
  id: string;
  title: string;
  coverUrl: string;
  authors: Author[];
}

export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  website: string;
}

export interface Interview {
  id: string;
  title: string;
  videoUrl?: string;
  transcriptUrl?: string;
  authorId: string;
}

export interface WPHrefLInk {
  'href': string;
}

export interface CuriesLink {
  name: string;
  href: string;
  templated: boolean;
}

export interface SelfLink {
  href: string;
  targetHints?: {
    allow: string[];
  };
}

export interface EmbeddableLink {
  embeddable: boolean;
  href: string;
}

export interface TermLink {
  taxonomy: string;
  embeddable: boolean;
  href: string;
}