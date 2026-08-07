import { useState, useMemo } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { useGetInterviews } from '../../api/interviews/useGetInterviews';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities';
import { sortBySurname } from '../../utils/sortBySurname';
import { usePageTitle } from '../../utils/usePageTitle';
import { Container } from '../../components/Container/Container';
import { PageTitle } from '../../components/PageTitle/PageTitle';
import { QueryState } from '../../components/QueryState/QueryState';
import styles from './Interviews.module.css';

export default function InterviewsPage() {
  const intl = useIntl();
  usePageTitle(intl.formatMessage({ id: 'interviews.heading' }));
  const { data: interviews, isLoading, isError } = useGetInterviews();

  const years = useMemo(() => {
    if (!interviews) return [];
    const set = new Set(interviews.map(i => i.interview_data?.festival_year).filter(Boolean) as number[]);
    return Array.from(set).sort((a, b) => b - a);
  }, [interviews]);

  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const currentYear = years[0] ?? null;
  const activeYear = selectedYear ?? currentYear;

  const filtered = useMemo(() => {
    if (!interviews) return [];
    const byYear = !activeYear ? interviews : interviews.filter(i => i.interview_data?.festival_year === activeYear);
    return [...byYear].sort((a, b) => {
      const surnameOf = (iv: typeof a) => {
        const name = sortBySurname(iv.interview_data?.authors ?? [])[0]?.name ?? iv.title?.rendered ?? '';
        return name.split(' ').slice(-1)[0].toLowerCase();
      };
      return surnameOf(a).localeCompare(surnameOf(b));
    });
  }, [interviews, activeYear]);

  const adultInterviews = useMemo(() => filtered.filter(i => (i.interview_data?.authors?.[0]?.kidfest_years?.length ?? 0) === 0), [filtered]);
  const kidsInterviews = useMemo(() => filtered.filter(i => (i.interview_data?.authors?.[0]?.kidfest_years?.length ?? 0) > 0), [filtered]);

  return (
    <main id="main-content" className={styles.page}>
      <Container>
        <PageTitle><FormattedMessage id="interviews.heading" /></PageTitle>

        <QueryState isLoading={isLoading} isError={isError} isEmpty={!isLoading && !isError && !interviews?.length} loadingId="interviews.loading" errorId="interviews.error" emptyId="interviews.empty" />

        {interviews && interviews.length > 0 && years.length > 1 && (
          <div className={styles.yearFilter} role="group" aria-label={intl.formatMessage({ id: 'interviews.yearFilter.label' })}>
            {years.map(year => (
              <button
                key={year}
                className={year === activeYear ? styles.yearButtonActive : styles.yearButton}
                onClick={() => setSelectedYear(year)}
                aria-pressed={year === activeYear}
              >
                {year}
              </button>
            ))}
          </div>
        )}

        {interviews && interviews.length > 0 && filtered.length === 0 && (
          <QueryState isLoading={false} isError={false} isEmpty={true} loadingId="interviews.loading" emptyId="interviews.emptyYear" emptyValues={{ year: activeYear ?? '' }} />
        )}

        {interviews && interviews.length > 0 && filtered.length > 0 && (
          <>
            {adultInterviews.length > 0 && (
              <ul className={styles.grid}>
                {adultInterviews.map((interview) => {
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
                    <li key={interview.id}>
                      <Link
                        to={`/interviews/${interview.slug}`}
                        className={styles.interviewCard}
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
            )}

            {kidsInterviews.length > 0 && (
              <section className={styles.kidsSection} aria-labelledby="kids-interviews-heading">
                <h2 id="kids-interviews-heading" className={styles.kidsHeading}>
                  <FormattedMessage id="interviews.kids.heading" />
                </h2>
                <ul className={styles.kidsGrid}>
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
                      <li key={interview.id}>
                        <Link
                          to={`/interviews/${interview.slug}`}
                          className={styles.kidsCard}
                          aria-label={intl.formatMessage({ id: 'interviews.card.label' }, { name: authorLabel })}
                        >
                          {photoSrc ? (
                            <img src={photoSrc} alt={authorLabel} className={styles.kidsPhoto} />
                          ) : (
                            <div className={styles.kidsPhotoPlaceholder} aria-hidden="true" />
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
              </section>
            )}
          </>
        )}
      </Container>
    </main>
  );
}
