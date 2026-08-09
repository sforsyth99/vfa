import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { useGetFestivalEvents } from '../../api/festivalEvents/useGetFestivalEvents';
import type { FestivalEvent } from '../../api/festivalEvents/festivalEventTypes';
import type { PersonData } from '../../api/people/peopleTypes';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities';
import { sanitizeHtml } from '../../utils/sanitizeHtml';
import { sortBySurname } from '../../utils/sortBySurname';
import { eventPath } from '../../utils/eventPath';
import { usePageTitle } from '../../utils/usePageTitle';
import { Container } from '../../components/Container/Container';
import { PageTitle } from '../../components/PageTitle/PageTitle';
import { QueryState } from '../../components/QueryState/QueryState';
import styles from './Events.module.css';

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

function formatPriceGroup(
  group: { tier: string; price_min: number | null; price_max: number | null }[],
  freeLabel: string,
): string | null {
  const priced = group.filter((t) => t.price_min !== null);
  if (priced.length === 0) return null;
  const fmt = (n: number) => Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
  const mins = priced.map((t) => t.price_min as number);
  const maxes = priced.map((t) => t.price_max ?? (t.price_min as number));
  if (maxes.every((n) => n === 0)) return freeLabel;
  const lo = Math.min(...mins);
  const hi = Math.max(...maxes);
  return lo === hi ? fmt(lo) : `${fmt(lo)}–${fmt(hi)}`;
}

function formatEventPrice(
  tickets: { type: string; tier: string; price_min: number | null; price_max: number | null }[],
  freeLabel: string,
): { primary: string; secondary?: string } {
  const all = tickets ?? [];
  const inPerson = all.filter((t) => t.type === 'in_person');
  const online = all.filter((t) => t.type === 'online');

  const inPersonStr = formatPriceGroup(inPerson, freeLabel);
  const onlineStr = formatPriceGroup(online, freeLabel);

  if (inPersonStr && onlineStr) {
    return { primary: `In person ${inPersonStr}`, secondary: `Online ${onlineStr}` };
  }
  return { primary: inPersonStr ?? onlineStr ?? freeLabel };
}

function formatVenueLabel(
  tickets: { type: string }[],
  venueName: string | undefined,
  intl: ReturnType<typeof useIntl>,
): string {
  const hasInPerson = tickets?.some((t) => t.type === 'in_person');
  const hasOnline = tickets?.some((t) => t.type === 'online');
  if (venueName && hasOnline) return intl.formatMessage({ id: 'home.schedule.locationAndOnline' }, { venue: venueName });
  if (venueName) return venueName;
  if (hasOnline && !hasInPerson) return intl.formatMessage({ id: 'home.schedule.locationOnline' });
  return '';
}

function formatAuthorLine(
  eventType: string,
  authorNames: string,
  modNames: string,
  intl: ReturnType<typeof useIntl>,
): { authorLine: string | null; showModSeparately: boolean } {
  if (eventType === 'conversation' && authorNames && modNames) {
    return {
      authorLine: intl.formatMessage({ id: 'events.inConversationWith' }, { author: authorNames, moderator: modNames }),
      showModSeparately: false,
    };
  }
  if (eventType === 'workshop' && authorNames) {
    return {
      authorLine: intl.formatMessage({ id: 'events.workshopBy' }, { names: authorNames }),
      showModSeparately: true,
    };
  }
  return { authorLine: null, showModSeparately: true };
}

function formatNames(people: PersonData[] | undefined): string {
  if (!people?.length) return '';
  if (people.length === 1) return people[0].name;
  return people.slice(0, -1).map((p) => p.name).join(', ') + ' & ' + people[people.length - 1].name;
}

