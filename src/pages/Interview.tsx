import { useParams, Link } from 'react-router-dom';
import { useGetInterview } from '../api/interviews/useGetInterview.ts';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities.ts';
import styles from './Interview.module.css';

export default function InterviewPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: interview, isLoading, error } = useGetInterview({ slug: slug! });

  if (isLoading) return <div>Loading...</div>;
  if (error || !interview) return <div>Interview not found</div>;

  const { author, interviewer_name, intro, question, answer, question_image } =
    interview.interview_data;

  const displayName = author?.name || decodeHtmlEntities(interview.title?.rendered ?? '');

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        {author?.photo && (
          <div className={styles.photoWrap}>
            <img src={author.photo[0]} alt={displayName} className={styles.photo} />
          </div>
        )}
        <div className={styles.meta}>
          <p className={styles.eyebrow}>Q&amp;A</p>
          <h1 className={styles.authorName}>{displayName}</h1>
          {interviewer_name && (
            <p className={styles.interviewer}>Interviewed by {interviewer_name}</p>
          )}
          {intro && <p className={styles.intro}>{intro}</p>}
          {author?.slug && (
            <Link to={`/people/${author.slug}`} className={styles.bioLink}>
              Read author bio →
            </Link>
          )}
        </div>
      </header>

      <div className={styles.qa}>
        {question.map((q, i) => {
          const img = question_image?.[i];
          return (
            <div key={i} className={styles.pair}>
              <div className={styles.question}>
                <span className={styles.qMark} aria-hidden="true">Q</span>
                <p className={styles.questionText}>{q}</p>
              </div>
              <div className={styles.answer}>
                <p className={styles.answerText}>{answer[i]}</p>
              </div>
              {img && (
                <img src={img[0]} alt="" className={styles.pairImage} />
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
