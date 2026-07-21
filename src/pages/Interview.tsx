import { useParams, Link } from 'react-router-dom';
import { useGetInterview } from '../api/interviews/useGetInterview.ts';
import { useGetPersonEvents } from '../api/people/useGetPersonEvents.ts';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities.ts';
import { usePageTitle } from '../utils/usePageTitle.ts';
import styles from './Interview.module.css';

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export default function InterviewPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: interview, isLoading, error } = useGetInterview({ slug: slug! });
  const authors = interview?.interview_data?.authors ?? [];
  const primaryAuthor = authors[0];
  const { data: personEvents } = useGetPersonEvents(primaryAuthor?.id);
  const authorNames = authors.map(a => a.name).join(' & ') || decodeHtmlEntities(interview?.title?.rendered ?? '');
  usePageTitle(authorNames ? `Interview with ${authorNames}` : null);

  if (isLoading) return <div>Loading...</div>;
  if (error || !interview) return <div>Interview not found</div>;

  const { interviewer_name, intro, book_cover, question, answer, question_image } =
    interview.interview_data;

  const displayName = authorNames;
  const authorInitials = getInitials(primaryAuthor?.name || displayName);
  const interviewerInitials = interviewer_name ? getInitials(interviewer_name) : 'Q';

  const today = new Date().toISOString().slice(0, 10);
  const upcomingEvents = personEvents?.filter((e) => e.event_date >= today) ?? [];

  return (
    <main id="main-content" className={styles.page}>
      <header className={styles.header}>
        <div className={styles.imageGroup}>
          {primaryAuthor?.photo && (
            <div className={styles.photoWrap}>
              <img
                src={primaryAuthor.photo[0]}
                alt={displayName}
                className={primaryAuthor.kidfest_years?.length > 0 ? styles.photoContain : styles.photo}
              />
            </div>
          )}
          {book_cover && (
            <div className={styles.bookWrap}>
              <img src={book_cover[0]} alt="Book cover" className={styles.bookCover} />
            </div>
          )}
        </div>

        <div className={styles.meta}>
          <p className={styles.eyebrow}>Q&amp;A</p>
          <h1 className={styles.authorName}>{displayName}</h1>
          {interviewer_name && (
            <p className={styles.interviewer}>Interviewed by {interviewer_name}</p>
          )}
          {upcomingEvents.length > 0 && (
            <div className={styles.eventCards}>
              {upcomingEvents.map((event) => (
                <div key={event.id} className={styles.eventCard}>
                  <div className={styles.eventCardText}>
                    <p className={styles.eventCardEyebrow}>See {displayName.split(' ')[0]} live</p>
                    <p className={styles.eventCardTitle}>
                      <Link to={`/festival-events/${event.slug}`}>{event.title}</Link>
                    </p>
                    {event.event_date && (
                      <p className={styles.eventCardDate}>
                        {new Date(event.event_date + 'T00:00:00').toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' })}
                        {event.time_start && ` · ${event.time_start} PT`}
                      </p>
                    )}
                  </div>
                  {event.eventbrite_url && (
                    <a
                      href={event.eventbrite_url}
                      className={styles.eventCardButton}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get tickets
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {intro && <div className={styles.intro} dangerouslySetInnerHTML={{ __html: intro }} />}

      <div className={styles.qa}>
        {question.map((q, i) => {
          const img = question_image?.[i];
          return (
            <div key={i} className={styles.pair}>
              <div className={styles.question}>
                <span className={styles.qMark} aria-hidden="true">{interviewerInitials}</span>
                <div className={styles.qText} dangerouslySetInnerHTML={{ __html: q }} />
              </div>
              <div className={styles.answer}>
                <span className={styles.aMark} aria-hidden="true">{authorInitials}</span>
                <div className={styles.aText} dangerouslySetInnerHTML={{ __html: answer[i] }} />
              </div>
              {img && (
                <img src={img[0]} alt="" className={styles.pairImage} />
              )}
            </div>
          );
        })}
      </div>

      {authors.length > 0 && (
        <div className={styles.bioLinks}>
          {authors.map(a => (
            <Link key={a.id} to={`/people/${a.slug}`} className={styles.bioLink}>
              Read {a.name}'s bio →
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
