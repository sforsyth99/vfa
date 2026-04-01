import React, { useState } from 'react';
import { useGetMenus } from '../api/menus/useGetMenus';
import { useGetMenuItems } from '../api/menus/useGetMenuItems';
import type { MenuItem } from '../api/menus/menuItemTypes';

const Menus: React.FC = () => {
  const { data, isLoading, error } = useGetMenus();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const handleToggle = (menuId: number) => {
    setOpenMenuId(openMenuId === menuId ? null : menuId);
  };

  return (
    <div>
      <h1>Menus</h1>
      {isLoading && <div>Loading menus...</div>}
      {error && <div>Error loading menus: {String(error)}</div>}
      {data && data.length > 0 ? (
        <ul>
          {data.map(menu => (
            <li key={menu.id}>
              <button onClick={() => handleToggle(menu.id)} style={{ fontWeight: 'bold' }}>
                {menu.name} (slug: {menu.slug})
              </button>
              <div>Description: {menu.description || <em>No description</em>}</div>
              {openMenuId === menu.id && <MenuItemsList menuId={menu.id} />}
            </li>
          ))}
        </ul>
      ) : (
        !isLoading && <div>No menus found.</div>
      )}
    </div>
  );
};

const MenuItemsList: React.FC<{ menuId: number }> = ({ menuId }) => {
  const { data, isLoading, error } = useGetMenuItems(menuId);
  if (isLoading) return <div>Loading menu items...</div>;
  if (error) return <div>Error loading menu items: {String(error)}</div>;
  if (!data || data.length === 0) return <div>No items in this menu.</div>;

  // Helper type for tree nodes
  type MenuItemNode = MenuItem & { children: MenuItemNode[] };

  // Build a tree from the flat array
  const buildTree = (items: MenuItem[]): MenuItemNode[] => {
    const map = new Map<number, MenuItemNode>();
    const roots: MenuItemNode[] = [];
    items.forEach(item => {
      map.set(item.id, { ...item, children: [] });
    });
    map.forEach(item => {
      if (item.parent && map.has(item.parent)) {
        map.get(item.parent)!.children.push(map.get(item.id)!);
      } else {
        roots.push(map.get(item.id)!);
      }
    });
    return roots;
  };

  const renderTree = (items: MenuItemNode[]) => (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <a href={item.url} target="_blank" rel="noopener noreferrer">{item.title?.rendered || item.url}</a>
          {item.children.length > 0 && renderTree(item.children)}
        </li>
      ))}
    </ul>
  );

  const tree = buildTree(data);
  return renderTree(tree);
};

export default Menus;
