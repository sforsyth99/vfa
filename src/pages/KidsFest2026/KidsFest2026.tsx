import { Link } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { usePageTitle } from '../../utils/usePageTitle';
import { useGetKidfestAuthors } from '../../api/people/useGetKidfestAuthors';
import { CURRENT_YEAR } from '../../config/festival';
import { type FestivalEvent } from '../../api/festivalEvents/festivalEventTypes';
import { useGetFestivalEvents } from '../../api/festivalEvents/useGetFestivalEvents';
import { useGetBooks } from '../../api/books/useGetBooks';
import { Container } from '../../components/Container/Container';
import { SectionTitle } from '../../components/SectionTitle/SectionTitle';
import { BookLink } from '../../components/BookLink/BookLink';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities';
import { track } from '../../utils/analytics';
import { downloadIcs } from '../../utils/downloadIcs';
import { EventLink } from '../../components/EventLink/EventLink';
import { KidsFestInterviews } from '../../components/KidsFestInterviews/KidsFestInterviews';
import { sanitizeHtml } from '../../utils/sanitizeHtml';
import posterSrc from '../../assets/VFA_KidsFest.jpg';
import styles from './KidsFest2026.module.css';

function formatTime(t: string): string {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${period}`;
}

function KidsFestHero({ mainEvent }: { mainEvent: FestivalEvent | null }) {
  const intl = useIntl();

  const handleAddToCalendar = () => {
    if (!mainEvent) return;
    const { event_date, time_start, time_end, venue } = mainEvent.event_data;
    const title = decodeHtmlEntities(mainEvent.title?.rendered ?? '');
    const locationParts = [venue?.name, venue?.street_address, venue?.city, venue?.province].filter(Boolean);
    track({ name: 'add_to_calendar', event_label: title, event_location: 'hero' });
    downloadIcs({
      title,
      date: event_date,
      timeStart: time_start,
      timeEnd: time_end,
      location: locationParts.join(', '),
      description: intl.formatMessage({ id: 'kidsfest2026.mainEvent.description' }),
      filename: 'kidsfest-2026.ics',
      uid: 'kidsfest-2026-main@victoriafestivalofauthors.ca',
    });
  };

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
          {mainEvent && (
            <button
              className={styles.heroCalendarButton}
              onClick={handleAddToCalendar}
            >
              {intl.formatMessage({ id: 'kidsfest2026.mainEvent.addToCalendar' })}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function sortKidfestEvents(events: FestivalEvent[] | undefined) {
  return (events ?? [])
    .filter((e) => e.event_data.is_kidfest)
    .sort((a, b) => {
      const dateCmp = a.event_data.event_date.localeCompare(b.event_data.event_date);
      return dateCmp !== 0 ? dateCmp : a.event_data.time_start.localeCompare(b.event_data.time_start);
    });
}

function KidsFestMainEvent({ events, isLoading }: { events: FestivalEvent[] | undefined; isLoading: boolean }) {
  const intl = useIntl();
  const { data: authorData } = useGetKidfestAuthors(CURRENT_YEAR);
  const stripAuthors = (authorData ?? [])
    .filter((a) => !(a.elder_years?.includes(CURRENT_YEAR)))
    .sort((a, b) => {
      const surname = (name: string) => name.trim().split(/\s+/).at(-1)!.toLowerCase();
      return surname(a.name).localeCompare(surname(b.name));
    });

  if (isLoading) return <p>{intl.formatMessage({ id: 'kidsfest2026.events.loading' })}</p>;

  const sorted = sortKidfestEvents(events);
  if (!sorted.length) {
    return <p className={styles.empty}>{intl.formatMessage({ id: 'kidsfest2026.events.empty' })}</p>;
  }

  const mainEvent = sorted.find((e) => e.event_data.event_type === 'author_fair');
  if (!mainEvent) return null;

  const { time_start, time_end, venue } = mainEvent.event_data;
  const timeStr = time_start
    ? `${formatTime(time_start)}${time_end ? ` – ${formatTime(time_end)}` : ''}`
    : '';
  const title = decodeHtmlEntities(mainEvent.title?.rendered ?? '');
  const locationParts = [venue?.name, venue?.street_address, venue?.city, venue?.province].filter(Boolean);

  return (
    <div className={styles.eventsWrapper}>
      <div className={styles.mainEventCard}>
        <p className={styles.mainEventEyebrow}>
          {intl.formatMessage({ id: 'kidsfest2026.mainEvent.eyebrow' })}
        </p>
        <h3 className={styles.mainEventTitle}>
          <EventLink slug={mainEvent.slug} isKidfest={mainEvent.event_data.is_kidfest} eventType={mainEvent.event_data.event_type} eventbriteUrl={mainEvent.event_data.eventbrite_url}>{title}</EventLink>
        </h3>
        <p className={styles.mainEventMeta}>
          {timeStr}{venue?.name ? ` · ${venue.name}` : ''}
        </p>
        <p className={styles.mainEventDescription}>
          {intl.formatMessage({ id: 'kidsfest2026.mainEvent.description' })}
        </p>
        <div className={styles.mainEventActions}>
          <span className={styles.mainEventFree}>
            {intl.formatMessage({ id: 'kidsfest2026.mainEvent.free' })}
          </span>
          <button
            className={styles.calendarButton}
            onClick={() => {
              track({ name: 'add_to_calendar', event_label: title, event_location: 'event_card' });
              downloadIcs({
                title,
                date: mainEvent.event_data.event_date,
                timeStart: mainEvent.event_data.time_start,
                timeEnd: mainEvent.event_data.time_end,
                location: locationParts.join(', '),
                description: intl.formatMessage({ id: 'kidsfest2026.mainEvent.description' }),
                filename: 'kidsfest-2026.ics',
                uid: `kidsfest-2026-main@victoriafestivalofauthors.ca`,
              });
            }}
            aria-label={intl.formatMessage({ id: 'kidsfest2026.mainEvent.addToCalendar' })}
          >
            {intl.formatMessage({ id: 'kidsfest2026.mainEvent.addToCalendar' })}
          </button>
        </div>
      </div>

      {stripAuthors.length > 0 && (
        <ul className={styles.authorStripList} aria-label={intl.formatMessage({ id: 'kidsfest2026.authors.heading' })}>
          {stripAuthors.map((author) => (
            <li key={author.id}>
              <Link to={`/people/${author.slug}`} aria-label={author.name} className={styles.authorStripItem}>
                {author.photo ? (
                  <img src={author.photo[0]} alt={author.name} className={styles.authorStripPhoto} loading="lazy" />
                ) : (
                  <div className={styles.authorStripPlaceholder} aria-hidden="true">{author.name.trim().charAt(0)}</div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function KidsFestWorkshops({ events, isLoading }: { events: FestivalEvent[] | undefined; isLoading: boolean }) {
  const intl = useIntl();

  if (isLoading) return null;

  const sorted = sortKidfestEvents(events);
  const otherEvents = sorted.filter((e) => e.event_data.event_type !== 'author_fair');
  if (!otherEvents.length) return null;

  return (
    <ul className={styles.eventList}>
      {otherEvents.map((event) => {
        const { time_start, time_end, venue, age_range, event_type, tickets, eventbrite_url, summary } = event.event_data;
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
              {age_range && <span className={styles.eventAge}>{intl.formatMessage({ id: 'kidsfest2026.event.ageRange' }, { range: age_range })}</span>}
              <span className={styles.eventPrice}>{price}</span>
            </div>
            <h3 className={styles.eventTitle}>
              <EventLink slug={event.slug} isKidfest={event.event_data.is_kidfest} eventType={event.event_data.event_type} eventbriteUrl={eventbrite_url}>{title}</EventLink>
            </h3>
            {summary && <p className={styles.eventSummary}>{summary}</p>}
            {venue?.name && <p className={styles.eventVenue}>{venue.name}</p>}
            <EventLink slug={event.slug} isKidfest={event.event_data.is_kidfest} eventType={event.event_data.event_type} eventbriteUrl={eventbrite_url} className={styles.eventLink}>
              {intl.formatMessage({ id: 'kidsfest2026.events.details' })}
            </EventLink>
          </li>
        );
      })}
    </ul>
  );
}

function KidsFestSpecialGuest() {
  const intl = useIntl();
  const { data: everyone, isLoading } = useGetKidfestAuthors(CURRENT_YEAR);

  if (isLoading || !everyone?.length) return null;

  const guest = everyone.find((a) => a.elder_years?.includes(CURRENT_YEAR));
  if (!guest) return null;

  const photo = guest.photo;

  return (
    <section className={styles.specialGuestSection} aria-labelledby="special-guest-heading">
      <p className={styles.specialGuestEyebrow}>
        {intl.formatMessage({ id: 'kidsfest2026.elders.heading' })}
      </p>
      <div className={styles.specialGuestInner}>
        {photo && (
          <img
            src={photo[0]}
            alt={guest.name}
            className={styles.specialGuestPhoto}
            loading="lazy"
          />
        )}
        <div className={styles.specialGuestContent}>
          <h2 id="special-guest-heading" className={styles.specialGuestName}>
            {guest.name}
          </h2>
          {guest.bio && (
            <div
              className={styles.specialGuestBio}
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(guest.bio) }}
            />
          )}
        </div>
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
            bookTitle={title}
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

  const { data: events, isLoading } = useGetFestivalEvents();
  const mainEvent = (events ?? []).find(
    (e) => e.event_data.is_kidfest && e.event_data.event_type === 'author_fair',
  ) ?? null;

  return (
    <main id="main-content">
      <KidsFestHero mainEvent={mainEvent} />

      <div className={styles.bandTan}>
        <Container>
          <section className={styles.section}>
            <SectionTitle>
              <FormattedMessage id="kidsfest2026.events.heading" />
            </SectionTitle>
            <KidsFestMainEvent events={events} isLoading={isLoading} />
          </section>
        </Container>
      </div>

      <div className={styles.bandWhite}>
        <Container>
          <KidsFestWorkshops events={events} isLoading={isLoading} />
        </Container>
      </div>

      <div className={styles.bandTan}>
        <Container>
          <KidsFestSpecialGuest />
        </Container>
      </div>

      <div className={styles.bandWhite}>
        <Container>
          <KidsFestInterviews />
        </Container>
      </div>

      <div className={styles.bandTan}>
        <Container>
          <section className={styles.section}>
            <SectionTitle>
              <FormattedMessage id="kidsfest2026.books.heading" />
            </SectionTitle>
            <KidsBooks />
          </section>
        </Container>
      </div>
    </main>
  );
}
