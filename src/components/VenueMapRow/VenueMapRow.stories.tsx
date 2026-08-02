import type { Meta, StoryObj } from '@storybook/react-vite';
import { VenueMapRow } from './VenueMapRow';

const mockVenue = {
  id: 1,
  slug: 'langham-court-theatre',
  name: 'Langham Court Theatre',
  alternate_name: '',
  name_pronunciation: '',
  building: '',
  room: '',
  street_address: '805 Langham Court',
  city: 'Victoria',
  province: 'BC',
  postal_code: 'V8V 4J3',
  country: 'Canada',
  phone: '',
  website_url: '',
  description: '',
  accessibility: '',
};

const meta = {
  component: VenueMapRow,
  args: {
    venue: mockVenue,
    children: (
      <div>
        <strong>Langham Court Theatre</strong>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem' }}>805 Langham Court, Victoria, BC</p>
      </div>
    ),
  },
} satisfies Meta<typeof VenueMapRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoAddress: Story = {
  args: {
    venue: { ...mockVenue, street_address: '' },
  },
};

export const TallContent: Story = {
  args: {
    children: (
      <div>
        <strong>Langham Court Theatre</strong>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem' }}>805 Langham Court, Victoria, BC</p>
        <p style={{ margin: '0.75rem 0 0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#888' }}>Accessibility</p>
        <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}>
          Mobility Considerations: Langham Court Theatre was built in 1880 as a carriage house and barn, and was
          converted to a theatre in 1940. Though the theatre has undergone significant renovations...
        </p>
        <a href="#" style={{ fontSize: '0.875rem' }}>Read more →</a>
      </div>
    ),
  },
};
