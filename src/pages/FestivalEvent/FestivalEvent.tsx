import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { useGetFestivalEvent } from '../../api/festivalEvents/useGetFestivalEvent.ts';
import { useGetFestivalEvents } from '../../api/festivalEvents/useGetFestivalEvents.ts';
import { useGetPersonBooks } from '../../api/people/useGetPersonBooks.ts';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities.ts';
import { sanitizeHtml } from '../../utils/sanitizeHtml';
import { isSafeUrl } from '../../utils/isSafeUrl.ts';
import { htmlToText } from '../../utils/htmlToText.ts';
import { eventPath } from '../../utils/eventPath.ts';
import { track } from '../../utils/analytics.ts';
import { sortBySurname } from '../../utils/sortBySurname.ts';
import type { PersonData } from '../../api/people/peopleTypes.ts';
import type { RelatedEventSummary } from '../../api/festivalEvents/festivalEventTypes.ts';
import { AuthorFeatureCard } from '../../components/AuthorFeatureCard/AuthorFeatureCard.tsx';
import { CARD_PALETTE } from '../../components/AuthorFeatureCard/cardPalette.ts';
import { VenueMapRow } from '../../components/VenueMapRow/VenueMapRow.tsx';
import { usePageTitle } from '../../utils/usePageTitle.ts';
import { EventbriteWidget } from '../../components/EventbriteWidget/EventbriteWidget';
import { Container } from '../../components/Container/Container';
import { Eyebrow } from '../../components/Eyebrow/Eyebrow';
import { PageTitle } from '../../components/PageTitle/PageTitle';
import { PageLoader } from '../../components/PageLoader/PageLoader';
import styles from './FestivalEvent.module.css';

function AuthorCard({ person, colorIndex }: { person: PersonData; colorIndex: number }) {
  const isKidfest = person.kidfest_years?.length > 0;
  const photo = isKidfest ? (person.kidfest_photo || person.photo) : person.photo;
  const { data: books = [] } = useGetPersonBooks(person.id);
  const firstCover = books.find((b) => b.cover_image)?.cover_image;
  const palette = CARD_PALETTE[colorIndex % CARD_PALETTE.length];

  return (
    <AuthorFeatureCard
      photoSrc={photo ? photo[0] : null}
      photoAlt={person.name}
      bookCoverSrc={firstCover ? firstCover[0] : null}
      title={person.name}
      to={person.slug ? `/people/${person.slug}` : undefined}
      contain={isKidfest}
      className={styles.authorCard}
      accentColor={palette.accentColor}
      lightAccent={palette.lightAccent}
    />
  );
}

