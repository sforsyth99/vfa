// src/api/books.ts
// Dummy API client for books
import { Book } from './types';

const dummyBooks: Book[] = [
  {
    id: 'b1',
    title: 'The Future Unwritten',
    coverUrl: '/assets/future-unwritten.jpg',
    authors: [], // Populated by authors.ts
  },
];

export async function fetchBooks(): Promise<Book[]> {
  await new Promise((r) => setTimeout(r, 120));
  return dummyBooks;
}
