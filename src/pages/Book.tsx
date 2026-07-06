import { useParams } from 'react-router-dom';
import { useGetBook } from '../api/books/useGetBook.ts';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities.ts';
import type { PersonData } from '../api/people/peopleTypes.ts';
import styles from './Book.module.css';

function AuthorName({ person }: { person: PersonData }) {
  if (person.website_url) {
    return <a href={person.website_url} className={styles.authorLink}>{person.name}</a>;
  }
  return <span>{person.name}</span>;
}

export default function BookPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: book, isLoading, error } = useGetBook({ slug: slug! });

  if (isLoading) return <div>Loading...</div>;
  if (error || !book) return <div>Book not found</div>;

  const { authors, cover_image, description, munros_url } = book.book_data;
  const title = decodeHtmlEntities(book.title.rendered);

  return (
    <main className={styles.page}>
      <div className={styles.bookLayout}>
        {cover_image && (
          <img src={cover_image[0]} alt={title} className={styles.coverImage} />
        )}
        <div className={styles.meta}>
          <p className={styles.eyebrow}>Book</p>
          <h1 className={styles.title}>{title}</h1>
          {authors.length > 0 && (
            <p className={styles.authors}>
              {authors.map((a, i) => (
                <span key={a.id}>
                  <AuthorName person={a} />
                  {i < authors.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
          )}
          {description && <p className={styles.description}>{description}</p>}
          {munros_url && (
            <a href={munros_url} className={styles.buyLink} target="_blank" rel="noopener noreferrer">
              Buy at Munro's Books →
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
