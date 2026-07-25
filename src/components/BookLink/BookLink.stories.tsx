import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { BookLink } from './BookLink';

const meta = {
  component: BookLink,
  tags: ['ai-generated'],
} satisfies Meta<typeof BookLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ToBookPage: Story = {
  args: { slug: 'my-great-novel', children: 'My Great Novel' },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: /my great novel/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/books/my-great-novel');
  },
};

export const CssCheck: Story = {
  args: { slug: 'a-book', children: 'Buy this book' },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: /buy this book/i });
    // global.css sets color: var(--vfa-color-link) = #1a5cff on <a>
    await expect(getComputedStyle(link).color).toBe('rgb(26, 92, 255)');
  },
};

export const ToBuyOnlineUrl: Story = {
  args: {
    slug: 'my-great-novel',
    munrosUrl: 'https://munros.com/book/123',
    children: 'Buy at Munro\'s',
  },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: /buy at munro/i });
    await expect(link).toHaveAttribute('href', 'https://munros.com/book/123');
    await expect(link).toHaveAttribute('target', '_blank');
  },
};
