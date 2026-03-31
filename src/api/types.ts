// src/api/types.ts

export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  eventbriteUrl: string;
  featured: boolean;
  format: 'in-person' | 'online';
  location: {
    indigenous: string;
    english: string;
  };
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  profilePhotoUrl: string;
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
