import { useIntl } from 'react-intl';
import styles from './SkipToContent.module.css';

export function SkipToContent() {
  const intl = useIntl();
  return (
    <a href="#main-content" className={styles.skipLink}>
      {intl.formatMessage({ id: 'accessibility.skipToContent' })}
    </a>
  );
}
