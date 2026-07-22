import { useIntl } from 'react-intl';
import { useGetTribeEvents } from '../api/events/useGetTribeEvents.ts';
import styles from './Events.module.css';

const renderEventDetail = (key: string, value: unknown): React.ReactNode => {
  if (typeof value === 'object' && value !== null) {
    if (key === 'title' || key === 'content' || key === 'excerpt') {
      return <span dangerouslySetInnerHTML={{ __html: (value as { rendered: string }).rendered }} />;
    }
    return (
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return value === null || value === undefined ? '' : value.toString();
};

function Events() {
  const intl = useIntl();
  const { data: events, isLoading, error } = useGetTribeEvents();

  return (
    <main id="main-content" className={styles.eventsMain}>
      <h1>{intl.formatMessage({ id: 'events.heading' })}</h1>
      {isLoading && <p>{intl.formatMessage({ id: 'events.loading' })}</p>}
      {error && <p>{intl.formatMessage({ id: 'events.error' })}</p>}
      {events && (
        <ul>
          {events.map(event => (
            <li key={event.id} style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
              {Object.entries(event).map(([key, value]) => (
                <div key={key} style={{ marginBottom: '0.5rem' }}>
                  <strong>{key}:</strong> {renderEventDetail(key, value)}
                </div>
              ))}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default Events;
