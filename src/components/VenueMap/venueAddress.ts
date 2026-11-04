import type { VenueData } from '../../api/venues/venueTypes.ts';

export function buildAddress(venue: VenueData): string {
  return [venue.street_address, venue.city, venue.province, venue.postal_code, venue.country]
    .filter(Boolean)
    .join(', ');
}
