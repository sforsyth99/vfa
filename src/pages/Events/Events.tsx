import { Link } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { useGetFestivalEvents } from '../../api/festivalEvents/useGetFestivalEvents';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities';
import { usePageTitle } from '../../utils/usePageTitle';
import { Container } from '../../components/Container/Container';
import { PageTitle } from '../../components/PageTitle/PageTitle';
import styles from './Events.module.css';

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-CA', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
}

function formatTime(t: string): string {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${period}`;
}

function Events() {
  const intl = useIntl();
  usePageTitle(intl.formatMessage({ id: 'events.heading' }));
  const { data: events, isLoading, error } = useGetFestivalEvents();

  const sorted = (events ?? []).sort((a, b) =>
    a.event_data.event_date.localeCompare(b.event_data.event_date)
  );

  return (
    <main id="main-content" className={styles.page}>
      <Container>
        <PageTitle><FormattedMessage id="events.heading" /></PageTitle>

        {isLoading && <p className={styles.state}><FormattedMessage id="events.loading" /></p>}
        {error && <p className={styles.state}><FormattedMessage id="events.error" /></p>}
        {!isLoading && !error && sorted.length === 0 && (
          <p className={styles.state}><FormattedMessage id="events.empty" /></p>
        )}

        <ul className={styles.list}>
          {sorted.map((event) => {
            const d = event.event_data;
            const title = decodeHtmlEntities(event.title?.rendered ?? '');
            const inPersonTicket = d.tickets?.find((t) => t.type === 'in_person');
            const price = inPersonTicket?.price ? `$${inPersonTicket.price}` : intl.formatMessage({ id: 'events.free' });
            const timeStr = d.time_start
              ? `${formatTime(d.time_start)}${d.time_end ? ` – ${formatTime(d.time_end)}` : ''} PT`
              : '';

            return (
              <li key={event.id} className={styles.item}>
                <div className={styles.meta}>
                  {d.event_date && <span className={styles.date}>{formatDate(d.event_date)}</span>}
                  {timeStr && <span className={styles.time}>{timeStr}</span>}
                  {d.venue?.name && <span className={styles.venue}>{d.venue.name}</span>}
                  <span className={styles.price}>{price}</span>
                </div>
                <h2 className={styles.title}>
                  <Link to={`/festival-events/${event.slug}`}>{title}</Link>
                </h2>
                {d.summary && <p className={styles.summary}>{d.summary}</p>}
                <Link to={`/festival-events/${event.slug}`} className={styles.details}>
                  <FormattedMessage id="events.details" />
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </main>
  );
}

export default Events;
