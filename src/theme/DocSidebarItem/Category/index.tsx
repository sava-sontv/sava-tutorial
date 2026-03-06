/**
 * DocSidebarItem Category - format label: slug → title (VD: avatars → Avatars, Save-Intro → Save Intro).
 */
import React, { useEffect, useMemo } from 'react';
import clsx from 'clsx';
import {
  ThemeClassNames,
  useThemeConfig,
  usePrevious,
  Collapsible,
  useCollapsible,
} from '@docusaurus/theme-common';
import { isSamePath } from '@docusaurus/theme-common/internal';
import type {
  PropSidebarItemCategory,
  PropSidebarItem,
  PropSidebarItemLink,
} from '@docusaurus/plugin-content-docs';
import {
  isActiveSidebarItem,
  findFirstSidebarItemLink,
  useDocSidebarItemsExpandedState,
  useVisibleSidebarItems,
} from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import useIsBrowser from '@docusaurus/useIsBrowser';
import DocSidebarItems from '@theme/DocSidebarItems';
import DocSidebarItemLink from '@theme/DocSidebarItem/Link';
import { useLocation } from '@docusaurus/router';
import { slugToTitle, isSlugLike, getPathForDocPath } from '@site/src/data/categories';
import styles from './styles.module.css';

function useAutoExpandActiveCategory({
  isActive,
  collapsed,
  updateCollapsed,
  activePath,
}: {
  isActive: boolean;
  collapsed: boolean;
  updateCollapsed: (toCollapsed?: boolean) => void;
  activePath: string;
}): void {
  const wasActive = usePrevious(isActive);
  const previousActivePath = usePrevious(activePath);
  useEffect(() => {
    const justBecameActive = isActive && !wasActive;
    const stillActiveButPathChanged =
      isActive && wasActive && activePath !== previousActivePath;
    if ((justBecameActive || stillActiveButPathChanged) && collapsed) {
      updateCollapsed(false);
    }
  }, [
    isActive,
    wasActive,
    collapsed,
    updateCollapsed,
    activePath,
    previousActivePath,
  ]);
}

function useCategoryHrefWithSSRFallback(
  item: PropSidebarItemCategory
): string | undefined {
  const isBrowser = useIsBrowser();
  return useMemo(() => {
    let href: string | undefined;
    if (item.href && !item.linkUnlisted) {
      href = item.href;
    } else if (isBrowser || !item.collapsible) {
      href = undefined;
    } else {
      href = findFirstSidebarItemLink(item);
    }
    return href ? (getPathForDocPath(href) ?? href) : undefined;
  }, [item, isBrowser]);
}

function CollapseButton({
  collapsed,
  categoryLabel,
  onClick,
}: {
  collapsed: boolean;
  categoryLabel: string;
  onClick: (e: React.MouseEvent) => void;
}): React.ReactElement {
  return (
    <button
      aria-label={
        collapsed
          ? translate(
              {
                id: 'theme.DocSidebarItem.expandCategoryAriaLabel',
                message: "Expand sidebar category '{label}'",
                description: 'The ARIA label to expand the sidebar category',
              },
              { label: categoryLabel },
            )
          : translate(
              {
                id: 'theme.DocSidebarItem.collapseCategoryAriaLabel',
                message: "Collapse sidebar category '{label}'",
                description: 'The ARIA label to collapse the sidebar category',
              },
              { label: categoryLabel },
            )
      }
      aria-expanded={!collapsed}
      type="button"
      className="clean-btn menu__caret"
      onClick={onClick}
    />
  );
}

function CategoryLinkLabel({ label }: { label: string }): React.ReactElement {
  return (
    <span title={label} className={styles.categoryLinkLabel}>
      {label}
    </span>
  );
}

export default function DocSidebarItemCategory(props: {
  item: PropSidebarItemCategory;
  onItemClick?: (item: PropSidebarItem) => void;
  activePath: string;
  level: number;
  index: number;
}): React.ReactElement {
  const visibleChildren = useVisibleSidebarItems(
    props.item.items,
    props.activePath,
  );
  if (visibleChildren.length === 0) {
    return <DocSidebarItemCategoryEmpty {...props} />;
  }
  return <DocSidebarItemCategoryCollapsible {...props} />;
}

function isCategoryWithHref(category: PropSidebarItemCategory): boolean {
  return typeof category.href === 'string';
}

