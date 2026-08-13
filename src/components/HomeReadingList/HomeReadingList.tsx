import { useRef, useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { useGetBooks } from '../../api/books/useGetBooks';
import { CURRENT_YEAR } from '../../config/festival';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities';
import { BookLink } from '../BookLink/BookLink';
import { SkeletonBlock } from '../Skeleton/Skeleton';
import styles from './HomeReadingList.module.css';

export function HomeReadingList() {
  const intl = useIntl();
  const { data: books, isLoading } = useGetBooks();
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 0);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => { updateScrollState(); }, [books, updateScrollState]);

  const scroll = (dir: 'prev' | 'next') => {
    if (!trackRef.current) return;
    const amount = trackRef.current.clientWidth * 0.75;
    trackRef.current.scrollBy({ left: dir === 'next' ? amount : -amount, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <section className={styles.section} aria-busy="true">
        <div className={styles.inner}>
          <SkeletonBlock className={styles.skeletonHeading} />
          <div className={styles.skeletonTrack}>
            {[0, 1, 2, 3, 4].map((i) => <SkeletonBlock key={i} className={styles.skeletonCard} />)}
          </div>
        </div>
      </section>
    );
  }

  const filtered = (books ?? []).filter(
    (b) =>
      b.book_data?.festival_year === CURRENT_YEAR &&
      !b.book_data?.categories?.includes('children'),
  );

  if (!filtered.length) return null;

  const sorted = [...filtered].sort((a, b) => {
    const key = (t: string) => t.replace(/^(a|an|the)\s+/i, '').toLowerCase();
    return key(decodeHtmlEntities(a.title?.rendered ?? '')).localeCompare(
      key(decodeHtmlEntities(b.title?.rendered ?? '')),
    );
  });

  return (
    <section className={styles.section} aria-labelledby="reading-list-heading">
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 id="reading-list-heading" className={styles.heading}>
            <FormattedMessage id="home.books.heading" />
          </h2>
          <Link to="/books" className={styles.seeAll}>
            <FormattedMessage id="home.books.seeAll" /> ›
          </Link>
        </div>

        <div className={styles.carouselWrapper} data-can-prev={canPrev} data-can-next={canNext}>
          <button
            className={`${styles.arrow} ${styles.arrowPrev}`}
            onClick={() => scroll('prev')}
            aria-label={intl.formatMessage({ id: 'home.books.prev' })}
            disabled={!canPrev}
          >
            ‹
          </button>

          <ul className={styles.track} ref={trackRef} onScroll={updateScrollState}>
            {sorted.map((book) => {
              const coverUrl = book.book_data?.cover_image ? book.book_data.cover_image[0] : null;
              const title = decodeHtmlEntities(book.title?.rendered ?? '');
              const authorName = book.book_data?.authors?.[0]?.name ?? book.book_data?.additional_authors ?? '';

              return (
                <li key={book.id} className={styles.item}>
                  <BookLink
                    slug={book.slug}
                    munrosUrl={book.book_data?.munros_url || undefined}
                    bookTitle={title}
                    className={styles.card}
                    aria-label={intl.formatMessage(
                      { id: 'home.books.cardLabel' },
                      { title, author: authorName },
                    )}
                  >
                    <div className={styles.cover}>
                      {coverUrl ? (
                        <img src={coverUrl} alt="" aria-hidden="true" loading="lazy" />
                      ) : (
                        <span className={styles.coverPlaceholder} aria-hidden="true">
                          {title.charAt(0)}
                        </span>
                      )}
                    </div>
                    <span className={styles.cardTitle}>{title}</span>
                    {authorName && (
                      <span className={styles.cardAuthor}>{authorName}</span>
                    )}
                  </BookLink>
                </li>
              );
            })}
          </ul>

          <button
            className={`${styles.arrow} ${styles.arrowNext}`}
            onClick={() => scroll('next')}
            aria-label={intl.formatMessage({ id: 'home.books.next' })}
            disabled={!canNext}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
