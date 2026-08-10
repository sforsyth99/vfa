import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import styles from './Footer.module.css';
import logoSrc from '../../assets/VFA_Logo.png';
import titleSponsorSrc from '../../assets/titleSponsor/MunrosBooks.jpg';
import calfStampSrc from '../../assets/CALF-Member_Stamp_Primary.png';
import SocialIcons from '../SocialIcons/SocialIcons';
import NewsletterSignup from '../NewsletterSignup/NewsletterSignup';
import { FOOTER_NAV } from '../../config/menus';
import { track } from '../../utils/analytics';

const sponsorImages = import.meta.glob('../../assets/sponsors/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' });
const sponsorLogos: string[] = Object.values(sponsorImages) as string[];

function Footer() {
  const intl = useIntl();
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className={styles.footer}>
      <div className={styles.footerBrand}>
        <Link to="/" className={styles.footerLogoLink}>
          <img
            src={logoSrc}
            alt={intl.formatMessage({ id: 'app.title' })}
            className={styles.footerLogo}
          />
        </Link>
      </div>

      <nav className={styles.footerNav} aria-label={intl.formatMessage({ id: 'footer.menu.label' })}>
        {FOOTER_NAV.map((group) => (
          <div key={group.heading} className={styles.footerNavGroup}>
            <p className={styles.footerNavHeading}>{group.heading}</p>
            <ul className={styles.footerNavList}>
              {group.items.map((item) => {
                const linkClass = item.featured
                  ? `${styles.footerNavLink} ${styles.footerNavLinkFeatured}`
                  : styles.footerNavLink;
                return (
                  <li key={item.to}>
                    {item.external ? (
                      <a
                        href={item.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                        onClick={item.trackingLabel === 'donate' ? () => track({ name: 'donate_click', event_location: 'footer' }) : undefined}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link to={item.to} className={linkClass}>{item.label}</Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className={styles.newsletterSocialRow}>
        <div className={styles.newsletterWrapper}>
          <NewsletterSignup location="footer" />
        </div>
        <SocialIcons />
      </div>

      <div className={styles.sponsorsContainer}>
        <div className={styles.titleSponsorRow}>
          <p className={styles.titleSponsorLabel}>
            {intl.formatMessage({ id: 'footer.sponsor.titleLabel' })}
          </p>
          <img
            src={titleSponsorSrc}
            alt={intl.formatMessage({ id: 'footer.sponsor.titleAlt' })}
            className={styles.titleSponsorLogo}
            loading="lazy"
          />
        </div>
        {sponsorLogos.length > 0 && (
          <div className={styles.sponsorRow}>
            {sponsorLogos.map((src: string, idx: number) => (
              <img
                key={idx}
                src={src}
                alt={intl.formatMessage({ id: 'footer.sponsor.logoAlt' })}
                className={styles.sponsorLogo}
                loading="lazy"
              />
            ))}
          </div>
        )}
        <div className={styles.calfWrapper}>
          <img
            src={calfStampSrc}
            alt={intl.formatMessage({ id: 'footer.calf.alt' })}
            className={styles.calfStamp}
            loading="lazy"
          />
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p className={styles.footerAcknowledgement}>
          <FormattedMessage id="footer.landAcknowledgement" />
        </p>
        <p className={styles.footerCopyright}>
          <FormattedMessage id="footer.copyright" values={{ year }} />
        </p>
      </div>
    </footer>
  );
}

export default Footer;
