import { useIntl } from 'react-intl';
import styles from './PageLoader.module.css';

export function PageLoader() {
  const intl = useIntl();
  return (
    <div className={styles.wrap} role="status">
      <div className={styles.spinner} />
      <span className={styles.srOnly}>{intl.formatMessage({ id: 'common.loading' })}</span>
    </div>
  );
}
