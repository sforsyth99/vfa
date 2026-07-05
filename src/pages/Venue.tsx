import { useParams } from 'react-router-dom';
import { useGetVenue } from '../api/venues/useGetVenue.ts';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities.ts';
import styles from './Venue.module.css';

export default function VenuePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: venue, isLoading, error } = useGetVenue({ slug: slug! });

  if (isLoading) return <div>Loading...</div>;
  if (error || !venue) return <div>Venue not found</div>;

  const { alternate_name, address, online_url, description } = venue.venue_data;

  return (
    <main className={styles.page}>
      <p className={styles.eyebrow}>Venue</p>
      <h1 className={styles.name}>{decodeHtmlEntities(venue.title.rendered)}</h1>
      {alternate_name && <p className={styles.alternateName}>{alternate_name}</p>}
      {address && <p className={styles.address}>{address}</p>}
      {online_url && <a href={online_url} className={styles.onlineLink}>Join online →</a>}
      {description && <p className={styles.description}>{description}</p>}
    </main>
  );
}
