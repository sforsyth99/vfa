import { useIntl, FormattedMessage } from 'react-intl';
import styles from './Home.module.css';
import { usePageTitle } from '../utils/usePageTitle';
import { useGetInterviews } from '../api/interviews/useGetInterviews';
import { useGetAuthors } from '../api/people/useGetAuthors';
import { useGetKidfestAuthors } from '../api/people/useGetKidfestAuthors';
import { useGetFestivalEvents } from '../api/festivalEvents/useGetFestivalEvents';
import type { FestivalEvent } from '../api/festivalEvents/festivalEventTypes';
import type { PersonData } from '../api/people/peopleTypes';
import { useGetBooks } from '../api/books/useGetBooks';
import type { Book } from '../api/books/bookTypes';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities';
import { Link } from 'react-router-dom';

function InterviewsList() {
  const intl = useIntl();
  const { data: interviews, isLoading, isError } = useGetInterviews();

  if (isLoading) return <div>{intl.formatMessage({ id: 'home.interviews.loading' })}</div>;
  if (isError) return <div>{intl.formatMessage({ id: 'home.interviews.error' })}</div>;
  if (!interviews?.length) return null;

  const preview = interviews.slice(0, 4);

  return (
    <div className={styles.section}>
      <h2><FormattedMessage id="home.interviews.heading" /></h2>
      <ul className={styles.interviewList}>
        {preview.map((interview) => {
          const data = interview.interview_data;
          const cover = data?.book_cover;
          const authors = data?.authors ?? [];
          const primaryAuthor = authors[0];
          const authorLabel = authors.length > 0
            ? authors.map(a => a.name).join(' & ')
            : decodeHtmlEntities(interview.title?.rendered ?? '');
          const initials = authorLabel.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
          const rawText = (data?.intro || data?.question?.[0] || '').replace(/<[^>]+>/g, '').trim();
          const snippet = rawText.slice(0, 55);
          const isMissing = !snippet;

          return (
            <li key={interview.id}>
              <Link to={`/interviews/${interview.slug}`} className={styles.interviewItem}>
                <div className={styles.interviewAuthorPhoto}>
                  {primaryAuthor?.photo
                    ? <img src={primaryAuthor.photo[0]} alt={authorLabel} />
                    : <div className={styles.interviewAuthorPlaceholder} aria-hidden="true">{initials}</div>
                  }
                </div>
                {cover
                  ? <img src={cover[0]} alt="" className={styles.interviewCover} />
                  : <div className={styles.interviewCoverPlaceholder} />
                }
                <div className={styles.interviewItemText}>
                  <span className={styles.interviewItemName}>{authorLabel}</span>
                  <span className={isMissing ? styles.interviewItemMissing : styles.interviewItemSnippet}>
                    {isMissing ? 'No content yet.' : <>{snippet}{rawText.length > 55 ? '…' : ''}</>}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      {interviews.length > 4 && (
        <Link to="/interviews" className={styles.seeAll}>
          <FormattedMessage id="home.interviews.seeAll" />
        </Link>
      )}
    </div>
  );
}

function bySurname(a: { name: string }, b: { name: string }): number {
  const surname = (name: string) => {
    const parts = name.trim().split(/\s+/);
    return parts[parts.length - 1].toLowerCase();
  };
  return surname(a.name).localeCompare(surname(b.name));
}

function nameInitials(name: string): string {
  return name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function AuthorPhotoGrid({
  headingId,
  authors,
  kids = false,
}: {
  headingId: string;
  authors: { id: number; slug?: string; name: string; photo: [string, number, number, boolean] | false | null }[];
  kids?: boolean;
}) {
  const sorted = [...authors].sort(bySurname);
  return (
    <div className={styles.section}>
      <h2><FormattedMessage id={headingId} /></h2>
      <div className={styles.authorGrid}>
        {sorted.map((author) => (
          <Link key={author.id} to={`/people/${author.slug}`} className={kids ? styles.kidsAuthorPhoto : styles.authorPhoto}>
            {author.photo
              ? <img src={author.photo[0]} alt={author.name} />
              : <div className={kids ? styles.kidsAuthorPhotoPlaceholder : styles.authorPhotoPlaceholder} aria-hidden="true">
                  {nameInitials(author.name)}
                </div>
            }
            <span className={styles.authorName}>{author.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function AuthorsList() {
  const intl = useIntl();
  const { data: authors, isLoading, isError } = useGetAuthors(2026);

  if (isLoading) return <div>{intl.formatMessage({ id: 'home.authors.loading' })}</div>;
  if (isError) return <div>{intl.formatMessage({ id: 'home.authors.error' })}</div>;
  if (!authors?.length) return null;

  return <AuthorPhotoGrid headingId="home.authors.heading" authors={authors} />;
}

function KidsAuthorsList() {
  const intl = useIntl();
  const { data: authors, isLoading, isError } = useGetKidfestAuthors(2026);

  if (isLoading) return <div>{intl.formatMessage({ id: 'home.kidsAuthors.loading' })}</div>;
  if (isError) return <div>{intl.formatMessage({ id: 'home.kidsAuthors.error' })}</div>;
  if (!authors?.length) return null;

  return <AuthorPhotoGrid headingId="home.kidsAuthors.heading" authors={authors} kids />;
}

function formatTime(t: string): string {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${period}`;
}

function ScheduleTable({ events, showHost = false }: { events: FestivalEvent[]; showHost?: boolean }) {
  const intl = useIntl();
  return (
    <table className={styles.scheduleTable}>
      <thead>
        <tr>
          <th>{intl.formatMessage({ id: 'home.schedule.date' })}</th>
          <th>{intl.formatMessage({ id: 'home.schedule.time' })}</th>
          <th>{intl.formatMessage({ id: 'home.schedule.event' })}</th>
          <th>{intl.formatMessage({ id: 'home.schedule.location' })}</th>
          {showHost && <th>{intl.formatMessage({ id: 'home.schedule.hostedBy' })}</th>}
        </tr>
      </thead>
      <tbody>
        {events.map((event) => {
          const { event_date, time_start, time_end, venue, tickets, hosts, hosted_by } = event.event_data;
          const timeStr = time_start
            ? `${formatTime(time_start)}${time_end ? ` – ${formatTime(time_end)}` : ''}`
            : '';
          const hasOnline = tickets.some((t) => t.type === 'online');
          const location = venue?.name
            ? hasOnline
              ? intl.formatMessage({ id: 'home.schedule.locationAndOnline' }, { venue: venue.name })
              : venue.name
            : hasOnline
              ? intl.formatMessage({ id: 'home.schedule.locationOnline' })
              : '—';
          const hostParts: React.ReactNode[] = [
            ...(hosts ?? []).map((h) =>
              h.slug
                ? <Link key={h.id} to={`/people/${h.slug}`}>{h.name}</Link>
                : <span key={h.id}>{h.name}</span>
            ),
            ...(hosted_by ? [<span key="text">{hosted_by}</span>] : []),
          ];
          return (
            <tr key={event.id}>
              <td className={styles.scheduleDate}>
                {event_date
                  ? new Date(event_date + 'T00:00:00').toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })
                  : '—'}
              </td>
              <td className={styles.scheduleTime}>{timeStr || '—'}</td>
              <td className={styles.scheduleName}>
                <Link to={`/festival-events/${event.slug}`}>
                  {decodeHtmlEntities(event.title?.rendered ?? '')}
                </Link>
              </td>
              <td className={styles.scheduleLocation}>{location}</td>
              {showHost && (
                <td className={styles.scheduleLocation}>
                  {hostParts.length > 0
                    ? hostParts.reduce<React.ReactNode[]>((acc, el, i) => i === 0 ? [el] : [...acc, ', ', el], [])
                    : '—'}
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function EventSchedule() {
  const intl = useIntl();
  const { data: events, isLoading, isError } = useGetFestivalEvents();

  if (isLoading) return <div>{intl.formatMessage({ id: 'home.events.loading' })}</div>;
  if (isError) return <div>{intl.formatMessage({ id: 'home.events.error' })}</div>;
  if (!events?.length) return null;

  const today = new Date().toISOString().slice(0, 10);

  const upcoming = events
    .filter((e) => e.event_data.event_date >= today)
    .sort((a, b) => {
      const dateCmp = a.event_data.event_date.localeCompare(b.event_data.event_date);
      if (dateCmp !== 0) return dateCmp;
      return a.event_data.time_start.localeCompare(b.event_data.time_start);
    });

  const past = events
    .filter((e) => e.event_data.event_date < today)
    .sort((a, b) => b.event_data.event_date.localeCompare(a.event_data.event_date));

  const regular = upcoming.filter((e) => !e.event_data.is_kidfest);
  const kidfest = upcoming.filter((e) => e.event_data.is_kidfest);
  const workshops = upcoming.filter((e) => e.event_data.event_type === 'workshop' && !e.event_data.is_kidfest);
  const online = upcoming.filter((e) => e.event_data.tickets.some((t) => t.type === 'online'));

  if (!upcoming.length && !past.length) return null;

  return (
    <>
      {regular.length > 0 && (
        <div className={styles.scheduleSection}>
          <h2 className={styles.scheduleHeading}><FormattedMessage id="home.schedule.upcoming" /></h2>
          <ScheduleTable events={regular} />
        </div>
      )}
      {kidfest.length > 0 && (
        <div className={styles.scheduleSection}>
          <h2 className={styles.scheduleHeading}><FormattedMessage id="home.schedule.kidfest" /></h2>
          <ScheduleTable events={kidfest} />
        </div>
      )}
      {workshops.length > 0 && (
        <div className={styles.scheduleSection}>
          <h2 className={styles.scheduleHeading}><FormattedMessage id="home.schedule.workshops" /></h2>
          <ScheduleTable events={workshops} showHost />
        </div>
      )}
      {online.length > 0 && (
        <div className={styles.scheduleSection}>
          <h2 className={styles.scheduleHeading}><FormattedMessage id="home.schedule.onlineEvents" /></h2>
          <p className={styles.scheduleIntro}><FormattedMessage id="home.schedule.onlineIntro" /></p>
          <table className={styles.scheduleTable}>
            <thead>
              <tr>
                <th>{intl.formatMessage({ id: 'home.schedule.date' })}</th>
                <th>{intl.formatMessage({ id: 'home.schedule.time' })}</th>
                <th>{intl.formatMessage({ id: 'home.schedule.event' })}</th>
              </tr>
            </thead>
            <tbody>
              {online.map((event) => {
                const { event_date, time_start, time_end } = event.event_data;
                const timeStr = time_start
                  ? `${formatTime(time_start)}${time_end ? ` – ${formatTime(time_end)}` : ''}`
                  : '';
                return (
                  <tr key={event.id}>
                    <td className={styles.scheduleDate}>
                      {event_date
                        ? new Date(event_date + 'T00:00:00').toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })
                        : '—'}
                    </td>
                    <td className={styles.scheduleTime}>{timeStr || '—'}</td>
                    <td className={styles.scheduleName}>
                      <Link to={`/festival-events/${event.slug}`}>
                        {decodeHtmlEntities(event.title?.rendered ?? '')}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {past.length > 0 && (
        <div className={styles.scheduleSection}>
          <h2 className={styles.scheduleHeading}><FormattedMessage id="home.schedule.past" /></h2>
          <ScheduleTable events={past} />
        </div>
      )}
    </>
  );
}

function BookCoverGrid({ books }: { books: Book[] }) {
  return (
    <div className={styles.bookGrid}>
      {books.map((book) => {
        const cover = book.book_data?.cover_image;
        const title = decodeHtmlEntities(book.title?.rendered ?? '');
        return (
          <Link key={book.id} to={`/books/${book.slug}`} className={styles.bookCover}>
            {cover
              ? <img src={cover[0]} alt={title} />
              : <div className={styles.bookCoverPlaceholder} aria-hidden="true" />
            }
            <p className={styles.bookCoverTitle}>{title}</p>
          </Link>
        );
      })}
    </div>
  );
}

function RegularBooksList() {
  const intl = useIntl();
  const { data: books, isLoading, isError } = useGetBooks();

  if (isLoading) return <div>{intl.formatMessage({ id: 'home.books.loading' })}</div>;
  if (isError) return null;

  const filtered = (books ?? []).filter((b) => !b.book_data?.categories?.includes('children'));
  if (!filtered.length) return null;

  return (
    <div className={styles.section}>
      <h2><FormattedMessage id="home.books.heading" /></h2>
      <BookCoverGrid books={filtered} />
    </div>
  );
}

function KidsBooksList() {
  const { data: books, isLoading, isError } = useGetBooks();

  if (isLoading || isError) return null;

  const filtered = (books ?? []).filter((b) => b.book_data?.categories?.includes('children'));
  if (!filtered.length) return null;

  return (
    <div className={styles.section}>
      <h2><FormattedMessage id="home.kidsBooks.heading" /></h2>
      <BookCoverGrid books={filtered} />
    </div>
  );
}

function HostsAndModerators() {
  const intl = useIntl();
  const { data: events, isLoading } = useGetFestivalEvents();

  if (isLoading) {
    return <div>{intl.formatMessage({ id: 'home.hostsAndModerators.loading' })}</div>;
  }

  const seen = new Set<number>();
  const people: { id: number; slug?: string; name: string; photo: [string, number, number, boolean] | false | null }[] = [];

  for (const event of (events ?? [])) {
    for (const person of [...event.event_data.hosts, ...event.event_data.moderator]) {
      if (!seen.has(person.id)) { seen.add(person.id); people.push(person); }
    }
  }

  if (!people.length) return null;

  return <AuthorPhotoGrid headingId="home.hostsAndModerators.heading" authors={people} />;
}

type SupportRole = 'moderator' | 'curator' | 'musician' | 'host';

interface SupportingPerson {
  id: number;
  slug?: string;
  name: string;
  bio: string;
  roles: SupportRole[];
}

function SupportingPersonBioSnippets() {
  const intl = useIntl();
  const { data: events, isLoading, isError } = useGetFestivalEvents();

  if (isLoading) return <div>{intl.formatMessage({ id: 'home.supportingBios.loading' })}</div>;
  if (isError) return <div>{intl.formatMessage({ id: 'home.supportingBios.error' })}</div>;

  const seen = new Map<number, SupportingPerson>();

  const addPerson = (person: PersonData, role: SupportRole) => {
    const existing = seen.get(person.id);
    if (existing) {
      if (!existing.roles.includes(role)) existing.roles.push(role);
    } else {
      seen.set(person.id, { id: person.id, slug: person.slug, name: person.name, bio: person.bio, roles: [role] });
    }
  };

  for (const event of (events ?? [])) {
    event.event_data.moderator.forEach((p) => addPerson(p, 'moderator'));
    event.event_data.curator.forEach((p) => addPerson(p, 'curator'));
    event.event_data.musician.forEach((p) => addPerson(p, 'musician'));
    event.event_data.hosts.forEach((p) => addPerson(p, 'host'));
  }

  const people = [...seen.values()].sort(bySurname);
  if (!people.length) return null;

  const roleLabel: Record<SupportRole, string> = {
    moderator: intl.formatMessage({ id: 'home.supportingBios.role.moderator' }),
    curator:   intl.formatMessage({ id: 'home.supportingBios.role.curator' }),
    musician:  intl.formatMessage({ id: 'home.supportingBios.role.musician' }),
    host:      intl.formatMessage({ id: 'home.supportingBios.role.host' }),
  };

  return (
    <div className={styles.section}>
      <h2><FormattedMessage id="home.supportingBios.heading" /></h2>
      <table className={styles.authorBioTable}>
        <tbody>
          {people.map((person) => {
            const plainBio = person.bio ? person.bio.replace(/<[^>]*>/g, '').trim() : '';
            const snippet = plainBio.slice(0, 50);
            return (
              <tr key={person.id}>
                <td className={styles.authorBioName}>
                  {person.slug
                    ? <Link to={`/people/${person.slug}`}>{person.name}</Link>
                    : person.name
                  }
                  <span className={styles.authorBioRoles}>
                    {person.roles.map((r) => roleLabel[r]).join(', ')}
                  </span>
                </td>
                <td className={styles.authorBioSnippet}>
                  {snippet
                    ? <>{snippet}{plainBio.length > 50 ? '…' : ''}</>
                    : <span className={styles.authorBioMissing}><FormattedMessage id="home.supportingBios.noBio" /></span>
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function AuthorBioSnippets() {
  const intl = useIntl();
  const { data: authors, isLoading, isError } = useGetAuthors(2026);

  if (isLoading) return <div>{intl.formatMessage({ id: 'home.authorBios.loading' })}</div>;
  if (isError) return <div>{intl.formatMessage({ id: 'home.authorBios.error' })}</div>;
  if (!authors?.length) return null;

  const sorted = [...authors].sort(bySurname);

  return (
    <div className={styles.section}>
      <h2><FormattedMessage id="home.authorBios.heading" /></h2>
      <table className={styles.authorBioTable}>
        <tbody>
          {sorted.map((author) => {
            const plainBio = author.bio ? author.bio.replace(/<[^>]*>/g, '').trim() : '';
            const snippet = plainBio.slice(0, 50);
            return (
              <tr key={author.id}>
                <td className={styles.authorBioName}>
                  <Link to={`/people/${author.slug}`}>{author.name}</Link>
                </td>
                <td className={styles.authorBioSnippet}>
                  {snippet
                    ? <>{snippet}{plainBio.length > 50 ? '…' : ''}</>
                    : <span className={styles.authorBioMissing}><FormattedMessage id="home.authorBios.noBio" /></span>
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Hero() {
  return (
    <div className={styles.hero}>
      <p className={styles.heroEyebrow}><FormattedMessage id="home.hero.eyebrow" /></p>
      <h1 className={styles.heroTitle}><FormattedMessage id="home.hero.title" /></h1>
      <p className={styles.heroSubtitle}><FormattedMessage id="home.hero.subtitle" /></p>
      <p className={styles.heroKidfest}><FormattedMessage id="home.hero.kidfest" /></p>
    </div>
  );
}

export function HomePage() {
  usePageTitle();
  return (
    <main id="main-content" className={styles.homeMain}>
      <Hero />
      <EventSchedule />
      <InterviewsList />
      <AuthorsList />
      <KidsAuthorsList />
      <HostsAndModerators />
      <AuthorBioSnippets />
      <SupportingPersonBioSnippets />
      <RegularBooksList />
      <KidsBooksList />
    </main>
  );
}

export default HomePage;
