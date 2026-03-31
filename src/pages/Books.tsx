import React from 'react';
import { useGetOsomBooks } from '../api/books/useGetOsomBooks';
import styles from './Events.module.css';
import type { OsomBook } from '../api/books/types.ts';

const renderBookDetail = (key: string, value: unknown): React.ReactNode => {
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

const Books: React.FC = () => {
  const { data: books, isLoading, error } = useGetOsomBooks();

  return (
    <main className={styles.eventsMain}>
      <h1>Books</h1>
      {isLoading && <p>Loading books...</p>}
      {error && <p>Error loading books.</p>}
      {books && (
        <ul>
          {books.slice(0, 5).map((book: OsomBook) => (
            <li key={book.id} style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
              {Object.entries(book).map(([key, value]) => (
                <div key={key} style={{ marginBottom: '0.5rem' }}>
                  <strong>{key}:</strong> {renderBookDetail(key, value)}
                </div>
              ))}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default Books;
