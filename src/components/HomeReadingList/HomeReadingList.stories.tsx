import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';
import { HomeReadingList } from './HomeReadingList';
import type { Book } from '../../api/books/bookTypes';

const BOOKS_URL = 'https://api.victoriafestivalofauthors.ca/wp-json/wp/v2/books';

function makeBook(id: number, title: string, author: string, hasCover = true): Book {
  return {
    id,
    slug: `book-${id}`,
    title: { rendered: title },
    book_data: {
      authors: [{ id, slug: `author-${id}`, name: author, alternate_name: '', name_pronunciation: '', pronouns: '', pronouns_other: '', bio: '', website_url: '', photo: false, photo_square: false, author_years: [2026], moderator_years: [], curator_years: [], musician_years: [], kidfest_years: [], elder_years: [], kidfest_photo: false }],
      subtitle: '',
      additional_authors: '',
      illustrators: '',
      age_min: null,
      age_max: null,
      categories: [],
      cover_image: hasCover ? ['https://placehold.co/130x185', 130, 185, false] : false,
      description: '',
      munros_url: `https://munrobooks.com/book-${id}`,
      festival_year: 2026,
    },
  };
}

const BOOKS = [
  makeBook(1, 'The Midnight Library', 'Matt Haig'),
  makeBook(2, 'Demon Copperhead', 'Barbara Kingsolver'),
  makeBook(3, 'Tomorrow, and Tomorrow, and Tomorrow', 'Gabrielle Zevin'),
  makeBook(4, 'Trust', 'Hernan Diaz'),
  makeBook(5, 'The Covenant of Water', 'Abraham Verghese', false),
  makeBook(6, 'Lessons in Chemistry', 'Bonnie Garmus'),
];

const meta = {
  component: HomeReadingList,
} satisfies Meta<typeof HomeReadingList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithBooks: Story = {
  parameters: {
    msw: [
      http.get(BOOKS_URL, () => HttpResponse.json(BOOKS)),
    ],
  },
};

export const Loading: Story = {
  parameters: {
    msw: [
      http.get(BOOKS_URL, () => new Promise(() => {})),
    ],
  },
};

export const Empty: Story = {
  parameters: {
    msw: [
      http.get(BOOKS_URL, () => HttpResponse.json([])),
    ],
  },
};
