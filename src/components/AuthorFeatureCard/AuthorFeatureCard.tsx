import type React from 'react';
import { Link } from 'react-router-dom';

import styles from './AuthorFeatureCard.module.css';

export interface CardEvent {
  title: string;
  subtitleLines?: string[];
  to: string;
  href?: string;
}

interface Props {
  photoSrc: string | null;
  photoAlt: string;
  bookCoverSrc: string | null;
  bookCoverAlt?: string;
  // Single-event / legacy props (used by FestivalEvent.tsx)
  title?: string;
  subtitleLines?: string[];
  to?: string;
  // Multi-event prop (used by Person.tsx)
  events?: CardEvent[];
  contain?: boolean;
  className?: string;
  accentColor?: string;
  lightAccent?: boolean;
}

export function AuthorFeatureCard({
  photoSrc,
  photoAlt,
  bookCoverSrc,
  bookCoverAlt = '',
  title,
  subtitleLines = [],
  to,
  events,
  contain = false,
  className,
  accentColor,
  lightAccent = false,
}: Props) {
  const isMultiEvent = events && events.length > 1;
  const rootClass = [styles.card, isMultiEvent && styles.cardMulti, className].filter(Boolean).join(' ');
  const accentStyle = accentColor
    ? ({ ['--card-accent' as string]: accentColor } as React.CSSProperties)
    : undefined;

  const bannerContent = isMultiEvent ? (
    <div className={styles.eventList}>
      {events.map((event, i) =>
        event.href ? (
          <a key={i} href={event.href} target="_blank" rel="noopener noreferrer" className={styles.eventEntry}>
            <p className={styles.title}>{event.title}</p>
            {event.subtitleLines?.map((line, j) => (
              <p key={j} className={styles.subtitle}>{line}</p>
            ))}
          </a>
        ) : (
          <Link key={i} to={event.to} className={styles.eventEntry}>
            <p className={styles.title}>{event.title}</p>
            {event.subtitleLines?.map((line, j) => (
              <p key={j} className={styles.subtitle}>{line}</p>
            ))}
          </Link>
        )
      )}
    </div>
  ) : (
    <>
      <p className={styles.title}>{events?.[0]?.title ?? title}</p>
      {(events?.[0]?.subtitleLines ?? subtitleLines).map((line, i) => (
        <p key={i} className={styles.subtitle}>{line}</p>
      ))}
    </>
  );

  const inner = (
    <>
      <div className={styles.photoSection}>
        {photoSrc && (
          <div className={styles.photoLeft}>
            <img
              src={photoSrc}
              alt={photoAlt}
              className={contain ? styles.authorPhotoContain : styles.authorPhoto}
              loading="lazy"
            />
          </div>
        )}
        {bookCoverSrc && (
          <img src={bookCoverSrc} alt={bookCoverAlt} className={styles.bookCover} loading="lazy" />
        )}
      </div>
      <div className={[styles.banner, lightAccent && styles.bannerLight].filter(Boolean).join(' ')}>
        {bannerContent}
      </div>
    </>
  );

  const singleHref = events?.[0]?.href;
  const singleTo = events?.[0]?.to ?? to;

  if (isMultiEvent) return <div className={rootClass} style={accentStyle}>{inner}</div>;
  if (singleHref) return <a href={singleHref} target="_blank" rel="noopener noreferrer" className={rootClass} style={accentStyle}>{inner}</a>;
  if (singleTo) return <Link to={singleTo} className={rootClass} style={accentStyle}>{inner}</Link>;
  return <div className={rootClass} style={accentStyle}>{inner}</div>;
}
