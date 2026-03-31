import React from 'react';
import { useGetTribeOrganizers } from '../api/events/useGetTribeOrganizers';
import type { TribeOrganizer } from '../api/events/types';
import styles from './Events.module.css';

const renderOrganizerDetail = (key: string, value: unknown): React.ReactNode => {
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

const TribeOrganizers: React.FC = () => {
  const { data: organizers, isLoading, error } = useGetTribeOrganizers();

  return (
    <main className={styles.eventsMain}>
      <h1>Organizers</h1>
      {isLoading && <p>Loading organizers...</p>}
      {error && <p>Error loading organizers.</p>}
      {organizers && (
        <ul>
          {organizers.slice(0, 5).map((organizer: TribeOrganizer) => (
            <li key={organizer.id} style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
              {Object.entries(organizer).map(([key, value]) => (
                <div key={key} style={{ marginBottom: '0.5rem' }}>
                  <strong>{key}:</strong> {renderOrganizerDetail(key, value)}
                </div>
              ))}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default TribeOrganizers;
