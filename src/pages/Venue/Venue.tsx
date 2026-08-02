import { useParams } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { useGetVenue } from '../../api/venues/useGetVenue.ts';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities.ts';
import { sanitizeHtml } from '../../utils/sanitizeHtml';
import { usePageTitle } from '../../utils/usePageTitle.ts';
import { Container } from '../../components/Container/Container';
import { Eyebrow } from '../../components/Eyebrow/Eyebrow';
import { PageTitle } from '../../components/PageTitle/PageTitle';
import { PageLoader } from '../../components/PageLoader/PageLoader';
import { VenueMapRow } from '../../components/VenueMapRow/VenueMapRow.tsx';
import styles from './Venue.module.css';

export default function VenuePage() {
  const intl = useIntl();
  const { slug } = useParams<{ slug: string }>();
  const { data: venue, isLoading, error } = useGetVenue({ slug: slug! });
  usePageTitle(venue ? decodeHtmlEntities(venue.title?.rendered ?? '') : null);

  if (isLoading) return <PageLoader />;
  if (error || !venue) return <div><FormattedMessage id="venue.notFound" /></div>;

  const { alternate_name, name_pronunciation, building, room, street_address, city, province, postal_code, country, phone, website_url, description, accessibility } = venue.venue_data;

  const buildingLine = [building, room].filter(Boolean).join(', ');
  const addressLine = [street_address, city, province, postal_code, country].filter(Boolean).join(', ');

  return (
    <main id="main-content" className={styles.page}>
      <Container narrow>
        <Eyebrow><FormattedMessage id="venue.eyebrow" /></Eyebrow>
        <PageTitle>{decodeHtmlEntities(venue.title?.rendered ?? '')}</PageTitle>
        <VenueMapRow venue={venue.venue_data}>
          {name_pronunciation && <p className={styles.pronunciation}>{name_pronunciation}</p>}
          {alternate_name && <p className={styles.alternateName}>{intl.formatMessage({ id: 'venue.formerly' }, { name: alternate_name })}</p>}
          {buildingLine && <p className={styles.building}>{buildingLine}</p>}
          {addressLine && <p className={styles.address}>{addressLine}</p>}
          {phone && <p className={styles.phone}>{phone}</p>}
          {website_url && <a href={website_url} className={styles.websiteLink}><FormattedMessage id="venue.visitWebsite" /></a>}
        </VenueMapRow>
        {description && <div className={styles.description} dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }} />}
        {accessibility && (
          <div className={styles.accessibility}>
            <h2 className={styles.accessibilityHeading}><FormattedMessage id="venue.accessibility" /></h2>
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(accessibility) }} />
          </div>
        )}
      </Container>
    </main>
  );
}
