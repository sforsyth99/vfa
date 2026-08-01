import { useIntl, FormattedMessage } from 'react-intl';
import { usePageTitle } from '../../utils/usePageTitle';
import { Container } from '../../components/Container/Container';
import { PageTitle } from '../../components/PageTitle/PageTitle';
import styles from './StrategicPlan.module.css';

const PDF_URL = '/VFA-2022_Strategic-Plan.pdf';

function StrategicPlanPage() {
  const intl = useIntl();
  usePageTitle(intl.formatMessage({ id: 'strategicPlan.pageTitle' }));

  return (
    <main id="main-content">
      <Container>
        <div className={styles.page}>
          <PageTitle><FormattedMessage id="strategicPlan.pageTitle" /></PageTitle>
          <p className={styles.description}>
            <FormattedMessage id="strategicPlan.description" />
          </p>
          <a
            href={PDF_URL}
            download
            className={styles.downloadBtn}
          >
            <FormattedMessage id="strategicPlan.download" />
          </a>
          <div className={styles.pdfWrapper}>
            <embed
              src={PDF_URL}
              type="application/pdf"
              aria-label={intl.formatMessage({ id: 'strategicPlan.pdfLabel' })}
              className={styles.pdfEmbed}
            />
          </div>
        </div>
      </Container>
    </main>
  );
}

export default StrategicPlanPage;
