import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useGetPerson } from '../api/people/useGetPerson.ts';
import { useGetPersonEvents } from '../api/people/useGetPersonEvents.ts';
import { useGetPersonBooks } from '../api/people/useGetPersonBooks.ts';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities.ts';
import styles from './Person.module.css';

export default function PersonPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: person, isLoading, error } = useGetPerson({ slug: slug! });
  const { data: events } = useGetPersonEvents(person?.id);
  const { data: books } = useGetPersonBooks(person?.id);

  if (isLoading) return <div>Loading...</div>;
  if (error || !person) return <div>Person not found</div>;

  const { alternate_name, bio, website_url, photo } = person.person_data;
  const name = decodeHtmlEntities(person.title?.rendered ?? '');


  return (
    <main className={styles.page}>
      <div className={styles.profile}>
        {photo && (
          <img src={photo[0]} alt={name} className={styles.photo} />
        )}
        <div className={styles.meta}>
          <p className={styles.eyebrow}>Author</p>
          <h1 className={styles.name}>{name}</h1>
          {alternate_name && <p className={styles.alternateName}>{alternate_name}</p>}

          {bio && <div className={styles.bio} dangerouslySetInnerHTML={{ __html: bio }} />}
          {website_url && (
            <a href={website_url} className={styles.websiteLink}>
              Visit website →
            </a>
          )}
        </div>
      </div>

      {books && books.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Books</h2>
          <ul className={styles.bookList}>
            {books.map(book => (
              <li key={book.id}>
                <Link to={`/books/${book.slug}`}>{book.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

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
