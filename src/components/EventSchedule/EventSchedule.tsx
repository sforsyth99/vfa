import type { ReactNode } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { QueryState } from '../QueryState/QueryState';
import { Link } from 'react-router-dom';
import { useGetFestivalEvents } from '../../api/festivalEvents/useGetFestivalEvents';
import type { FestivalEvent } from '../../api/festivalEvents/festivalEventTypes';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities';
import { EventLink } from '../EventLink/EventLink';
import styles from './EventSchedule.module.css';

function formatTime(t: string): string {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${period}`;
}

function ScheduleTable({
  events,
  showHost = false,
}: {
  events: FestivalEvent[];
  showHost?: boolean;
}) {
  const intl = useIntl();
  const dateLabel = intl.formatMessage({ id: 'home.schedule.date' });
  const timeLabel = intl.formatMessage({ id: 'home.schedule.time' });
  const eventLabel = intl.formatMessage({ id: 'home.schedule.event' });
  const locationLabel = intl.formatMessage({ id: 'home.schedule.location' });
  const hostedByLabel = intl.formatMessage({ id: 'home.schedule.hostedBy' });

  return (
    <table className={styles.scheduleTable}>
      <thead>
        <tr>
          <th scope="col">{dateLabel}</th>
          <th scope="col">{timeLabel}</th>
          <th scope="col">{eventLabel}</th>
          <th scope="col">{locationLabel}</th>
          {showHost && <th scope="col">{hostedByLabel}</th>}
        </tr>
      </thead>
      <tbody>
        {events.map((event) => {
          const { event_date, time_start, time_end, venue, tickets, hosts, hosted_by, eventbrite_url } =
            event.event_data;
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
          const hostParts: ReactNode[] = [
            ...(hosts ?? []).map((h) =>
              h.slug ? (
                <Link key={h.id} to={`/people/${h.slug}`}>
                  {h.name}
                </Link>
              ) : (
                <span key={h.id}>{h.name}</span>
              ),
            ),
            ...(hosted_by ? [<span key="text">{hosted_by}</span>] : []),
          ];
          return (
            <tr key={event.id}>
              <td className={styles.scheduleDate} data-label={dateLabel}>
                {event_date
                  ? new Date(event_date + 'T00:00:00').toLocaleDateString('en-CA', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })
                  : '—'}
              </td>
              <td className={styles.scheduleTime} data-label={timeLabel}>
                {timeStr || '—'}
              </td>
              <td className={styles.scheduleName} data-label={eventLabel}>
                <EventLink slug={event.slug} isKidfest={event.event_data.is_kidfest} eventType={event.event_data.event_type} eventbriteUrl={eventbrite_url}>
                  {decodeHtmlEntities(event.title?.rendered ?? '')}
                </EventLink>
              </td>
              <td className={styles.scheduleLocation} data-label={locationLabel}>
                {location}
              </td>
              {showHost && (
                <td className={styles.scheduleLocation} data-label={hostedByLabel}>
                  {hostParts.length > 0
                    ? hostParts.reduce<ReactNode[]>(
                        (acc, el, i) => (i === 0 ? [el] : [...acc, ', ', el]),
                        [],
                      )
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

export function EventSchedule({
  hideKidfest = false,
  hidePast = false,
}: {
  hideKidfest?: boolean;
  hidePast?: boolean;
}) {
  const { data: events, isLoading, isError } = useGetFestivalEvents();

  if (isLoading || isError)
    return (
      <QueryState
        isLoading={isLoading}
        isError={isError}
        loadingId="home.events.loading"
        errorId="home.events.error"
      />
    );
  if (!events?.length) return null;

  const today = new Date().toISOString().slice(0, 10);
  // const dateLabel  = intl.formatMessage({ id: 'home.schedule.date' });
  // const timeLabel  = intl.formatMessage({ id: 'home.schedule.time' });
  // const eventLabel = intl.formatMessage({ id: 'home.schedule.event' });

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
  const workshops = upcoming.filter(
    (e) => e.event_data.event_type === 'workshop' && !e.event_data.is_kidfest,
  );
  const online = upcoming.filter((e) => e.event_data.tickets.some((t) => t.type === 'online'));

  if (!upcoming.length && !past.length) return null;

  return (
    <>
      {regular.length > 0 && (
        <div className={styles.scheduleSection}>
          <h2 className={styles.scheduleHeading}>
            <FormattedMessage id="home.schedule.upcoming" />
          </h2>
          <ScheduleTable events={regular} />
        </div>
      )}
      {!hideKidfest && kidfest.length > 0 && (
        <div className={styles.scheduleSection}>
          <h2 className={styles.scheduleHeading}>
            <FormattedMessage id="home.schedule.kidfest" />
          </h2>
          <ScheduleTable events={kidfest} />
        </div>
      )}
      {workshops.length > 0 && (
        <div className={styles.scheduleSection}>
          <h2 className={styles.scheduleHeading}>
            <FormattedMessage id="home.schedule.workshops" />
          </h2>
          <ScheduleTable events={workshops} showHost />
        </div>
      )}
      {online.length > 0 && (
        <div className={styles.onlineSection}>
          <div className={styles.onlineCta}>
            <p className={styles.onlineCtaHeading}>
              <FormattedMessage id="home.schedule.onlineCta" />
            </p>
            <p className={styles.onlineCtaIntro}>
              <FormattedMessage id="home.schedule.onlineIntro" />
            </p>
          </div>
          <ul className={styles.onlineList}>
            {online.map((event) => {
              const { event_date, time_start, time_end, online_url, eventbrite_url: ebUrl } = event.event_data;
              const dateStr = event_date
                ? new Date(event_date + 'T00:00:00').toLocaleDateString('en-CA', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })
                : '';
              const timeStr = time_start
                ? `${formatTime(time_start)}${time_end ? ` – ${formatTime(time_end)}` : ''}`
                : '';
              const title = decodeHtmlEntities(event.title?.rendered ?? '');
              return (
                <li key={event.id} className={styles.onlineEvent}>
                  <div className={styles.onlineEventMeta}>
                    {[dateStr, timeStr].filter(Boolean).join(' · ')}
                  </div>
                  <EventLink
                    slug={event.slug}
                    isKidfest={event.event_data.is_kidfest}
                    eventType={event.event_data.event_type}
                    eventbriteUrl={ebUrl}
                    className={styles.onlineEventTitle}
                  >
                    {title}
                  </EventLink>
                  {online_url && (
                    <a
                      href={online_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.onlineEventJoin}
                    >
                      <FormattedMessage id="home.schedule.joinOnline" />
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {!hidePast && past.length > 0 && (
        <div className={styles.scheduleSection}>
          <h2 className={styles.scheduleHeading}>
            <FormattedMessage id="home.schedule.past" />
          </h2>
          <ScheduleTable events={past} />
        </div>
      )}
    </>
  );
}
