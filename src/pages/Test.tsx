import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../api/types.ts';

interface WPPost {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  link: string;
}

const Test: React.FC = () => {
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${BASE_URL}/posts?per_page=30`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch posts');
        return res.json();
      })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main id="main-content">
      <h1>WordPress Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <a href={post.link} target="_blank" rel="noopener noreferrer"
               dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Test;
