// src/api/authors.ts
// Dummy API client for authors
import type { Author, Book } from './types';

const dummyAuthors: Author[] = [
  {
    id: 'a1',
    name: 'Jane Doe',
    bio: 'Jane Doe is an award-winning author of speculative fiction.',
    profilePhotoUrl: '/assets/jane.jpg',
    interviews: [
      {
        id: 'i1',
        title: 'Interview with Jane Doe',
        videoUrl: 'https://youtube.com/v/interview1',
        authorId: 'a1',
      },
    ],
    books: [], // Populated below
  },
];

const dummyBooks: Book[] = [
  {
    id: 'b1',
    title: 'The Future Unwritten',
    coverUrl: '/assets/future-unwritten.jpg',
    authors: [], // Populated below
  },
];

dummyAuthors[0].books = [dummyBooks[0]];
dummyBooks[0].authors = [dummyAuthors[0]];

export async function fetchAuthors(): Promise<Author[]> {
  await new Promise((r) => setTimeout(r, 200));
  return dummyAuthors;
}
