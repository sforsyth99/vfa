import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { useGetInterviews } from '../../api/interviews/useGetInterviews';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities';
import { usePageTitle } from '../../utils/usePageTitle';
import { Container } from '../../components/Container/Container';
import { PageTitle } from '../../components/PageTitle/PageTitle';
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
    if (!activeYear) return interviews;
    return interviews.filter(i => i.interview_data?.festival_year === activeYear);
  }, [interviews, activeYear]);

  if (isLoading) return <div className={styles.state}><FormattedMessage id="interviews.loading" /></div>;
  if (isError) return <div className={styles.state}><FormattedMessage id="interviews.error" /></div>;
  if (!interviews?.length) return <div className={styles.state}><FormattedMessage id="interviews.empty" /></div>;

  return (
    <main id="main-content" className={styles.page}>
      <Container>
      <PageTitle><FormattedMessage id="interviews.heading" /></PageTitle>

      {years.length > 1 && (
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

      {filtered.length === 0 ? (
        <div className={styles.state}>
          <FormattedMessage id="interviews.emptyYear" values={{ year: activeYear }} />
        </div>
      ) : (
        <ul className={styles.list}>
          {filtered.map((interview) => {
            const data = interview.interview_data;
            const cover = data?.book_cover;
            const authors = data?.authors ?? [];
            const primaryAuthor = authors[0];
            const authorLabel = authors.length > 0
              ? authors.map(a => a.name).join(' & ')
              : decodeHtmlEntities(interview.title?.rendered ?? '');

            const rawText = (data?.intro || data?.question?.[0] || '').replace(/<[^>]+>/g, '').trim();
            const snippet = rawText.slice(0, 55);
            const isMissing = !snippet;

            const initials = authorLabel.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();

            return (
              <li key={interview.id}>
                <Link to={`/interviews/${interview.slug}`} className={styles.item}>
                  <div className={styles.authorPhoto}>
                    {primaryAuthor?.photo
                      ? <img src={primaryAuthor.photo[0]} alt="" aria-hidden="true" loading="lazy" />
                      : <div className={styles.authorPhotoPlaceholder} aria-hidden="true">{initials}</div>
                    }
                  </div>
                  {cover
                    ? <img src={cover[0]} alt="" className={styles.cover} loading="lazy" />
                    : <div className={styles.coverPlaceholder} aria-hidden="true" />
                  }
                  <div className={styles.itemText}>
                    <p className={styles.itemName}>{authorLabel}</p>
                    <p className={isMissing ? styles.itemMissing : styles.itemIntro}>
                      {isMissing ? 'No content yet.' : <>{snippet}{rawText.length > 55 ? '…' : ''}</>}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      </Container>
    </main>
  );
}
