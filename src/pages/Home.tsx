import styles from './Home.module.css';
import InfinitePosts from '../components/InfinitePosts';

export function HomePage() {
  return (<main id="main-content" className={styles.homeMain}>
    <InfinitePosts />
  </main>);
}

export default HomePage;