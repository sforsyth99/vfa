import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { useGetFestivalEvents } from '../../api/festivalEvents/useGetFestivalEvents';
import { useGetInterviews } from '../../api/interviews/useGetInterviews';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities';
import { eventPath } from '../../utils/eventPath';
import { EventLink } from '../EventLink/EventLink';
import { SkeletonBlock } from '../Skeleton/Skeleton';
import { formatTicketPrice } from '../../utils/formatTicketPrice';
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
  const { data: interviews } = useGetInterviews();

  if (isLoading) return (
    <section className={styles.section} aria-busy="true">
      <div className={styles.inner}>
        <SkeletonBlock className={styles.skeletonEyebrow} />
        <SkeletonBlock className={styles.skeletonHeading} />
        <div className={styles.skeletonList}>
          {[0, 1, 2].map((i) => <SkeletonBlock key={i} className={styles.skeletonCard} />)}
        </div>
      </div>
    </section>
  );

  // Map author ID → their most recent interview (by festival year)
  const interviewByAuthor = new Map(
    (interviews ?? [])
      .sort((a, b) => (b.interview_data.festival_year ?? 0) - (a.interview_data.festival_year ?? 0))
      .flatMap((iv) => iv.interview_data.authors.map((author) => [author.id, iv] as const))
  );

  const today = new Date().toISOString().slice(0, 10);
  const featured = (events ?? [])
    .filter((e) => e.event_data.is_featured && e.event_data.event_date >= today)
    .sort((a, b) => {
      const dateCmp = a.event_data.event_date.localeCompare(b.event_data.event_date);
      if (dateCmp !== 0) return dateCmp;
      return (a.event_data.time_start || '').localeCompare(b.event_data.time_start || '');
    });

  if (!featured.length) return null;

  return (
    <section className={styles.section} aria-labelledby="featured-events-heading">
      <div className={styles.inner}>
        <p className={styles.eyebrow}><FormattedMessage id="featured.eyebrow" /></p>
        <div className={styles.headingRow}>
          <h2 id="featured-events-heading" className={styles.heading}>
            <FormattedMessage id="featured.heading" />
          </h2>
          <Link to="/events" className={styles.seeAll}>
            <FormattedMessage id="featured.seeAll" /> ›
          </Link>
        </div>
        <ul className={styles.list}>
          {featured.map((event) => {
            const { event_date, time_start, time_end, venue, summary, tickets, authors, event_image } = event.event_data;
            const price = formatTicketPrice(tickets, intl.formatMessage({ id: 'events.free' }));
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
                    <EventLink slug={event.slug} isKidfest={event.event_data.is_kidfest} eventType={event.event_data.event_type}>{title}</EventLink>
                  </h3>
                  {summary && <p className={styles.cardSummary}>{summary}</p>}
                  {authors.map((author) => {
                    const iv = interviewByAuthor.get(author.id);
                    if (!iv) return null;
                    const bookTitle = iv.interview_data.book_title;
                    const label = bookTitle
                      ? intl.formatMessage({ id: 'person.interviewLink.withBook' }, { name: author.name, bookTitle })
                      : intl.formatMessage({ id: 'person.interviewLink.generic' });
                    return (
                      <Link key={author.id} to={`/interviews/${iv.slug}`} className={styles.cardInterviewLink}>
                        {label}
                      </Link>
                    );
                  })}
                  {event.event_data.is_kidfest && event.event_data.event_type === 'author_fair' ? (
                    <Link to="/kidsfest2026" className={styles.cardCta}>{ctaLabel}</Link>
                  ) : (
                    <Link to={eventPath(event.slug)} className={styles.cardCta}>
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
