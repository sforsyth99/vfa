import styles from './Home.module.css';
import InfinitePosts from '../components/InfinitePosts';
import { useGetPostsByCategory } from '../api/posts/useGetPostsByCategory';
import { useGetCategories } from '../api/categories/useGetCategories';
import { useMemo } from 'react';

function QandA2024Posts() {
  // Get all categories and find the Q&A 2024 category id
  const { data: categories, isLoading: catLoading, isError: catError } = useGetCategories();
  console.log('Category names:', categories?.map(cat => cat.name)); // Debug log to check category names
  const qnaCategory = useMemo(() =>
    categories?.find(cat => cat.name === 'Q&amp;A 2024'), [categories]);

  const categoryId = qnaCategory?.id;

  // Only call the hook if categoryId is defined
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useGetPostsByCategory(categoryId ?? -1, 10); // Use -1 as a dummy value if undefined

  if (catLoading || (categoryId && isLoading)) return <div>Loading Q&amp;A 2024 posts...</div>;
  if (catError) return <div>Error loading categories.</div>;
  if (!categoryId) return <div>Q&amp;A 2024 category not found.</div>;
  if (isError) return <div>Error loading posts: {error instanceof Error ? error.message : 'Unknown error'}</div>;

  const allPosts = data ? data.pages.flat() : [];
  if (!allPosts.length) return <div>No Q&amp;A 2024 posts found.</div>;

  return (
    <div style={{ margin: '2rem 0' }}>
      <h2>Q&amp;A 2024</h2>
      <ul>
        {allPosts.map(post => (
          <li key={post.id}>
            <strong>{post.title.rendered}</strong>
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

export function HomePage() {
  return (
    <main id="main-content" className={styles.homeMain}>
      <QandA2024Posts />
      <InfinitePosts />
    </main>
  );
}

export default HomePage;