import { useParams } from 'react-router-dom';
import { useGetVenue } from '../api/venues/useGetVenue.ts';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities.ts';
import { usePageTitle } from '../utils/usePageTitle.ts';
import styles from './Venue.module.css';

export default function VenuePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: venue, isLoading, error } = useGetVenue({ slug: slug! });
  usePageTitle(venue ? decodeHtmlEntities(venue.title?.rendered ?? '') : null);

  if (isLoading) return <div>Loading...</div>;
  if (error || !venue) return <div>Venue not found</div>;

  const { alternate_name, name_pronunciation, building, room, street_address, city, province, postal_code, country, phone, website_url, description } = venue.venue_data;

  const buildingLine = [building, room].filter(Boolean).join(', ');
  const addressLine = [street_address, city, province, postal_code, country].filter(Boolean).join(', ');

  return (
    <main className={styles.page}>
      <p className={styles.eyebrow}>Venue</p>
      <h1 className={styles.name}>{decodeHtmlEntities(venue.title?.rendered ?? '')}</h1>
      {name_pronunciation && <p className={styles.pronunciation}>{name_pronunciation}</p>}
      {alternate_name && <p className={styles.alternateName}>(formerly {alternate_name})</p>}
      {buildingLine && <p className={styles.building}>{buildingLine}</p>}
      {addressLine && <p className={styles.address}>{addressLine}</p>}
      {phone && <p className={styles.phone}>{phone}</p>}
      {website_url && <a href={website_url} className={styles.websiteLink}>Visit website →</a>}
      {description && <div className={styles.description} dangerouslySetInnerHTML={{ __html: description }} />}
    </main>
  );
}
