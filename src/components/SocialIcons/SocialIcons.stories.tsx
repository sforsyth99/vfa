import type { Meta, StoryObj } from '@storybook/react-vite';
import SocialIcons from './SocialIcons';

const meta = {
  component: SocialIcons,
} satisfies Meta<typeof SocialIcons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
