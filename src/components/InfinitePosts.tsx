import { useInfinitePosts } from '../api/posts/useGetPosts';
import type { Post } from '../api/posts/postTypes';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities';

const POSTS_PER_PAGE = 3;

function InfinitePosts() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useInfinitePosts(POSTS_PER_PAGE);

  const allPosts: Post[] = data ? data.pages.flat() : [];

  if (isLoading) return <div>Loading posts...</div>;
  if (isError) return <div>Error loading posts: {error instanceof Error ? error.message : 'Unknown error'}</div>;
  if (!allPosts.length) return <div>No posts found.</div>;

  return (
    <div>
      <h2>Latest Posts (Infinite)</h2>
      <ul>
        {allPosts.map(post => (
          <li key={post.id}>
            <strong>{decodeHtmlEntities(post.title.rendered)}</strong>
          </li>
        ))}
      </ul>
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} style={{ marginTop: 16 }}>
          {isFetchingNextPage ? 'Loading...' : 'Load more'}
        </button>
      )}
      {!hasNextPage && <div style={{ marginTop: 16 }}>No more posts.</div>}
    </div>
  );
}

export default InfinitePosts;
