/**
 * DocSidebarItem Link - format label: slug → title.
 * Link dùng path 3 cấp kiểu Roblox: /categories/, /sections/, /articles/ (getPathForDocPath).
 */
import React from 'react';
import clsx from 'clsx';
import { useLocation } from '@docusaurus/router';
import type { PropSidebarItemLink, PropSidebarItem } from '@docusaurus/plugin-content-docs';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { isActiveSidebarItem } from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import IconExternalLink from '@theme/Icon/ExternalLink';
import { slugToTitle, isSlugLike, getPathForDocPath } from '@site/src/data/categories';
import styles from './styles.module.css';

function LinkLabel({ label }: { label: string }): React.ReactElement {
  return (
    <span title={label} className={styles.linkLabel}>
      {label}
    </span>
  );
}

export default function DocSidebarItemLink({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}: {
  item: PropSidebarItemLink;
  onItemClick?: (item: PropSidebarItem) => void;
  activePath: string;
  level: number;
  index: number;
}): React.ReactElement {
  const { href, label, className, autoAddBaseUrl } = item;
  const { pathname } = useLocation();
  const rawLabel = typeof label === 'string' ? label : String(label ?? '');
  const displayLabel = isSlugLike(rawLabel) ? slugToTitle(rawLabel) : rawLabel;
  const isInternalLink = isInternalUrl(href);
  const to = isInternalLink ? (getPathForDocPath(href) ?? href) : href;
  const pathnameNorm = pathname.replace(/^\/(en|vi)\//, '/');
  const toNorm = to ? to.replace(/^\/(en|vi)\//, '/') : '';
  const isActive =
    isActiveSidebarItem(item, activePath) ||
    (isInternalLink && toNorm && pathnameNorm === toNorm);
  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        'menu__list-item',
        className,
      )}
      key={label}>
      <Link
        className={clsx(
          'menu__link',
          !isInternalLink && styles.menuExternalLink,
          {
            'menu__link--active': isActive,
          },
        )}
        autoAddBaseUrl={autoAddBaseUrl}
        aria-current={isActive ? 'page' : undefined}
        to={to}
        {...(isInternalLink && {
          onClick: onItemClick ? () => onItemClick(item) : undefined,
        })}
        {...props}>
        <LinkLabel label={displayLabel} />
        {!isInternalLink && <IconExternalLink />}
      </Link>
    </li>
  );
}
