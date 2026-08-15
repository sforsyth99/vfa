import { Link } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { useGetVenues } from '../../api/venues/useGetVenues';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities';
import { htmlToText } from '../../utils/htmlToText';
import { usePageTitle } from '../../utils/usePageTitle';
import { Container } from '../../components/Container/Container';
import { PageTitle } from '../../components/PageTitle/PageTitle';
import { QueryState } from '../../components/QueryState/QueryState';
import { VenueMapRow } from '../../components/VenueMapRow/VenueMapRow';
import { SkeletonBlock } from '../../components/Skeleton/Skeleton';
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

        {isLoading && (
          <ul className={styles.list} aria-busy="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <li key={i} className={styles.skeletonItem}>
                <SkeletonBlock className={styles.skeletonName} />
                <SkeletonBlock className={styles.skeletonDetail} />
                <SkeletonBlock className={styles.skeletonDetail} />
                <SkeletonBlock className={styles.skeletonDesc} />
                <SkeletonBlock className={styles.skeletonDescShort} />
              </li>
            ))}
          </ul>
        )}
        {!isLoading && <QueryState isLoading={false} isError={!!error} isEmpty={!error && sorted.length === 0} loadingId="venues.loading" errorId="venues.error" emptyId="venues.empty" />}

        <ul className={styles.list}>
          {sorted.map((venue) => {
            const d = venue.venue_data;
            const title = decodeHtmlEntities(venue.title?.rendered ?? d.name);
            const buildingLine = [d.building, d.room].filter(Boolean).join(', ');
            const addressLine = [d.street_address, d.city].filter(Boolean).join(', ');
            const descriptionText = d.description ? htmlToText(d.description) : '';
            const accessibilityText = d.accessibility ? htmlToText(d.accessibility) : '';

            return (
              <li key={venue.id} className={styles.item}>
                <VenueMapRow venue={d}>
                  <Link to={`/venues/${venue.slug}`} className={styles.name}>
                    {title}
                    {d.alternate_name && (
                      <span className={styles.formerName}>
                        {intl.formatMessage({ id: 'venue.formerly' }, { name: d.alternate_name })}
                      </span>
                    )}
                  </Link>
                  {buildingLine && <p className={styles.detail}>{buildingLine}</p>}
                  {addressLine && <p className={styles.detail}>{addressLine}</p>}
                  {descriptionText && <p className={styles.description}>{descriptionText}</p>}
                  {accessibilityText && (
                    <p className={styles.accessibility}>{accessibilityText}</p>
                  )}
                  {(descriptionText || accessibilityText) && (
                    <Link
                      to={`/venues/${venue.slug}`}
                      className={styles.readMore}
                      aria-label={intl.formatMessage({ id: 'venues.readMoreLabel' }, { name: title })}
                    >
                      {intl.formatMessage({ id: 'venues.readMore' })}
                    </Link>
                  )}
                </VenueMapRow>
              </li>
            );
          })}
        </ul>
      </Container>
    </main>
  );
}
