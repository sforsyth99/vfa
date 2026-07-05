import { useParams } from 'react-router-dom';
import { useGetInterview } from '../api/interviews/useGetInterview.ts';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities.ts';
import styles from './Interview.module.css';

export default function InterviewPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: interview, isLoading, error } = useGetInterview({ slug: slug! });

  if (isLoading) return <div>Loading...</div>;
  if (error || !interview) return <div>Interview not found</div>;

  const { author_name, interviewer_name, author_bio_url, intro, author_photo, question, answer } =
    interview.interview_data;

  const displayName = author_name || decodeHtmlEntities(interview.title.rendered);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        {author_photo && (
          <div className={styles.photoWrap}>
            <img src={author_photo[0]} alt={displayName} className={styles.photo} />
          </div>
        )}
        <div className={styles.meta}>
          <p className={styles.eyebrow}>Q&amp;A</p>
          <h1 className={styles.authorName}>{displayName}</h1>
          {interviewer_name && (
            <p className={styles.interviewer}>Interviewed by {interviewer_name}</p>
          )}
          {intro && <p className={styles.intro}>{intro}</p>}
          {author_bio_url && (
            <a href={author_bio_url} className={styles.bioLink}>
              Read author bio →
            </a>
          )}
        </div>
      </header>

      <div className={styles.qa}>
        {question.map((q, i) => (
          <div key={i} className={styles.pair}>
            <div className={styles.question}>
              <span className={styles.qMark} aria-hidden="true">Q</span>
              <p className={styles.questionText}>{q}</p>
            </div>
            <div className={styles.answer}>
              <p className={styles.answerText}>{answer[i]}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
