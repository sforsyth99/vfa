export const BASE_URL = 'https://api.victoriafestivalofauthors.ca/wp-json/wp/v2';

//Remaining status types are not visible without authentication.
export enum StatusType {
  PUBLISH = 'publish',
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

export interface VersionHistoryLink {
  count: number;
  href: string;
}

export interface PredecessorVersionLink {
  id: number;
  href: string;
}