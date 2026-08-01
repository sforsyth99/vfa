import { Link } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { useGetAuthors } from '../../api/people/useGetAuthors';
import { usePageTitle } from '../../utils/usePageTitle';
import { CURRENT_YEAR } from '../../config/festival';
import { bySurname } from '../../utils/sortBySurname';
import { Container } from '../../components/Container/Container';
import { PageTitle } from '../../components/PageTitle/PageTitle';
import { QueryState } from '../../components/QueryState/QueryState';
import styles from './Authors.module.css';

function initials(name: string) {
  return name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
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
          <div className={styles.grid}>
            {[...authors].sort(bySurname).map((author) => {
              const photo = author.photo_square || author.photo;
              return (
                <Link key={author.id} to={`/people/${author.slug}`} className={styles.card}>
                  {photo ? (
                    <img src={photo[0]} alt="" aria-hidden="true" loading="lazy" className={styles.photo} />
                  ) : (
                    <div className={styles.placeholder} aria-hidden="true">{initials(author.name)}</div>
                  )}
                  <span className={styles.name}>{author.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </main>
  );
}
