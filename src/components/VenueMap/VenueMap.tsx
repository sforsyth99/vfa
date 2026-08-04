import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { VenueData } from '../../api/venues/venueTypes.ts';
import styles from './VenueMap.module.css';

// Leaflet's default icon assets don't resolve correctly through Vite's bundler,
// so we point directly to the CDN copies.
const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

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
  return [venue.street_address, venue.city, venue.province, venue.country]
    .filter(Boolean)
    .join(', ');
}

export default function VenueMap({ venue }: { venue: VenueData }) {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [failed, setFailed] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<L.Map | null>(null);

  const address = buildAddress(venue);
  const geocodingQuery = buildGeocodingQuery(venue);

  useEffect(() => {
    if (!geocodingQuery) return;

    const controller = new AbortController();

    const params = new URLSearchParams({ addressString: geocodingQuery, maxResults: '1', outputSRS: '4326' });

    fetch(`https://geocoder.api.gov.bc.ca/addresses.json?${params}`, { signal: controller.signal })
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

  useEffect(() => {
    if (!coords || !mapRef.current) return;

    const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: false }).setView(
      [coords.lat, coords.lon],
      16
    );

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    L.marker([coords.lat, coords.lon], { icon: markerIcon }).addTo(map);

    leafletRef.current = map;

    return () => {
      map.remove();
      leafletRef.current = null;
    };
  }, [coords]);

  if (!address) return null;

  if (failed) {
    return (
      <a
        href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(address)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.fallbackLink}
      >
        View on map
      </a>
    );
  }

  if (!coords) return null;

  const { lat, lon } = coords;

  return (
    <div className={styles.wrap}>
      <div ref={mapRef} className={styles.map} />
      <a
        href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.osmLink}
      >
        View larger map
      </a>
    </div>
  );
}
