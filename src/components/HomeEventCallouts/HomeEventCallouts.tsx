import { FormattedMessage, useIntl } from 'react-intl';
import { track } from '../../utils/analytics';
import { useGetFestivalEvents } from '../../api/festivalEvents/useGetFestivalEvents';
import type { FestivalEvent } from '../../api/festivalEvents/festivalEventTypes';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities';
import { EventLink } from '../EventLink/EventLink';
import { SkeletonBlock } from '../Skeleton/Skeleton';
import styles from './HomeEventCallouts.module.css';

const MAX_WORKSHOPS = 5;

function formatShortDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-CA', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function oxfordList(names: string[]): string {
  if (names.length <= 2) return names.join(' and ');
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}

function formatTime(t: string): string {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${period}`;
}

function CalloutSkeleton() {
  return (
    <div className={`${styles.inner} ${styles.workshopCard}`} aria-busy="true">
      <div className={styles.intro}>
        <SkeletonBlock className={styles.skeletonEyebrow} />
        <SkeletonBlock className={styles.skeletonHeading} />
        <SkeletonBlock className={styles.skeletonHeadingShort} />
        <SkeletonBlock className={styles.skeletonTagline} />
        <SkeletonBlock className={styles.skeletonTaglineShort} />
      </div>
      <div className={styles.skeletonList}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={styles.skeletonItem}>
            <SkeletonBlock className={styles.skeletonEventTitle} />
            <SkeletonBlock className={styles.skeletonEventMeta} />
          </div>
        ))}
      </div>
    </div>
  );
}

function EventList({
  events,
  showHost = false,
  showAuthors = false,
  showVenue = true,
  inlineMeta = false,
  onEventClick,
}: {
  events: FestivalEvent[];
  showHost?: boolean;
  showAuthors?: boolean;
  showVenue?: boolean;
  inlineMeta?: boolean;
  onEventClick?: (title: string) => void;
}) {
  const intl = useIntl();
  return (
    <ul className={styles.eventList}>
      {events.map((event) => {
        const title = decodeHtmlEntities(event.title?.rendered ?? '');
        const {
          event_date,
          event_type,
          is_kidfest,
          hosts,
          hosted_by,
          authors,
          time_start,
          time_end,
          venue,
        } = event.event_data;
        const hostNames = [
          ...(hosts ?? []).map((h) => h.name),
          ...(hosted_by ? [hosted_by] : []),
        ].join(', ');
        const authorNames = oxfordList((authors ?? []).map((a) => a.name));
        const bylineNames = showAuthors ? authorNames : showHost ? hostNames : '';
        const bylineKey = showAuthors
          ? 'home.callouts.online.featuring'
          : 'home.callouts.workshops.hostedBy';
        const dateStr = event_date ? formatShortDate(event_date) : '';
        const timeStr = time_start
          ? `${formatTime(time_start)}${time_end ? ` – ${formatTime(time_end)}` : ''}`
          : '';
        const locationStr = showVenue ? (venue?.name ?? '') : '';
        const meta = [dateStr, timeStr, locationStr].filter(Boolean).join(' · ');
        const eventLink = (
          <EventLink
            slug={event.slug}
            isKidfest={is_kidfest}
            eventType={event_type}
            className={styles.eventTitle}
            onClick={onEventClick ? () => onEventClick(title) : undefined}
          >
            {title}
          </EventLink>
        );
        return (
          <li key={event.id} className={styles.eventItem}>
            {inlineMeta ? (
              <div className={styles.eventTitleRow}>
                {eventLink}
                {meta && <span className={styles.eventMeta}>{meta}</span>}
              </div>
            ) : (
              eventLink
            )}
            {bylineNames && (
              <span className={styles.eventHost}>
                {intl.formatMessage({ id: bylineKey }, { names: bylineNames })}
              </span>
            )}
            {!inlineMeta && meta && <span className={styles.eventMeta}>{meta}</span>}
          </li>
        );
      })}
    </ul>
  );
}

export function HomeWorkshopCallout() {
  const { data: events, isLoading } = useGetFestivalEvents();

  if (isLoading) {
    return (
      <section className={styles.section} aria-labelledby="workshop-callout-heading">
        <CalloutSkeleton />
      </section>
    );
  }

  if (!events?.length) return null;

  const today = new Date().toISOString().slice(0, 10);
  const workshops = events
    .filter(
      (e) =>
        e.event_data.event_date >= today &&
        e.event_data.event_type === 'workshop' &&
        !e.event_data.is_kidfest,
    )
    .sort((a, b) => a.event_data.event_date.localeCompare(b.event_data.event_date))
    .slice(0, MAX_WORKSHOPS);

  if (!workshops.length) return null;

  return (
    <section className={styles.section} aria-labelledby="workshop-callout-heading">
      <div className={`${styles.inner} ${styles.workshopCard}`}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>
            <FormattedMessage id="home.callouts.workshops.eyebrow" />
          </p>
          <h2 id="workshop-callout-heading" className={styles.heading}>
            <FormattedMessage id="home.callouts.workshops.heading" />
          </h2>
          <p className={styles.tagline}>
            <FormattedMessage id="home.callouts.workshops.tagline" />
          </p>
        </div>
        <EventList
          events={workshops}
          showHost
          onEventClick={(title) =>
            track({ name: 'callout_click', event_label: title, event_location: 'workshop_callout' })
          }
        />
      </div>
    </section>
  );
}

export function HomeEventCallouts() {
  return (
    <>
      <HomeWorkshopCallout />
      <HomeOnlineCallout />
    </>
  );
}

export function HomeOnlineCallout() {
  const { data: events, isLoading } = useGetFestivalEvents();

  if (isLoading) {
    return (
      <section className={styles.sectionDark} aria-labelledby="online-callout-heading">
        <CalloutSkeleton />
      </section>
    );
  }

  if (!events?.length) return null;

  const today = new Date().toISOString().slice(0, 10);
  const online = events
    .filter(
      (e) =>
        e.event_data.event_date >= today &&
        (e.event_data.tickets.some((t) => t.type === 'online') || !!e.event_data.online_url),
    )
    .sort((a, b) => a.event_data.event_date.localeCompare(b.event_data.event_date));

  if (!online.length) return null;

  return (
    <section className={styles.sectionDark} aria-labelledby="online-callout-heading">
      <div className={`${styles.inner} ${styles.workshopCard}`}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>
            <FormattedMessage id="home.callouts.online.eyebrow" />
          </p>
          <h2 id="online-callout-heading" className={styles.heading}>
            <FormattedMessage id="home.callouts.online.heading" />
          </h2>
          <p className={styles.tagline}>
            <FormattedMessage id="home.callouts.online.tagline" />
          </p>
        </div>
        <EventList
          events={online}
          showAuthors
          showVenue={false}
          inlineMeta
          onEventClick={(title) =>
            track({ name: 'callout_click', event_label: title, event_location: 'online_callout' })
          }
        />
      </div>
    </section>
  );
}
