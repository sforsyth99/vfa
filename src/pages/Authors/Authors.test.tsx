import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import messages from '../../locales/en.json';
import type { PersonData } from '../../api/people/peopleTypes';
import AuthorsPage from './Authors';

const base: Omit<PersonData, 'id' | 'slug' | 'name' | 'books'> = {
  alternate_name: '',
  name_pronunciation: '',
  pronouns: '',
  pronouns_other: '',
  bio: '',
  website_url: '',
  photo: false,
  photo_square: false,
  author_years: [2026],
  moderator_years: [],
  curator_years: [],
  musician_years: [],
  kidfest_years: [],
  elder_years: [],
  kidfest_photo: false,
};

const authors: PersonData[] = [
  {
    ...base,
    id: 1,
    slug: 'ann-able',
    name: 'Ann Able',
    books: [
      { id: 11, slug: 'first', title: 'First Book', cover: ['/first.jpg', 300, 450, true] },
      { id: 12, slug: 'no-cover', title: 'No Cover Yet', cover: null },
    ],
  },
  { ...base, id: 2, slug: 'bob-baker', name: 'Bob Baker', books: [] },
];

vi.mock('../../api/people/useGetAuthors', () => ({
  useGetAuthors: () => ({ data: authors, isLoading: false, isError: false }),
}));

function renderPage() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <IntlProvider locale="en" messages={messages}>
        <MemoryRouter>
          <AuthorsPage />
        </MemoryRouter>
      </IntlProvider>
    </QueryClientProvider>,
  );
}

describe('AuthorsPage', () => {
  const fetchSpy = vi.fn(() => Promise.reject(new Error('unexpected request')));

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchSpy);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    fetchSpy.mockClear();
  });

  it('shows book covers from the author list, with the book title as alt text', () => {
    renderPage();
    const ann = screen.getByRole('link', { name: /Ann Able/ });
    const cover = within(ann).getByRole('img', { name: 'First Book' });
    expect(cover).toHaveAttribute('src', '/first.jpg');
  });

  it('skips books without a cover and handles authors with no books', () => {
    renderPage();
    expect(screen.queryByRole('img', { name: 'No Cover Yet' })).not.toBeInTheDocument();
    const bob = screen.getByRole('link', { name: /Bob Baker/ });
    expect(within(bob).queryAllByRole('img')).toHaveLength(0);
  });

  it('makes no per-author book requests', () => {
    renderPage();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
