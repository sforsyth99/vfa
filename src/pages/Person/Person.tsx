import { Link, useParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { useGetPerson } from '../../api/people/useGetPerson.ts';
import { useGetPersonEvents } from '../../api/people/useGetPersonEvents.ts';
import { useGetPersonBooks } from '../../api/people/useGetPersonBooks.ts';
import { type PersonInterview, useGetPersonInterviews, } from '../../api/people/useGetPersonInterview.ts';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities.ts';
import { sanitizeHtml } from '../../utils/sanitizeHtml';
import { isSafeUrl } from '../../utils/isSafeUrl.ts';
import { usePageTitle } from '../../utils/usePageTitle.ts';
import { BookLink } from '../../components/BookLink/BookLink.tsx';
import { EventInfoCard } from '../../components/EventInfoCard/EventInfoCard.tsx';
import { Container } from '../../components/Container/Container';
import { Eyebrow } from '../../components/Eyebrow/Eyebrow';
import { PageTitle } from '../../components/PageTitle/PageTitle';
import { PageLoader } from '../../components/PageLoader/PageLoader';
import styles from './Person.module.css';

interface AuthorMetaProps {
  name: string;
  firstName: string;
  name_pronunciation?: string | null;
  alternate_name?: string | null;
  bio?: string | null;
  website_url?: string | null;
  interviews?: PersonInterview[];
}

function AuthorMeta({
  name,
  firstName,
  name_pronunciation,
  alternate_name,
  bio,
  website_url,
  interviews,
}: AuthorMetaProps) {
  const intl = useIntl();
  const hasLinks = (website_url && isSafeUrl(website_url)) || (interviews && interviews.length > 0);
  return (
    <>
      <Eyebrow>
        <FormattedMessage id="person.eyebrow" />
      </Eyebrow>
      <PageTitle>{name}</PageTitle>
      {name_pronunciation && <p className={styles.pronunciation}>{name_pronunciation}</p>}
      {alternate_name && <p className={styles.alternateName}>{alternate_name}</p>}
      {bio && (
        <div className={styles.bio} dangerouslySetInnerHTML={{ __html: sanitizeHtml(bio) }} />
      )}
      {hasLinks && (
        <div className={styles.metaLinks}>
          {website_url && isSafeUrl(website_url) && (
            <a
              href={website_url}
              className={styles.metaLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FormattedMessage id="person.websiteLink" />
            </a>
          )}
          {interviews &&
            interviews.length > 0 &&
            interviews.map((interview) => (
              <Link
                key={interview.id}
                to={`/interviews/${interview.slug}`}
                className={styles.metaLink}
              >
                {interview.book_title ? (
                  <FormattedMessage
                    id="person.interviewLink.withBook"
                    values={{ firstName, bookTitle: <em>{interview.book_title}</em> }}
                  />
                ) : interview.festival_year ? (
                  intl.formatMessage(
                    { id: 'person.interviewLink.withYear' },
                    { year: interview.festival_year, firstName },
                  )
                ) : (
                  intl.formatMessage({ id: 'person.interviewLink.generic' })
                )}
              </Link>
            ))}
        </div>
      )}
    </>
  );
}

export default function PersonPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: person, isLoading, error } = useGetPerson({ slug: slug! });
  const { data: events } = useGetPersonEvents(person?.id);
  const { data: books } = useGetPersonBooks(person?.id);
  const { data: interviews } = useGetPersonInterviews(person?.id);

  const name = decodeHtmlEntities(person?.title?.rendered ?? '');
  usePageTitle(person ? name : null);

  if (isLoading) return <PageLoader />;
  if (error || !person)
    return (
      <div>
        <FormattedMessage id="person.notFound" />
      </div>
    );

  const {
    alternate_name,
    name_pronunciation,
    bio,
    website_url,
    photo,
    kidfest_years,
    kidfest_photo,
  } = person.person_data;

  const isKidfest = kidfest_years?.length > 0;
  const kidsBooks = (books ?? []).filter(
    (b): b is typeof b & { cover_image: [string, number, number, boolean] } => !!b.cover_image,
  );
  const photoSrc = photo ? photo[0].replace(/-\d+x\d+(\.[a-z]+)$/i, '$1') : null;
  const kidfestPhotoSrc = kidfest_photo
    ? kidfest_photo[0].replace(/-\d+x\d+(\.[a-z]+)$/i, '$1')
    : null;
  const firstName = name.split(' ')[0];

  const displayBooks = isKidfest ? [] : (books ?? []).filter((b) => b.cover_image);
  const adultEvents = isKidfest ? [] : (events ?? []);
  const showBottomCards = isKidfest || displayBooks.length > 0 || adultEvents.length > 0;

  return (
    <main id="main-content" className={styles.page}>
      {/* ── Hero: narrow two-column ───────────────────── */}
      <Container narrow>
        {isKidfest && (kidfestPhotoSrc || kidsBooks.length > 0) && (
          <div className={styles.kidsHero}>
            {kidfestPhotoSrc && (
              <img src={kidfestPhotoSrc} alt={name} className={styles.kidsHeroImg} />
            )}
            {kidsBooks.map((book) => (
              <BookLink key={book.id} slug={book.slug} munrosUrl={book.munros_url}>
                <img src={book.cover_image[0]} alt={book.title} className={styles.kidsHeroImg} />
              </BookLink>
            ))}
          </div>
        )}

        <div className={!isKidfest && photoSrc ? styles.adultHero : styles.profile}>
          {!isKidfest && photoSrc && (
            <div className={styles.photoCol}>
              <img src={photoSrc} alt={name} className={styles.authorPhoto} loading="eager" />
            </div>
          )}
          <div className={styles.meta}>
            <AuthorMeta
              name={name}
              firstName={firstName}
              name_pronunciation={name_pronunciation}
              alternate_name={alternate_name}
              bio={bio}
              website_url={website_url}
              interviews={interviews}
            />
          </div>
        </div>
      </Container>

      {/* ── Full-width: events + books ────────────────── */}
      {showBottomCards && (
        <Container narrow className={styles.bottomSection}>
          <div className={styles.bottomCards}>
            {displayBooks.length > 0 && (
              <div
                className={`${styles.booksCol}${adultEvents.length > 1 ? ` ${styles.booksColTop}` : ''}`}
              >
                {displayBooks.map((book) => (
                  <BookLink
                    key={book.id}
                    slug={book.slug}
                    munrosUrl={book.munros_url}
                    className={styles.bookCard}
                  >
                    <img
                      src={(book.cover_image as [string, number, number, boolean])[0]}
                      alt={book.title}
                      className={styles.bookCoverImg}
                      loading="lazy"
                    />
                    <span className={styles.bookCta}>
                      {book.munros_url ? (
                        <FormattedMessage
                          id="person.bookBuy"
                          values={{ bookTitle: <em>{book.title}</em> }}
                        />
                      ) : (
                        <FormattedMessage id="person.bookLearnMore" />
                      )}
                    </span>
                  </BookLink>
                ))}
              </div>
            )}
            {adultEvents.length > 0 && (
              <div className={styles.eventsCol}>
                {adultEvents.map((event) => (
                  <EventInfoCard key={event.id} event={event} name={name} />
                ))}
              </div>
            )}
            {isKidfest && (
              <div className={styles.eventsCol}>
                <div className={styles.kidsfestCard}>
                  <p className={styles.kidsfestCardEyebrow}>
                    <FormattedMessage id="person.kidsfestCard.eyebrow" values={{ firstName: name }} />
                  </p>
                  <p className={styles.kidsfestCardTitle}>
                    <FormattedMessage id="kidsfest.heading" />
                  </p>
                  <p className={styles.kidsfestCardDate}>
                    <FormattedMessage id="kidsfest.date" />
                    {' · '}
                    <FormattedMessage id="kidsfest.time" />
                  </p>
                  <p className={styles.kidsfestCardDate}>
                    <FormattedMessage id="kidsfest.venue" />
                  </p>
                  <Link to="/kidsfest2026" className={styles.kidsfestCardButton}>
                    <FormattedMessage id="person.kidsfestCard.cta" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </Container>
      )}
    </main>
  );
}
