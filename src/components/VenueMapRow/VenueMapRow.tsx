import type { ReactNode } from 'react';
import type { VenueData } from '../../api/venues/venueTypes.ts';
import VenueMap from '../VenueMap/VenueMap.tsx';
import styles from './VenueMapRow.module.css';

interface Props {
  venue: VenueData;
  children: ReactNode;
}

export function VenueMapRow({ venue, children }: Props) {
  return (
    <div className={styles.row}>
      <div className={styles.info}>{children}</div>
      {venue.street_address && <VenueMap venue={venue} />}
    </div>
  );
}
