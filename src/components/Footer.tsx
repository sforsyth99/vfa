import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => (
    <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Author Festival. All rights reserved.</p>
    </footer>
);

export default Footer;
