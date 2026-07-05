import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useGetFestivalEvent } from '../api/festivalEvents/useGetFestivalEvent.ts';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities.ts';
import type { PersonData } from '../api/people/peopleTypes.ts';
import styles from './FestivalEvent.module.css';

function PersonLink({ person }: { person: PersonData }) {
  if (person.website_url) {
    return <a href={person.website_url} className={styles.personLink}>{person.name}</a>;
  }
  return <span>{person.name}</span>;
}

export default function FestivalEventPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: event, isLoading, error } = useGetFestivalEvent({ slug: slug! });

  if (isLoading) return <div>Loading...</div>;
  if (error || !event) return <div>Event not found</div>;

  const {
    event_date, time_start, time_end,
    event_image, description,
    venue,
    ticket_tier, ticket_price,
    authors, moderator, curator, musician,
  } = event.event_data;

  const timeRange = time_start
    ? `${time_start}${time_end ? ` – ${time_end}` : ''}`
    : null;

  return (
    <main className={styles.page}>
      {event_image && (
        <img src={event_image[0]} alt={decodeHtmlEntities(event.title.rendered)} className={styles.eventImage} />
      )}
      <p className={styles.eyebrow}>Event</p>
      <h1 className={styles.title}>{decodeHtmlEntities(event.title.rendered)}</h1>
      {event_date && <p className={styles.datetime}>{event_date}{timeRange ? ` · ${timeRange}` : ''}</p>}
      {description && <p className={styles.description}>{description}</p>}

      {venue && (
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Venue</p>
          <Link to={`/venues/${venue.slug}`} className={styles.venueName}>{venue.name}</Link>
          {venue.alternate_name && <p className={styles.venueIndigenous}>{venue.alternate_name}</p>}
          {venue.address && <p className={styles.venueAddress}>{venue.address}</p>}
          {venue.online_url && (
            <a href={venue.online_url} className={styles.onlineLink}>Join online →</a>
          )}
        </div>
      )}

      {(authors.length > 0 || moderator || curator || musician) && (
        <div className={styles.section}>
          <p className={styles.sectionLabel}>People</p>
          {authors.length > 0 && (
            <ul className={styles.authorList}>
              {authors.map(a => (
                <li key={a.id}><PersonLink person={a} /></li>
              ))}
            </ul>
          )}
          {moderator && (
            <div className={styles.roleRow}>
              <span className={styles.roleLabel}>Moderator</span>
              <PersonLink person={moderator} />
            </div>
          )}
          {curator && (
            <div className={styles.roleRow}>
              <span className={styles.roleLabel}>Curator</span>
              <PersonLink person={curator} />
            </div>
          )}
          {musician && (
            <div className={styles.roleRow}>
              <span className={styles.roleLabel}>Musician</span>
              <PersonLink person={musician} />
            </div>
          )}
        </div>
      )}

      {ticket_tier.length > 0 && (
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Tickets</p>
          <ul className={styles.ticketList}>
            {ticket_tier.map((tier, i) => (
              <li key={i} className={styles.ticketRow}>
                <span className={styles.ticketTier}>{tier}</span>
                <span className={styles.ticketPrice}>{ticket_price[i]}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
