import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import { useGetPrimaryMenu } from '../api/menus/useGetPrimaryMenu';
import { useGetMenuItems } from '../api/menus/useGetMenuItems';
import { useGetPages } from '../api/pages/useGetPages';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities';
import type { MenuItem } from '../api/menus/menuTypes.ts';
import type { Page } from '../api/pages/pageTypes';
import vfaLogo from '../assets/VFA_Logo.png';

function Header() {
  const { data: menuLocation } = useGetPrimaryMenu();
  const { data: menuItems, isLoading } = useGetMenuItems(menuLocation?.menu ?? 0);
  const { data: pages } = useGetPages();

  const topLevelItems = (menuItems ?? [])
    .filter((item: MenuItem) => item.parent === 0)
    .sort((a: MenuItem, b: MenuItem) => a.menu_order - b.menu_order);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/">
          <img src={vfaLogo} alt="Victoria Festival of Authors" className={styles.logo} />
        </Link>
        <div className={styles.right}>
          {!isLoading && topLevelItems.length > 0 && (
            <ul className={styles.navList}>
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
          <a
            href="https://victoriafestivalofauthors.ca/tickets"
            className={styles.cta}
            target="_blank"
            rel="noopener noreferrer"
          >
            Get tickets
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;
