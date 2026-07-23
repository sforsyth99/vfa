import { Link, useParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
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
  const intl = useIntl();
  const { slug } = useParams<{ slug: string }>();
  const { data: interview, isLoading, error } = useGetInterview({ slug: slug! });
  const authors = interview?.interview_data?.authors ?? [];
  const primaryAuthor = authors[0];
  const { data: personEvents } = useGetPersonEvents(primaryAuthor?.id);
  const authorNames =
    authors.map((a) => a.name).join(' & ') || decodeHtmlEntities(interview?.title?.rendered ?? '');
  usePageTitle(
    authorNames ? intl.formatMessage({ id: 'interview.pageTitle' }, { name: authorNames }) : null,
  );

  if (isLoading)
    return (
      <div>
        <FormattedMessage id="interview.loading" />
      </div>
    );
  if (error || !interview)
    return (
      <div>
        <FormattedMessage id="interview.notFound" />
      </div>
    );

  const {
    interviewer_name,
    interviewer_bio,
    intro,
    book_cover,
    question,
    answer,
    question_image,
    interviewer_age,
  } = interview.interview_data;

  const displayName = authorNames;
  const authorInitials = getInitials(primaryAuthor?.name || displayName);
  const interviewerInitials = interviewer_name ? getInitials(interviewer_name) : 'Q';
  const firstName = displayName.split(' ')[0];

  const today = new Date().toISOString().slice(0, 10);
  const upcomingEvents = personEvents?.filter((e) => e.event_date >= today) ?? [];

  return (
    <main id="main-content" className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <p className={styles.eyebrow}>
            <FormattedMessage id="interview.eyebrow" />
          </p>
          <h1 className={styles.authorName}>{displayName}</h1>
          {interviewer_name && (
            <p className={styles.interviewer}>
              {intl.formatMessage({ id: 'interview.interviewedBy' }, { name: interviewer_name })}
              {interviewer_age != null && `, age ${interviewer_age}`}
            </p>
          )}
        </div>

        <div className={styles.visualRow}>
          <div className={styles.imageGroup}>
            {primaryAuthor?.photo && (
              <img src={primaryAuthor.photo[0]} alt={displayName} className={styles.headerImg} />
            )}
            {book_cover && (
              <img src={book_cover[0]} alt={intl.formatMessage({ id: 'book.eyebrow' })} className={styles.headerImg} />
            )}
          </div>

          {upcomingEvents.length > 0 && (
          <div className={styles.eventCards}>
            {upcomingEvents.map((event) => (
              <div key={event.id} className={styles.eventCard}>
                <p className={styles.eventCardEyebrow}>
                  {intl.formatMessage({ id: 'interview.seeLive' }, { firstName })}
                </p>
                <p className={styles.eventCardTitle}>
                  <Link to={`/festival-events/${event.slug}`}>{event.title}</Link>
                </p>
                {event.event_date && (
                  <p className={styles.eventCardDate}>
                    {new Date(event.event_date + 'T00:00:00').toLocaleDateString('en-CA', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                    {event.time_start && ` · ${event.time_start} PT`}
                  </p>
                )}
                {event.venue_name && (
                  <p className={styles.eventCardVenue}>{event.venue_name}</p>
                )}
                {event.eventbrite_url ? (
                  <a
                    href={event.eventbrite_url}
                    className={styles.eventCardButton}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FormattedMessage id="interview.getTickets" />
                  </a>
                ) : (
                  <Link to={`/festival-events/${event.slug}`} className={styles.eventCardButton}>
                    <FormattedMessage id="interview.learnMore" />
                  </Link>
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
                <span className={styles.qMark} aria-hidden="true">
                  {i === 0 && interviewer_name
                    ? `${interviewer_name} (${interviewerInitials}):`
                    : `${interviewerInitials}:`}
                </span>
                <div className={styles.qText} dangerouslySetInnerHTML={{ __html: q }} />
              </div>
              <div className={styles.answer}>
                <span className={styles.aMark} aria-hidden="true">
                  {i === 0 ? `${displayName} (${authorInitials}):` : `${authorInitials}:`}
                </span>
                <div className={styles.aText} dangerouslySetInnerHTML={{ __html: answer[i] }} />
              </div>
              {img && <img src={img[0]} alt="" className={styles.pairImage} />}
            </div>
          );
        })}
      </div>

      {interviewer_bio && (
        <div className={styles.interviewerBio}>
          <p className={styles.interviewerBioLabel}>
            <FormattedMessage id="interview.interviewerBio" />
            {interviewer_name && `: ${interviewer_name}`}{interviewer_age != null && `, age ${interviewer_age}`}
          </p>
          <div dangerouslySetInnerHTML={{ __html: interviewer_bio }} />
        </div>
      )}

      {authors.length > 0 && (
        <div className={styles.bioLinks}>
          {authors.map((a) => (
            <Link key={a.id} to={`/people/${a.slug}`} className={styles.bioLink}>
              {intl.formatMessage({ id: 'interview.readBio' }, { name: a.name })}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
