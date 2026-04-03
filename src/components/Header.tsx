import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import { useGetPrimaryMenu } from '../api/menus/useGetPrimaryMenu';
import { useGetMenuItems } from '../api/menus/useGetMenuItems';
import { useGetPages } from '../api/pages/useGetPages';
import type { MenuItem } from '../api/menus/menuTypes.ts';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities';

function renderMenuItems(menuItems: MenuItem[], parentId = 0): React.ReactNode {
  const items = menuItems
    .filter((item: MenuItem) => item.parent === parentId)
    .sort((a: MenuItem, b: MenuItem) => a.order - b.order);
  if (!items.length) return null;
  return (
    <ul className={parentId === 0 ? styles.navList : styles.subMenu}>
      {items.map((item: MenuItem) => (
        <li key={item.id}>
          <Link to={item.url.replace(/^https?:\/\/[^/]+/, '') || '/'}>{decodeHtmlEntities(item.title.rendered)}</Link>
          {renderMenuItems(menuItems, item.id)}
        </li>
      ))}
    </ul>
  );
}

const Header: React.FC = () => {
  const { data: menuLocation, isLoading: loadingMenu, error: menuError } = useGetPrimaryMenu();
  const menuId = menuLocation?.menu;
  const { data: menuItems, isLoading: loadingItems, error: itemsError } = useGetMenuItems(menuId ?? 0);
  const { data: pages, isLoading: loadingPages, error: pagesError } = useGetPages();

  return (
    <header className={styles.header}>
      <nav>
        {(loadingMenu || loadingItems || loadingPages) ? (
          <div>Loading menu...</div>
        ) : menuError || itemsError || pagesError ? (
          <div>Error loading menu</div>
        ) : (
          <>
            {menuItems && renderMenuItems(menuItems)}
            {pages && (
              <ul className={styles.navList}>
                {pages.map((page) => (
                  <li key={page.id}>
                    <Link to={`/pages/${page.slug}`}>{decodeHtmlEntities(page.title.rendered)}</Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
