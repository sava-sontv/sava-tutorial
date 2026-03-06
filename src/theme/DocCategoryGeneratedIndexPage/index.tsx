/**
 * Trang category index: /docs/avatars (category) hoặc /docs/avatars/getting-started (topic).
 * Breadcrumb: Home > Category, hoặc Home > Category > Topic khi đang ở topic.
 */
import React, { useState } from 'react';
import { PageMetadata } from '@docusaurus/theme-common';
import { useCurrentSidebarCategory } from '@docusaurus/plugin-content-docs/client';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import DocCardList from '@theme/DocCardList';
import DocPaginator from '@theme/DocPaginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import HomeBreadcrumbItem from '@theme/DocBreadcrumbs/Items/Home';
import Heading from '@theme/Heading';
import { ThemeClassNames } from '@docusaurus/theme-common';
import type {
  PropCategoryGeneratedIndex,
  PropSidebarItem,
} from '@docusaurus/plugin-content-docs';
import { getCategoryLabelForSegment, getCategoryPathForSegment, getPathForDocPath, type Locale } from '@site/src/data/categories';
import styles from './styles.module.css';
import clsx from "clsx";

function CategoryIndexBreadcrumbs({
  title,
  parentItems = [],
}: {
  title: string;
  parentItems?: { label: string; href: string }[];
}): React.ReactElement {
  return (
    <nav
      className={clsx(ThemeClassNames.docs.docBreadcrumbs, styles.breadcrumbsWrap)}
      aria-label="Breadcrumbs">
      <ul className="breadcrumbs breadcrumbs--sm">
        <HomeBreadcrumbItem />
        {parentItems.map((item) => (
          <li key={item.href} className="breadcrumbs__item">
            <Link to={item.href} className="breadcrumbs__link">
              {item.label}
            </Link>
          </li>
        ))}
        <li className="breadcrumbs__item breadcrumbs__item--active">
          <span className="breadcrumbs__link">{title}</span>
        </li>
      </ul>
    </nav>
  );
}

export default function DocCategoryGeneratedIndexPage(props: {
  categoryGeneratedIndex: PropCategoryGeneratedIndex;
}): React.ReactElement {
  const { categoryGeneratedIndex } = props;
  const { i18n } = useDocusaurusContext();
  const locale = (i18n.currentLocale ?? i18n.defaultLocale) as Locale;
  const category = useCurrentSidebarCategory();
  const [searchTerm, setSearchTerm] = useState('');

  const slug = categoryGeneratedIndex.slug ?? '';
  const segments = slug.split('/').filter(Boolean);
  const parentItems: { label: string; href: string }[] = [];
  if (segments.length >= 2) {
    const categorySegment = segments[0];
    parentItems.push({
      label: getCategoryLabelForSegment(categorySegment, locale),
      href: getCategoryPathForSegment(categorySegment) ?? `/docs/${categorySegment}`,
    });
  }

  const filteredItems = category.items
    .filter((item: PropSidebarItem) => {
      if (item.type === 'link' || item.type === 'category') {
        return item?.label?.toLowerCase()?.includes(searchTerm.toLowerCase());
      }
      return false;
    })
    .map((item: PropSidebarItem) => {
      if ((item.type === 'link' || item.type === 'category') && item.href) {
        return { ...item, href: getPathForDocPath(item.href) ?? item.href };
      }
      return item;
    });

  return (
    <>
      <PageMetadata
        title={categoryGeneratedIndex.title}
        description={categoryGeneratedIndex.description}
        keywords={categoryGeneratedIndex.keywords}
        image={useBaseUrl(categoryGeneratedIndex.image)}
      />
      <div className={styles.generatedIndexPage}>
        <DocVersionBanner />
        <CategoryIndexBreadcrumbs title={categoryGeneratedIndex.title} parentItems={parentItems} />
        <DocVersionBadge />
        <header>
          <Heading as="h1" className={styles.title}>
            {categoryGeneratedIndex.title}
          </Heading>
          {categoryGeneratedIndex.description && (
            <p>{categoryGeneratedIndex.description}</p>
          )}
        </header>
        <div className="margin-top--lg">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={clsx('rounded-full', styles.searchInput)}
          />
        </div>
        <article className={clsx("margin-top--lg", styles.scrollableDocCardList)}>
          <DocCardList items={filteredItems} className={styles.list} />
        </article>
        <footer className="margin-top--md">
          <DocPaginator
            previous={categoryGeneratedIndex.navigation.previous}
            next={categoryGeneratedIndex.navigation.next}
          />
        </footer>
      </div>
    </>
  );
}
