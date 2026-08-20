import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { usePageTitle } from '../../utils/usePageTitle.ts';
import { Container } from '../../components/Container/Container';
import styles from './NotFound.module.css';

export default function NotFoundPage() {
  const intl = useIntl();
  usePageTitle(intl.formatMessage({ id: 'notFound.pageTitle' }));

  return (
    <main id="main-content" className={styles.page}>
      <Container narrow>
        <div className={styles.inner}>
          <p className={styles.chapter}>{intl.formatMessage({ id: 'notFound.chapter' })}</p>
          <div className={styles.rule} aria-hidden="true" />
          <h1 className={styles.heading}>{intl.formatMessage({ id: 'notFound.heading' })}</h1>
          <p className={styles.body}>{intl.formatMessage({ id: 'notFound.body' })}</p>
          <div className={styles.links}>
            <Link to="/" className={styles.primary}>
              {intl.formatMessage({ id: 'notFound.home' })}
            </Link>
            <Link to="/events" className={styles.secondary}>
              {intl.formatMessage({ id: 'notFound.events' })}
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
