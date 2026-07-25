import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { AuthorFeatureCard } from './AuthorFeatureCard';

const meta = {
  component: AuthorFeatureCard,
  tags: ['ai-generated'],
} satisfies Meta<typeof AuthorFeatureCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const PHOTO = 'https://placehold.co/300x400/eef3ef/1d3d2f?text=Author';
const COVER = 'https://placehold.co/120x180/4a6dcc/fff?text=Book';

export const SingleEvent: Story = {
  args: {
    photoSrc: PHOTO,
    photoAlt: 'Jane Smith',
    bookCoverSrc: COVER,
    bookCoverAlt: 'Great Novel',
    title: 'In Conversation with Jane Smith',
    subtitleLines: ['Sat, Oct 18, 2026'],
    to: '/festival-events/jane-smith-conversation',
  },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link');
    await expect(link).toHaveAttribute('href', '/festival-events/jane-smith-conversation');
  },
};

export const MultipleEvents: Story = {
  args: {
    photoSrc: PHOTO,
    photoAlt: 'Jane Smith',
    bookCoverSrc: COVER,
    bookCoverAlt: 'Great Novel',
    events: [
      { title: 'In Conversation with Jane Smith', subtitleLines: ['Sat, Oct 18, 2026'], to: '/festival-events/jane-smith-conversation' },
      { title: 'Jane Smith Workshop', subtitleLines: ['Sun, Oct 19, 2026'], to: '/festival-events/jane-smith-workshop' },
      { title: 'Jane Smith Reading', subtitleLines: ['Mon, Oct 20, 2026'], to: '/festival-events/jane-smith-reading' },
    ],
  },
  play: async ({ canvas }) => {
    const links = canvas.getAllByRole('link');
    await expect(links).toHaveLength(3);
    await expect(links[0]).toHaveAttribute('href', '/festival-events/jane-smith-conversation');
  },
};

export const NoPhoto: Story = {
  args: {
    photoSrc: null,
    photoAlt: 'Author',
    bookCoverSrc: COVER,
    bookCoverAlt: 'Great Novel',
    title: 'Reading: New Voices',
    subtitleLines: ['Fri, Oct 17, 2026'],
    to: '/festival-events/new-voices',
  },
};

export const NoBook: Story = {
  args: {
    photoSrc: PHOTO,
    photoAlt: 'Jane Smith',
    bookCoverSrc: null,
    title: 'Jane Smith Keynote',
    subtitleLines: ['Sat, Oct 18, 2026'],
    to: '/festival-events/keynote',
  },
};
