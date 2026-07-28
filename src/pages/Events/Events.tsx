import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { useGetFestivalEvents } from '../../api/festivalEvents/useGetFestivalEvents';
import type { FestivalEvent } from '../../api/festivalEvents/festivalEventTypes';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities';
import { usePageTitle } from '../../utils/usePageTitle';
import { Container } from '../../components/Container/Container';
import { PageTitle } from '../../components/PageTitle/PageTitle';
import styles from './Events.module.css';

const FESTIVAL_START = '2026-10-12';

function formatDayHeading(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-CA', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
}

function formatTime(t: string): string {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${period}`;
}

function formatEventPrice(tickets: { type: string; tier: string; price: string }[], freeLabel: string): string {
  const all = tickets ?? [];
  const inPerson = all.filter((t) => t.type === 'in_person');
  // Fall back to online tickets when no in-person tickets exist
  const relevant = inPerson.length > 0 ? inPerson : all.filter((t) => t.type === 'online');

  if (relevant.length === 0) return freeLabel;

  const isSliding = relevant.some((t) => /sliding/i.test(t.tier));

  // Extract every number from every price string (handles "$5 - $20", "$30", "30", "@20" typos)
  const nums = relevant.flatMap((t) =>
    (t.price.match(/\d+(\.\d+)?/g) ?? []).map(Number)
  );

  // All zeros (or no numbers) means free
  if (nums.length === 0 || nums.every((n) => n === 0)) return isSliding ? 'Sliding Scale' : freeLabel;

  const nonZero = nums.filter((n) => n > 0);
  const min = nums.includes(0) ? 0 : Math.min(...nonZero);
  const max = Math.max(...nonZero);
  const range = min === max ? `$${min}` : `$${min}–$${max}`;

  return isSliding ? `Sliding Scale · ${range}` : range;
}

function EventPopover({ event, popoverRef }: { event: FestivalEvent; popoverRef: React.RefObject<HTMLDivElement | null> }) {
  const d = event.event_data;
  const title = decodeHtmlEntities(event.title?.rendered ?? '');
  const authors = d.authors ?? [];

  const photos = authors.flatMap((a) =>
    a.photo ? [{ id: a.id, name: a.name, src: a.photo[0] }] : []
  );
  const covers = authors.flatMap((a) =>
    (a.books ?? []).flatMap((b) =>
      Array.isArray(b.cover) ? [{ id: b.id, title: b.title, src: b.cover[0] as string }] : []
    )
  );
  const eventImg = d.event_image ? d.event_image[0] : null;
  const showImages = !d.is_kidfest;

  return (
    <div ref={popoverRef} className={styles.popover} role="tooltip" aria-label={title}>
      {showImages && photos.length === 0 && covers.length === 0 && eventImg && (
        <img src={eventImg} alt={title} className={styles.popoverEventImg} />
      )}
      {showImages && (photos.length > 0 || covers.length > 0) && (
        photos.length <= 2 ? (
          <div className={styles.popoverImages}>
            {photos.map((p) => (
              <img key={p.id} src={p.src} alt={p.name} className={styles.popoverPhoto} />
            ))}
            {covers.slice(0, 4).map((c) => (
              <img key={c.id} src={c.src} alt={c.title} className={styles.popoverCover} />
            ))}
          </div>
        ) : (
          <>
            <div className={styles.popoverImages}>
              {photos.slice(0, 4).map((p) => (
                <img key={p.id} src={p.src} alt={p.name} className={styles.popoverPhoto} />
              ))}
            </div>
            {covers.length > 0 && (
              <div className={styles.popoverImages}>
                {covers.slice(0, 4).map((c) => (
                  <img key={c.id} src={c.src} alt={c.title} className={styles.popoverCover} />
                ))}
              </div>
            )}
          </>
        )
      )}
      <p className={styles.popoverTitle}>{title}</p>
      {authors.length > 0 && (
        <p className={styles.popoverAuthors}>
          {authors.length === 1
            ? authors[0].name
            : authors.slice(0, -1).map((a) => a.name).join(', ') + ' & ' + authors[authors.length - 1].name}
        </p>
      )}
      {d.summary && <p className={styles.popoverSummary}>{d.summary}</p>}
      {d.venue?.name && <p className={styles.popoverVenue}>{d.venue.name}</p>}
    </div>
  );
}

function EventRow({ event }: { event: FestivalEvent }) {
  const intl = useIntl();
  const popoverRef = useRef<HTMLDivElement>(null);
  const d = event.event_data;
  const title = decodeHtmlEntities(event.title?.rendered ?? '');
  const price = formatEventPrice(d.tickets, intl.formatMessage({ id: 'events.free' }));
  const timeStr = d.time_start ? formatTime(d.time_start) : '';

  const handleMouseMove = (e: React.MouseEvent<HTMLLIElement>) => {
    const pop = popoverRef.current;
    if (!pop) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left + 16;
    const y = e.clientY - rect.top - pop.offsetHeight / 2;
    pop.style.left = `${x}px`;
    pop.style.top = `${y}px`;
    pop.style.right = 'auto';
    pop.style.bottom = 'auto';
  };

  return (
    <li className={styles.row} onMouseMove={handleMouseMove}>
      <Link to={`/festival-events/${event.slug}`} className={styles.rowLink}>
        <span className={styles.rowTime}>{timeStr}</span>
        <span className={styles.rowTitle}>{title}</span>
        <span className={styles.rowMeta}>
          {d.venue?.name && <span className={styles.rowVenue}>{d.venue.name}</span>}
          <span className={styles.rowPrice}>{price}</span>
        </span>
      </Link>
      <EventPopover event={event} popoverRef={popoverRef} />
    </li>
  );
}

function EventGroup({ heading, events }: { heading: string; events: FestivalEvent[] }) {
  return (
    <section className={styles.group} aria-labelledby={`day-${heading}`}>
      <h2 id={`day-${heading}`} className={styles.dayHeading}>{heading}</h2>
      <ul className={styles.rowList}>
        {events.map((e) => <EventRow key={e.id} event={e} />)}
      </ul>
    </section>
  );
}

function Events() {
  const intl = useIntl();
  usePageTitle(intl.formatMessage({ id: 'events.heading' }));
  const { data: events, isLoading, error } = useGetFestivalEvents();

  const today = new Date().toISOString().slice(0, 10);

  const upcoming = (events ?? [])
    .filter((e) => e.event_data.event_date >= today)
    .sort((a, b) => {
      const dateCmp = a.event_data.event_date.localeCompare(b.event_data.event_date);
      if (dateCmp !== 0) return dateCmp;
      return (a.event_data.time_start || '').localeCompare(b.event_data.time_start || '');
    });

  const preseason = upcoming.filter((e) => e.event_data.event_date < FESTIVAL_START);
  const festival = upcoming.filter((e) => e.event_data.event_date >= FESTIVAL_START);

  // Group festival events by date
  const byDay = festival.reduce<Map<string, FestivalEvent[]>>((map, e) => {
    const date = e.event_data.event_date;
    if (!map.has(date)) map.set(date, []);
    map.get(date)!.push(e);
    return map;
  }, new Map());

  return (
    <main id="main-content" className={styles.page}>
      <Container>
        <PageTitle><FormattedMessage id="events.heading" /></PageTitle>

        {isLoading && <p className={styles.state}><FormattedMessage id="events.loading" /></p>}
        {error && <p className={styles.state}><FormattedMessage id="events.error" /></p>}
        {!isLoading && !error && upcoming.length === 0 && (
          <p className={styles.state}><FormattedMessage id="events.empty" /></p>
        )}

        {preseason.length > 0 && (
          <EventGroup
            heading={intl.formatMessage({ id: 'events.preseason' })}
            events={preseason}
          />
        )}

        {[...byDay.entries()].map(([date, dayEvents]) => (
          <EventGroup
            key={date}
            heading={formatDayHeading(date)}
            events={dayEvents}
          />
        ))}

      </Container>
    </main>
  );
}

export default Events;
