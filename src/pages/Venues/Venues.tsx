import { Link } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { useGetVenues } from '../../api/venues/useGetVenues';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities';
import { usePageTitle } from '../../utils/usePageTitle';
import { Container } from '../../components/Container/Container';
import { PageTitle } from '../../components/PageTitle/PageTitle';
import styles from './Venues.module.css';

export default function VenuesPage() {
  const intl = useIntl();
  usePageTitle(intl.formatMessage({ id: 'venues.heading' }));
  const { data: venues, isLoading, error } = useGetVenues();

  const sorted = (venues ?? []).sort((a, b) =>
    (a.venue_data.name || '').localeCompare(b.venue_data.name || '')
  );

  return (
    <main id="main-content" className={styles.page}>
      <Container>
        <PageTitle><FormattedMessage id="venues.heading" /></PageTitle>

        {isLoading && <p className={styles.state}><FormattedMessage id="venues.loading" /></p>}
        {error && <p className={styles.state}><FormattedMessage id="venues.error" /></p>}
        {!isLoading && !error && sorted.length === 0 && (
          <p className={styles.state}><FormattedMessage id="venues.empty" /></p>
        )}

        <ul className={styles.list}>
          {sorted.map((venue) => {
            const d = venue.venue_data;
            const title = decodeHtmlEntities(venue.title?.rendered ?? d.name);
            const buildingLine = [d.building, d.room].filter(Boolean).join(', ');
            const addressLine = [d.street_address, d.city].filter(Boolean).join(', ');

            return (
              <li key={venue.id}>
                <Link to={`/venues/${venue.slug}`} className={styles.item}>
                  <p className={styles.name}>{title}</p>
                  {buildingLine && <p className={styles.detail}>{buildingLine}</p>}
                  {addressLine && <p className={styles.detail}>{addressLine}</p>}
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </main>
  );
}
