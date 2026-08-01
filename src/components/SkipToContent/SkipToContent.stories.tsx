import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { SkipToContent } from './SkipToContent';

const meta = {
  component: SkipToContent,
} satisfies Meta<typeof SkipToContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link');
    await expect(link).toHaveAttribute('href', '#main-content');
    await userEvent.tab();
    await expect(link).toHaveFocus();
  },
};