function DocSidebarItemCategoryEmpty({
  item,
  ...props
}: {
  item: PropSidebarItemCategory;
  onItemClick?: (item: PropSidebarItem) => void;
  activePath: string;
  level: number;
  index: number;
}): React.ReactElement | null {
  if (!isCategoryWithHref(item)) {
    return null;
  }
  const {
    type: _type,
    collapsed: _collapsed,
    collapsible: _collapsible,
    items: _items,
    linkUnlisted: _linkUnlisted,
    ...forwardableProps
  } = item;
  const resolvedHref = getPathForDocPath(item.href!) ?? item.href!;
  const linkItem: PropSidebarItemLink = {
    type: 'link',
    href: resolvedHref,
    label: item.label,
    ...forwardableProps,
  };
  return <DocSidebarItemLink item={linkItem} {...props} />;
}

function DocSidebarItemCategoryCollapsible({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}: {
  item: PropSidebarItemCategory;
  onItemClick?: (item: PropSidebarItem) => void;
  activePath: string;
  level: number;
  index: number;
}): React.ReactElement {
  const { items, label, collapsible, className, href } = item;
  const { pathname } = useLocation();
  const rawLabel = typeof label === 'string' ? label : String(label ?? '');
  const displayLabel = isSlugLike(rawLabel) ? slugToTitle(rawLabel) : rawLabel;
  const {
    docs: {
      sidebar: { autoCollapseCategories },
    },
  } = useThemeConfig();
  const hrefWithSSRFallback = useCategoryHrefWithSSRFallback(item);
  const pathnameNorm = pathname.replace(/^\/(en|vi)\//, '/');
  const hrefNorm = hrefWithSSRFallback
    ? hrefWithSSRFallback.replace(/^\/(en|vi)\//, '/')
    : '';
  const isActive = isActiveSidebarItem(item, activePath);
  const isCurrentPage =
    isSamePath(href, activePath) ||
    (hrefNorm !== '' && pathnameNorm === hrefNorm);
  const { collapsed, setCollapsed } = useCollapsible({
    initialState: () => {
      if (!collapsible) {
        return false;
      }
      return isActive ? false : (item.collapsed ?? false);
    },
  });
  const { expandedItem, setExpandedItem } = useDocSidebarItemsExpandedState();
  const updateCollapsed = (toCollapsed = !collapsed) => {
    setExpandedItem(toCollapsed ? null : index);
    setCollapsed(toCollapsed);
  };
  useAutoExpandActiveCategory({
    isActive,
    collapsed,
    updateCollapsed,
    activePath,
  });
  useEffect(() => {
    if (
      collapsible &&
      expandedItem != null &&
      expandedItem !== index &&
      autoCollapseCategories
    ) {
      setCollapsed(true);
    }
  }, [collapsible, expandedItem, index, setCollapsed, autoCollapseCategories]);
  const handleItemClick = (e: React.MouseEvent) => {
    onItemClick?.(item);
    if (collapsible) {
      if (href) {
        if (isCurrentPage) {
          e.preventDefault();
          updateCollapsed();
        } else {
          updateCollapsed(false);
        }
      } else {
        e.preventDefault();
        updateCollapsed();
      }
    }
  };
  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemCategory,
        ThemeClassNames.docs.docSidebarItemCategoryLevel(level),
        'menu__list-item',
        {
          'menu__list-item--collapsed': collapsed,
        },
        className,
      )}>
      <div
        className={clsx('menu__list-item-collapsible', {
          'menu__list-item-collapsible--active': isCurrentPage,
        })}>
        <Link
          className={clsx(styles.categoryLink, 'menu__link', {
            'menu__link--sublist': collapsible,
            'menu__link--sublist-caret': !href && collapsible,
            'menu__link--active': isActive,
          })}
          onClick={handleItemClick}
          aria-current={isCurrentPage ? 'page' : undefined}
          role={collapsible && !href ? 'button' : undefined}
          aria-expanded={collapsible && !href ? !collapsed : undefined}
          href={collapsible ? hrefWithSSRFallback ?? '#' : hrefWithSSRFallback}
          {...props}>
          <CategoryLinkLabel label={displayLabel} />
        </Link>
        {href && collapsible && (
          <CollapseButton
            collapsed={collapsed}
            categoryLabel={displayLabel}
            onClick={(e) => {
              e.preventDefault();
              updateCollapsed();
            }}
          />
        )}
      </div>
      <Collapsible lazy as="ul" className="menu__list" collapsed={collapsed}>
        <DocSidebarItems
          items={items ?? []}
          tabIndex={collapsed ? -1 : 0}
          onItemClick={onItemClick}
          activePath={activePath}
          level={level + 1}
        />
      </Collapsible>
    </li>
  );
}
