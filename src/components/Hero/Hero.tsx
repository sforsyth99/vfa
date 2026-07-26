import { useIntl } from 'react-intl';
import heroImage from '../../assets/VFA-2026_Facebook-Cover-Photo-scaled.jpg';
import styles from './Hero.module.css';

export function Hero() {
  const intl = useIntl();
  return (
    <div className={styles.hero}>
      <h1 className="sr-only">{intl.formatMessage({ id: 'hero.heading' })}</h1>
      <img
        src={heroImage}
        alt={intl.formatMessage({ id: 'hero.imageAlt' })}
        className={styles.image}
      />
    </div>
  );
}
