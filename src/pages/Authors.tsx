import React from 'react';
import { useGetOsomAuthors } from '../api/authors/useGetOsomAuthors';
import styles from './Events.module.css';
import type { OsomAuthor } from '../api/authors/types.ts';

const renderAuthorDetail = (_key: string, value: unknown): React.ReactNode => {
  if (typeof value === 'object' && value !== null) {
    return <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{JSON.stringify(value, null, 2)}</pre>;
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  return value === null || value === undefined ? '' : value.toString();
};

const Authors: React.FC = () => {
  const { data: authors, isLoading, error } = useGetOsomAuthors();

  return (
    <main className={styles.eventsMain}>
      <h1>Authors</h1>
      {isLoading && <p>Loading authors...</p>}
      {error && <p>Error loading authors.</p>}
      {authors && (
        <ul>
          {authors.slice(0, 5).map((author: OsomAuthor) => (
            <li key={author.id} style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
              {Object.entries(author).map(([key, value]) => (
                <div key={key} style={{ marginBottom: '0.5rem' }}>
                  <strong>{key}:</strong> {renderAuthorDetail(key, value)}
                </div>
              ))}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default Authors;
