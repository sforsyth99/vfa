import React from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import styles from './Header.module.css';
import logo from '../assets/VFA_Logo.png';
import { useGetPrimaryMenu } from '../api/menus/useGetPrimaryMenu';
import { useGetMenuItems } from '../api/menus/useGetMenuItems';
import { useGetPages } from '../api/pages/useGetPages';
import type { MenuItem } from '../api/menus/menuTypes.ts';
import type { Page } from '../api/pages/pageTypes';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities';

function renderMenuItems(menuItems: MenuItem[], pages: Page[] = [], parentId = 0): React.ReactNode {
  const items = menuItems
    .filter((item: MenuItem) => item.parent === parentId)
    .sort((a: MenuItem, b: MenuItem) => a.menu_order - b.menu_order);
  if (!items.length) return null;
  return (
    <ul className={parentId === 0 ? styles.navList : styles.subMenu}>
      {items.map((item: MenuItem) => {
        let pageMatch = null;
        if (pages && pages.length) {
          pageMatch = pages.find(
            (page) =>
              item.url.endsWith(`/pages/${page.slug}`) ||
              item.url.replace(/^https?:\/\/[^/]+/, '') === `/pages/${page.slug}` ||
              item.url.replace(/^https?:\/\/[^/]+/, '') === `/${page.slug}` ||
              item.url === page.link,
          );
        }
        const isExternal = /^https?:\/\//.test(item.url) && !pageMatch;
        const linkTo = pageMatch ? `/pages/${pageMatch.slug}` : (item.url.replace(/^https?:\/\/[^/]+/, '') || '/');
        return (
          <li key={item.id}>
            {isExternal ? (
              <a href={item.url} target="_blank" rel="noopener noreferrer">{decodeHtmlEntities(item.title.rendered)}</a>
            ) : (
              <Link to={linkTo}>{decodeHtmlEntities(item.title.rendered)}</Link>
            )}
            {renderMenuItems(menuItems, pages, item.id)}
          </li>
        );
      })}
    </ul>
  );
}

function Header() {
  const intl = useIntl();
  const { data: menuLocation, isLoading: loadingMenu, error: menuError } = useGetPrimaryMenu();
  const menuId = menuLocation?.menu;
  const { data: menuItems, isLoading: loadingItems, error: itemsError } = useGetMenuItems(menuId ?? 0);
  const { data: pages, isLoading: loadingPages, error: pagesError } = useGetPages();

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link to="/" className={styles.logoLink}>
          <img src={logo} alt={intl.formatMessage({ id: 'app.title' })} className={styles.logo} />
        </Link>
        <nav className={styles.nav}>
          {(loadingMenu || loadingItems || loadingPages) ? (
            <div>{intl.formatMessage({ id: 'nav.loading' })}</div>
          ) : menuError || itemsError || pagesError ? (
            <div>{intl.formatMessage({ id: 'nav.error' })}</div>
          ) : (
            <>
              {menuItems && renderMenuItems(menuItems, pages)}
            </>
          )}
        </nav>
        <a
          href="https://www.canadahelps.org/en/charities/victoria-festival-of-authors-society/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.donateButton}
        >
          {intl.formatMessage({ id: 'nav.donate' })}
        </a>
      </div>
    </header>
  );
}

export default Header;
