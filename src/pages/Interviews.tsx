import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { useGetInterviews } from '../api/interviews/useGetInterviews';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities';
import { usePageTitle } from '../utils/usePageTitle';
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
      <h1 className={styles.heading}><FormattedMessage id="interviews.heading" /></h1>

      {years.length > 1 && (
        <div className={styles.yearFilter}>
          {years.map(year => (
            <button
              key={year}
              className={year === activeYear ? styles.yearButtonActive : styles.yearButton}
              onClick={() => setSelectedYear(year)}
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
            const cover = interview.interview_data?.book_cover;
            const authors = interview.interview_data?.authors ?? [];
            const authorLabel = authors.length > 0
              ? authors.map(a => a.name).join(' & ')
              : decodeHtmlEntities(interview.title?.rendered ?? '');
            return (
              <li key={interview.id}>
                <Link to={`/interviews/${interview.slug}`} className={styles.item}>
                  {cover && <img src={cover[0]} alt="" className={styles.cover} />}
                  <div className={styles.itemText}>
                    <p className={styles.itemName}>{authorLabel}</p>
                    {interview.interview_data?.intro && (
                      <p className={styles.itemIntro}>
                        {interview.interview_data.intro.replace(/<[^>]+>/g, '')}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
