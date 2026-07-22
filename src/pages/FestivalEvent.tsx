import { Link, useParams } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { useIntl, FormattedMessage } from 'react-intl';
import { useGetFestivalEvent } from '../api/festivalEvents/useGetFestivalEvent.ts';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities.ts';
import type { PersonData } from '../api/people/peopleTypes.ts';
import type { PersonBook } from '../api/people/useGetPersonBooks.ts';
import wretch from '../api/wretch.ts';
import VenueMap from '../components/VenueMap.tsx';
import { usePageTitle } from '../utils/usePageTitle.ts';
import styles from './FestivalEvent.module.css';

const VFA_API_BASE = 'https://api.victoriafestivalofauthors.ca/wp-json/vfa/v1';

function AuthorBooks({ authors }: { authors: PersonData[] }) {
  const intl = useIntl();
  const results = useQueries({
    queries: authors.map((a) => ({
      queryKey: ['person-books', a.id],
      queryFn: () => wretch(`${VFA_API_BASE}/people/${a.id}/books`).get().json<PersonBook[]>(),
      enabled: authors.length > 0,
      refetchOnWindowFocus: false,
    })),
  });

  const seen = new Set<number>();
  const books = results.flatMap((r) => r.data ?? []).filter((b) => {
    if (seen.has(b.id)) return false;
    seen.add(b.id);
    return true;
  });

  if (!books.length) return null;

  return (
    <div className={styles.section}>
      <p className={styles.sectionLabel}>{intl.formatMessage({ id: 'festivalEvent.section.books' })}</p>
      <div className={styles.bookGrid}>
        {books.map((book) => (
          <Link key={book.id} to={`/books/${book.slug}`} className={styles.bookCard}>
            {book.cover_image
              ? <img src={book.cover_image[0]} alt={book.title} className={styles.bookCover} />
              : <div className={styles.bookCoverPlaceholder} />
            }
            <p className={styles.bookTitle}>{book.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function PersonCard({ person }: { person: PersonData }) {
  const isKidfest = person.kidfest_years?.length > 0;
  const card = (
    <>
      {person.photo
        ? <img
            src={person.photo[0]}
            alt={person.name}
            className={isKidfest ? styles.personPhotoContain : styles.personPhoto}
          />
        : <div className={styles.personPhotoPlaceholder} />
      }
      <span className={styles.personCardName}>{person.name}</span>
    </>
  );
  if (!person.slug) return <div className={styles.personCard}>{card}</div>;
  return <Link to={`/people/${person.slug}`} className={styles.personCard}>{card}</Link>;
}

function PersonGroup({ people, label }: { people: PersonData[]; label: string }) {
  if (!people.length) return null;
  return (
    <div className={styles.personGroup}>
      <p className={styles.personGroupLabel}>{label}</p>
      <div className={styles.personCardGrid}>
        {people.map(p => <PersonCard key={p.id} person={p} />)}
      </div>
    </div>
  );
}

const EVENT_TYPE_KEYS: Record<string, string> = {
  conversation: 'festivalEvent.type.conversation',
  walk: 'festivalEvent.type.walk',
  workshop: 'festivalEvent.type.workshop',
  author_fair: 'festivalEvent.type.authorFair',
};

export default function FestivalEventPage() {
  const intl = useIntl();
  const { slug } = useParams<{ slug: string }>();
  const { data: event, isLoading, error } = useGetFestivalEvent({ slug: slug! });
  usePageTitle(event ? decodeHtmlEntities(event.title?.rendered ?? '') : null);

  if (isLoading) return <div><FormattedMessage id="festivalEvent.loading" /></div>;
  if (error || !event) return <div><FormattedMessage id="festivalEvent.notFound" /></div>;

  const {
    is_kidfest,
    event_type,
    hosts,
    hosted_by,
    age_range,
    extra_info,
    event_date,
    time_start,
    time_end,
    event_image,
    eventbrite_image,
    description,
    venue,
    online_url,
    eventbrite_url,
    tickets,
    authors,
    moderator,
    curator,
    musician,
  } = event.event_data;

  const timeRange = time_start
    ? `${time_start}${time_end ? ` – ${time_end}` : ''} PT`
    : null;

  const typeKey = (event_type && EVENT_TYPE_KEYS[event_type]) ?? 'festivalEvent.type.default';
  const typeLabel = intl.formatMessage({ id: typeKey });
  const eyebrowLabel = is_kidfest
    ? intl.formatMessage({ id: 'festivalEvent.type.kidfest' }, { label: typeLabel })
    : typeLabel;

  return (
    <main id="main-content" className={styles.page}>
      {event_image && (
        <img
          src={event_image[0]}
          alt={decodeHtmlEntities(event.title?.rendered ?? '')}
          className={styles.eventImage}
        />
      )}
      <p className={styles.eyebrow}>{eyebrowLabel}</p>
      <h1 className={styles.title}>{decodeHtmlEntities(event.title?.rendered ?? '')}</h1>
      {event_date && (
        <p className={styles.datetime}>
          {event_date}
          {timeRange ? ` · ${timeRange}` : ''}
        </p>
      )}
      {age_range && <p className={styles.ageRange}>{age_range}</p>}
      {description && <div className={styles.description} dangerouslySetInnerHTML={{ __html: description }} />}
      {extra_info && <p className={styles.extraInfo}>{extra_info}</p>}

      {(venue || online_url) && (
        <div className={styles.section}>
          <p className={styles.sectionLabel}>{intl.formatMessage({ id: 'festivalEvent.section.venue' })}</p>
          {venue && (
            <>
              <Link to={`/venues/${venue.slug}`} className={styles.venueName}>
                {venue.name}
              </Link>
              {venue.name_pronunciation && (
                <p className={styles.venuePronunciation}>{venue.name_pronunciation}</p>
              )}
              {venue.alternate_name && (
                <p className={styles.venueIndigenous}>
                  ({intl.formatMessage({ id: 'festivalEvent.venueFormerly' }, { name: venue.alternate_name })})
                </p>
              )}
              {[venue.building, venue.room].filter(Boolean).join(', ') && (
                <p className={styles.venueBuilding}>
                  {[venue.building, venue.room].filter(Boolean).join(', ')}
                </p>
              )}
              {[venue.street_address, venue.city, venue.province, venue.postal_code, venue.country]
                .filter(Boolean)
                .join(', ') && (
                <p className={styles.venueAddress}>
                  {[venue.street_address, venue.city, venue.province, venue.postal_code, venue.country]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              )}
            </>
          )}
          {venue?.street_address && <VenueMap venue={venue} />}
          {online_url && (
            <a href={online_url} className={styles.onlineLink}>
              <FormattedMessage id="festivalEvent.joinOnline" />
            </a>
          )}
        </div>
      )}

      {(authors.length > 0 ||
        moderator.length > 0 ||
        curator.length > 0 ||
        musician.length > 0 ||
        hosts.length > 0 ||
        hosted_by) && (
        <div className={styles.section}>
          <p className={styles.sectionLabel}>{intl.formatMessage({ id: 'festivalEvent.section.people' })}</p>
          <PersonGroup people={authors} label={intl.formatMessage({ id: 'festivalEvent.people.authors' })} />
          <PersonGroup people={moderator} label={intl.formatMessage({ id: 'festivalEvent.people.moderator' })} />
          <PersonGroup people={curator} label={intl.formatMessage({ id: 'festivalEvent.people.curator' })} />
          <PersonGroup people={musician} label={intl.formatMessage({ id: 'festivalEvent.people.musician' })} />
          {(hosts.length > 0 || hosted_by) && (
            <div className={styles.personGroup}>
              <p className={styles.personGroupLabel}>{intl.formatMessage({ id: 'festivalEvent.people.hostedBy' })}</p>
              {hosts.length > 0 && (
                <div className={styles.personCardGrid}>
                  {hosts.map(p => <PersonCard key={p.id} person={p} />)}
                </div>
              )}
              {hosted_by && <p className={styles.hostedByText}>{hosted_by}</p>}
            </div>
          )}
        </div>
      )}

      {authors.length > 0 && <AuthorBooks authors={authors} />}

      {(tickets.length > 0 || eventbrite_url) && (
        <div className={styles.section}>
          <p className={styles.sectionLabel}>{intl.formatMessage({ id: 'festivalEvent.section.tickets' })}</p>
          {(['in_person', 'online'] as const).map((type) => {
            const group = tickets.filter((t) => t.type === type);
            if (group.length === 0) return null;
            const hasOtherType = tickets.some((t) => t.type !== type);
            return (
              <div key={type}>
                {hasOtherType && (
                  <p className={styles.ticketCategory}>
                    {type === 'in_person'
                      ? intl.formatMessage({ id: 'festivalEvent.tickets.inPerson' })
                      : intl.formatMessage({ id: 'festivalEvent.tickets.online' })}
                  </p>
                )}
                <ul className={styles.ticketList}>
                  {group.map((ticket, i) => (
                    <li key={i} className={styles.ticketRow}>
                      <span className={styles.ticketTier}>{ticket.tier}</span>
                      <span className={styles.ticketPrice}>{ticket.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          {eventbrite_image && (
            <img
              src={eventbrite_image[0]}
              alt={intl.formatMessage({ id: 'festivalEvent.eventbriteImageAlt' })}
              className={styles.eventbriteImage}
            />
          )}
          {eventbrite_url && (
            <a
              href={eventbrite_url}
              className={styles.eventbriteLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FormattedMessage id="festivalEvent.buyTickets" />
            </a>
          )}
        </div>
      )}
    </main>
  );
}
