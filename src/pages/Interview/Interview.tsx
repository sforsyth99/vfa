import { Link, useParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { useGetInterview } from '../../api/interviews/useGetInterview.ts';
import { useGetInterviews } from '../../api/interviews/useGetInterviews.ts';
import { useGetPersonEvents } from '../../api/people/useGetPersonEvents.ts';
import { useGetPersonBooks } from '../../api/people/useGetPersonBooks.ts';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities.ts';
import { EventInfoCard } from '../../components/EventInfoCard/EventInfoCard.tsx';
import { sortBySurname } from '../../utils/sortBySurname.ts';
import { sanitizeHtml } from '../../utils/sanitizeHtml.ts';
import { injectYouTubeEmbeds } from '../../utils/injectYouTubeEmbeds.ts';
import { injectApplePodcastEmbeds } from '../../utils/injectApplePodcastEmbeds.ts';
import { usePageTitle } from '../../utils/usePageTitle.ts';
import { track } from '../../utils/analytics.ts';
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
  const { data: allInterviews } = useGetInterviews();
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

  const festivalYear = interview.interview_data.festival_year;
  const isKidsInterview = interviewer_age != null;
  const yearPeers = (allInterviews ?? [])
    .filter((iv) =>
      iv.interview_data.festival_year === festivalYear &&
      festivalYear !== null &&
      (iv.interview_data.interviewer_age != null) === isKidsInterview,
    )
    .sort((a, b) => b.date.localeCompare(a.date));
  const currentIndex = yearPeers.findIndex((iv) => iv.slug === slug);
  const prevInterview = currentIndex > 0 ? yearPeers[currentIndex - 1] : yearPeers[yearPeers.length - 1];
  const nextInterview = currentIndex < yearPeers.length - 1 ? yearPeers[currentIndex + 1] : yearPeers[0];
  const showNav = yearPeers.length > 1 && currentIndex !== -1;

  const interviewNavName = (iv: typeof yearPeers[0]) => {
    const ivAuthors = sortBySurname(iv.interview_data.authors ?? []);
    return ivAuthors.length > 0 ? ivAuthors.map((a) => a.name).join(' & ') : decodeHtmlEntities(iv.title?.rendered ?? '');
  };

  return (
    <main id="main-content" className={styles.page}>
      <Container narrow>
        {showNav && (
          <nav className={styles.interviewNavTop} aria-label={intl.formatMessage({ id: 'interview.nav.label' })}>
            {prevInterview && (
              <Link to={`/interviews/${prevInterview.slug}`} className={`${styles.interviewNavTopLink} ${styles.interviewNavTopLinkPrev}`}
                onClick={() => track({ name: 'prev_next_nav', event_label: prevInterview.slug, event_location: 'top', content_type: 'interview' })}>
                <span className={styles.interviewNavArrow}>‹</span>
                {intl.formatMessage({ id: 'interview.nav.previous' })}
              </Link>
            )}
            {nextInterview && (
              <Link to={`/interviews/${nextInterview.slug}`} className={`${styles.interviewNavTopLink} ${styles.interviewNavTopLinkNext}`}
                onClick={() => track({ name: 'prev_next_nav', event_label: nextInterview.slug, event_location: 'top', content_type: 'interview' })}>
                {intl.formatMessage({ id: 'interview.nav.next' })}
                <span className={styles.interviewNavArrow}>›</span>
              </Link>
            )}
          </nav>
        )}
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
        {showNav && (
          <nav className={styles.interviewNav} aria-label={intl.formatMessage({ id: 'interview.nav.label' })}>
            <div className={styles.interviewNavPrevNext}>
              {prevInterview && (
                <Link to={`/interviews/${prevInterview.slug}`} className={styles.interviewNavPrev}
                  onClick={() => track({ name: 'prev_next_nav', event_label: prevInterview.slug, event_location: 'bottom', content_type: 'interview' })}>
                  <span className={styles.interviewNavArrow}>‹</span>
                  <span className={styles.interviewNavLabel}>
                    <span className={styles.interviewNavHint}>{intl.formatMessage({ id: 'interview.nav.previous' })}</span>
                    <span className={styles.interviewNavTitle}>{interviewNavName(prevInterview)}</span>
                  </span>
                </Link>
              )}
              {nextInterview && (
                <Link to={`/interviews/${nextInterview.slug}`} className={styles.interviewNavNext}
                  onClick={() => track({ name: 'prev_next_nav', event_label: nextInterview.slug, event_location: 'bottom', content_type: 'interview' })}>
                  <span className={styles.interviewNavLabel}>
                    <span className={styles.interviewNavHint}>{intl.formatMessage({ id: 'interview.nav.next' })}</span>
                    <span className={styles.interviewNavTitle}>{interviewNavName(nextInterview)}</span>
                  </span>
                  <span className={styles.interviewNavArrow}>›</span>
                </Link>
              )}
            </div>
          </nav>
        )}
      </Container>
    </main>
  );
}
