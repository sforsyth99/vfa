import React from 'react';
import { useGetTribeVenue } from '../api/events/useGetTribeVenue';
import type { TribeVenue } from '../api/events/types';
import styles from './Events.module.css';

const renderVenueDetail = (key: string, value: unknown): React.ReactNode => {
  if (typeof value === 'object' && value !== null) {
    if (key === 'title' || key === 'content' || key === 'excerpt') {
      // @ts-expect-error: value.rendered is expected for these keys
      return <span dangerouslySetInnerHTML={{ __html: value.rendered }} />;
    }
    return <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{JSON.stringify(value, null, 2)}</pre>;
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  return value === null || value === undefined ? '' : value.toString();
};

const TribeVenues: React.FC = () => {
  const { data: venues, isLoading, error } = useGetTribeVenue();

  return (
    <main className={styles.eventsMain}>
      <h1>Venues</h1>
      {isLoading && <p>Loading venues...</p>}
      {error && <p>Error loading venues.</p>}
      {venues && (
        <ul>
          {venues.slice(0, 5).map((venue: TribeVenue) => (
            <li key={venue.id} style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
              {Object.entries(venue).map(([key, value]) => (
                <div key={key} style={{ marginBottom: '0.5rem' }}>
                  <strong>{key}:</strong> {renderVenueDetail(key, value)}
                </div>
              ))}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default TribeVenues;
