import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { QueryState } from './QueryState';

const meta = {
  component: QueryState,
  args: {
    loadingId: 'common.loading',
    errorId: 'home.authors.error',
    emptyId: 'events.empty',
  },
} satisfies Meta<typeof QueryState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: { isLoading: true, isError: false },
  play: async ({ canvas }) => {
    const el = canvas.getByRole('status');
    await expect(el).toBeVisible();
  },
};

export const Error: Story = {
  args: { isLoading: false, isError: true },
  play: async ({ canvas }) => {
    const el = canvas.getByRole('status');
    await expect(el).toBeVisible();
  },
};

export const Empty: Story = {
  args: { isLoading: false, isError: false, isEmpty: true },
};

export const Idle: Story = {
  args: { isLoading: false, isError: false },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('status')).toBeNull();
  },
};
