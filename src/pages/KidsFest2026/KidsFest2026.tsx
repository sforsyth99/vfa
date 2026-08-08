import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { usePageTitle } from '../../utils/usePageTitle';
import { useGetKidfestAuthors } from '../../api/people/useGetKidfestAuthors';
import { type PersonData } from '../../api/people/peopleTypes';
import { CURRENT_YEAR } from '../../config/festival';
import { type FestivalEvent } from '../../api/festivalEvents/festivalEventTypes';
import { useGetFestivalEvents } from '../../api/festivalEvents/useGetFestivalEvents';
import { useGetBooks } from '../../api/books/useGetBooks';
import { Container } from '../../components/Container/Container';
import { BookLink } from '../../components/BookLink/BookLink';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities';
import { track } from '../../utils/analytics';
import { downloadIcs } from '../../utils/downloadIcs';
import { EventLink } from '../../components/EventLink/EventLink';
import { KidsFestInterviews } from '../../components/KidsFestInterviews/KidsFestInterviews';
import { sanitizeHtml } from '../../utils/sanitizeHtml';
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
          <div className={styles.heroActions}>
            <p className={styles.heroBadge}>
              {intl.formatMessage({ id: 'kidsfest2026.mainEvent.free' })}
            </p>
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

function KidsFestWorkshops({ events, isLoading }: { events: FestivalEvent[] | undefined; isLoading: boolean }) {
  const intl = useIntl();

  if (isLoading) return null;

  const sorted = sortKidfestEvents(events);
  const otherEvents = sorted.filter((e) => e.event_data.event_type !== 'author_fair');
  if (!otherEvents.length) return null;

  return (
    <section className={styles.workshopsSection} aria-labelledby="workshops-heading">
      <h2 id="workshops-heading" className={styles.workshopsHeading}>
        {intl.formatMessage({ id: 'kidsfest2026.workshops.heading' })}
      </h2>
      <p className={styles.workshopsBlurb}>
        {intl.formatMessage({ id: 'kidsfest2026.workshops.description' })}
      </p>
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
    </section>
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
      <h2 id="special-guest-heading" className={styles.specialGuestName}>
        {guest.name}
      </h2>
      <div className={styles.specialGuestInner}>
        {photo && (
          <img
            src={photo[0]}
            alt={guest.name}
            className={styles.specialGuestPhoto}
            loading="lazy"
          />
        )}
        {guest.bio && (
          <div
            className={styles.specialGuestBio}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(guest.bio) }}
          />
        )}
      </div>
    </section>
  );
}

function KidsFestReadBooks() {
  const intl = useIntl();
  const { data: books, isLoading } = useGetBooks();

  if (isLoading || !books?.length) return null;

  const kidsBooks = books.filter((b) => b.book_data?.categories?.includes('children'));
  if (!kidsBooks.length) return null;

  const topRow = kidsBooks.slice(0, 5);
  const midLeft = kidsBooks[5] ?? null;
  const midRight = kidsBooks[6] ?? null;
  const bottomRow = kidsBooks.slice(7, 12);

  const renderCover = (book: typeof kidsBooks[0]) => {
    const cover = book.book_data?.cover_image;
    const title = decodeHtmlEntities(book.title?.rendered ?? '');
    return (
      <BookLink
        key={book.id}
        slug={book.slug}
        munrosUrl={book.book_data?.munros_url}
        bookTitle={title}
        aria-label={title}
        className={styles.rbPhotoCell}
      >
        {cover ? (
          <img src={cover[0]} alt="" aria-hidden="true" loading="lazy" className={styles.rbCover} />
        ) : (
          <div className={styles.rbPlaceholder} aria-hidden="true" />
        )}
      </BookLink>
    );
  };

  return (
    <section className={styles.rbSection} aria-labelledby="read-books-heading">
      <div className={styles.rbGrid}>
        {topRow.map(renderCover)}

        {midLeft ? renderCover(midLeft) : <div aria-hidden="true" />}
        <div className={styles.rbTextCell}>
          <p className={styles.rbReadThe}>
            {intl.formatMessage({ id: 'kidsfest2026.readBooks.readThe' })}
          </p>
          <h2 id="read-books-heading" className={styles.rbBooks}>
            {intl.formatMessage({ id: 'kidsfest2026.readBooks.books' })}
          </h2>
        </div>
        {midRight ? renderCover(midRight) : <div aria-hidden="true" />}

        {bottomRow.map(renderCover)}
      </div>
    </section>
  );
}

function KidsFestMeetAuthors() {
  const intl = useIntl();
  const { data: authorData } = useGetKidfestAuthors(CURRENT_YEAR);

  const authors = (authorData ?? [])
    .filter((a) => !(a.elder_years?.includes(CURRENT_YEAR)))
    .sort((a, b) => {
      const surname = (name: string) => name.trim().split(/\s+/).at(-1)!.toLowerCase();
      return surname(a.name).localeCompare(surname(b.name));
    });

  if (!authors.length) return null;

  const topRow = authors.slice(0, 5);
  const midLeft = authors[5] ?? null;
  const bottomRow = authors.slice(6, 11);

  const renderPhoto = (author: PersonData) => {
    const photoSrc = author.kidfest_photo || author.photo;
    return (
      <Link
        key={author.id}
        to={`/people/${author.slug}`}
        className={styles.maPhotoCell}
      >
        {photoSrc ? (
          <img src={photoSrc[0]} alt="" aria-hidden="true" className={styles.maPhoto} loading="lazy" />
        ) : (
          <div className={styles.maPlaceholder} aria-hidden="true">
            {author.name.trim().charAt(0)}
          </div>
        )}
        <p className={styles.maAuthorName}>{author.name}</p>
      </Link>
    );
  };

  return (
    <section className={styles.maSection} aria-labelledby="meet-authors-heading">
      <div className={styles.maGrid}>
        {topRow.map(renderPhoto)}

        {midLeft ? renderPhoto(midLeft) : <div aria-hidden="true" />}
        <div className={styles.maTextCell}>
          <p className={styles.maMeetThe}>
            {intl.formatMessage({ id: 'kidsfest2026.meetAuthors.meetThe' })}
          </p>
          <h2 id="meet-authors-heading" className={styles.maAuthors}>
            {intl.formatMessage({ id: 'kidsfest2026.meetAuthors.authors' })}
          </h2>
          <p className={styles.maTextDate}>
            {intl.formatMessage({ id: 'kidsfest.date' })} · {intl.formatMessage({ id: 'kidsfest.time' })}
          </p>
          <p className={styles.maTextVenue}>
            {intl.formatMessage({ id: 'kidsfest.venue' })}
          </p>
          <p className={styles.maTextFree}>
            {intl.formatMessage({ id: 'kidsfest2026.meetAuthors.free' })}
          </p>
        </div>

        {bottomRow.map(renderPhoto)}
      </div>

      <p className={styles.maDescription}>
        {intl.formatMessage({ id: 'kidsfest2026.mainEvent.description' })}
      </p>
    </section>
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

      <div className={styles.bandWhite}>
        <Container>
          <KidsFestMeetAuthors />
        </Container>
      </div>

      <div className={styles.bandTan}>
        <Container>
          <KidsFestSpecialGuest />
        </Container>
      </div>

      <div className={styles.bandWhite}>
        <Container>
          <KidsFestWorkshops events={events} isLoading={isLoading} />
        </Container>
      </div>

      <div className={styles.bandTan}>
        <Container>
          <KidsFestInterviews />
        </Container>
      </div>

      <div className={styles.bandWhite}>
        <Container>
          <KidsFestReadBooks />
        </Container>
      </div>
    </main>
  );
}
