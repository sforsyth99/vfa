import { Link } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { useGetVenues } from '../../api/venues/useGetVenues';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities';
import { usePageTitle } from '../../utils/usePageTitle';
import { Container } from '../../components/Container/Container';
import { PageTitle } from '../../components/PageTitle/PageTitle';
import { QueryState } from '../../components/QueryState/QueryState';
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

        <QueryState isLoading={isLoading} isError={!!error} isEmpty={!isLoading && !error && sorted.length === 0} loadingId="venues.loading" errorId="venues.error" emptyId="venues.empty" />

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
