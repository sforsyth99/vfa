import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { useGetQACategories } from '../../api/qa/useGetQACategories.ts';
import { useGetQAPosts } from '../../api/qa/useGetQAPosts.ts';
import type { QACategory } from '../../api/qa/qaTypes.ts';
import { usePageTitle } from '../../utils/usePageTitle.ts';
import { Container } from '../../components/Container/Container';
import { PageTitle } from '../../components/PageTitle/PageTitle';
import { QueryState } from '../../components/QueryState/QueryState';
import styles from './Archives.module.css';

function YearSection({ category }: { category: QACategory }) {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetQAPosts(category.id, isOpen);

  const posts = data?.pages.flatMap((p) => p.items) ?? [];
  const sectionId = `archive-${category.slug}`;

  return (
    <div className={styles.yearSection}>
      <button
        className={styles.yearToggle}
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        aria-controls={sectionId}
        aria-label={intl.formatMessage(
          { id: isOpen ? 'archives.collapse' : 'archives.expand' },
          { label: category.label }
        )}
      >
        <span className={styles.yearLabel}>{category.label}</span>
        <span className={styles.yearChevron} aria-hidden="true">
          {isOpen ? '▲' : '▼'}
        </span>
        <span className={styles.yearCount}>
          <FormattedMessage id="archives.interviewCount" values={{ count: category.count }} />
        </span>
      </button>

      <div id={sectionId} className={isOpen ? styles.yearContent : styles.yearContentHidden}>
        <QueryState
          isLoading={isLoading}
          isError={isError}
          loadingId="archives.interviewsLoading"
          errorId="archives.interviewsError"
        />

        {posts.length > 0 && (
          <ul className={styles.interviewList}>
            {posts.map((post) => (
              <li key={post.id} className={styles.interviewItem}>
                <Link to={`/${post.slug}`} className={styles.interviewLink}>
                  <span className={styles.interviewAuthor}>{post.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {hasNextPage && (
          <button
            className={styles.loadMore}
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            <FormattedMessage id={isFetchingNextPage ? 'archives.loadingMore' : 'archives.loadMore'} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function ArchivesPage() {
  const intl = useIntl();
  usePageTitle(intl.formatMessage({ id: 'archives.pageTitle' }));
  const { data: categories, isLoading, isError } = useGetQACategories();

  return (
    <main id="main-content">
      <Container>
        <div className={styles.page}>
          <PageTitle><FormattedMessage id="archives.heading" /></PageTitle>
          <QueryState
            isLoading={isLoading}
            isError={isError}
            isEmpty={categories?.length === 0}
            loadingId="archives.yearsLoading"
            errorId="archives.yearsError"
            emptyId="archives.empty"
          />
          {categories && categories.length > 0 && (
            <div className={styles.yearList}>
              {categories.map((category) => (
                <YearSection key={category.id} category={category} />
              ))}
            </div>
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
