import { useParams } from 'react-router-dom';
import { useGetPages } from '../../api/pages/useGetPages';
import { useGetPage } from '../../api/pages/useGetPage';
import { Container } from '../../components/Container/Container';
import styles from './DynamicPage.module.css';

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: pages, isLoading: loadingPages } = useGetPages();

  const page = pages?.find((p: { slug: string }) => p.slug === slug);
  const pageId = page?.id;

  const { data: pageData, isLoading: loadingPage, error } = useGetPage({ pageId: pageId as number });
  if (loadingPages || loadingPage) return <div>Loading...</div>;
  if (!pageId || !pageData) return <div>Page not found</div>;
  if (error) return <div>Error loading page</div>;

  return (
    <main id="main-content" className={styles.page}>
      <Container narrow>
        <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: pageData.title.rendered }} />
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: pageData.content.rendered }} />
      </Container>
    </main>
  );
}
