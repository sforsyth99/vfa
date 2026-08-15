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
import { SkeletonBlock } from '../../components/Skeleton/Skeleton';
import styles from './Authors.module.css';

function initials(name: string) {
  return name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function surnameInitial(name: string): string {
  const surname = name.trim().split(/\s+/).pop() ?? name;
  return surname[0].toUpperCase();
}

function AuthorRow({ author }: { author: PersonData }) {
  const { data: books = [] } = useGetPersonBooks(author.id, CURRENT_YEAR);
  const photo = author.photo_square || author.photo;
  const bio = author.bio ? htmlToText(author.bio) : '';
  const booksWithCover = books.filter(b => b.cover_image);

  return (
    <Link to={`/people/${author.slug}`} className={styles.item}>
      <div className={styles.visual}>
        <div className={styles.photoWrap}>
          {photo ? (
            <img src={photo[0]} alt="" aria-hidden="true" loading="lazy" className={styles.photo} />
          ) : (
            <div className={styles.placeholder} aria-hidden="true">{initials(author.name)}</div>
          )}
        </div>

        {booksWithCover.length > 0 && (
          <div className={styles.books}>
            {booksWithCover.map(book => (
              <img key={book.id} src={(book.cover_image as [string, number, number, boolean])[0]} alt={book.title} className={styles.bookCover} loading="lazy" />
            ))}
          </div>
        )}
      </div>

      <div className={styles.info}>
        <p className={styles.name}>{author.name}</p>
        {bio && <p className={styles.bio}>{bio}</p>}
      </div>

      <span className={styles.chevron} aria-hidden="true">›</span>
    </Link>
  );
}

export default function AuthorsPage() {
  const intl = useIntl();
  usePageTitle(intl.formatMessage({ id: 'home.authors.heading' }));
  const { data: authors, isLoading, isError } = useGetAuthors(CURRENT_YEAR);

  const grouped = authors
    ? [...authors].sort(bySurname).reduce<Record<string, PersonData[]>>((acc, author) => {
        const letter = surnameInitial(author.name);
        (acc[letter] ??= []).push(author);
        return acc;
      }, {})
    : null;

  const letters = grouped ? Object.keys(grouped).sort() : [];

  return (
    <main id="main-content" className={styles.page}>
      <Container>
        <PageTitle><FormattedMessage id="home.authors.heading" /></PageTitle>

        {isLoading && (
          <div className={styles.skeletonPanel} aria-busy="true">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className={styles.skeletonRow}>
                <SkeletonBlock className={styles.skeletonPhoto} />
                <div className={styles.skeletonInfo}>
                  <SkeletonBlock className={styles.skeletonName} />
                  <SkeletonBlock className={styles.skeletonBio} />
                  <SkeletonBlock className={styles.skeletonBioShort} />
                </div>
              </div>
            ))}
          </div>
        )}
        {!isLoading && <QueryState isLoading={false} isError={isError} loadingId="home.authors.loading" errorId="home.authors.error" />}

        {grouped && (
          <>
            <nav className={styles.jumpNav} aria-label={intl.formatMessage({ id: 'authors.jumpNav.label' })}>
              {letters.map(letter => (
                <a key={letter} href={`#authors-${letter}`} className={styles.jumpLink}>{letter}</a>
              ))}
            </nav>

            <div className={styles.listPanel}>
              {letters.map(letter => (
                <section key={letter} id={`authors-${letter}`} className={styles.letterSection}>
                  <div className={styles.letterDivider} aria-hidden="true">{letter}</div>
                  <ul className={styles.list}>
                    {grouped[letter].map(author => (
                      <li key={author.id}>
                        <AuthorRow author={author} />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </>
        )}
      </Container>
    </main>
  );
}
