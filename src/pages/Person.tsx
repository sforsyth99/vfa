import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useGetPerson } from '../api/people/useGetPerson.ts';
import { useGetPersonEvents } from '../api/people/useGetPersonEvents.ts';
import { useGetPersonBooks } from '../api/people/useGetPersonBooks.ts';
import { useGetPersonInterview } from '../api/people/useGetPersonInterview.ts';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities.ts';
import { usePageTitle } from '../utils/usePageTitle.ts';
import styles from './Person.module.css';

export default function PersonPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: person, isLoading, error } = useGetPerson({ slug: slug! });
  const { data: events } = useGetPersonEvents(person?.id);
  const { data: books } = useGetPersonBooks(person?.id);
  const { data: interview } = useGetPersonInterview(person?.id);

  const name = decodeHtmlEntities(person?.title?.rendered ?? '');
  usePageTitle(person ? name : null);

  if (isLoading) return <div>Loading...</div>;
  if (error || !person) return <div>Person not found</div>;

  const { alternate_name, name_pronunciation, bio, website_url, photo, kidfest_years } = person.person_data;
  const isKidfest = kidfest_years?.length > 0;


  return (
    <main className={styles.page}>
      <div className={styles.profile}>
        {photo && (
          <img src={photo[0]} alt={name} className={isKidfest ? styles.kidfestPhoto : styles.photo} />
        )}
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
          {interview && (
            <Link to={`/interviews/${interview.slug}`} className={styles.websiteLink}>
              Read interview →
            </Link>
          )}
        </div>
      </div>

      {books && books.length > 0 && (() => {
        const regularBooks = books.filter(b => !b.categories?.includes('children'));
        const kidsBooks = books.filter(b => b.categories?.includes('children'));
        return (
          <>
            {regularBooks.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionHeading}>Books</h2>
                <div className={styles.bookGrid}>
                  {regularBooks.map(book => (
                    <Link key={book.id} to={`/books/${book.slug}`} className={styles.bookCard}>
                      {book.cover_image
                        ? <img src={book.cover_image[0]} alt={book.title} className={styles.bookCover} />
                        : <div className={styles.bookCoverPlaceholder} />
                      }
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
                  {kidsBooks.map(book => (
                    <Link key={book.id} to={`/books/${book.slug}`} className={styles.bookCard}>
                      {book.cover_image
                        ? <img src={book.cover_image[0]} alt={book.title} className={styles.bookCover} />
                        : <div className={styles.bookCoverPlaceholder} />
                      }
                      <p className={styles.bookTitle}>{book.title}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        );
      })()}

      {events && events.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Festival Events</h2>
          <ul className={styles.eventList}>
            {events.map(event => (
              <li key={event.id}>
                <Link to={`/festival-events/${event.slug}`}>{event.title}</Link>
                {event.roles.length > 0 && (
                  <span className={styles.eventRoles}> — {event.roles.join(', ')}</span>
                )}
                {event.event_date && (
                  <span className={styles.eventDate}> ({event.event_date})</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
