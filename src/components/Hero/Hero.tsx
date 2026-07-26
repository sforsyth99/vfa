import { useIntl } from 'react-intl';
import heroImage from '../../assets/VFA-2026_Facebook-Cover-Photo-scaled.jpg';
import styles from './Hero.module.css';

export function Hero() {
  const intl = useIntl();
  return (
    <div className={styles.hero}>
      <img
        src={heroImage}
        alt={intl.formatMessage({ id: 'hero.alt' })}
        className={styles.image}
      />
    </div>
  );
}
