import { useState, useMemo } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useGetInterviews } from '../../api/interviews/useGetInterviews';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities';
import { sortBySurname } from '../../utils/sortBySurname';
import { usePageTitle } from '../../utils/usePageTitle';
import { Container } from '../../components/Container/Container';
import { PageTitle } from '../../components/PageTitle/PageTitle';
import { QueryState } from '../../components/QueryState/QueryState';
import { AuthorFeatureCard } from '../../components/AuthorFeatureCard/AuthorFeatureCard';
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
        <ul className={styles.grid}>
          {filtered.map((interview) => {
            const data = interview.interview_data;
            const authors = sortBySurname(data?.authors ?? []);
            const primaryAuthor = authors[0];
            const authorLabel = authors.length > 0
              ? authors.map(a => a.name).join(' & ')
              : decodeHtmlEntities(interview.title?.rendered ?? '');
            const isKidfest = (primaryAuthor?.kidfest_years?.length ?? 0) > 0;
            const photo = (!isKidfest && primaryAuthor?.photo_square) || primaryAuthor?.photo;
            const bookCover = data?.book_cover;

            return (
              <li key={interview.id}>
                <AuthorFeatureCard
                  photoSrc={photo ? photo[0] : null}
                  photoAlt={authorLabel}
                  bookCoverSrc={bookCover ? bookCover[0] : null}
                  bookCoverAlt={data?.book_title ?? ''}
                  title={authorLabel}
                  to={`/interviews/${interview.slug}`}
                  contain={isKidfest}
                />
              </li>
            );
          })}
        </ul>
      )}
      </Container>
    </main>
  );
}
