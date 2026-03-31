import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from '../api/events';
import type { Event } from '../api/types';
import { EventList } from '../components/EventList';
import { FormattedMessage } from 'react-intl';

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
      <h1><FormattedMessage id="home.featuredEvents" defaultMessage="Featured Events" /></h1>
      {featured.length === 0 ? (
        <p><FormattedMessage id="home.noEvents" defaultMessage="No upcoming events. Check back soon or sign up for our newsletter!" /></p>
      ) : (
        <EventList events={featured} />
      )}
      <h2><FormattedMessage id="home.upcomingEvents" defaultMessage="Upcoming Events" /></h2>
      {upcoming.length === 0 ? (
        <p><FormattedMessage id="home.noEvents" defaultMessage="No upcoming events. Check back soon or sign up for our newsletter!" /></p>
      ) : (
        <EventList events={upcoming} />
      )}
    </main>
  );
}
