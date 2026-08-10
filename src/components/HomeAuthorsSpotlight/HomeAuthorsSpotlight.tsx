import { useRef, useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { useGetAuthors } from '../../api/people/useGetAuthors';
import { CURRENT_YEAR } from '../../config/festival';
import { sortBySurname } from '../../utils/sortBySurname';
import { SkeletonBlock } from '../Skeleton/Skeleton';
import styles from './HomeAuthorsSpotlight.module.css';

export function HomeAuthorsSpotlight() {
  const intl = useIntl();
  const { data: authors, isLoading } = useGetAuthors(CURRENT_YEAR);
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 0);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => { updateScrollState(); }, [authors, updateScrollState]);

  const scroll = (dir: 'prev' | 'next') => {
    if (!trackRef.current) return;
    const amount = trackRef.current.clientWidth * 0.75;
    trackRef.current.scrollBy({ left: dir === 'next' ? amount : -amount, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <section className={styles.section} aria-busy="true">
        <SkeletonBlock className={styles.skeletonHeading} />
        <div className={styles.skeletonTrack}>
          {[0, 1, 2, 3, 4].map((i) => <SkeletonBlock key={i} className={styles.skeletonCard} />)}
        </div>
      </section>
    );
  }

  if (!authors?.length) return null;

  const sorted = sortBySurname(authors);

  return (
    <section className={styles.section} aria-labelledby="authors-spotlight-heading">
      <div className={styles.inner}>
      <div className={styles.header}>
        <h2 id="authors-spotlight-heading" className={styles.heading}>
          <FormattedMessage id="home.authorsSpotlight.heading" />
        </h2>
        <Link to="/authors" className={styles.seeAll}>
          <FormattedMessage id="home.authorsSpotlight.seeAll" /> ›
        </Link>
      </div>

      <div className={styles.carouselWrapper} data-can-prev={canPrev} data-can-next={canNext}>
        <button
          className={`${styles.arrow} ${styles.arrowPrev}`}
          onClick={() => scroll('prev')}
          aria-label={intl.formatMessage({ id: 'home.authorsSpotlight.prev' })}
          disabled={!canPrev}
        >
          ‹
        </button>

        <ul className={styles.track} ref={trackRef} onScroll={updateScrollState}>
          {sorted.map((author) => {
            const photoSrc = author.photo
              ? author.photo[0]
              : author.photo_square
                ? author.photo_square[0]
                : null;
            const initial = author.name.trim().charAt(0).toUpperCase();
            return (
              <li key={author.id} className={styles.item}>
                <Link
                  to={`/people/${author.slug}`}
                  className={styles.card}
                  aria-label={author.name}
                >
                  <div className={styles.photoCard}>
                    {photoSrc ? (
                      <img src={photoSrc} alt="" aria-hidden="true" loading="lazy" />
                    ) : (
                      <span className={styles.initial} aria-hidden="true">{initial}</span>
                    )}
                  </div>
                  <span className={styles.cardName}>{author.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          className={`${styles.arrow} ${styles.arrowNext}`}
          onClick={() => scroll('next')}
          aria-label={intl.formatMessage({ id: 'home.authorsSpotlight.next' })}
          disabled={!canNext}
        >
          ›
        </button>
      </div>
      </div>
    </section>
  );
}
