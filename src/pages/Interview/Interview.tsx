import { Link, useParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { useGetInterview } from '../../api/interviews/useGetInterview.ts';
import { useGetPersonEvents } from '../../api/people/useGetPersonEvents.ts';
import { useGetPersonBooks } from '../../api/people/useGetPersonBooks.ts';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities.ts';
import { EventInfoCard } from '../../components/EventInfoCard/EventInfoCard.tsx';
import { sortBySurname } from '../../utils/sortBySurname.ts';
import { sanitizeHtml } from '../../utils/sanitizeHtml.ts';
import { injectYouTubeEmbeds } from '../../utils/injectYouTubeEmbeds.ts';
import { injectApplePodcastEmbeds } from '../../utils/injectApplePodcastEmbeds.ts';
import { usePageTitle } from '../../utils/usePageTitle.ts';
import { Container } from '../../components/Container/Container';
import { BookLink } from '../../components/BookLink/BookLink';
import { Eyebrow } from '../../components/Eyebrow/Eyebrow';
import { PageTitle } from '../../components/PageTitle/PageTitle';
import { PageLoader } from '../../components/PageLoader/PageLoader';
import styles from './Interview.module.css';


function richHtml(html: string): string {
  return injectApplePodcastEmbeds(injectYouTubeEmbeds(sanitizeHtml(html)));
}

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
  const authors = sortBySurname(interview?.interview_data?.authors ?? []);
  const primaryAuthor = authors[0];
  const { data: personEvents } = useGetPersonEvents(primaryAuthor?.id);
  const { data: personBooks } = useGetPersonBooks(primaryAuthor?.id);
  const authorNames =
    authors.map((a) => a.name).join(' & ') || decodeHtmlEntities(interview?.title?.rendered ?? '');
  usePageTitle(
    authorNames ? intl.formatMessage({ id: 'interview.pageTitle' }, { name: authorNames }) : null,
  );

  if (isLoading) return <PageLoader />;
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
  const today = new Date().toISOString().slice(0, 10);
  const upcomingEvents = personEvents?.filter((e) => e.event_date >= today) ?? [];
  const { book_title } = interview.interview_data;
  const linkedBook = personBooks?.find((b) =>
    book_title ? b.title.toLowerCase() === book_title.toLowerCase() : true,
  ) ?? personBooks?.[0];

  return (
    <main id="main-content" className={styles.page}>
      <Container narrow>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <Eyebrow><FormattedMessage id="interview.eyebrow" /></Eyebrow>
          <PageTitle>{displayName}</PageTitle>
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
              linkedBook ? (
                <BookLink slug={linkedBook.slug} munrosUrl={linkedBook.munros_url} bookTitle={book_title ?? undefined} className={styles.headerImgLink}>
                  <img src={book_cover[0]} alt={intl.formatMessage({ id: 'interview.bookCoverAlt' })} className={styles.headerImg} />
                </BookLink>
              ) : (
                <img src={book_cover[0]} alt={intl.formatMessage({ id: 'interview.bookCoverAlt' })} className={styles.headerImg} />
              )
            )}
          </div>

          {upcomingEvents.length > 0 && (
            <div className={styles.eventCards}>
              {upcomingEvents.map((event) => (
                <EventInfoCard key={event.id} event={event} name={displayName} />
              ))}
            </div>
          )}
        </div>

        {authors.length > 0 && (
          <div className={styles.bioLinks}>
            {authors.map((a) => (
              <Link key={a.id} to={`/people/${a.slug}`} className={styles.bioLink}>
                {intl.formatMessage({ id: 'interview.readBio' }, { name: a.name })}
              </Link>
            ))}
          </div>
        )}
      </header>

      {intro && <div className={styles.intro} dangerouslySetInnerHTML={{ __html: richHtml(intro) }} />}

      <div className={styles.qa}>
        {question.map((q, i) => {
          const a = answer?.[i] ?? '';
          const img = question_image?.[i];
          const hasQ = !!q?.trim();
          const hasA = !!a?.trim();
          if (!hasQ && !hasA) return null;
          return (
            <div key={i} className={styles.pair}>
              {hasQ && (
                <div className={styles.question}>
                  <span className={styles.qMark}>
                    {i === 0 && interviewer_name
                      ? `${interviewer_name} (${interviewerInitials}):`
                      : `${interviewerInitials}:`}
                  </span>
                  <div className={styles.qText} dangerouslySetInnerHTML={{ __html: sanitizeHtml(q) }} />
                </div>
              )}
              {hasA && (
                <div className={styles.answer}>
                  <span className={styles.aMark}>
                    {i === 0 ? `${displayName} (${authorInitials}):` : `${authorInitials}:`}
                  </span>
                  <div className={styles.aText} dangerouslySetInnerHTML={{ __html: richHtml(a) }} />
                </div>
              )}
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
          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(interviewer_bio) }} />
        </div>
      )}
      </Container>
    </main>
  );
}
