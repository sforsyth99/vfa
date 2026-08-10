import { Link } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { useGetAllQAPosts } from '../../api/qa/useGetAllQAPosts.ts';
import type { QAPostWithYear } from '../../api/qa/qaTypes.ts';
import { usePageTitle } from '../../utils/usePageTitle.ts';
import { Container } from '../../components/Container/Container';
import { PageTitle } from '../../components/PageTitle/PageTitle';
import { QueryState } from '../../components/QueryState/QueryState';
import styles from './Archives.module.css';

function cleanTitle(title: string): string {
  return title.replace(/^Q\s*&\s*A\s+with\s+/i, '').trim();
}

function surnameInitial(post: QAPostWithYear): string {
  const name = cleanTitle(post.title);
  const surname = name.trim().split(/\s+/).pop() ?? name;
  return surname[0]?.toUpperCase() ?? '#';
}

function bySurnameTitle(a: QAPostWithYear, b: QAPostWithYear): number {
  const nameA = cleanTitle(a.title);
  const nameB = cleanTitle(b.title);
  const surA = nameA.trim().split(/\s+/).pop()?.toLowerCase() ?? '';
  const surB = nameB.trim().split(/\s+/).pop()?.toLowerCase() ?? '';
  return surA.localeCompare(surB) || nameA.localeCompare(nameB);
}

export default function ArchivesPage() {
  const intl = useIntl();
  usePageTitle(intl.formatMessage({ id: 'archives.pageTitle' }));
  const { isLoading, isError, posts } = useGetAllQAPosts();

  const grouped =
    !isLoading && !isError && posts.length > 0
      ? [...posts].sort(bySurnameTitle).reduce<Record<string, QAPostWithYear[]>>((acc, post) => {
          const letter = surnameInitial(post);
          (acc[letter] ??= []).push(post);
          return acc;
        }, {})
      : null;

  const letters = grouped ? Object.keys(grouped).sort() : [];

  return (
    <main id="main-content">
      <Container>
        <div className={styles.page}>
          <PageTitle>
            <FormattedMessage id="archives.heading" />
          </PageTitle>

          <QueryState
            isLoading={isLoading}
            isError={isError}
            isEmpty={!isLoading && !isError && posts.length === 0}
            loadingId="archives.yearsLoading"
            errorId="archives.yearsError"
            emptyId="archives.empty"
          />

          {grouped && (
            <>
              <nav
                className={styles.jumpNav}
                aria-label={intl.formatMessage({ id: 'archives.jumpNav.label' })}
              >
                {letters.map((letter) => (
                  <a key={letter} href={`#archive-${letter}`} className={styles.jumpLink}>
                    {letter}
                  </a>
                ))}
              </nav>

              <div className={styles.listPanel}>
                {letters.map((letter) => (
                  <section key={letter} id={`archive-${letter}`} className={styles.letterSection}>
                    <div className={styles.letterDivider} aria-hidden="true">
                      {letter}
                    </div>
                    <ul className={styles.list}>
                      {grouped[letter].map((post) => (
                        <li key={post.id}>
                          <Link to={`/${post.slug}`} className={styles.item}>
                            <span className={styles.itemInfo}>
                              <span className={styles.title}>{cleanTitle(post.title)}</span>
                              {post.year && (
                                <span className={styles.year}>({post.year})</span>
                              )}
                            </span>
                            <span className={styles.chevron} aria-hidden="true">›</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </>
          )}

          <div className={styles.socialSection}>
            <p className={styles.socialHeading}>
              <FormattedMessage id="archives.moreFrom" />
            </p>
            <div className={styles.socialLinks}>
              <a
                href="https://www.youtube.com/@victoriafestivalofauthors580"
                className={styles.socialLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FormattedMessage id="archives.youtube" />
              </a>
              <a
                href="https://soundcloud.com/vicfestofauthors"
                className={styles.socialLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FormattedMessage id="archives.soundcloud" />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
