import { FormattedMessage } from 'react-intl';
import NewsletterSignup from '../NewsletterSignup/NewsletterSignup';
import { Container } from '../Container/Container';
import styles from './HomeNewsletter.module.css';

export function HomeNewsletter() {
  return (
    <section className={styles.section} aria-labelledby="newsletter-cta-heading">
      <Container>
        <div className={styles.inner}>
          <div className={styles.text}>
            <h2 id="newsletter-cta-heading" className={styles.heading}>
              <FormattedMessage id="newsletter.cta.heading" />
            </h2>
            <p className={styles.body}>
              <FormattedMessage id="newsletter.cta.body" />
            </p>
          </div>
          <div className={styles.form}>
            <NewsletterSignup />
          </div>
        </div>
      </Container>
    </section>
  );
}
