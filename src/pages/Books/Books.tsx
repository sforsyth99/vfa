import { FormattedMessage, useIntl } from 'react-intl';
import { useGetBooks } from '../../api/books/useGetBooks';
import { CURRENT_YEAR } from '../../config/festival';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities';
import { usePageTitle } from '../../utils/usePageTitle';
import { BookLink } from '../../components/BookLink/BookLink';
import { Container } from '../../components/Container/Container';
import { PageTitle } from '../../components/PageTitle/PageTitle';
import { QueryState } from '../../components/QueryState/QueryState';
import { SkeletonBlock } from '../../components/Skeleton/Skeleton';
import styles from './Books.module.css';

function titleSortKey(title: string) {
  return title.replace(/^(a|an|the)\s+/i, '').toLowerCase();
}

export default function BooksPage() {
  const intl = useIntl();
  usePageTitle(intl.formatMessage({ id: 'books.pageTitle' }));

  const { data: books, isLoading, isError } = useGetBooks();

  const filtered = (books ?? [])
    .filter(
      (b) =>
        b.book_data?.festival_year === CURRENT_YEAR &&
        !b.book_data?.categories?.includes('children'),
    )
    .sort((a, b) =>
      titleSortKey(decodeHtmlEntities(a.title?.rendered ?? '')).localeCompare(
        titleSortKey(decodeHtmlEntities(b.title?.rendered ?? '')),
      ),
    );

  return (
    <main id="main-content" className={styles.page}>
      <Container>
        <PageTitle><FormattedMessage id="books.pageTitle" /></PageTitle>

        <QueryState
          isLoading={isLoading}
          isError={isError}
          loadingId="books.loading"
          errorId="books.error"
        />

        {isLoading && (
          <div className={styles.grid}>
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className={styles.skeletonCard}>
                <SkeletonBlock className={styles.skeletonCover} />
                <SkeletonBlock className={styles.skeletonTitle} />
                <SkeletonBlock className={styles.skeletonAuthor} />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <p className={styles.empty}><FormattedMessage id="books.empty" /></p>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <ul className={styles.grid}>
            {filtered.map((book) => {
              const title = decodeHtmlEntities(book.title?.rendered ?? '');
              const coverUrl = book.book_data?.cover_image ? book.book_data.cover_image[0] : null;
              const authorName =
                book.book_data?.authors?.[0]?.name ?? book.book_data?.additional_authors ?? '';

              return (
                <li key={book.id}>
                  <BookLink
                    slug={book.slug}
                    munrosUrl={book.book_data?.munros_url || undefined}
                    bookTitle={title}
                    className={styles.card}
                    aria-label={
                      authorName
                        ? intl.formatMessage({ id: 'home.books.cardLabel' }, { title, author: authorName })
                        : title
                    }
                  >
                    <div className={styles.cover}>
                      {coverUrl ? (
                        <img src={coverUrl} alt="" aria-hidden="true" loading="lazy" />
                      ) : (
                        <span className={styles.placeholder} aria-hidden="true">
                          {title.charAt(0)}
                        </span>
                      )}
                    </div>
                    <span className={styles.title}>{title}</span>
                    {authorName && <span className={styles.author}>{authorName}</span>}
                  </BookLink>
                </li>
              );
            })}
          </ul>
        )}
      </Container>
    </main>
  );
}
