import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useGetInterviews } from '../../api/interviews/useGetInterviews';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities';
import { sortBySurname } from '../../utils/sortBySurname';
import { AuthorFeatureCard } from '../AuthorFeatureCard/AuthorFeatureCard';
import styles from './LatestInterviews.module.css';

const COUNT = 3;

export function LatestInterviews() {
  const { data: interviews, isLoading } = useGetInterviews();

  if (isLoading || !interviews?.length) return null;

  const latest = interviews.slice(0, COUNT);

  return (
    <section className={styles.section} aria-labelledby="latest-interviews-heading">
      <h2 id="latest-interviews-heading" className={styles.heading}>
        <FormattedMessage id="interviews.latest.heading" />
      </h2>

      <ul className={styles.grid}>
        {latest.map((interview) => {
          const data = interview.interview_data;
          const authors = sortBySurname(data?.authors ?? []);
          const primaryAuthor = authors[0];
          const authorLabel = authors.length > 0
            ? authors.map(a => a.name).join(' & ')
            : decodeHtmlEntities(interview.title?.rendered ?? '');

          const bookCover = interview.interview_data?.book_cover;
          return (
            <li key={interview.id}>
              <AuthorFeatureCard
                photoSrc={primaryAuthor?.photo ? primaryAuthor.photo[0] : null}
                photoAlt={authorLabel}
                bookCoverSrc={bookCover ? bookCover[0] : null}
                bookCoverAlt={interview.interview_data?.book_title ?? ''}
                title={authorLabel}
                to={`/interviews/${interview.slug}`}
              />
            </li>
          );
        })}
      </ul>

      <div className={styles.footer}>
        <Link to="/interviews" className={styles.viewAll}>
          <FormattedMessage id="interviews.latest.viewAll" />
        </Link>
      </div>
    </section>
  );
}
