import type { Meta, StoryObj } from '@storybook/react-vite';
import { Eyebrow } from './Eyebrow';

const meta = {
  component: Eyebrow,
} satisfies Meta<typeof Eyebrow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Free Family Event' },
};

export const AsSpan: Story = {
  args: { as: 'span', children: 'Q&A' },
};

export const AsDiv: Story = {
  args: { as: 'div', children: 'Main Event' },
};
