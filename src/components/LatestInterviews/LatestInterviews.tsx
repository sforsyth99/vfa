import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useGetInterviews } from '../../api/interviews/useGetInterviews';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities';
import { sortBySurname } from '../../utils/sortBySurname';
import styles from './LatestInterviews.module.css';

const COUNT = 3;

export function LatestInterviews() {
  const { data: interviews, isLoading } = useGetInterviews();

  if (isLoading || !interviews?.length) return null;

  const latest = interviews.slice(0, COUNT);

  return (
    <section className={styles.section} aria-labelledby="latest-interviews-heading">
      <div className={styles.header}>
        <h2 id="latest-interviews-heading" className={styles.heading}>
          <FormattedMessage id="interviews.latest.heading" />
        </h2>
        <Link to="/interviews" className={styles.viewAll}>
          <FormattedMessage id="interviews.latest.viewAll" />
        </Link>
      </div>

      <ul className={styles.list}>
        {latest.map((interview) => {
          const data = interview.interview_data;
          const authors = sortBySurname(data?.authors ?? []);
          const primaryAuthor = authors[0];
          const authorLabel = authors.length > 0
            ? authors.map(a => a.name).join(' & ')
            : decodeHtmlEntities(interview.title?.rendered ?? '');
          const rawText = (data?.intro || data?.question?.[0] || '').replace(/<[^>]+>/g, '').trim();
          const snippet = rawText.slice(0, 120);
          const initials = authorLabel.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();

          return (
            <li key={interview.id}>
              <Link to={`/interviews/${interview.slug}`} className={styles.item}>
                <div className={styles.photo}>
                  {primaryAuthor?.photo
                    ? <img src={primaryAuthor.photo[0]} alt="" aria-hidden="true" loading="lazy" />
                    : <div className={styles.photoPlaceholder} aria-hidden="true">{initials}</div>
                  }
                </div>
                <div className={styles.text}>
                  <p className={styles.name}>{authorLabel}</p>
                  {snippet && (
                    <p className={styles.snippet}>
                      {snippet}{rawText.length > 120 ? '…' : ''}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
