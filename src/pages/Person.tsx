import { Link, useParams } from 'react-router-dom';
import { useGetPerson } from '../api/people/useGetPerson.ts';
import { useGetPersonEvents } from '../api/people/useGetPersonEvents.ts';
import { useGetPersonBooks } from '../api/people/useGetPersonBooks.ts';
import { useGetPersonInterviews } from '../api/people/useGetPersonInterview.ts';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities.ts';
import { usePageTitle } from '../utils/usePageTitle.ts';
import { BlurImageCard } from '../components/BlurImageCard.tsx';
import styles from './Person.module.css';

export default function PersonPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: person, isLoading, error } = useGetPerson({ slug: slug! });
  const { data: events } = useGetPersonEvents(person?.id);
  const { data: books } = useGetPersonBooks(person?.id);
  const { data: interviews } = useGetPersonInterviews(person?.id);

  const name = decodeHtmlEntities(person?.title?.rendered ?? '');
  usePageTitle(person ? name : null);

  if (isLoading) return <div>Loading...</div>;
  if (error || !person) return <div>Person not found</div>;

  const { alternate_name, name_pronunciation, bio, website_url, photo, kidfest_years } =
    person.person_data;
  const isKidfest = kidfest_years?.length > 0;

  const firstBook = books?.[0];

  return (
    <main id="main-content" className={styles.page}>
      {(photo || firstBook?.cover_image) && (
        <div className={styles.hero}>
          {photo && (
            <div className={styles.heroCard}>
              <BlurImageCard src={photo[0]} alt={name} contain />
            </div>
          )}
          {firstBook?.cover_image && (
            <div className={styles.heroCard}>
              <BlurImageCard src={firstBook.cover_image[0]} alt={firstBook.title} contain />
            </div>
          )}
        </div>
      )}

      <div className={styles.profile}>
        <div className={styles.meta}>
          <p className={styles.eyebrow}>Author</p>
          <h1 className={styles.name}>{name}</h1>
          {name_pronunciation && <p className={styles.pronunciation}>{name_pronunciation}</p>}
          {alternate_name && <p className={styles.alternateName}>{alternate_name}</p>}

          {bio && <div className={styles.bio} dangerouslySetInnerHTML={{ __html: bio }} />}
          {website_url && (
            <a href={website_url} className={styles.websiteLink}>
              Visit website →
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
                  <>
                    Read {name.split(' ')[0]} talk about <em>{interview.book_title}</em> →
                  </>
                ) : (
                  `Read ${interview.festival_year ? `${interview.festival_year} ` : ''}interview →`
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
                See {name.split(' ')[0]} at <em>{event.title}</em> →
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
                  <h2 className={styles.sectionHeading}>Books</h2>
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
                  <h2 className={styles.sectionHeading}>Children's Books</h2>
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
