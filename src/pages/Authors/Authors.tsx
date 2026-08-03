import { Link } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { useGetAuthors } from '../../api/people/useGetAuthors';
import { useGetPersonBooks } from '../../api/people/useGetPersonBooks';
import { usePageTitle } from '../../utils/usePageTitle';
import { CURRENT_YEAR } from '../../config/festival';
import { bySurname } from '../../utils/sortBySurname';
import { htmlToText } from '../../utils/htmlToText';
import type { PersonData } from '../../api/people/peopleTypes';
import { Container } from '../../components/Container/Container';
import { PageTitle } from '../../components/PageTitle/PageTitle';
import { QueryState } from '../../components/QueryState/QueryState';
import styles from './Authors.module.css';

function initials(name: string) {
  return name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function AuthorRow({ author }: { author: PersonData }) {
  const { data: books = [] } = useGetPersonBooks(author.id, CURRENT_YEAR);
  const photo = author.photo || author.photo_square;
  const bio = author.bio ? htmlToText(author.bio) : '';
  const booksWithCover = books.filter(b => b.cover_image);

  const firstBook = booksWithCover[0];

  return (
    <Link to={`/people/${author.slug}`} className={styles.item}>
      <div className={styles.photoWrap}>
        {photo ? (
          <img src={photo[0]} alt="" aria-hidden="true" loading="lazy" className={styles.photo} />
        ) : (
          <div className={styles.placeholder} aria-hidden="true">{initials(author.name)}</div>
        )}
      </div>

      <div className={styles.bookWrap}>
        {firstBook?.cover_image && (
          <img src={firstBook.cover_image[0]} alt={firstBook.title} className={styles.bookCover} loading="lazy" />
        )}
      </div>

      <div className={styles.info}>
        <p className={styles.name}>{author.name}</p>
        {bio && <p className={styles.bio}>{bio}</p>}
      </div>
    </Link>
  );
}

export default function AuthorsPage() {
  const intl = useIntl();
  usePageTitle(intl.formatMessage({ id: 'home.authors.heading' }));
  const { data: authors, isLoading, isError } = useGetAuthors(CURRENT_YEAR);

  return (
    <main id="main-content" className={styles.page}>
      <Container>
        <PageTitle><FormattedMessage id="home.authors.heading" /></PageTitle>

        <QueryState isLoading={isLoading} isError={isError} loadingId="home.authors.loading" errorId="home.authors.error" />

        {authors && (
          <ul className={styles.list}>
            {[...authors].sort(bySurname).map((author) => (
              <li key={author.id}>
                <AuthorRow author={author} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </main>
  );
}
