import { useState, useEffect } from 'react';
import type { VenueData } from '../api/venues/venueTypes.ts';
import styles from './VenueMap.module.css';

interface Coords {
  lat: number;
  lon: number;
}

function buildAddress(venue: VenueData): string {
  return [venue.street_address, venue.city, venue.province, venue.postal_code, venue.country]
    .filter(Boolean)
    .join(', ');
}

function buildGeocodingQuery(venue: VenueData): string {
  // Omit postal code — it can confuse geocoders
  return [venue.street_address, venue.city, venue.province, venue.country]
    .filter(Boolean)
    .join(', ');
}

export default function VenueMap({ venue }: { venue: VenueData }) {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [failed, setFailed] = useState(false);

  const address = buildAddress(venue);
  const geocodingQuery = buildGeocodingQuery(venue);

  useEffect(() => {
    if (!geocodingQuery) return;

    const controller = new AbortController();

    const params = new URLSearchParams({ q: geocodingQuery, limit: '1', lang: 'en' });

    fetch(`https://photon.komoot.io/api/?${params}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((geojson) => {
        const feature = geojson?.features?.[0];
        if (feature) {
          const [lon, lat] = feature.geometry.coordinates;
          setCoords({ lat, lon });
        } else {
          setFailed(true);
        }
      })
      .catch((err) => {
        if (err?.name !== 'AbortError') {
          console.error('VenueMap geocoding failed:', err);
          setFailed(true);
        }
      });

    return () => controller.abort();
  }, [geocodingQuery]);

  if (!address) return null;

  if (failed) {
    return (
      <a
        href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(address)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.fallbackLink}
      >
        View on map →
      </a>
    );
  }

  if (!coords) return null;

  const { lat, lon } = coords;
  const delta = 0.004;
  const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;

  return (
    <div className={styles.wrap}>
      <iframe
        src={src}
        title={`Map of ${venue.name}`}
        className={styles.map}
        loading="lazy"
      />
      <a
        href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.osmLink}
      >
        View larger map →
      </a>
    </div>
  );
}
