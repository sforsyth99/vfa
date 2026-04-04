import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGetMenus } from '../api/menus/useGetMenus';
import { useGetMenuItems } from '../api/menus/useGetMenuItems';
import { useGetPages } from '../api/pages/useGetPages';
import styles from './Footer.module.css';
import en from '../locales/en.json';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities';
import type { MenuItem } from '../api/menus/menuTypes';
import type { Page } from '../api/pages/pageTypes';

function renderMenuItems(menuItems: MenuItem[], pages: Page[] = [], parentId = 0): React.ReactNode {
  const items = menuItems.filter((item: MenuItem) => item.parent === parentId).sort((a: MenuItem, b: MenuItem) => a.menu_order - b.menu_order);
  if (!items.length) return null;
  return (
    <ul className={parentId === 0 ? styles.footerNavList : styles.footerSubMenu}>
      {items.map((item: MenuItem) => {
        let pageMatch: Page | null = null;
        if (pages && pages.length) {
          pageMatch = pages.find((page: Page) =>
            item.url.endsWith(`/pages/${page.slug}`) ||
            item.url.replace(/^https?:\/\/[^/]+/, '') === `/pages/${page.slug}` ||
            item.url.replace(/^https?:\/\/[^/]+/, '') === `/${page.slug}` ||
            item.url === page.link,
          ) || null;
        }
        const isExternal = /^https?:\/\//.test(item.url) && !pageMatch;
        const linkTo = pageMatch ? `/pages/${pageMatch.slug}` : (item.url.replace(/^https?:\/\/[^/]+/, '') || '/');
        return (
          <li key={item.id}>
            {isExternal ? (
              <a href={item.url} target="_blank" rel="noopener noreferrer"
                 className={styles.footerNavLink}>{decodeHtmlEntities(item.title.rendered)}</a>
            ) : (
              <Link to={linkTo} className={styles.footerNavLink}>{decodeHtmlEntities(item.title.rendered)}</Link>
            )}
            {renderMenuItems(menuItems, pages, item.id)}
          </li>
        );
      })}
    </ul>
  );
}

function Footer() {
  // Use the localized land acknowledgement
  const landAcknowledgement = useMemo(() => en['footer.landAcknowledgement'], []);
  // Get all menus and find the footer menu by slug
  const { data: menus } = useGetMenus();
  const footerMenu = menus?.find(menu => menu.slug === 'footer');
  const footerMenuId = footerMenu?.id;
  const { data: menuItems } = useGetMenuItems(footerMenuId ?? 0);
  const { data: pages } = useGetPages();

  return (
    <footer className={styles.footer}>
      {menuItems && menuItems.length > 0 && (
        <nav style={{ marginBottom: '1.5em' }} aria-label="Footer menu">
          {renderMenuItems(menuItems, pages)}
        </nav>
      )}
      <p style={{ marginBottom: '1em', fontSize: '0.95em' }}>{landAcknowledgement}</p>
      <p>&copy; {new Date().getFullYear()} Author Festival. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
