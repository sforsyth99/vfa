import { useGetFestivalEvents } from '../../api/festivalEvents/useGetFestivalEvents';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities';
import { EventbriteWidget } from '../../components/EventbriteWidget/EventbriteWidget';
import { Container } from '../../components/Container/Container';
import { PageLoader } from '../../components/PageLoader/PageLoader';

export default function EventbriteTestPage() {
  const { data: events, isLoading } = useGetFestivalEvents();

  if (isLoading) return <PageLoader />;

  const featured =
    (events ?? []).find((e) => e.event_data.is_featured && e.event_data.eventbrite_url) ??
    (events ?? []).find((e) => !!e.event_data.eventbrite_url);

  if (!featured) {
    return (
      <main id="main-content">
        <Container>
          <p>No event with an Eventbrite URL found.</p>
        </Container>
      </main>
    );
  }

  const title = decodeHtmlEntities(featured.title?.rendered ?? '');
  const { eventbrite_url, tickets } = featured.event_data;

  return (
    <main id="main-content">
      <Container narrow>
        <h1>{title}</h1>
        <p style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#666' }}>
          URL: {eventbrite_url}
        </p>
        <EventbriteWidget
          eventbriteUrl={eventbrite_url}
          eventTitle={title}
          hasTickets={tickets.length > 0}
        />
      </Container>
    </main>
  );
}
