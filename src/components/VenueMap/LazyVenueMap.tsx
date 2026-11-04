import { Component, lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import type { VenueData } from '../../api/venues/venueTypes.ts';
import { buildAddress } from './venueAddress.ts';
import { VenueMapFallback, VenueMapPlaceholder } from './VenueMapPlaceholder.tsx';

// Leaflet (about 150 KB) and the map component load only when a map is shown,
// and only in the browser.
const VenueMap = lazy(() => import('./VenueMap.tsx'));

class MapLoadBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** The venue map, loaded on demand. Shows a link to OpenStreetMap if the map code can't load. */
export function LazyVenueMap({ venue }: { venue: VenueData }) {
  const address = buildAddress(venue);
  if (!address) return null;
  return (
    <MapLoadBoundary fallback={<VenueMapFallback address={address} />}>
      <Suspense fallback={<VenueMapPlaceholder />}>
        <VenueMap venue={venue} />
      </Suspense>
    </MapLoadBoundary>
  );
}
