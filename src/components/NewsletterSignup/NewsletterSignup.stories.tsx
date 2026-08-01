import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import NewsletterSignup from './NewsletterSignup';

const meta = {
  component: NewsletterSignup,
} satisfies Meta<typeof NewsletterSignup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox');
    const button = canvas.getByRole('button');
    await expect(input).toBeVisible();
    await expect(button).toBeEnabled();
  },
};

export const WithEmail: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox');
    await userEvent.type(input, 'reader@example.com');
    await expect(input).toHaveValue('reader@example.com');
  },
};
