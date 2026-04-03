import React, { useState } from 'react';
import { useGetPaginatedPosts } from '../api/posts/useGetPosts';
import type { Post } from '../api/posts/postTypes.ts';

const POSTS_PER_PAGE = 3;

const PaginatedPosts: React.FC = () => {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { data: posts, isLoading, error } = useGetPaginatedPosts(page, POSTS_PER_PAGE);

  React.useEffect(() => {
    if (posts && posts.length > 0) {
      setAllPosts(prev => {
        // Avoid duplicates if page is reset
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

  if (isLoading && page === 1) return <div>Loading posts...</div>;
  if (error) return <div>Error loading posts.</div>;
  if (!allPosts || allPosts.length === 0) return <div>No posts found.</div>;

  return (
    <div>
      <h2>Latest Posts</h2>
      <ul>
        {allPosts.map(post => (
          <li key={post.id}>
            <strong>{post.title.rendered}</strong>
          </li>
        ))}
      </ul>
      {hasMore && (
        <button onClick={handleLoadMore} disabled={isLoadingMore} style={{ marginTop: 16 }}>
          {isLoadingMore ? 'Loading...' : 'Load more'}
        </button>
      )}
    </div>
  );
};

export default PaginatedPosts;
