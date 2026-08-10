import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';
import { HomeAuthorsSpotlight } from './HomeAuthorsSpotlight';
import type { PersonData } from '../../api/people/peopleTypes';

const VFA = 'https://api.victoriafestivalofauthors.ca/wp-json/vfa/v1';

function makeAuthor(id: number, name: string): PersonData {
  return {
    id,
    slug: `author-${id}`,
    name,
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
}

const AUTHORS = [
  makeAuthor(1, 'Brandi Bird'),
  makeAuthor(2, 'Eden Robinson'),
  makeAuthor(3, 'Lee Maracle'),
  makeAuthor(4, 'Richard Van Camp'),
  makeAuthor(5, 'Téa Mutonji'),
];

const meta = {
  component: HomeAuthorsSpotlight,
} satisfies Meta<typeof HomeAuthorsSpotlight>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithAuthors: Story = {
  parameters: {
    msw: [
      http.get(`${VFA}/people/authors`, () => HttpResponse.json(AUTHORS)),
    ],
  },
};

export const Loading: Story = {
  parameters: {
    msw: [
      http.get(`${VFA}/people/authors`, () => new Promise(() => {})),
    ],
  },
};
