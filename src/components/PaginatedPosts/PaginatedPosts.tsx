import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useGetPaginatedPosts } from '../../api/posts/useGetPosts';
import type { Post } from '../../api/posts/postTypes.ts';
import styles from './PaginatedPosts.module.css';

const POSTS_PER_PAGE = 3;

function PaginatedPosts() {
  const intl = useIntl();
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { data: posts, isLoading, error } = useGetPaginatedPosts(page, POSTS_PER_PAGE);

  React.useEffect(() => {
    if (posts && posts.length > 0) {
      setAllPosts(prev => {
        const ids = new Set(prev.map(p => p.id));
        return [...prev, ...posts.filter(p => !ids.has(p.id))];
      });
      setHasMore(posts.length === POSTS_PER_PAGE);
    } else if (posts && posts.length === 0) {
      setHasMore(false);
    }
    setIsLoadingMore(false);
  }, [posts]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setPage(prev => prev + 1);
  };

  if (isLoading && page === 1) return <div><FormattedMessage id="posts.loading" /></div>;
  if (error) return <div><FormattedMessage id="posts.error" /></div>;
  if (!allPosts || allPosts.length === 0) return <div><FormattedMessage id="posts.empty" /></div>;

  return (
    <div>
      <h2><FormattedMessage id="posts.latestHeading" /></h2>
      <ul>
        {allPosts.map(post => (
          <li key={post.id}>
            <strong>{post.title.rendered}</strong>
          </li>
        ))}
      </ul>
      {hasMore && (
        <button onClick={handleLoadMore} disabled={isLoadingMore} className={styles.loadMore}>
          {isLoadingMore
            ? intl.formatMessage({ id: 'posts.loadingMore' })
            : intl.formatMessage({ id: 'posts.loadMore' })}
        </button>
      )}
    </div>
  );
}

export default PaginatedPosts;
