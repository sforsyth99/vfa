import type { Meta, StoryObj } from '@storybook/react-vite';
import { Section } from './Section';

const meta = {
  component: Section,
  args: { children: 'Section content' },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Large: Story = {
  args: { spacing: 'large' },
};

export const Compact: Story = {
  args: { spacing: 'compact' },
};
