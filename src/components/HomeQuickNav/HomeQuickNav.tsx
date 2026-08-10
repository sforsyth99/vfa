import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import styles from './HomeQuickNav.module.css';

const TILES = [
  { to: '/events', titleId: 'home.quickNav.events.title', descId: 'home.quickNav.events.desc' },
  { to: '/authors', titleId: 'home.quickNav.authors.title', descId: 'home.quickNav.authors.desc' },
  { to: '/kidsfest2026', titleId: 'home.quickNav.kidsfest.title', descId: 'home.quickNav.kidsfest.desc' },
  { to: '/interviews', titleId: 'home.quickNav.interviews.title', descId: 'home.quickNav.interviews.desc' },
];

export function HomeQuickNav() {
  const intl = useIntl();
  return (
    <nav className={styles.section} aria-label={intl.formatMessage({ id: 'home.quickNav.label' })}>
      <div className={styles.grid}>
        {TILES.map(({ to, titleId, descId }) => (
          <Link key={to} to={to} className={styles.tile}>
            <span className={styles.tileBody}>
              <span className={styles.tileTitle}>{intl.formatMessage({ id: titleId })}</span>
              <span className={styles.tileDesc}>{intl.formatMessage({ id: descId })}</span>
            </span>
            <span className={styles.tileChevron} aria-hidden="true">›</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
