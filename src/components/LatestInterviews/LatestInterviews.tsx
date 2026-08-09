import { useRef, useState, useCallback, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { useGetInterviews } from '../../api/interviews/useGetInterviews';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities';
import { sortBySurname } from '../../utils/sortBySurname';
import { SkeletonBlock } from '../Skeleton/Skeleton';
import styles from './LatestInterviews.module.css';

const COUNT = 16;

export function LatestInterviews() {
  const intl = useIntl();
  const { data: interviews, isLoading } = useGetInterviews();
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 0);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    updateScrollState();
  }, [interviews, updateScrollState]);

  if (isLoading) return (
    <section className={styles.section} aria-busy="true">
      <SkeletonBlock className={styles.skeletonHeading} />
      <div className={styles.skeletonTrack}>
        {[0, 1, 2, 3, 4].map((i) => <SkeletonBlock key={i} className={styles.skeletonCard} />)}
      </div>
    </section>
  );
  if (!interviews?.length) return null;

  const latest = interviews
    .filter((i) => (i.interview_data?.authors?.[0]?.kidfest_years?.length ?? 0) === 0)
    .slice(0, COUNT);

  const scroll = (dir: 'prev' | 'next') => {
    if (!trackRef.current) return;
    const amount = trackRef.current.clientWidth * 0.75;
    trackRef.current.scrollBy({ left: dir === 'next' ? amount : -amount, behavior: 'smooth' });
  };

  return (
    <section className={styles.section} aria-labelledby="latest-interviews-heading">
      <h2 id="latest-interviews-heading" className={styles.heading}>
        <FormattedMessage id="interviews.latest.heading" />
      </h2>

      <div
        className={styles.carouselWrapper}
        data-can-prev={canPrev}
        data-can-next={canNext}
      >
        <button
          className={`${styles.arrow} ${styles.arrowPrev}`}
          onClick={() => scroll('prev')}
          aria-label={intl.formatMessage({ id: 'latestInterviews.prev' })}
          disabled={!canPrev}
        >
          ‹
        </button>

        <ul className={styles.track} ref={trackRef} onScroll={updateScrollState}>
          {latest.map((interview) => {
            const data = interview.interview_data;
            const authors = sortBySurname(data?.authors ?? []);
            const primaryAuthor = authors[0];
            const authorLabel = authors.length > 0
              ? authors.map(a => decodeHtmlEntities(a.name)).join(' & ')
              : decodeHtmlEntities(interview.title?.rendered ?? '');
            const photoSrc = primaryAuthor?.photo_square
              ? primaryAuthor.photo_square[0]
              : primaryAuthor?.photo
                ? primaryAuthor.photo[0]
                : null;
            const interviewerName = data?.interviewer_name ?? '';
            const initial = authorLabel.trim().charAt(0).toUpperCase();

            return (
              <li key={interview.id} className={styles.item}>
                <Link
                  to={`/interviews/${interview.slug}`}
                  className={styles.card}
                  aria-label={intl.formatMessage({ id: 'interviews.card.label' }, { name: authorLabel })}
                >
                  {photoSrc ? (
                    <div className={styles.photoCircle}>
                      <img src={photoSrc} alt={authorLabel} />
                    </div>
                  ) : (
                    <div className={styles.photoCircle} aria-hidden="true">
                      <span className={styles.initial}>{initial}</span>
                    </div>
                  )}
                  <span className={styles.cardName}>{authorLabel}</span>
                  {interviewerName && (
                    <span className={styles.interviewerLine}>
                      <FormattedMessage id="interviews.card.interviewedBy" values={{ name: interviewerName }} />
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          className={`${styles.arrow} ${styles.arrowNext}`}
          onClick={() => scroll('next')}
          aria-label={intl.formatMessage({ id: 'latestInterviews.next' })}
          disabled={!canNext}
        >
          ›
        </button>
      </div>
    </section>
  );
}
