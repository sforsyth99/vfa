import { Link } from 'react-router-dom';
import { useGetInterviews } from '../api/interviews/useGetInterviews';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities';
import { usePageTitle } from '../utils/usePageTitle';
import styles from './Interviews.module.css';

export default function InterviewsPage() {
  usePageTitle('Interviews');
  const { data: interviews, isLoading, isError } = useGetInterviews();

  if (isLoading) return <div className={styles.state}>Loading interviews...</div>;
  if (isError) return <div className={styles.state}>Error loading interviews.</div>;
  if (!interviews?.length) return <div className={styles.state}>No interviews yet.</div>;

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Interviews</h1>
      <ul className={styles.list}>
        {interviews.map((interview) => {
          const cover = interview.interview_data?.book_cover;
          const author = interview.interview_data?.author;
          return (
            <li key={interview.id}>
              <Link to={`/interviews/${interview.slug}`} className={styles.item}>
                {cover && <img src={cover[0]} alt="" className={styles.cover} />}
                <div className={styles.itemText}>
                  <p className={styles.itemName}>{author?.name ?? decodeHtmlEntities(interview.title?.rendered ?? '')}</p>
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
    </main>
  );
}
