import { useState } from 'react';
import { useGetTribeEvents } from '../api/events/useGetTribeEvents.ts';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities';
import type { TribeEvent } from '../api/events/eventTypes';
import styles from './Events.module.css';

const FILTERS = ['All', 'Readings', 'Panels', 'Workshops', 'In Conversation', 'Free events'];

function parseDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day: d.getDate().toString(),
    month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
    time: d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
  };
}

function EventCard({ event }: { event: TribeEvent }) {
  const { day, month, time } = parseDate(event.date);
  return (
    <article className={styles.eventCard}>
      <div className={styles.eventCardImg} role="presentation" />
      <div className={styles.eventCardBody}>
        <div className={styles.eventCardMeta}>
          <div className={styles.dateBlock}>
            <span className={styles.dateDay}>{day}</span>
            <span className={styles.dateMonth}>{month}</span>
          </div>
          <div>
            <div className={styles.kicker}>Event</div>
            <div className={styles.eventCardTime}>{time}</div>
          </div>
        </div>
        <h3 className={styles.eventCardTitle}>{decodeHtmlEntities(event.title.rendered)}</h3>
        {event.excerpt.rendered && (
          <div
            className={styles.eventCardExcerpt}
            dangerouslySetInnerHTML={{ __html: event.excerpt.rendered }}
          />
        )}
        <div className={styles.eventCardFooter}>
          <a href={event.link} target="_blank" rel="noopener noreferrer" className={styles.btnLink}>
            Details →
          </a>
        </div>
      </div>
    </article>
  );
}

function Events() {
  const [activeFilter, setActiveFilter] = useState('All');
  const { data: events, isLoading, isError } = useGetTribeEvents();

  return (
    <main className={styles.eventsPage}>
      <div className={styles.pageHeader}>
        <span className={styles.kicker}>All events</span>
        <h1 className={styles.pageTitle}>
          Readings, panels,<br />workshops &amp; more.
        </h1>
        <div className={styles.filters}>
          {FILTERS.map(f => (
            <button
              key={f}
              className={`${styles.pill} ${activeFilter === f ? styles.pillActive : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.eventsSection}>
        {isLoading && <p className={styles.emptyState}>Loading events…</p>}
        {isError && <p className={styles.emptyState}>Events coming soon.</p>}
        {!isLoading && !isError && events && events.length > 0 && (
          <div className={styles.eventsGrid}>
            {events.map((event: TribeEvent) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
        {!isLoading && !isError && (!events || events.length === 0) && (
          <p className={styles.emptyState}>
            The full event schedule will be announced soon.<br />
            Check back or sign up for our newsletter to be notified.
          </p>
        )}
      </div>
    </main>
  );
}

export default Events;
