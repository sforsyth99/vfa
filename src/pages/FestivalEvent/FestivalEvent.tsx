import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { useGetFestivalEvent } from '../../api/festivalEvents/useGetFestivalEvent.ts';
import { useGetPersonBooks } from '../../api/people/useGetPersonBooks.ts';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities.ts';
import { sanitizeHtml } from '../../utils/sanitizeHtml';
import { isSafeUrl } from '../../utils/isSafeUrl.ts';
import { htmlToText } from '../../utils/htmlToText.ts';
import { sortBySurname } from '../../utils/sortBySurname.ts';
import type { PersonData } from '../../api/people/peopleTypes.ts';
import { AuthorFeatureCard } from '../../components/AuthorFeatureCard/AuthorFeatureCard.tsx';
import { VenueMapRow } from '../../components/VenueMapRow/VenueMapRow.tsx';
import { usePageTitle } from '../../utils/usePageTitle.ts';
import { EventbriteLink } from '../../components/EventbriteLink/EventbriteLink';
import { Container } from '../../components/Container/Container';
import { Eyebrow } from '../../components/Eyebrow/Eyebrow';
import { PageTitle } from '../../components/PageTitle/PageTitle';
import { PageLoader } from '../../components/PageLoader/PageLoader';
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
      to={person.slug ? `/people/${person.slug}` : undefined}
      contain={isKidfest}
      className={styles.authorCard}
    />
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

function LabelledCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.labelledCard}>
      <p className={styles.cardRoleLabel}>{label}</p>
      {children}
    </div>
  );
}

function formatEventPrice(tickets: { type: string; tier: string; price: string }[], freeLabel: string): string {
  const all = tickets ?? [];
  const inPerson = all.filter((t) => t.type === 'in_person');
  const relevant = inPerson.length > 0 ? inPerson : all.filter((t) => t.type === 'online');
  if (relevant.length === 0) return freeLabel;
  const isSliding = relevant.some((t) => /sliding/i.test(t.tier));
  const nums = relevant.flatMap((t) => (t.price.match(/\d+(\.\d+)?/g) ?? []).map(Number));
  if (nums.length === 0 || nums.every((n) => n === 0)) return isSliding ? 'Sliding Scale' : freeLabel;
  const nonZero = nums.filter((n) => n > 0);
  const min = nums.includes(0) ? 0 : Math.min(...nonZero);
  const max = Math.max(...nonZero);
  const range = min === max ? `$${min}` : `$${min}–$${max}`;
  return isSliding ? `Sliding Scale · ${range}` : range;
}

const EVENT_TYPE_KEYS: Record<string, string> = {
  conversation: 'festivalEvent.type.conversation',
  panel: 'festivalEvent.type.panel',
  walk: 'festivalEvent.type.walk',
  workshop: 'festivalEvent.type.workshop',
  author_fair: 'festivalEvent.type.authorFair',
};

