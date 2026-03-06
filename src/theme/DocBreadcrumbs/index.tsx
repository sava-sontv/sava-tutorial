import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { ThemeClassNames } from '@docusaurus/theme-common';
import {
  useSidebarBreadcrumbs,
  useDoc,
  useDocsSidebar,
  findFirstSidebarItemLink,
} from '@docusaurus/plugin-content-docs/client';
import type { PropSidebarBreadcrumbsItem } from '@docusaurus/plugin-content-docs';
import { useHomePageRoute } from '@docusaurus/theme-common/internal';
import { useHistory } from '@docusaurus/router';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import { translate } from '@docusaurus/Translate';
import HomeBreadcrumbItem from '@theme/DocBreadcrumbs/Items/Home';
import DocBreadcrumbsStructuredData from '@theme/DocBreadcrumbs/StructuredData';
import {
  getCategoryPathForSegment,
  getSectionPathForSegments,
  getPathForDocPath,
  getCategoryLabelForSegment,
  slugToTitle,
  isSlugLike,
  type Locale,
} from '../../data/categories';
import styles from './styles.module.css';

function getCategoryPathForPermalink(permalink: string): string | undefined {
  const segments = getPathSegmentsFromPermalink(permalink);
  if (!segments.length) return undefined;
  return getCategoryPathForSegment(segments[0]);
}

/** Lấy segment category từ permalink: /docs/avatars/sava-docs → avatars. */
function getSegmentFromPermalink(permalink: string): string | undefined {
  const segments = getPathSegmentsFromPermalink(permalink);
  return segments[0];
}

/** Lấy các segment sau /docs/: /docs/avatars/getting-started/sava-avatar → ['avatars','getting-started','sava-avatar']. */
function getPathSegmentsFromPermalink(permalink: string): string[] {
  const match = permalink.match(/\/docs\/(.+?)(?:\/?$)/);
  if (!match || !match[1]) return [];
  return match[1].split('/').filter(Boolean);
}

function BreadcrumbsItemLink({
  children,
  href,
  isLast,
  onNavigate,
}: {
  children: ReactNode;
  href: string | undefined;
  isLast: boolean;
  onNavigate?: (url: string) => void;
}): ReactNode {
  const className = 'breadcrumbs__link';
  if (isLast) {
    return <span className={className}>{children}</span>;
  }
  if (!href) {
    return <span className={className}>{children}</span>;
  }
  if (onNavigate) {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      onNavigate(href);
    };
    return (
      <a className={className} href={href} onClick={handleClick}>
        {children}
      </a>
    );
  }
  return (
    <a className={className} href={href}>
      {children}
    </a>
  );
}

function BreadcrumbsItem({
  children,
  active,
}: {
  children: ReactNode;
  active?: boolean;
}): ReactNode {
  return (
    <li
      className={clsx('breadcrumbs__item', {
        'breadcrumbs__item--active': active,
      })}>
      {children}
    </li>
  );
}