function EventPopover({ event, popoverRef }: { event: FestivalEvent; popoverRef: React.RefObject<HTMLDivElement | null> }) {
  const intl = useIntl();
  const d = event.event_data;
  const title = decodeHtmlEntities(event.title?.rendered ?? '');
  const authorNames = formatNames(sortBySurname(d.authors ?? [])) || formatNames(sortBySurname(d.hosts ?? []));
  const modNames = formatNames(sortBySurname(d.moderator ?? []));
  const { primary: pricePrimary, secondary: priceSecondary } = formatEventPrice(d.tickets, intl.formatMessage({ id: 'events.free' }));
  const timeStr = d.time_start
    ? d.time_end
      ? `${formatTime(d.time_start)} – ${formatTime(d.time_end)}`
      : formatTime(d.time_start)
    : '';

  const popoverImg = d.event_type === 'author_fair' && d.event_image
    ? d.event_image[0]
    : d.eventbrite_image
      ? d.eventbrite_image[0]
      : null;

  return (
    <div ref={popoverRef} className={styles.popover} role="tooltip" aria-label={title}>
      <p className={styles.popoverTitle}>{title}</p>
      {popoverImg && (
        <img src={popoverImg} alt="" aria-hidden="true" className={styles.popoverEventbriteImg} />
      )}
      {(() => {
        const { authorLine, showModSeparately } = formatAuthorLine(d.event_type, authorNames, modNames, intl);
        const displayLine = authorLine ?? authorNames;
        return (
          <>
            {displayLine && <p className={styles.popoverAuthors}>{displayLine}</p>}
            {showModSeparately && modNames && (
              <p className={styles.popoverMod}>
                {intl.formatMessage({ id: 'events.moderatedBy' }, { names: modNames })}
              </p>
            )}
          </>
        );
      })()}
      {d.description && <div className={styles.popoverSummary} dangerouslySetInnerHTML={{ __html: sanitizeHtml(d.description) }} />}
      {(() => {
        const hasInPerson = d.tickets?.some((t) => t.type === 'in_person');
        const hasOnline = d.tickets?.some((t) => t.type === 'online');
        const locationMode = hasInPerson && hasOnline
          ? ''
          : hasOnline
            ? intl.formatMessage({ id: 'events.locationOnline' })
            : hasInPerson
              ? intl.formatMessage({ id: 'events.locationInPerson' })
              : '';
        const venueLine = [d.venue?.name, d.venue?.room, d.venue?.building, d.venue?.street_address]
          .filter(Boolean).join(', ');
        return (
          <>
            <div className={styles.popoverMeta}>
              {timeStr && <span>{timeStr}</span>}
              {locationMode && <span>{locationMode}</span>}
              {pricePrimary && <span>{pricePrimary}</span>}
              {priceSecondary && <span>{priceSecondary}</span>}
            </div>
            {venueLine && <p className={styles.popoverVenueAddress}>{venueLine}</p>}
          </>
        );
      })()}
      {d.age_range && (
        <p className={styles.popoverAgeRange}>
          {intl.formatMessage({ id: 'events.agesRange' }, { range: d.age_range })}
        </p>
      )}
      {d.extra_info && <p className={styles.popoverExtra}>{d.extra_info}</p>}
    </div>
  );
}

function EventRow({ event }: { event: FestivalEvent }) {
  const intl = useIntl();
  const popoverRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [popoverActive, setPopoverActive] = useState(false);
  const d = event.event_data;
  const title = decodeHtmlEntities(event.title?.rendered ?? '');
  const timeStr = d.time_start ? formatTime(d.time_start) : '';
  const venueLabel = formatVenueLabel(d.tickets, d.venue?.name, intl);

  const authorNames = formatNames(sortBySurname(d.authors ?? [])) || formatNames(sortBySurname(d.hosts ?? []));
  const modNames = formatNames(sortBySurname(d.moderator ?? []));
  const { authorLine, showModSeparately } = formatAuthorLine(d.event_type, authorNames, modNames, intl);
  const rowAuthorLine = authorLine ?? (authorNames ? intl.formatMessage({ id: 'events.rowFeaturing' }, { names: authorNames }) : '');
  const rowSubtitle = [
    rowAuthorLine,
    showModSeparately && modNames ? intl.formatMessage({ id: 'events.rowMod' }, { name: modNames }) : '',
  ].filter(Boolean).join(' · ');

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

  const handleTitleEnter = () => {
    timerRef.current = setTimeout(() => setPopoverActive(true), 175);
  };

  const handleTitleLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPopoverActive(false);
  };

  const inner = (
    <>
      <span className={styles.rowTime}>{timeStr}</span>
      <span
        className={styles.rowTitleGroup}
        onMouseEnter={handleTitleEnter}
        onMouseLeave={handleTitleLeave}
      >
        <span className={styles.rowTitle}>{title}</span>
        {rowSubtitle && <span className={styles.rowAuthors}>{rowSubtitle}</span>}
      </span>
      {venueLabel && <span className={styles.rowVenue}>{venueLabel}</span>}
    </>
  );

  const isKidsfestMain = d.is_kidfest && d.event_type === 'author_fair';

  return (
    <li
      className={`${styles.row}${popoverActive ? ` ${styles.rowPopoverActive}` : ''}`}
      onMouseMove={handleMouseMove}
    >
      {isKidsfestMain ? (
        <Link to="/kidsfest2026" className={styles.rowLink}>{inner}</Link>
      ) : (
        <Link to={eventPath(event.slug)} className={styles.rowLink}>
          {inner}
        </Link>
      )}
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

  const byDay = upcoming.reduce<Map<string, FestivalEvent[]>>((map, e) => {
    const date = e.event_data.event_date;
    if (!map.has(date)) map.set(date, []);
    map.get(date)!.push(e);
    return map;
  }, new Map());

  return (
    <main id="main-content" className={styles.page}>
      <Container>
        <PageTitle><FormattedMessage id="events.heading" /></PageTitle>

        <QueryState isLoading={isLoading} isError={!!error} isEmpty={!isLoading && !error && upcoming.length === 0} loadingId="events.loading" errorId="events.error" emptyId="events.empty" />

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