function StaffCard({ person, colorIndex }: { person: PersonData; colorIndex: number }) {
  const palette = CARD_PALETTE[colorIndex % CARD_PALETTE.length];

  return (
    <AuthorFeatureCard
      photoSrc={person.photo ? person.photo[0] : null}
      photoAlt={person.name}
      bookCoverSrc={null}
      title={person.name}
      to={person.slug ? `/people/${person.slug}` : undefined}
      className={styles.authorCard}
      accentColor={palette.accentColor}
      lightAccent={palette.lightAccent}
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


function formatTime(t: string): string {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${period}`;
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${iso}T00:00:00`));
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
  const { data: allEvents } = useGetFestivalEvents();
  usePageTitle(event ? decodeHtmlEntities(event.title?.rendered ?? '') : null);

  if (isLoading) return <PageLoader />;
  if (error || !event) return <div><FormattedMessage id="festivalEvent.notFound" /></div>;

  const today = new Date().toISOString().slice(0, 10);
  const futureEvents = (allEvents ?? [])
    .filter((e) => e.event_data.event_date >= today && e.event_data.event_type !== 'author_fair')
    .sort((a, b) => {
      const d = a.event_data.event_date.localeCompare(b.event_data.event_date);
      return d !== 0 ? d : (a.event_data.time_start ?? '').localeCompare(b.event_data.time_start ?? '');
    });
  const currentIndex = futureEvents.findIndex((e) => e.slug === slug);
  const isPast = event.event_data.event_date < today;
  const prevEvent = currentIndex > 0 ? futureEvents[currentIndex - 1] : futureEvents[futureEvents.length - 1];
  const nextEvent = currentIndex < futureEvents.length - 1 ? futureEvents[currentIndex + 1] : futureEvents[0];

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
    related_events,
  } = event.event_data;

  const allPeople = [
    ...sortBySurname(authors),
    ...sortBySurname(moderator),
    ...sortBySurname(curator),
    ...sortBySurname(musician),
    ...hosts,
  ];
  const personColorIndex = new Map(allPeople.map((p, i) => [p.id, i]));

  const timeRange = time_start
    ? `${formatTime(time_start)}${time_end ? ` – ${formatTime(time_end)}` : ''} PT`
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

  const freeLabel = intl.formatMessage({ id: 'events.free' });
  const pricedTiers = tickets.filter((t) => t.price_min !== null);
  const fmt = (n: number) => Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
  const formatTierPrice = (t: { price_min: number | null; price_max: number | null }) => {
    const lo = t.price_min as number;
    const hi = t.price_max ?? lo;
    if (lo === 0 && hi === 0) return freeLabel;
    return lo === hi ? fmt(lo) : `${fmt(lo)}–${fmt(hi)}`;
  };

  return (
    <main id="main-content" className={styles.page}>
      <Container>
        {event_image && (
          <img
            src={event_image[0]}
            alt={decodeHtmlEntities(event.title?.rendered ?? '')}
            className={styles.eventImage}
          />
        )}
        {!isPast && currentIndex !== -1 && futureEvents.length > 1 && (
          <nav className={styles.eventNavTop} aria-label={intl.formatMessage({ id: 'festivalEvent.nav.label' })}>
            {prevEvent && (
              <Link to={eventPath(prevEvent.slug)} className={`${styles.eventNavTopLink} ${styles.eventNavTopLinkPrev}`}
                onClick={() => track({ name: 'prev_next_nav', event_label: prevEvent.slug, event_location: 'top', content_type: 'event' })}>
                <span className={styles.eventNavTopArrow}>‹</span>
                {intl.formatMessage({ id: 'festivalEvent.nav.previous' })}
              </Link>
            )}
            {nextEvent && (
              <Link to={eventPath(nextEvent.slug)} className={`${styles.eventNavTopLink} ${styles.eventNavTopLinkNext}`}
                onClick={() => track({ name: 'prev_next_nav', event_label: nextEvent.slug, event_location: 'top', content_type: 'event' })}>
                {intl.formatMessage({ id: 'festivalEvent.nav.next' })}
                <span className={styles.eventNavTopArrow}>›</span>
              </Link>
            )}
          </nav>
        )}
        <Eyebrow>{eyebrowLabel}</Eyebrow>
        <PageTitle>{decodeHtmlEntities(event.title?.rendered ?? '')}</PageTitle>

        <div className={styles.twoCol}>
          <aside className={styles.sidebarCol}>
            <div className={styles.ticketBox}>
              <p className={styles.ticketBoxTitle}>
                {decodeHtmlEntities(event.title?.rendered ?? '')}
              </p>
              {event_date && (
                <p className={styles.datetime}>{formatDate(event_date)}</p>
              )}
              {timeRange && (
                <p className={styles.datetime}>{timeRange}</p>
              )}
              {pricedTiers.length > 0 && (
                <div className={styles.ticketTiers}>
                  <p className={styles.ticketTiersEyebrow}>{intl.formatMessage({ id: 'festivalEvent.price.admission' })}</p>
                  {pricedTiers.map((t, i) => {
                    const isSliding = /sliding/i.test(t.tier);
                    const priceStr = formatTierPrice(t);
                    const tierLabel = t.tier || (t.type === 'in_person' ? intl.formatMessage({ id: 'festivalEvent.format.inPerson' }) : intl.formatMessage({ id: 'festivalEvent.format.online' }));
                    return (
                      <div key={i} className={styles.ticketTierRow}>
                        <span className={styles.ticketTierName}>
                          {isSliding ? intl.formatMessage({ id: 'festivalEvent.price.slidingScale' }) : tierLabel}
                        </span>
                        <span className={styles.ticketTierPrice}>{priceStr}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              {venue && (
                <>
                  <p className={styles.ticketBoxVenueName}>{venue.name}</p>
                  {(venue.street_address || venue.city) && (
                    <p className={styles.ticketBoxAddress}>
                      {[venue.street_address, venue.city].filter(Boolean).join(', ')}
                    </p>
                  )}
                </>
              )}
              {locationMode && (
                <p className={`${styles.locationBadge} ${locationBadgeClass}`}>{locationMode}</p>
              )}
              {age_range && <p className={styles.ageRange}>{age_range}</p>}
              <EventbriteWidget
                eventbriteUrl={eventbrite_url}
                eventTitle={decodeHtmlEntities(event.title?.rendered ?? '')}
                hasTickets={tickets.length > 0}
              />
              {extra_info && <p className={styles.extraInfo}>{extra_info}</p>}
            </div>
          </aside>

          <div className={styles.mainCol}>
            {(authors.length > 0 ||
              moderator.length > 0 ||
              curator.length > 0 ||
              musician.length > 0 ||
              hosts.length > 0 ||
              hosted_by) && (
              <div className={styles.section}>
                <div className={`${styles.peopleFlow}${allPeople.length >= 5 ? ` ${styles.peopleFlowWide}` : ''}`}>
                  {sortBySurname(authors).map((a) => (
                    <LabelledCard key={a.id} label={intl.formatMessage({ id: 'festivalEvent.people.author' })}>
                      <AuthorCard person={a} colorIndex={personColorIndex.get(a.id) ?? 0} />
                    </LabelledCard>
                  ))}
                  {sortBySurname(moderator).map((p) => (
                    <LabelledCard key={p.id} label={intl.formatMessage({ id: 'festivalEvent.people.moderator' })}>
                      <StaffCard person={p} colorIndex={personColorIndex.get(p.id) ?? 0} />
                    </LabelledCard>
                  ))}
                  {sortBySurname(curator).map((p) => (
                    <LabelledCard key={p.id} label={intl.formatMessage({ id: 'festivalEvent.people.curator' })}>
                      <StaffCard person={p} colorIndex={personColorIndex.get(p.id) ?? 0} />
                    </LabelledCard>
                  ))}
                  {sortBySurname(musician).map((p) => (
                    <LabelledCard key={p.id} label={intl.formatMessage({ id: 'festivalEvent.people.musician' })}>
                      <StaffCard person={p} colorIndex={personColorIndex.get(p.id) ?? 0} />
                    </LabelledCard>
                  ))}
                  {hosts.map((p) => (
                    <LabelledCard key={p.id} label={intl.formatMessage({ id: 'festivalEvent.people.hostedBy' })}>
                      <StaffCard person={p} colorIndex={personColorIndex.get(p.id) ?? 0} />
                    </LabelledCard>
                  ))}
                </div>
                {hosted_by && <p className={styles.hostedByText}>{hosted_by}</p>}
              </div>
            )}

            {description && (
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
              />
            )}

            {related_events && related_events.length > 0 && (
              <div className={styles.relatedSection}>
                <h2 className={styles.relatedHeading}>
                  {intl.formatMessage({ id: 'festivalEvent.relatedEvents.heading' })}
                </h2>
                <ul className={styles.relatedList}>
                  {related_events.map((rel: RelatedEventSummary) => (
                    <li key={rel.id} className={styles.relatedCard}>
                      {rel.event_type && (
                        <p className={styles.relatedEyebrow}>
                          {rel.is_kidfest
                            ? intl.formatMessage({ id: 'festivalEvent.type.kidfest' }, { label: intl.formatMessage({ id: EVENT_TYPE_KEYS[rel.event_type] ?? 'festivalEvent.type.default' }) })
                            : intl.formatMessage({ id: EVENT_TYPE_KEYS[rel.event_type] ?? 'festivalEvent.type.default' })}
                        </p>
                      )}
                      <h3 className={styles.relatedTitle}>
                        <Link to={eventPath(rel.slug)} className={styles.relatedTitleLink}>
                          {rel.title}
                        </Link>
                      </h3>
                      {(rel.event_date || rel.venue_name) && (
                        <p className={styles.relatedMeta}>
                          {[rel.event_date, rel.venue_name].filter(Boolean).join(' · ')}
                        </p>
                      )}
                      <Link to={eventPath(rel.slug)} className={styles.relatedDetailsLink}>
                        {intl.formatMessage({ id: 'festivalEvent.relatedEvents.details' })}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

      </Container>

      {(venue || online_url) && (
        <div className={styles.venueBand}>
          <Container>
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
          </Container>
        </div>
      )}
      <nav className={styles.eventNav} aria-label={intl.formatMessage({ id: 'festivalEvent.nav.label' })}>
        <Container>
          {isPast || currentIndex === -1 ? (
            <div className={styles.eventNavBrowse}>
              <Link to="/events" className={styles.eventNavBrowseLink}>
                {intl.formatMessage({ id: 'festivalEvent.nav.browseUpcoming' })}
              </Link>
            </div>
          ) : (
            <div className={styles.eventNavPrevNext}>
              {prevEvent && (
                <Link to={eventPath(prevEvent.slug)} className={styles.eventNavPrev}
                  onClick={() => track({ name: 'prev_next_nav', event_label: prevEvent.slug, event_location: 'bottom', content_type: 'event' })}>
                  <span className={styles.eventNavArrow}>‹</span>
                  <span className={styles.eventNavLabel}>
                    <span className={styles.eventNavHint}>{intl.formatMessage({ id: 'festivalEvent.nav.previous' })}</span>
                    <span className={styles.eventNavTitle}>{decodeHtmlEntities(prevEvent.title?.rendered ?? '')}</span>
                  </span>
                </Link>
              )}
              {nextEvent && (
                <Link to={eventPath(nextEvent.slug)} className={styles.eventNavNext}
                  onClick={() => track({ name: 'prev_next_nav', event_label: nextEvent.slug, event_location: 'bottom', content_type: 'event' })}>
                  <span className={styles.eventNavLabel}>
                    <span className={styles.eventNavHint}>{intl.formatMessage({ id: 'festivalEvent.nav.next' })}</span>
                    <span className={styles.eventNavTitle}>{decodeHtmlEntities(nextEvent.title?.rendered ?? '')}</span>
                  </span>
                  <span className={styles.eventNavArrow}>›</span>
                </Link>
              )}
            </div>
          )}
        </Container>
      </nav>
    </main>
  );
}
