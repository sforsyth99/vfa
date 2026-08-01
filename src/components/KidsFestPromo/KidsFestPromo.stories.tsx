import type { Meta, StoryObj } from '@storybook/react-vite';
import { KidsFestPromo } from './KidsFestPromo';

const meta = {
  component: KidsFestPromo,
} satisfies Meta<typeof KidsFestPromo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
