import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from '../api/events';
import type { Event } from '../api/types';

export function HomePage() {
  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });

  if (isLoading) return <div>Loading events...</div>;
  if (error) return <div>Failed to load events.</div>;

  const featured = events?.filter(e => e.featured) || [];
  const upcoming = events?.filter(e => !e.featured) || [];

  return (
    <main id="main-content">
      <h1>Featured Events</h1>
      {featured.length === 0 ? (
        <p>No featured events.</p>
      ) : (
        <ul>
          {featured.map(event => (
            <li key={event.id}>
              <strong>{event.title}</strong> — {new Date(event.date).toLocaleString()}<br />
              <a href={event.eventbriteUrl} target="_blank" rel="noopener noreferrer">Buy Tickets</a>
            </li>
          ))}
        </ul>
      )}
      <h2>Upcoming Events</h2>
      {upcoming.length === 0 ? (
        <p>No upcoming events.</p>
      ) : (
        <ul>
          {upcoming.map(event => (
            <li key={event.id}>
              <strong>{event.title}</strong> — {new Date(event.date).toLocaleString()}<br />
              <a href={event.eventbriteUrl} target="_blank" rel="noopener noreferrer">Buy Tickets</a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
