import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import styles from './Header.module.css';
import logo from '../../assets/VFA_Logo.png';
import { PRIMARY_NAV } from '../../config/menus';
import { track } from '../../utils/analytics';
import { SearchWidget } from '../SearchWidget/SearchWidget';

const TICKETS_URL = 'https://www.eventbrite.ca/o/victoria-festival-of-authors-11095513695';

function Header() {
  const intl = useIntl();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);
  const ticketsLabel = intl.formatMessage({ id: 'nav.getTickets' });

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link to="/" className={styles.logoLink}>
          <img src={logo} alt={intl.formatMessage({ id: 'app.title' })} className={styles.logo} />
        </Link>
        <nav
          id="primary-nav"
          className={`${styles.nav} ${isOpen ? styles.navOpen : ''}`}
          aria-label={intl.formatMessage({ id: 'nav.primaryLabel' })}
        >
          <ul className={styles.navList}>
            {PRIMARY_NAV.map((item) => (
              <li
                key={item.to}
                className={
                  item.highlightWhenActive && location.pathname === item.to
                    ? styles.navItemActive
                    : undefined
                }
              >
                {item.external ? (
                  <a href={item.to} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
                    {item.label}
                  </a>
                ) : (
                  <NavLink
                    to={item.to}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      !item.highlightWhenActive && isActive ? styles.navLinkCurrent : undefined
                    }
                  >
                    {item.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
          <a
            href={TICKETS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ticketsMobile}
            onClick={() => track({ name: 'get_tickets_click', event_location: 'header_mobile' })}
          >
            {ticketsLabel}
          </a>
        </nav>
        <div className={styles.headerRight}>
          <a
            href={TICKETS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ticketsButton}
            onClick={() => track({ name: 'get_tickets_click', event_location: 'header_desktop' })}
          >
            {ticketsLabel}
          </a>
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
