import { useRef, useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { useGetInterviews } from '../../api/interviews/useGetInterviews';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities';
import { sortBySurname } from '../../utils/sortBySurname';
import { SkeletonBlock } from '../Skeleton/Skeleton';
import styles from './KidsFestInterviews.module.css';

export function KidsFestInterviews() {
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

  if (isLoading) {
    return (
      <section className={styles.section} aria-busy="true">
        <SkeletonBlock className={styles.skeletonEyebrow} />
        <SkeletonBlock className={styles.skeletonHeading} />
        <SkeletonBlock className={styles.skeletonBlurb} />
        <SkeletonBlock className={styles.skeletonBlurbShort} />
        <div className={styles.skeletonTrack}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.skeletonItem}>
              <SkeletonBlock className={styles.skeletonPhoto} />
              <SkeletonBlock className={styles.skeletonName} />
              <SkeletonBlock className={styles.skeletonByline} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!interviews?.length) return null;

  const kidsInterviews = interviews.filter(
    (i) => (i.interview_data?.authors?.[0]?.kidfest_years?.length ?? 0) > 0,
  );

  if (!kidsInterviews.length) return null;

  const scroll = (dir: 'prev' | 'next') => {
    if (!trackRef.current) return;
    const amount = trackRef.current.clientWidth * 0.75;
    trackRef.current.scrollBy({ left: dir === 'next' ? amount : -amount, behavior: 'smooth' });
  };

  return (
    <section className={styles.section} aria-labelledby="kidsfest-interviews-heading">
      <p className={styles.eyebrow}>
        <FormattedMessage id="kidsfestInterviews.eyebrow" />
      </p>
      <h2 id="kidsfest-interviews-heading" className={styles.heading}>
        <FormattedMessage id="kidsfestInterviews.heading" />
      </h2>
      <p className={styles.blurb}>
        <FormattedMessage id="kidsfestInterviews.blurb" />
      </p>

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
          {kidsInterviews.map((interview) => {
            const data = interview.interview_data;
            const authors = sortBySurname(data?.authors ?? []);
            const primaryAuthor = authors[0];
            const authorLabel = authors.length > 0
              ? authors.map(a => decodeHtmlEntities(a.name)).join(' & ')
              : decodeHtmlEntities(interview.title?.rendered ?? '');
            const photoSrc = primaryAuthor?.photo ? primaryAuthor.photo[0] : null;
            const interviewerName = data?.interviewer_name ?? '';
            const interviewerAge = data?.interviewer_age ?? null;

            return (
              <li key={interview.id} className={styles.item}>
                <Link
                  to={`/interviews/${interview.slug}`}
                  className={styles.card}
                  aria-label={intl.formatMessage({ id: 'interviews.card.label' }, { name: authorLabel })}
                >
                  {photoSrc ? (
                    <div className={styles.polaroid}>
                      <img src={photoSrc} alt={authorLabel} className={styles.photo} loading="lazy" />
                    </div>
                  ) : (
                    <div className={styles.photoPlaceholder} aria-hidden="true" />
                  )}
                  <span className={styles.cardName}>{authorLabel}</span>
                  {interviewerName && (
                    <span className={styles.interviewerLine}>
                      <FormattedMessage
                        id={interviewerAge ? 'interviews.card.interviewedByAge' : 'interviews.card.interviewedBy'}
                        values={{ name: interviewerName, age: interviewerAge }}
                      />
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
