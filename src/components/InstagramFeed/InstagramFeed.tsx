import { useIntl } from 'react-intl';
import { useGetInstagramFeed } from '../../api/instagram/useGetInstagramFeed';
import styles from './InstagramFeed.module.css';

export function InstagramFeed() {
  const intl = useIntl();
  const { data, isLoading, isError } = useGetInstagramFeed();

  if (isLoading || isError || !data?.posts?.length) return null;

  const posts = data.posts.slice(0, 3);
  const profileUrl = `https://www.instagram.com/${data.username}/`;

  return (
    <section className={styles.section} aria-labelledby="instagram-heading">
      <h2 id="instagram-heading" className={styles.heading}>
        {intl.formatMessage({ id: 'instagram.heading' })}
      </h2>
      <ul className={styles.grid}>
        {posts.map((post) => {
          const captionSnippet = post.caption?.slice(0, 100) ?? '';
          return (
            <li key={post.id}>
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.post}
                aria-label={intl.formatMessage({ id: 'instagram.postLinkLabel' }, { caption: captionSnippet })}
              >
                <img
                  src={post.mediaUrl}
                  alt=""
                  aria-hidden="true"
                  className={styles.image}
                  loading="lazy"
                />
                <div className={styles.overlay} aria-hidden="true">
                  <span className={styles.overlayText}>
                    {intl.formatMessage({ id: 'instagram.viewPost' })}
                  </span>
                </div>
              </a>
            </li>
          );
        })}
      </ul>
      <a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.viewMore}
      >
        {intl.formatMessage({ id: 'instagram.viewMore' }, { handle: data.username })}
      </a>
    </section>
  );
}
