import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import { useGetPrimaryMenu } from '../api/menus/useGetPrimaryMenu';
import { useGetMenuItems } from '../api/menus/useGetMenuItems';
import type { MenuItem } from '../api/menus/types';
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

  return (
    <header className={styles.header}>
      <nav>
        {loadingMenu || loadingItems ? (
          <div>Loading menu...</div>
        ) : menuError || itemsError ? (
          <div>Error loading menu</div>
        ) : (
          menuItems && renderMenuItems(menuItems)
        )}
      </nav>
    </header>
  );
};

export default Header;
