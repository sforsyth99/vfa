import type { Meta, StoryObj } from '@storybook/react';
import { KidsFestInterviews } from './KidsFestInterviews';

const meta: Meta<typeof KidsFestInterviews> = {
  title: 'Components/KidsFestInterviews',
  component: KidsFestInterviews,
};
export default meta;

type Story = StoryObj<typeof KidsFestInterviews>;

export const Default: Story = {};
