import { useParams, Link } from 'react-router-dom';
import { useGetBook } from '../api/books/useGetBook.ts';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities.ts';
import { usePageTitle } from '../utils/usePageTitle.ts';
import type { PersonData } from '../api/people/peopleTypes.ts';
import styles from './Book.module.css';

function AuthorName({ person }: { person: PersonData }) {
  if (!person.slug) return <span>{person.name}</span>;
  return <Link to={`/people/${person.slug}`} className={styles.authorLink}>{person.name}</Link>;
}

export default function BookPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: book, isLoading, error } = useGetBook({ slug: slug! });
  const title = decodeHtmlEntities(book?.title?.rendered ?? '');
  usePageTitle(book ? title : null);

  if (isLoading) return <div>Loading...</div>;
  if (error || !book) return <div>Book not found</div>;

  const { authors, additional_authors, subtitle, illustrators, age_min, age_max, cover_image, description, munros_url } = book.book_data;
  const ageLabel = age_min != null
    ? age_max != null ? `Ages ${age_min}–${age_max}` : `Ages ${age_min}+`
    : null;

  return (
    <main id="main-content" className={styles.page}>
      <div className={styles.bookLayout}>
        {cover_image && (
          <img src={cover_image[0]} alt={title} className={styles.coverImage} />
        )}
        <div className={styles.meta}>
          <p className={styles.eyebrow}>Book</p>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {(authors.length > 0 || additional_authors) && (
            <p className={styles.authors}>
              {authors.map((a, i) => (
                <span key={a.id}>
                  <AuthorName person={a} />
                  {(i < authors.length - 1 || additional_authors) ? ', ' : ''}
                </span>
              ))}
              {additional_authors}
            </p>
          )}
          {illustrators && (
            <p className={styles.illustrators}>Illustrated by {illustrators}</p>
          )}
          {ageLabel && <p className={styles.ageRange}>{ageLabel}</p>}
          {description && <div className={styles.description} dangerouslySetInnerHTML={{ __html: description }} />}
          {munros_url && (
            <a href={munros_url} className={styles.buyLink} target="_blank" rel="noopener noreferrer">
              Buy online →
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
