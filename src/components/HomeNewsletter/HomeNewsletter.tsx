import { FormattedMessage, useIntl } from 'react-intl';
import NewsletterSignup from '../NewsletterSignup/NewsletterSignup';
import { Container } from '../Container/Container';
import { useGetNewsletterPost } from '../../api/posts/useGetNewsletterPost';
import { extractNewsletterExcerpt } from '../../utils/sanitizeHtml';
import { track } from '../../utils/analytics';
import styles from './HomeNewsletter.module.css';

export function HomeNewsletter() {
  const intl = useIntl();
  const { data: newsletter } = useGetNewsletterPost();

  return (
    <section className={styles.section} aria-label={intl.formatMessage({ id: 'newsletter.section.label' })}>
      <Container>
        <div className={styles.content}>
          {newsletter && (
            <>
              <p className={styles.eyebrow}>
                <FormattedMessage id="newsletter.fromLatestIssue" />
              </p>
              {newsletter.title && (
                <h2 className={styles.issueTitle}>{newsletter.title}</h2>
              )}
              <p className={styles.editorialContent}>
                {extractNewsletterExcerpt(newsletter.content)}
              </p>
              <a
                href={newsletter.archive_url}
                className={styles.readFullLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={intl.formatMessage({ id: 'newsletter.readFull.label' })}
                onClick={() => track({ name: 'newsletter_read_full', event_location: 'homepage' })}
              >
                <FormattedMessage id="newsletter.readFull" />
              </a>
            </>
          )}
          <div className={newsletter ? styles.signupBelowNewsletter : undefined}>
            <NewsletterSignup location="homepage" />
          </div>
        </div>
      </Container>
    </section>
  );
}
