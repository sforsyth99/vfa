import { Link, useParams } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { useGetPerson } from '../api/people/useGetPerson.ts';
import { useGetPersonEvents } from '../api/people/useGetPersonEvents.ts';
import { useGetPersonBooks } from '../api/people/useGetPersonBooks.ts';
import { useGetPersonInterviews } from '../api/people/useGetPersonInterview.ts';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities.ts';
import { usePageTitle } from '../utils/usePageTitle.ts';
import styles from './Person.module.css';

export default function PersonPage() {
  const intl = useIntl();
  const { slug } = useParams<{ slug: string }>();
  const { data: person, isLoading, error } = useGetPerson({ slug: slug! });
  const { data: events } = useGetPersonEvents(person?.id);
  const { data: books } = useGetPersonBooks(person?.id);
  const { data: interviews } = useGetPersonInterviews(person?.id);

  const name = decodeHtmlEntities(person?.title?.rendered ?? '');
  usePageTitle(person ? name : null);

  if (isLoading) return <div><FormattedMessage id="person.loading" /></div>;
  if (error || !person) return <div><FormattedMessage id="person.notFound" /></div>;

  const { alternate_name, name_pronunciation, bio, website_url, photo } = person.person_data;

  const firstBook = books?.[0];
  const photoSrc = photo ? photo[0].replace(/-\d+x\d+(\.[a-z]+)$/i, '$1') : null;
  const firstName = name.split(' ')[0];

  return (
    <main id="main-content" className={styles.page}>
      {events && events.length > 0 && (
        <div className={styles.eventFeatureCards}>
          {events.map((event) => (
            <Link
              key={event.id}
              to={`/festival-events/${event.slug}`}
              className={styles.eventFeatureCard}
            >
              <div className={styles.eventFeatureCardPhoto}>
                {photo && (
                  <div className={styles.eventFeatureCardPhotoLeft}>
                    <img
                      src={photoSrc!}
                      alt={name}
                      className={styles.eventFeatureCardAuthorPhoto}
                    />
                  </div>
                )}
                {firstBook?.cover_image && (
                  <img
                    src={firstBook.cover_image[0]}
                    alt={firstBook.title}
                    className={styles.eventFeatureCardBookCover}
                  />
                )}
              </div>
              <div className={styles.eventFeatureCardInfo}>
                <h2 className={styles.eventFeatureCardTitle}>{event.title}</h2>
                {event.event_date && (
                  <p className={styles.eventFeatureCardDate}>
                    {new Date(event.event_date + 'T00:00:00').toLocaleDateString('en-CA', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className={styles.profile}>
        <div className={styles.meta}>
          <p className={styles.eyebrow}><FormattedMessage id="person.eyebrow" /></p>
          <h1 className={styles.name}>{name}</h1>
          {name_pronunciation && <p className={styles.pronunciation}>{name_pronunciation}</p>}
          {alternate_name && <p className={styles.alternateName}>{alternate_name}</p>}

          {bio && <div className={styles.bio} dangerouslySetInnerHTML={{ __html: bio }} />}
          {website_url && (
            <a href={website_url} className={styles.websiteLink}>
              <FormattedMessage id="person.websiteLink" />
            </a>
          )}
          {interviews &&
            interviews.length > 0 &&
            interviews.map((interview) => (
              <Link
                key={interview.id}
                to={`/interviews/${interview.slug}`}
                className={styles.websiteLink}
              >
                {interview.book_title ? (
                  <FormattedMessage
                    id="person.interviewLink.withBook"
                    values={{ firstName, bookTitle: <em>{interview.book_title}</em> }}
                  />
                ) : interview.festival_year ? (
                  intl.formatMessage({ id: 'person.interviewLink.withYear' }, { year: interview.festival_year })
                ) : (
                  intl.formatMessage({ id: 'person.interviewLink.generic' })
                )}
              </Link>
            ))}
          {events &&
            events.length > 0 &&
            events.map((event) => (
              <Link
                key={event.id}
                to={`/festival-events/${event.slug}`}
                className={styles.websiteLink}
              >
                {intl.formatMessage({ id: 'person.eventLink' }, { firstName, eventTitle: event.title })}
              </Link>
            ))}
        </div>
      </div>

      {books &&
        books.length > 0 &&
        (() => {
          const regularBooks = books.filter((b) => !b.categories?.includes('children'));
          const kidsBooks = books.filter((b) => b.categories?.includes('children'));
          return (
            <>
              {regularBooks.length > 0 && (
                <section className={styles.section}>
                  <h2 className={styles.sectionHeading}>
                    <FormattedMessage id="person.section.books" />
                  </h2>
                  <div className={styles.bookGrid}>
                    {regularBooks.map((book) => (
                      <Link key={book.id} to={`/books/${book.slug}`} className={styles.bookCard}>
                        {book.cover_image ? (
                          <img
                            src={book.cover_image[0]}
                            alt={book.title}
                            className={styles.bookCover}
                          />
                        ) : (
                          <div className={styles.bookCoverPlaceholder} />
                        )}
                        <p className={styles.bookTitle}>{book.title}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
              {kidsBooks.length > 0 && (
                <section className={styles.section}>
                  <h2 className={styles.sectionHeading}>
                    <FormattedMessage id="person.section.kidsBooks" />
                  </h2>
                  <div className={styles.bookGrid}>
                    {kidsBooks.map((book) => (
                      <Link key={book.id} to={`/books/${book.slug}`} className={styles.bookCard}>
                        {book.cover_image ? (
                          <img
                            src={book.cover_image[0]}
                            alt={book.title}
                            className={styles.bookCover}
                          />
                        ) : (
                          <div className={styles.bookCoverPlaceholder} />
                        )}
                        <p className={styles.bookTitle}>{book.title}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </>
          );
        })()}
    </main>
  );
}
