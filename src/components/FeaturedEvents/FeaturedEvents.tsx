import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { useGetFestivalEvents } from '../../api/festivalEvents/useGetFestivalEvents';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities';
import styles from './FeaturedEvents.module.css';

function formatTime(t: string): string {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${period}`;
}

export function FeaturedEvents() {
  const intl = useIntl();
  const { data: events, isLoading } = useGetFestivalEvents();

  if (isLoading) return null;

  const today = new Date().toISOString().slice(0, 10);
  const featured = (events ?? [])
    .filter((e) => e.event_data.is_featured && e.event_data.event_date >= today)
    .sort((a, b) => a.event_data.event_date.localeCompare(b.event_data.event_date));

  if (!featured.length) return null;

  return (
    <section className={styles.section} aria-labelledby="featured-events-heading">
      <div className={styles.inner}>
        <p className={styles.eyebrow}><FormattedMessage id="featured.eyebrow" /></p>
        <h2 id="featured-events-heading" className={styles.heading}>
          <FormattedMessage id="featured.heading" />
        </h2>
        <ul className={styles.list}>
          {featured.map((event) => {
            const { event_date, time_start, time_end, venue, summary, eventbrite_url, tickets, authors, event_image } = event.event_data;
            const inPersonTicket = tickets.find((t) => t.type === 'in_person');
            const rawPrice = inPersonTicket?.price;
            const price = rawPrice ? `$${rawPrice}` : 'Free';
            const dateStr = event_date
              ? new Date(event_date + 'T00:00:00').toLocaleDateString('en-CA', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                })
              : '';
            const timeStr = time_start
              ? `${formatTime(time_start)}${time_end ? ` – ${formatTime(time_end)}` : ''}`
              : '';
            const title = decodeHtmlEntities(event.title?.rendered ?? '');
            const ctaLabel = intl.formatMessage({ id: 'featured.details' });
            return (
              <li key={event.id} className={styles.card}>
                <div className={styles.cardBody}>
                  <div className={styles.cardMeta}>
                    <div className={styles.cardMetaRow}>
                      {dateStr && <span className={styles.cardDate}>{dateStr}</span>}
                      {timeStr && <span className={styles.cardTime}>{timeStr}</span>}
                    </div>
                    <div className={styles.cardMetaRow}>
                      {venue?.name && <span className={styles.cardVenue}>{venue.name}</span>}
                      <span className={styles.cardPrice}>{price}</span>
                    </div>
                  </div>
                  <h3 className={styles.cardTitle}>
                    <Link to={`/festival-events/${event.slug}`}>{title}</Link>
                  </h3>
                  {summary && <p className={styles.cardSummary}>{summary}</p>}
                  {eventbrite_url ? (
                    <a href={eventbrite_url} target="_blank" rel="noopener noreferrer" className={styles.cardCta}>
                      {ctaLabel}
                    </a>
                  ) : (
                    <Link to={`/festival-events/${event.slug}`} className={styles.cardCta}>
                      {ctaLabel}
                    </Link>
                  )}
                </div>
                {(() => {
                  const bookCovers = authors.flatMap((a) => a.books ?? []).flatMap((b) =>
                    Array.isArray(b.cover) ? [{ id: b.id, title: b.title, src: b.cover[0] as string }] : []
                  );
                  const authorPhotos = authors.flatMap((a) => {
                    const src = Array.isArray(a.photo) ? a.photo[0] as string : undefined;
                    return src ? [{ id: a.id, name: a.name, src }] : [];
                  });
                  if (bookCovers.length === 0 && authorPhotos.length === 0 && !event_image) return null;
                  return (
                    <div className={styles.cardImagePanel}>
                      {authorPhotos.map((a) => (
                        <img key={a.id} src={a.src} alt={a.name} className={styles.cardAuthorPhoto} />
                      ))}
                      {bookCovers.map((book) => (
                        <img key={book.id} src={book.src} alt={book.title} className={styles.cardBookCover} />
                      ))}
                      {bookCovers.length === 0 && event_image && (
                        <img src={event_image[0]} alt={title} className={styles.cardImage} />
                      )}
                    </div>
                  );
                })()}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
