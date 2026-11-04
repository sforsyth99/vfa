import { useIntl } from 'react-intl';
import styles from './PageLoader.module.css';

/**
 * Full-page loading state. It is the page's <main> (so the skip link has a
 * target) and is at least a screen tall, so the footer starts below the fold
 * and doesn't jump down when the content arrives.
 */
export function PageLoader() {
  const intl = useIntl();
  return (
    <main id="main-content" className={styles.wrap} aria-busy="true">
      <div role="status">
        <div className={styles.spinner} />
        <span className={styles.srOnly}>{intl.formatMessage({ id: 'common.loading' })}</span>
      </div>
    </main>
  );
}
