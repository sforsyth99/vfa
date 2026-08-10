import type { Meta, StoryObj } from '@storybook/react-vite';
import { HomeQuickNav } from './HomeQuickNav';

const meta = {
  component: HomeQuickNav,
} satisfies Meta<typeof HomeQuickNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
