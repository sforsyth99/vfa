import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import messages from '../../locales/en.json';
import PersonPage from './Person';

type Q = { data?: unknown; isPending: boolean; isLoading?: boolean; error?: unknown };
const state: { person: Q; events: Q; books: Q; interviews: Q } = {} as never;

vi.mock('../../api/people/useGetPerson.ts', () => ({ useGetPerson: () => state.person }));
vi.mock('../../api/people/useGetPersonEvents.ts', () => ({
  useGetPersonEvents: () => state.events,
}));
vi.mock('../../api/people/useGetPersonBooks.ts', () => ({ useGetPersonBooks: () => state.books }));
vi.mock('../../api/people/useGetPersonInterview.ts', () => ({
  useGetPersonInterviews: () => state.interviews,
}));
vi.mock('../../utils/analytics.ts', () => ({ track: () => {} }));

const person = {
  id: 7,
  slug: 'ann-able',
  title: { rendered: 'Ann Able' },
  person_data: {
    alternate_name: '',
    name_pronunciation: '',
    bio: '<p>Ann writes books.</p>',
    website_url: '',
    photo: ['https://example.org/ann-210x300.jpg', 210, 300, true],
    photo_square: ['https://example.org/ann-sq-300x300.jpg', 300, 300, true],
    kidfest_years: [],
    kidfest_photo: false,
  },
};

const done = (data: unknown): Q => ({ data, isPending: false });
const pending: Q = { data: undefined, isPending: true };

function renderPage() {
  return render(
    <IntlProvider locale="en" messages={messages}>
      <MemoryRouter initialEntries={['/people/ann-able']}>
        <Routes>
          <Route path="/people/:slug" element={<PersonPage />} />
        </Routes>
      </MemoryRouter>
    </IntlProvider>,
  );
}

describe('PersonPage', () => {
  beforeEach(() => {
    state.person = { data: person, isPending: false, isLoading: false };
    state.events = done([]);
    state.books = done([]);
    state.interviews = done([]);
  });

  it("gives the author's photos their width and height so the page doesn't shift as they load", () => {
    renderPage();
    const [desktop, mobile] = screen.getAllByRole('img', { name: 'Ann Able' });
    expect(desktop).toHaveAttribute('width', '210');
    expect(desktop).toHaveAttribute('height', '300');
    expect(mobile).toHaveAttribute('width', '300');
    expect(mobile).toHaveAttribute('height', '300');
  });

  it('renders the page while events, books and interviews are still loading', () => {
    state.events = pending;
    state.books = pending;
    state.interviews = pending;
    renderPage();
    expect(screen.getByText('Ann writes books.')).toBeInTheDocument();
  });

  it('shows "not found" when the person does not exist', () => {
    state.person = { data: undefined, isPending: false, isLoading: false };
    renderPage();
    expect(screen.getByText('Person not found')).toBeInTheDocument();
  });
});
