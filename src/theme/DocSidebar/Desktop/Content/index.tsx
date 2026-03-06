/**
 * DocSidebar Desktop Content: chỉ hiện bài viết trong section hiện tại (kiểu Roblox Support).
 */
import React, { useState } from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import {
  useAnnouncementBar,
  useScrollPosition,
} from '@docusaurus/theme-common/internal';
import { translate } from '@docusaurus/Translate';
import { useCurrentSidebarSiblings } from '@docusaurus/plugin-content-docs/client';
import type { PropSidebarItem } from '@docusaurus/plugin-content-docs';
import DocSidebarItems from '@theme/DocSidebarItems';
import styles from './styles.module.css';

function useShowAnnouncementBar() {
  const { isActive } = useAnnouncementBar();
  const [showAnnouncementBar, setShowAnnouncementBar] = useState(isActive);
  useScrollPosition(
    ({ scrollY }) => {
      if (isActive) {
        setShowAnnouncementBar(scrollY === 0);
      }
    },
    [isActive],
  );
  return isActive && showAnnouncementBar;
}

export default function DocSidebarDesktopContent({
  path,
  sidebar,
  className,
}: {
  path: string;
  sidebar: PropSidebarItem[];
  className?: string;
}): React.ReactElement {
  const showAnnouncementBar = useShowAnnouncementBar();
  const sectionItems = useCurrentSidebarSiblings();
  const items = sectionItems.length > 0 ? sectionItems : sidebar;
  const articlesHeading = translate({
    id: 'theme.docs.sidebar.articlesInSection',
    message: 'Articles in this section',
    description: 'Heading for the list of articles in the doc sidebar',
  });

  return (
    <nav
      aria-label={translate({
        id: 'theme.docs.sidebar.navAriaLabel',
        message: 'Docs sidebar',
        description: 'The ARIA label for the sidebar navigation',
      })}
      className={clsx(
        'menu thin-scrollbar',
        styles.menu,
        showAnnouncementBar && styles.menuWithAnnouncementBar,
        className,
      )}>
      <h3 className={styles.articlesHeading}>{articlesHeading}</h3>
      <ul className={clsx(ThemeClassNames.docs.docSidebarMenu, 'menu__list')}>
        <DocSidebarItems items={items} activePath={path} level={1} />
      </ul>
    </nav>
  );
}
