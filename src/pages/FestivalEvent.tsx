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
    event_date, time_start, time_end, timezone,
    event_image, eventbrite_image, description,
    venue, online_url, eventbrite_url,
    ticket_tier, ticket_price,
    online_ticket_tier, online_ticket_price,
    authors, moderator, curator, musician,
  } = event.event_data;

  const TIMEZONE_LABELS: Record<string, string> = {
    'America/Vancouver': 'PT',
    'America/Edmonton':  'MT',
    'America/Winnipeg':  'CT',
    'America/Toronto':   'ET',
    'America/Halifax':   'AT',
    'America/St_Johns':  'NT',
  };

  const timeRange = time_start
    ? `${time_start}${time_end ? ` – ${time_end}` : ''}${timezone ? ` ${TIMEZONE_LABELS[timezone] ?? timezone}` : ''}`
    : null;

  return (
    <main className={styles.page}>
      {event_image && (
        <img src={event_image[0]} alt={decodeHtmlEntities(event.title?.rendered ?? '')} className={styles.eventImage} />
      )}
      <p className={styles.eyebrow}>Event</p>
      <h1 className={styles.title}>{decodeHtmlEntities(event.title?.rendered ?? '')}</h1>
      {event_date && <p className={styles.datetime}>{event_date}{timeRange ? ` · ${timeRange}` : ''}</p>}
      {description && <p className={styles.description}>{description}</p>}

      {(venue || online_url) && (
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Venue</p>
          {venue && (
            <>
              <Link to={`/venues/${venue.slug}`} className={styles.venueName}>{venue.name}</Link>
              {venue.alternate_name && <p className={styles.venueIndigenous}>{venue.alternate_name}</p>}
              {[venue.building, venue.room].filter(Boolean).join(', ') && (
                <p className={styles.venueBuilding}>
                  {[venue.building, venue.room].filter(Boolean).join(', ')}
                </p>
              )}
              {[venue.street_address, venue.city, venue.province, venue.postal_code, venue.country].filter(Boolean).join(', ') && (
                <p className={styles.venueAddress}>
                  {[venue.street_address, venue.city, venue.province, venue.postal_code, venue.country].filter(Boolean).join(', ')}
                </p>
              )}
            </>
          )}
          {online_url && (
            <a href={online_url} className={styles.onlineLink}>Join online →</a>
          )}
        </div>
      )}

      {(authors.length > 0 || moderator.length > 0 || curator.length > 0 || musician.length > 0) && (
        <div className={styles.section}>
          <p className={styles.sectionLabel}>People</p>
          {authors.length > 0 && (
            <ul className={styles.authorList}>
              {authors.map(a => (
                <li key={a.id}><PersonLink person={a} /></li>
              ))}
            </ul>
          )}
          {moderator.length > 0 && (
            <div className={styles.roleRow}>
              <span className={styles.roleLabel}>Moderator</span>
              <span>{moderator.map((p, i) => (
                <span key={p.id}><PersonLink person={p} />{i < moderator.length - 1 ? ', ' : ''}</span>
              ))}</span>
            </div>
          )}
          {curator.length > 0 && (
            <div className={styles.roleRow}>
              <span className={styles.roleLabel}>Curator</span>
              <span>{curator.map((p, i) => (
                <span key={p.id}><PersonLink person={p} />{i < curator.length - 1 ? ', ' : ''}</span>
              ))}</span>
            </div>
          )}
          {musician.length > 0 && (
            <div className={styles.roleRow}>
              <span className={styles.roleLabel}>Musician</span>
              <span>{musician.map((p, i) => (
                <span key={p.id}><PersonLink person={p} />{i < musician.length - 1 ? ', ' : ''}</span>
              ))}</span>
            </div>
          )}
        </div>
      )}

      {(ticket_tier.length > 0 || online_ticket_tier.length > 0 || eventbrite_url) && (
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Tickets</p>
          {ticket_tier.length > 0 && (
            <>
              {online_ticket_tier.length > 0 && <p className={styles.ticketCategory}>In-Person</p>}
              <ul className={styles.ticketList}>
                {ticket_tier.map((tier, i) => (
                  <li key={i} className={styles.ticketRow}>
                    <span className={styles.ticketTier}>{tier}</span>
                    <span className={styles.ticketPrice}>{ticket_price[i]}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {online_ticket_tier.length > 0 && (
            <>
              {ticket_tier.length > 0 && <p className={styles.ticketCategory}>Online</p>}
              <ul className={styles.ticketList}>
                {online_ticket_tier.map((tier, i) => (
                  <li key={i} className={styles.ticketRow}>
                    <span className={styles.ticketTier}>{tier}</span>
                    <span className={styles.ticketPrice}>{online_ticket_price[i]}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {eventbrite_image && (
            <img src={eventbrite_image[0]} alt="Eventbrite waiting room" className={styles.eventbriteImage} />
          )}
          {eventbrite_url && (
            <a href={eventbrite_url} className={styles.eventbriteLink} target="_blank" rel="noopener noreferrer">
              Buy tickets on Eventbrite →
            </a>
          )}
        </div>
      )}
    </main>
  );
}
