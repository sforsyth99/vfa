import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import styles from './Header.module.css';
import logo from '../../assets/VFA_Logo.png';
import { PRIMARY_NAV } from '../../config/menus';
import { track } from '../../utils/analytics';
import { SearchWidget } from '../SearchWidget/SearchWidget';

const DONATE_URL = 'https://www.canadahelps.org/en/charities/victoria-festival-of-authors-society/';

function Header() {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);
  const donateLabel = intl.formatMessage({ id: 'nav.donate' });

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link to="/" className={styles.logoLink}>
          <img src={logo} alt={intl.formatMessage({ id: 'app.title' })} className={styles.logo} />
        </Link>
        <nav
          id="primary-nav"
          className={`${styles.nav} ${isOpen ? styles.navOpen : ''}`}
          aria-label="Main navigation"
        >
          <ul className={styles.navList}>
            {PRIMARY_NAV.map((item) => (
              <li key={item.to}>
                {item.external ? (
                  <a href={item.to} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
                    {item.label}
                  </a>
                ) : (
                  <Link to={item.to} onClick={closeMenu}>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <a
            href={DONATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.donateMobile}
            onClick={() => track({ name: 'donate_click', event_location: 'header_mobile' })}
          >
            {donateLabel}
          </a>
        </nav>
        <a
          href={DONATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.donateButton}
          onClick={() => track({ name: 'donate_click', event_location: 'header_desktop' })}
        >
          {donateLabel}
        </a>
        <div className={styles.headerRight}>
          <SearchWidget />
          <button
            className={`${styles.menuButton} ${isOpen ? styles.menuButtonOpen : ''}`}
            onClick={() => setIsOpen((o) => !o)}
            aria-expanded={isOpen}
            aria-controls="primary-nav"
            aria-label={
              isOpen
                ? intl.formatMessage({ id: 'nav.close' })
                : intl.formatMessage({ id: 'nav.open' })
            }
          >
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
