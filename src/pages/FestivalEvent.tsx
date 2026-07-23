import { Link, useParams } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { useGetFestivalEvent } from '../api/festivalEvents/useGetFestivalEvent.ts';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities.ts';
import type { PersonData } from '../api/people/peopleTypes.ts';
import { useGetPersonBooks } from '../api/people/useGetPersonBooks.ts';
import { AuthorFeatureCard } from '../components/AuthorFeatureCard.tsx';
import VenueMap from '../components/VenueMap.tsx';
import { usePageTitle } from '../utils/usePageTitle.ts';
import styles from './FestivalEvent.module.css';

function AuthorCard({ person }: { person: PersonData }) {
  const isKidfest = person.kidfest_years?.length > 0;
  const photo = isKidfest ? (person.kidfest_photo || person.photo) : person.photo;
  const { data: books = [] } = useGetPersonBooks(person.id);
  const firstCover = books.find((b) => b.cover_image)?.cover_image;

  return (
    <AuthorFeatureCard
      photoSrc={photo ? photo[0] : null}
      photoAlt={person.name}
      bookCoverSrc={firstCover ? firstCover[0] : null}
      title={person.name}
      subtitleLines={books.map((b) => b.title)}
      to={person.slug ? `/people/${person.slug}` : undefined}
      contain={isKidfest}
      className={styles.authorCard}
    />
  );
}

function AuthorCardGroup({ authors, label }: { authors: PersonData[]; label: string }) {
  if (!authors.length) return null;
  return (
    <div className={styles.personGroup}>
      <p className={styles.personGroupLabel}>{label}</p>
      <div className={styles.authorCardGrid}>
        {authors.map((a) => <AuthorCard key={a.id} person={a} />)}
      </div>
    </div>
  );
}

function StaffCard({ person }: { person: PersonData }) {
  return (
    <AuthorFeatureCard
      photoSrc={person.photo ? person.photo[0] : null}
      photoAlt={person.name}
      bookCoverSrc={null}
      title={person.name}
      to={person.slug ? `/people/${person.slug}` : undefined}
      className={styles.authorCard}
    />
  );
}

function StaffCardGroup({ people, label }: { people: PersonData[]; label: string }) {
  if (!people.length) return null;
  return (
    <div className={styles.personGroup}>
      <p className={styles.personGroupLabel}>{label}</p>
      <div className={styles.authorCardGrid}>
        {people.map((p) => <StaffCard key={p.id} person={p} />)}
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

      {(authors.length > 0 ||
        moderator.length > 0 ||
        curator.length > 0 ||
        musician.length > 0 ||
        hosts.length > 0 ||
        hosted_by) && (
        <div className={styles.section}>
          <AuthorCardGroup authors={authors} label={intl.formatMessage({ id: 'festivalEvent.people.authors' })} />
          <StaffCardGroup people={moderator} label={intl.formatMessage({ id: 'festivalEvent.people.moderator' })} />
          <StaffCardGroup people={curator} label={intl.formatMessage({ id: 'festivalEvent.people.curator' })} />
          <StaffCardGroup people={musician} label={intl.formatMessage({ id: 'festivalEvent.people.musician' })} />
          {(hosts.length > 0 || hosted_by) && (
            <div className={styles.personGroup}>
              <p className={styles.personGroupLabel}>{intl.formatMessage({ id: 'festivalEvent.people.hostedBy' })}</p>
              {hosts.length > 0 && (
                <div className={styles.authorCardGrid}>
                  {hosts.map(p => <StaffCard key={p.id} person={p} />)}
                </div>
              )}
              {hosted_by && <p className={styles.hostedByText}>{hosted_by}</p>}
            </div>
          )}
        </div>
      )}

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

    </main>
  );
}
