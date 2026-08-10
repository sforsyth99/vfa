import { useRef, useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { useGetFestivalEvents } from '../../api/festivalEvents/useGetFestivalEvents';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities';
import { eventPath } from '../../utils/eventPath';
import { EventbriteWidget } from '../EventbriteWidget/EventbriteWidget';
import { SkeletonBlock } from '../Skeleton/Skeleton';
import type { PersonData } from '../../api/people/peopleTypes';
import starryBg from '../../assets/starry-background-sm.jpg';
import artWorkshopBg from '../../assets/art-workshop.jpeg';
import kidsFestPoster from '../../assets/kids-fest-crop.png';
import styles from './HomeEventBrowser.module.css';

function formatTime(t: string): string {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${period}`;
}

function formatAuthorNames(authors: PersonData[]): string {
  const names = authors.map((a) => a.name);
  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  if (names.length <= 4) return `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`;
  return `${names.slice(0, 3).join(', ')} & ${names.length - 3} others`;
}

export function HomeEventBrowser() {
  const intl = useIntl();
  const { data: events, isLoading } = useGetFestivalEvents();
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 0);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => { updateScrollState(); }, [events, updateScrollState]);

  const scroll = (dir: 'prev' | 'next') => {
    const el = trackRef.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>('li'));
    const containerCenter = el.scrollLeft + el.clientWidth / 2;
    let closestIdx = 0, minDist = Infinity;
    items.forEach((item, i) => {
      const dist = Math.abs(item.offsetLeft + item.offsetWidth / 2 - containerCenter);
      if (dist < minDist) { minDist = dist; closestIdx = i; }
    });
    const targetIdx = Math.max(0, Math.min(items.length - 1, closestIdx + (dir === 'next' ? 1 : -1)));
    items[targetIdx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  if (isLoading) {
    return (
      <section className={styles.section} aria-busy="true">
        <div className={styles.inner}>
          <SkeletonBlock className={styles.skeletonHeading} />
          <div className={styles.skeletonTrack}>
            {[0, 1, 2].map((i) => <SkeletonBlock key={i} className={styles.skeletonCard} />)}
          </div>
        </div>
      </section>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = (events ?? [])
    .filter((e) => e.event_data.event_date >= today)
    .sort((a, b) => a.event_data.event_date.localeCompare(b.event_data.event_date));

  if (!upcoming.length) return null;

  const fmt = (n: number) => (Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`);

  return (
    <section className={styles.section} aria-labelledby="event-browser-heading">
      <div className={styles.inner}>
        <h2 id="event-browser-heading" className={styles.heading}>
          <FormattedMessage id="home.eventBrowser.heading" />
        </h2>

        <div className={styles.carouselWrapper} data-can-prev={canPrev} data-can-next={canNext}>
          <button
            className={`${styles.arrow} ${styles.arrowPrev}`}
            onClick={() => scroll('prev')}
            disabled={!canPrev}
            aria-label={intl.formatMessage({ id: 'home.eventBrowser.prev' })}
          >
            ‹
          </button>

          <ul className={styles.track} ref={trackRef} onScroll={updateScrollState}>
            {upcoming.map((event) => {
              const d = event.event_data;
              const title = decodeHtmlEntities(event.title?.rendered ?? '');
              const dateStr = d.event_date
                ? new Date(d.event_date + 'T00:00:00').toLocaleDateString('en-CA', {
                    weekday: 'long', month: 'long', day: 'numeric',
                  })
                : '';
              const timeStr = d.time_start
                ? `${formatTime(d.time_start)}${d.time_end ? ` – ${formatTime(d.time_end)}` : ''}`
                : '';
              const inPerson = d.tickets.filter((t) => t.type === 'in_person');
              const relevant = inPerson.length > 0 ? inPerson : d.tickets;
              const priced = relevant.filter((t) => t.price_min !== null);
              const price: string | null = priced.length === 0 ? null : (() => {
                const mins = priced.map((t) => t.price_min as number);
                const maxes = priced.map((t) => t.price_max ?? (t.price_min as number));
                if (maxes.every((n) => n === 0)) return intl.formatMessage({ id: 'events.free' });
                const lo = Math.min(...mins); const hi = Math.max(...maxes);
                return lo === hi ? fmt(lo) : `${fmt(lo)}–${fmt(hi)}`;
              })();
              const authorNames = formatAuthorNames(d.authors);
              const isWorkshop = d.event_type === 'workshop';
              const isKidsFestAuthorFair = d.is_kidfest && d.event_type === 'author_fair';
              const useKidsFestPoster = isWorkshop && d.is_kidfest;
              const useArtBg = !useKidsFestPoster && isWorkshop && d.hosts.length === 2;
              const photoSource = isWorkshop && d.hosts.length === 1 ? d.hosts : d.authors;
              const avatars = photoSource.slice(0, isKidsFestAuthorFair ? undefined : 5).map((a) => ({
                name: a.name,
                initial: a.name.trim().charAt(0).toUpperCase(),
                src: (Array.isArray(a.photo) ? a.photo[0] : a.photo_square ? a.photo_square[0] : null)
                  ?.replace(/-\d+x\d+(\.[a-z]+)$/i, '$1') ?? null,
              }));
              const detailPath = d.is_kidfest && d.event_type === 'author_fair'
                ? '/kidsfest2026'
                : eventPath(event.slug);

              return (
                <li key={event.id} className={styles.item}>
                  <div className={styles.card}>
                    <div className={styles.cardBanner}>
                      <img
                        src={useKidsFestPoster ? kidsFestPoster : useArtBg ? artWorkshopBg : avatars.length === 1 && avatars[0].src ? avatars[0].src.replace(/-\d+x\d+(\.[a-z]+)$/i, '$1') : starryBg}
                        alt={useKidsFestPoster ? 'KidsFest 2026' : avatars.length === 1 ? avatars[0].name : ''}
                        aria-hidden={useKidsFestPoster || avatars.length !== 1 ? true : undefined}
                        className={useKidsFestPoster ? styles.posterContain : undefined}
                      />
                      {!useArtBg && !useKidsFestPoster && avatars.length > 1 && (
                        <div className={`${styles.avatarOverlay}${isKidsFestAuthorFair ? ` ${styles.avatarOverlayKids}` : ''}`} data-count={avatars.length}>
                          {avatars.map((av, i) => (
                            <div key={i} className={styles.overlayAvatar}>
                              {av.src
                                ? <img src={av.src} alt={av.name} loading="lazy" />
                                : <span aria-hidden="true">{av.initial}</span>
                              }
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className={styles.cardBody}>
                      <div className={styles.cardMeta}>
                        {dateStr && <span className={styles.cardDate}>{dateStr}</span>}
                        {timeStr && <span className={styles.cardTime}>{timeStr}</span>}
                        {d.venue?.name && <span className={styles.cardVenue}>{d.venue.name}</span>}
                        {price && <span className={styles.cardPrice}>{price}</span>}
                      </div>
                      <h3 className={styles.cardTitle}>
                        <Link to={detailPath}>{title}</Link>
                      </h3>
                      {authorNames && <p className={styles.cardAuthors}>with {authorNames}</p>}
                      {d.summary && <p className={styles.cardSummary}>{d.summary}</p>}
                      <div className={styles.cardActions}>
                        <EventbriteWidget eventbriteUrl={d.eventbrite_url} eventTitle={title} hasTickets={d.tickets.length > 0} />
                        <Link to={detailPath} className={styles.detailsLink}>
                          <FormattedMessage id="home.eventBrowser.details" /> ›
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <button
            className={`${styles.arrow} ${styles.arrowNext}`}
            onClick={() => scroll('next')}
            disabled={!canNext}
            aria-label={intl.formatMessage({ id: 'home.eventBrowser.next' })}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