export default function DocBreadcrumbs(): ReactNode {
  const { frontMatter, metadata } = useDoc();
  const sidebarBreadcrumbs = useSidebarBreadcrumbs();
  const homePageRoute = useHomePageRoute();
  const sidebar = useDocsSidebar();
  const history = useHistory();
  const { withBaseUrl } = useBaseUrlUtils();
  const { i18n } = useDocusaurusContext();
  const permalink = metadata.permalink ?? '';
  const locale = (i18n.currentLocale ?? i18n.defaultLocale) as Locale;

  const customBreadcrumb = (frontMatter as { breadcrumb?: unknown }).breadcrumb;
  const useCustomBreadcrumb =
    Array.isArray(customBreadcrumb) &&
    customBreadcrumb.length >= 2 &&
    typeof customBreadcrumb[0] === 'string' &&
    typeof customBreadcrumb[1] === 'string';

  let breadcrumbs: { label: string; href?: string }[] | null = null;

  const pathSegments = getPathSegmentsFromPermalink(permalink);
  const segment = pathSegments[0];
  const categoryPath = getCategoryPathForPermalink(permalink);
  const docTitle = metadata.title ?? '';
  const docLabel = isSlugLike(docTitle) ? slugToTitle(docTitle) : docTitle;

  // 3 cấp: Category → Topic → Article (path dạng /docs/avatars/getting-started/sava-avatar)
  const isThreeLevel = pathSegments.length >= 3;
  const hasSidebarBreadcrumbs = sidebarBreadcrumbs && sidebarBreadcrumbs.length > 0;

  if (useCustomBreadcrumb && !isThreeLevel) {
    const singularName = String(customBreadcrumb[0]);
    const title = String(customBreadcrumb[1]);
    const categoryHref =
      categoryPath ??
      (sidebar?.items?.[0] ? findFirstSidebarItemLink(sidebar.items[0]) : undefined);
    const navLabel =
      singularName.charAt(0).toUpperCase() + singularName.slice(1);
    breadcrumbs = [
      { label: navLabel, href: categoryHref },
      { label: isSlugLike(title) ? slugToTitle(title) : title, href: undefined },
    ];
  } else if (isThreeLevel) {
    // Luôn dùng 3 cấp: Category → Section → Article (href dùng path /categories/..., /sections/..., /articles/...)
    const sectionPath = getSectionPathForSegments(pathSegments[0], pathSegments[1]);
    const articlePath = getPathForDocPath(permalink);
    if (hasSidebarBreadcrumbs && sidebarBreadcrumbs!.length >= 3) {
      breadcrumbs = sidebarBreadcrumbs!.map((item, idx) => ({
        label: item.label,
        href:
          idx === 0 ? (categoryPath ?? item.href)
          : idx === 1 ? (sectionPath ?? item.href)
          : articlePath ?? item.href,
      }));
      if (breadcrumbs.length > 2) breadcrumbs[2].href = undefined;
    } else {
      const categoryLabel = getCategoryLabelForSegment(pathSegments[0], locale);
      const topicLabel = isSlugLike(pathSegments[1]) ? slugToTitle(pathSegments[1]) : pathSegments[1];
      breadcrumbs = [
        { label: categoryLabel, href: categoryPath ?? `/docs/${pathSegments[0]}` },
        { label: topicLabel, href: sectionPath ?? `/docs/${pathSegments[0]}/${pathSegments[1]}` },
        { label: docLabel, href: undefined },
      ];
    }
  } else if (segment && categoryPath) {
    // 2 cấp: Category → Article
    const categoryLabel = getCategoryLabelForSegment(segment, locale);
    breadcrumbs = [
      { label: categoryLabel, href: categoryPath },
      { label: docLabel, href: undefined },
    ];
  } else {
    breadcrumbs = hasSidebarBreadcrumbs
      ? sidebarBreadcrumbs!.map((item) => ({
          label: item.label,
          href: item.href,
        }))
      : null;
    if (breadcrumbs && permalink) {
      breadcrumbs = breadcrumbs.map((item, idx) => ({
        ...item,
        label:
          idx === breadcrumbs!.length - 1 && isSlugLike(item.label)
            ? slugToTitle(item.label)
            : item.label,
        href: idx === 0 && categoryPath ? categoryPath : item.href,
      }));
    }
  }

  if (!breadcrumbs) {
    return null;
  }

  const structuredDataBreadcrumbs = breadcrumbs as PropSidebarBreadcrumbsItem[];

  return (
    <>
      <DocBreadcrumbsStructuredData breadcrumbs={structuredDataBreadcrumbs} />
      <nav
        className={clsx(
          ThemeClassNames.docs.docBreadcrumbs,
          styles.breadcrumbsContainer,
        )}
        aria-label={translate({
          id: 'theme.docs.breadcrumbs.navAriaLabel',
          message: 'Breadcrumbs',
          description: 'The ARIA label for the breadcrumbs',
        })}>
        <ul className="breadcrumbs breadcrumbs--sm">
          {homePageRoute && <HomeBreadcrumbItem />}
          {breadcrumbs.map((item, idx) => {
            const isLast = idx === breadcrumbs!.length - 1;
            const href = item.href;
            return (
              <BreadcrumbsItem key={idx} active={isLast}>
                <BreadcrumbsItemLink
                  href={href}
                  isLast={isLast}
                  onNavigate={(url) => history.push(withBaseUrl(url))}>
                  {item.label}
                </BreadcrumbsItemLink>
              </BreadcrumbsItem>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