export default function FestivalEventPage() {
  const intl = useIntl();
  const { slug } = useParams<{ slug: string }>();
  const { data: event, isLoading, error } = useGetFestivalEvent({ slug: slug! });
  usePageTitle(event ? decodeHtmlEntities(event.title?.rendered ?? '') : null);

  if (isLoading) return <PageLoader />;
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

  const hasInPerson = tickets.some((t) => t.type === 'in_person');
  const hasOnline = tickets.some((t) => t.type === 'online') || !!online_url;
  const locationMode = hasInPerson && hasOnline
    ? intl.formatMessage({ id: 'festivalEvent.format.hybrid' })
    : hasOnline
      ? intl.formatMessage({ id: 'festivalEvent.format.online' })
      : hasInPerson
        ? intl.formatMessage({ id: 'festivalEvent.format.inPerson' })
        : null;
  const locationBadgeClass = hasInPerson && hasOnline
    ? styles.locationBadgeHybrid
    : hasOnline
      ? styles.locationBadgeOnline
      : styles.locationBadgeInPerson;

  const price = formatEventPrice(tickets, intl.formatMessage({ id: 'events.free' }));

  return (
    <main id="main-content" className={styles.page}>
      <Container narrow>
      {event_image && (
        <img
          src={event_image[0]}
          alt={decodeHtmlEntities(event.title?.rendered ?? '')}
          className={styles.eventImage}
        />
      )}
      <Eyebrow>{eyebrowLabel}</Eyebrow>
      <PageTitle>{decodeHtmlEntities(event.title?.rendered ?? '')}</PageTitle>
      {event_date && (
        <p className={styles.datetime}>
          {event_date}
          {timeRange ? ` · ${timeRange}` : ''}
          {price && <> · <span className={styles.headerPrice}>{price}</span></>}
        </p>
      )}
      {locationMode && (
        <p className={`${styles.locationBadge} ${locationBadgeClass}`}>{locationMode}</p>
      )}
      {age_range && <p className={styles.ageRange}>{age_range}</p>}
      {eventbrite_url && (
        <EventbriteLink href={eventbrite_url} eventTitle={decodeHtmlEntities(event.title?.rendered ?? '')} className={styles.eventbriteLink}>
          <FormattedMessage id="festivalEvent.buyTickets" />
        </EventbriteLink>
      )}
      {extra_info && <p className={styles.extraInfo}>{extra_info}</p>}
      {(authors.length > 0 ||
        moderator.length > 0 ||
        curator.length > 0 ||
        musician.length > 0 ||
        hosts.length > 0 ||
        hosted_by) && (
        <div className={styles.section}>
          <div className={styles.peopleFlow}>
            {sortBySurname(authors).map((a) => (
              <LabelledCard key={a.id} label={intl.formatMessage({ id: 'festivalEvent.people.author' })}>
                <AuthorCard person={a} />
              </LabelledCard>
            ))}
            {sortBySurname(moderator).map((p) => (
              <LabelledCard key={p.id} label={intl.formatMessage({ id: 'festivalEvent.people.moderator' })}>
                <StaffCard person={p} />
              </LabelledCard>
            ))}
            {sortBySurname(curator).map((p) => (
              <LabelledCard key={p.id} label={intl.formatMessage({ id: 'festivalEvent.people.curator' })}>
                <StaffCard person={p} />
              </LabelledCard>
            ))}
            {sortBySurname(musician).map((p) => (
              <LabelledCard key={p.id} label={intl.formatMessage({ id: 'festivalEvent.people.musician' })}>
                <StaffCard person={p} />
              </LabelledCard>
            ))}
            {hosts.map((p) => (
              <LabelledCard key={p.id} label={intl.formatMessage({ id: 'festivalEvent.people.hostedBy' })}>
                <StaffCard person={p} />
              </LabelledCard>
            ))}
          </div>
          {hosted_by && <p className={styles.hostedByText}>{hosted_by}</p>}
        </div>
      )}

      {description && <div className={styles.description} dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }} />}

      {(venue || online_url) && (
        <div className={styles.section}>
          <h2 className={styles.sectionLabel}>{intl.formatMessage({ id: 'festivalEvent.section.venue' })}</h2>
          {venue && (
            <VenueMapRow venue={venue}>
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
              {venue.accessibility && (
                <div className={styles.venueAccessibility}>
                  <p className={styles.venueAccessibilityLabel}>
                    {intl.formatMessage({ id: 'festivalEvent.accessibilityLabel' })}
                  </p>
                  <p className={styles.venueAccessibilityExcerpt}>
                    {htmlToText(venue.accessibility)}
                  </p>
                  <Link
                    to={`/venues/${venue.slug}`}
                    className={styles.venueAccessibilityMore}
                    aria-label={intl.formatMessage({ id: 'festivalEvent.accessibilityReadMoreLabel' }, { venue: venue.name })}
                  >
                    {intl.formatMessage({ id: 'festivalEvent.accessibilityReadMore' })}
                  </Link>
                </div>
              )}
            </VenueMapRow>
          )}
          {online_url && isSafeUrl(online_url) && (
            <a href={online_url} className={styles.onlineLink}>
              <FormattedMessage id="festivalEvent.joinOnline" />
            </a>
          )}
        </div>
      )}
      </Container>
    </main>
  );
}
