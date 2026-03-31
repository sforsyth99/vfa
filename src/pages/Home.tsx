import styles from './Home.module.css';
import { TribeEventCard } from '../components/TribeEventCard.tsx';

export function HomePage() {
  return (<main id="main-content" className={styles.homeMain}>

    <TribeEventCard eventSlug={'7195'} venueSlug={'7196'} />
  </main>);
}

export default HomePage;