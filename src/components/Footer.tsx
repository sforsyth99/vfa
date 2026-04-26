import { Link } from 'react-router-dom';
import { useGetMenus } from '../api/menus/useGetMenus';
import { useGetMenuItems } from '../api/menus/useGetMenuItems';
import { useGetPages } from '../api/pages/useGetPages';
import styles from './Footer.module.css';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities';
import type { MenuItem } from '../api/menus/menuTypes';
import type { Page } from '../api/pages/pageTypes';
import vfaLogo from '../assets/VFA_Logo.png';
import munrosBooks from '../assets/titleSponsor/MunrosBooks.jpg';

const sponsorImages = import.meta.glob('../assets/sponsors/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' });
const sponsorLogos: string[] = Object.values(sponsorImages) as string[];

function Footer() {
  const { data: menus } = useGetMenus();
  const footerMenu = menus?.find(menu => menu.slug === 'footer');
  const { data: menuItems } = useGetMenuItems(footerMenu?.id ?? 0);
  const { data: pages } = useGetPages();

  const topLevelItems = (menuItems ?? [])
    .filter((item: MenuItem) => item.parent === 0)
    .sort((a: MenuItem, b: MenuItem) => a.menu_order - b.menu_order);

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <div className={styles.brandCol}>
            <img src={vfaLogo} alt="Victoria Festival of Authors" className={styles.logo} />
            <p className={styles.tagline}>
              An annual celebration of writers, readers, and the literary
              community gathered on Lekwungen and W̱SÁNEĆ territory.
            </p>
            <div className={styles.socialLinks}>
              <a href="https://www.instagram.com/victoriafestivalofauthors/" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://bsky.app/profile/victoriafestivalofauthors.ca" target="_blank" rel="noopener noreferrer">Bluesky</a>
              <a href="https://victoriafestivalofauthors.ca/newsletter" target="_blank" rel="noopener noreferrer">Newsletter</a>
            </div>
          </div>
          <div>
            <div className={styles.sponsorLabel}>Title sponsor</div>
            <div className={styles.titleSponsorBox}>
              <img src={munrosBooks} alt="Munro's Books" className={styles.titleSponsorLogo} />
              <div className={styles.titleSponsorInfo}>
                <div className={styles.titleSponsorEyebrow}>Presented in partnership with</div>
                <div className={styles.titleSponsorName}>Munro's Books</div>
                <div className={styles.titleSponsorDesc}>Victoria's beloved independent bookseller since 1963.</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.supportersLabel}>Supporters &amp; partners</div>
        <div className={styles.sponsorGrid}>
          {sponsorLogos.map((src: string, idx: number) => (
            <div className={styles.sponsorCell} key={idx}>
              <img src={src} alt="Sponsor" />
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} Victoria Festival of Authors · Registered charity</span>
          {topLevelItems.length > 0 && (
            <ul className={styles.footerNavList}>
              {topLevelItems.map((item: MenuItem) => {
                const pageMatch = pages?.find((page: Page) =>
                  item.url.endsWith(`/pages/${page.slug}`) ||
                  item.url.replace(/^https?:\/\/[^/]+/, '') === `/pages/${page.slug}` ||
                  item.url.replace(/^https?:\/\/[^/]+/, '') === `/${page.slug}` ||
                  item.url === page.link,
                );
                const isExternal = /^https?:\/\//.test(item.url) && !pageMatch;
                const linkTo = pageMatch
                  ? `/pages/${pageMatch.slug}`
                  : (item.url.replace(/^https?:\/\/[^/]+/, '') || '/');
                return (
                  <li key={item.id}>
                    {isExternal ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        {decodeHtmlEntities(item.title.rendered)}
                      </a>
                    ) : (
                      <Link to={linkTo}>{decodeHtmlEntities(item.title.rendered)}</Link>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          <span>Land acknowledgement · Accessibility · Privacy</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
