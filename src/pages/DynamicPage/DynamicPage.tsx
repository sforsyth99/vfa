import { Navigate, useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useGetPages } from '../../api/pages/useGetPages';
import { useGetPage } from '../../api/pages/useGetPage';
import { useGetInterviews } from '../../api/interviews/useGetInterviews';
import { useGetPostBySlug } from '../../api/posts/useGetPostBySlug';
import { sanitizeHtml } from '../../utils/sanitizeHtml';
import { Container } from '../../components/Container/Container';
import styles from './DynamicPage.module.css';

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: pages, isLoading: loadingPages } = useGetPages();
  const { data: interviews, isLoading: loadingInterviews } = useGetInterviews();

  const interviewMatch = interviews?.find((i) => i.slug === slug);
  const page = pages?.find((p: { slug: string }) => p.slug === slug);
  const pageId = page?.id;

  const { data: pageData, isLoading: loadingPage } = useGetPage({ pageId, enabled: !interviewMatch && !!pageId });

  const lookUpPost = !interviewMatch && !loadingPages && !loadingInterviews && !pageId;
  const { data: postData, isLoading: loadingPost } = useGetPostBySlug({ slug: slug!, enabled: lookUpPost });

  if (interviewMatch) return <Navigate to={`/interviews/${slug}`} replace />;

  if (loadingPages || loadingInterviews || loadingPage || loadingPost) return <div><FormattedMessage id="common.loading" /></div>;

  if (postData) {
    return (
      <main id="main-content" className={styles.page}>
        <Container narrow>
          <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: sanitizeHtml(postData.title.rendered) }} />
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: sanitizeHtml(postData.content.rendered) }} />
        </Container>
      </main>
    );
  }

  if (!pageId || !pageData) return <div><FormattedMessage id="dynamicPage.notFound" /></div>;

  return (
    <main id="main-content" className={styles.page}>
      <Container narrow>
        <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: sanitizeHtml(pageData.title.rendered) }} />
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: sanitizeHtml(pageData.content.rendered) }} />
      </Container>
    </main>
  );
}
