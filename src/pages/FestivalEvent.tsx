import { Link, useParams } from 'react-router-dom';
import { useGetFestivalEvent } from '../api/festivalEvents/useGetFestivalEvent.ts';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities.ts';
import type { PersonData } from '../api/people/peopleTypes.ts';
import VenueMap from '../components/VenueMap.tsx';
import styles from './FestivalEvent.module.css';

function PersonLink({ person }: { person: PersonData }) {
  if (!person.slug) return <span>{person.name}</span>;
  return (
    <Link to={`/people/${person.slug}`} className={styles.personLink}>
      {person.name}
    </Link>
  );
}

export default function FestivalEventPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: event, isLoading, error } = useGetFestivalEvent({ slug: slug! });

  if (isLoading) return <div>Loading...</div>;
  if (error || !event) return <div>Event not found</div>;

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

  return (
    <main className={styles.page}>
      {event_image && (
        <img
          src={event_image[0]}
          alt={decodeHtmlEntities(event.title?.rendered ?? '')}
          className={styles.eventImage}
        />
      )}
      <p className={styles.eyebrow}>
        {(() => {
          const typeLabels: Record<string, string> = { conversation: 'Conversation', walk: 'Walk', workshop: 'Workshop', author_fair: 'Author Fair' };
          const label = (event_type && typeLabels[event_type]) ?? 'Event';
          return is_kidfest ? `KidsFest ${label}` : label;
        })()}
      </p>
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
          <p className={styles.sectionLabel}>Venue</p>
          {venue && (
            <>
              <Link to={`/venues/${venue.slug}`} className={styles.venueName}>
                {venue.name}
              </Link>
              {venue.alternate_name && (
                <p className={styles.venueIndigenous}>{venue.alternate_name}</p>
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
                  {[
                    venue.street_address,
                    venue.city,
                    venue.province,
                    venue.postal_code,
                    venue.country,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              )}
            </>
          )}
          {venue?.street_address && <VenueMap venue={venue} />}
          {online_url && (
            <a href={online_url} className={styles.onlineLink}>
              Join online →
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
          <p className={styles.sectionLabel}>People</p>
          {authors.length > 0 && (
            <ul className={styles.authorList}>
              {authors.map((a) => (
                <li key={a.id}>
                  <PersonLink person={a} />
                </li>
              ))}
            </ul>
          )}
          {moderator.length > 0 && (
            <div className={styles.roleRow}>
              <span className={styles.roleLabel}>Moderator</span>
              <span>
                {moderator.map((p, i) => (
                  <span key={p.id}>
                    <PersonLink person={p} />
                    {i < moderator.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </span>
            </div>
          )}
          {curator.length > 0 && (
            <div className={styles.roleRow}>
              <span className={styles.roleLabel}>Curator</span>
              <span>
                {curator.map((p, i) => (
                  <span key={p.id}>
                    <PersonLink person={p} />
                    {i < curator.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </span>
            </div>
          )}
          {musician.length > 0 && (
            <div className={styles.roleRow}>
              <span className={styles.roleLabel}>Musician</span>
              <span>
                {musician.map((p, i) => (
                  <span key={p.id}>
                    <PersonLink person={p} />
                    {i < musician.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </span>
            </div>
          )}
          {(hosts.length > 0 || hosted_by) && (
            <div className={styles.roleRow}>
              <span className={styles.roleLabel}>Hosted by</span>
              <span>
                {hosts.map((p, i) => (
                  <span key={p.id}>
                    <PersonLink person={p} />
                    {(i < hosts.length - 1 || hosted_by) ? ', ' : ''}
                  </span>
                ))}
                {hosted_by}
              </span>
            </div>
          )}
        </div>
      )}

      {(tickets.length > 0 || eventbrite_url) && (
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Tickets</p>
          {(['in_person', 'online'] as const).map((type) => {
            const group = tickets.filter((t) => t.type === type);
            if (group.length === 0) return null;
            const hasOtherType = tickets.some((t) => t.type !== type);
            return (
              <div key={type}>
                {hasOtherType && (
                  <p className={styles.ticketCategory}>
                    {type === 'in_person' ? 'In-Person' : 'Online'}
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
              alt="Eventbrite waiting room"
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
              Buy tickets on Eventbrite →
            </a>
          )}
        </div>
      )}
    </main>
  );
}
