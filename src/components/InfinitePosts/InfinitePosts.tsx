import { useIntl, FormattedMessage } from 'react-intl';
import { useInfinitePosts } from '../../api/posts/useGetPosts';
import type { Post } from '../../api/posts/postTypes';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities';
import styles from './InfinitePosts.module.css';

const POSTS_PER_PAGE = 3;

function InfinitePosts() {
  const intl = useIntl();
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePosts(POSTS_PER_PAGE);

  const allPosts: Post[] = data ? data.pages.flat() : [];

  if (isLoading) return <div><FormattedMessage id="posts.loading" /></div>;
  if (isError) return <div><FormattedMessage id="posts.error" /></div>;
  if (!allPosts.length) return <div><FormattedMessage id="posts.empty" /></div>;

  return (
    <div>
      <h2><FormattedMessage id="posts.latestHeading" /></h2>
      <ul>
        {allPosts.map(post => (
          <li key={post.id}>
            <strong>{decodeHtmlEntities(post.title.rendered)}</strong>
          </li>
        ))}
      </ul>
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className={styles.spacedTop}>
          {isFetchingNextPage
            ? intl.formatMessage({ id: 'posts.loadingMore' })
            : intl.formatMessage({ id: 'posts.loadMore' })}
        </button>
      )}
      {!hasNextPage && <div className={styles.spacedTop}><FormattedMessage id="posts.noMore" /></div>}
    </div>
  );
}

export default InfinitePosts;
