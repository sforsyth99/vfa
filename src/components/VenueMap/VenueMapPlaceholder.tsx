import { useIntl } from 'react-intl';
import styles from './VenueMap.module.css';

/** Holds the map's space while the map code and the venue's location load. */
export function VenueMapPlaceholder() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={`${styles.map} ${styles.placeholder}`} />
      <span className={`${styles.osmLink} ${styles.linkSpace}`}>&nbsp;</span>
    </div>
  );
}

/** A plain link to the address on OpenStreetMap, used when the map can't be shown. */
export function VenueMapFallback({ address }: { address: string }) {
  const intl = useIntl();
  return (
    <a
      href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(address)}`}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.fallbackLink}
    >
      {intl.formatMessage({ id: 'venue.viewOnMap' })}
    </a>
  );
}
