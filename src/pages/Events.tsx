import { useGetTribeEvents } from '../api/events/useGetTribeEvents.ts';
import styles from './Events.module.css';


const renderEventDetail = (key: string, value: any) => {
  if (typeof value === 'object' && value !== null) {
    if (key === 'title' || key === 'content' || key === 'excerpt') {
      // Render HTML safely for known fields
      return (
        <span dangerouslySetInnerHTML={{ __html: value.rendered }} />
      );
    }
    // Render objects/arrays as JSON for now
    return <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{JSON.stringify(value, null, 2)}</pre>;
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  return value === null || value === undefined ? '' : value.toString();
};

const Events: React.FC = () => {
  const { data: events, isLoading, error } = useGetTribeEvents();

  return (
    <main className={styles.eventsMain}>
      <h1>Events</h1>
      {isLoading && <p>Loading events...</p>}
      {error && <p>Error loading events.</p>}
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
};

export default Events;
