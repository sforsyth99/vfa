import { useIntl, FormattedMessage } from 'react-intl';
import { useGetMedia } from '../../api/media/useGetMedia';
import type { Media } from '../../api/media/mediaTypes.ts';
import { Container } from '../../components/Container/Container';
import { PageTitle } from '../../components/PageTitle/PageTitle';
import { usePageTitle } from '../../utils/usePageTitle';
import { sanitizeHtml } from '../../utils/sanitizeHtml';
import styles from './Media.module.css';

function MediaPage() {
  const intl = useIntl();
  usePageTitle(intl.formatMessage({ id: 'media.heading' }));
  const { data, isLoading, error } = useGetMedia();

  if (isLoading) return <div><FormattedMessage id="media.loading" /></div>;
  if (error) return <div><FormattedMessage id="media.error" /></div>;
  if (!data || data.length === 0) return <div><FormattedMessage id="media.empty" /></div>;

  return (
    <main id="main-content">
      <Container>
        <PageTitle><FormattedMessage id="media.heading" /></PageTitle>
        <ul>
          {data.slice(0, 5).map((media: Media) => (
            <li key={media.id} className={styles.mediaItem}>
              <strong>{media.title.rendered}</strong>
              <div>
                <img
                  src={media.source_url}
                  alt={media.alt_text || media.title.rendered}
                  className={styles.mediaImg}
                  loading="lazy"
                />
              </div>
              {media.caption.rendered && (
                <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(media.caption.rendered) }} />
              )}
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}

export default MediaPage;
