import { Link } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { usePageTitle } from '../../utils/usePageTitle';
import { useGetKidfestAuthors } from '../../api/people/useGetKidfestAuthors';
import { useGetFestivalEvents } from '../../api/festivalEvents/useGetFestivalEvents';
import { useGetBooks } from '../../api/books/useGetBooks';
import { Container } from '../../components/Container/Container';
import { SectionTitle } from '../../components/SectionTitle/SectionTitle';
import { BookLink } from '../../components/BookLink/BookLink';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities';
import posterSrc from '../../assets/VFA_KidsFest.jpg';
import styles from './KidsFest2026.module.css';

function formatTime(t: string): string {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${period}`;
}

function KidsFestHero() {
  const intl = useIntl();
  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <img
          src={posterSrc}
          alt={intl.formatMessage({ id: 'kidsfest.posterAlt' })}
          className={styles.heroPoster}
        />
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>
            {intl.formatMessage({ id: 'kidsfest.eyebrow' })}
          </p>
          <h1 className={styles.heroHeading}>
            {intl.formatMessage({ id: 'kidsfest.heading' })}
          </h1>
          <p className={styles.heroTagline}>
            {intl.formatMessage({ id: 'kidsfest.tagline' })}
          </p>
          <dl className={styles.heroDetails}>
            <div className={styles.heroDetailRow}>
              <dt className={styles.heroDetailLabel}>Date</dt>
              <dd className={styles.heroDetailValue}>
                {intl.formatMessage({ id: 'kidsfest.date' })}
              </dd>
            </div>
            <div className={styles.heroDetailRow}>
              <dt className={styles.heroDetailLabel}>Time</dt>
              <dd className={styles.heroDetailValue}>
                {intl.formatMessage({ id: 'kidsfest.time' })}
              </dd>
            </div>
            <div className={styles.heroDetailRow}>
              <dt className={styles.heroDetailLabel}>Where</dt>
              <dd className={styles.heroDetailValue}>
                {intl.formatMessage({ id: 'kidsfest.venue' })}
                <span className={styles.heroAddress}>
                  {intl.formatMessage({ id: 'kidsfest.address' })}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

function KidsFestEvents() {
  const intl = useIntl();
  const { data: events, isLoading } = useGetFestivalEvents();

  if (isLoading) return <p>{intl.formatMessage({ id: 'kidsfest2026.events.loading' })}</p>;

  const sorted = (events ?? [])
    .filter((e) => e.event_data.is_kidfest)
    .sort((a, b) => {
      const dateCmp = a.event_data.event_date.localeCompare(b.event_data.event_date);
      return dateCmp !== 0 ? dateCmp : a.event_data.time_start.localeCompare(b.event_data.time_start);
    });

  if (!sorted.length) {
    return <p className={styles.empty}>{intl.formatMessage({ id: 'kidsfest2026.events.empty' })}</p>;
  }

  const mainEvent = sorted.find((e) => e.event_data.event_type === 'author_fair');
  const otherEvents = sorted.filter((e) => e.event_data.event_type !== 'author_fair');

  return (
    <div className={styles.eventsWrapper}>
      {mainEvent && (() => {
        const { time_start, time_end, venue } = mainEvent.event_data;
        const timeStr = time_start
          ? `${formatTime(time_start)}${time_end ? ` – ${formatTime(time_end)}` : ''}`
          : '';
        const title = decodeHtmlEntities(mainEvent.title?.rendered ?? '');
        return (
          <div className={styles.mainEventCard}>
            <p className={styles.mainEventEyebrow}>
              {intl.formatMessage({ id: 'kidsfest2026.mainEvent.eyebrow' })}
            </p>
            <h3 className={styles.mainEventTitle}>
              <Link to={`/festival-events/${mainEvent.slug}`}>{title}</Link>
            </h3>
            <p className={styles.mainEventMeta}>
              {timeStr}{venue?.name ? ` · ${venue.name}` : ''}
            </p>
            <p className={styles.mainEventDescription}>
              {intl.formatMessage({ id: 'kidsfest2026.mainEvent.description' })}
            </p>
            <span className={styles.mainEventFree}>
              {intl.formatMessage({ id: 'kidsfest2026.mainEvent.free' })}
            </span>
          </div>
        );
      })()}

      {otherEvents.length > 0 && (
        <ul className={styles.eventList}>
          {otherEvents.map((event) => {
            const { time_start, time_end, venue, age_range, event_type, tickets } = event.event_data;
            const isWorkshop = event_type === 'workshop';
            const timeStr = time_start
              ? `${formatTime(time_start)}${time_end ? ` – ${formatTime(time_end)}` : ''}`
              : '';
            const price = tickets.find((t) => t.type === 'in_person')?.price || tickets[0]?.price || 'Free';
            const title = decodeHtmlEntities(event.title?.rendered ?? '');
            return (
              <li key={event.id} className={styles.eventCard}>
                <div className={styles.eventMeta}>
                  {isWorkshop && (
                    <span className={styles.workshopBadge}>
                      {intl.formatMessage({ id: 'kidsfest2026.workshop.badge' })}
                    </span>
                  )}
                  {timeStr && <span className={styles.eventTime}>{timeStr}</span>}
                  {age_range && <span className={styles.eventAge}>{age_range}</span>}
                  <span className={styles.eventPrice}>{price}</span>
                </div>
                <h3 className={styles.eventTitle}>
                  <Link to={`/festival-events/${event.slug}`}>{title}</Link>
                </h3>
                {venue?.name && <p className={styles.eventVenue}>{venue.name}</p>}
                <Link to={`/festival-events/${event.slug}`} className={styles.eventLink}>
                  {intl.formatMessage({ id: 'kidsfest2026.events.details' })}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function KidsFestAuthors() {
  const intl = useIntl();
  const { data: everyone, isLoading } = useGetKidfestAuthors(2026);

  if (isLoading) return <p>{intl.formatMessage({ id: 'kidsfest2026.authors.loading' })}</p>;
  if (!everyone?.length) return null;

  const sorted = [...everyone].sort((a, b) => {
    const surname = (name: string) => name.trim().split(/\s+/).at(-1)!.toLowerCase();
    return surname(a.name).localeCompare(surname(b.name));
  });

  return (
    <section className={styles.section}>
      <div className={styles.authorGrid} aria-label={intl.formatMessage({ id: 'kidsfest2026.authors.heading' })}>
        {sorted.map((author) => {
          const isGuest = author.elder_years?.includes(2026);
          const photo = author.photo;
          const initials = author.name.trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
          return (
            <Link
              key={author.id}
              to={`/people/${author.slug}`}
              className={`${styles.authorCard} ${isGuest ? styles.authorCardGuest : ''}`}
            >
              {photo ? (
                <img src={photo[0]} alt="" aria-hidden="true" loading="lazy" className={styles.authorPhoto} />
              ) : (
                <div className={styles.authorPhotoPlaceholder} aria-hidden="true">{initials}</div>
              )}
              <span className={styles.authorName}>{author.name}</span>
              {isGuest && (
                <span className={styles.guestBadge}>
                  {intl.formatMessage({ id: 'kidsfest2026.elders.heading' })}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function KidsBooks() {
  const { data: books, isLoading } = useGetBooks();

  if (isLoading || !books?.length) return null;

  const kidsBooks = books.filter((b) => b.book_data?.categories?.includes('children'));
  if (!kidsBooks.length) return null;

  return (
    <div className={styles.bookGrid}>
      {kidsBooks.map((book) => {
        const cover = book.book_data?.cover_image;
        const title = decodeHtmlEntities(book.title?.rendered ?? '');
        return (
          <BookLink
            key={book.id}
            slug={book.slug}
            munrosUrl={book.book_data?.munros_url}
            className={styles.bookItem}
          >
            {cover ? (
              <img src={cover[0]} alt="" aria-hidden="true" loading="lazy" className={styles.bookCover} />
            ) : (
              <div className={styles.bookCoverPlaceholder} aria-hidden="true" />
            )}
            <p className={styles.bookTitle}>{title}</p>
            {(() => {
              const authorNames = (book.book_data?.authors ?? []).map((a) => a.name);
              if (book.book_data?.additional_authors) authorNames.push(book.book_data.additional_authors);
              return authorNames.length > 0
                ? <p className={styles.bookAuthor}>by {authorNames.join(', ')}</p>
                : null;
            })()}
          </BookLink>
        );
      })}
    </div>
  );
}

export default function KidsFest2026Page() {
  const intl = useIntl();
  usePageTitle(intl.formatMessage({ id: 'kidsfest2026.pageTitle' }));

  return (
    <main id="main-content">
      <KidsFestHero />
      <Container>
        <section className={styles.section}>
          <SectionTitle>
            <FormattedMessage id="kidsfest2026.events.heading" />
          </SectionTitle>
          <KidsFestEvents />
        </section>
        <KidsFestAuthors />
        <section className={styles.section}>
          <SectionTitle>
            <FormattedMessage id="kidsfest2026.books.heading" />
          </SectionTitle>
          <KidsBooks />
        </section>
      </Container>
    </main>
  );
}
