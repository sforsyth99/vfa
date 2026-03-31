import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header: React.FC = () => (
  <header className={styles.header}>
    <nav>
      <ul className={styles.navList}>
        <li><Link to="/events">Events</Link></li>
        <li><Link to="/books">Books</Link></li>
        <li><Link to="/authors">Authors</Link></li>
        <li><Link to="/venues">Venues</Link></li>
        <li><Link to="/organizers">Organizers</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </nav>
  </header>
);

export default Header;
