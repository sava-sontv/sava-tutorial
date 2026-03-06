import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import { useAllDocsData } from '@docusaurus/plugin-content-docs/client';
import { getActiveCategories, getPathForDocPath, slugToTitle, type Locale } from '@site/src/data/categories';
import { useHistory } from '@docusaurus/router';
import clsx from "clsx";
import styles from './styles.module.css';
import React from 'react';

function CategoryCard({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  return (
    <Link to={path} className={styles.card}>
      <div className={styles.cardContent}>
        <Heading as="h3" className={styles.cardTitle}>
          {title}
        </Heading>
        <p className={styles.cardDescription}>{description}</p>
      </div>
    </Link>
  );
}

export default function HomepageFeatures(): ReactNode {
  const { i18n } = useDocusaurusContext();
  const history = useHistory();
  const locale = (i18n.currentLocale ?? i18n.defaultLocale) as Locale;
  const items = getActiveCategories();
  const sectionTitle = locale === 'vi' ? 'Danh mục' : 'Categories';
  const [searchAll, setSearchAll] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const searchWrapRef = useRef<HTMLDivElement | null>(null);

  const allDocsData = useAllDocsData();
  const allDocs = useMemo(() => {
    const pluginId = (allDocsData && (allDocsData.default ? 'default' : Object.keys(allDocsData)[0])) ?? 'default';
    const pluginData = allDocsData?.[pluginId];
    if (!pluginData?.versions?.length) return [];
    const version = pluginData.versions.find((v) => v.name === 'current') ?? pluginData.versions[0];
    return (version.docs ?? []).map((d) => ({ id: d.id, path: d.path }));
  }, [allDocsData]);

  function displayTitleFromDocId(docId: string): string {
    const last = docId.split('/').filter(Boolean).slice(-1)[0] ?? docId;
    const cleaned = last.replace(/^\d+(?:-\d+)*-/, '');
    return slugToTitle(cleaned);
  }

  function withLocalePrefix(path: string): string {
    if (!path.startsWith('/')) return path;
    if (locale === i18n.defaultLocale) return path;
    if (path.startsWith(`/${locale}/`)) return path;
    return `/${locale}${path}`;
  }

  function handleSuggestionType(path: string){
    const pathSegments = path.split('/').filter(Boolean);
    const typeMap = {
      categories: 'topic',
      sections: 'section',
      articles: 'article'
    };
    const type = typeMap[pathSegments[0]] || '';

    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  const suggestions = useMemo(() => {
    const q = searchAll.trim().toLowerCase();
    if (!q) return [];
    return allDocs
      .map((d) => {
        const normalizedDocPath = d.path.replace(/^\/(en|vi)\//, '/');
        const customPath = getPathForDocPath(normalizedDocPath);
        return {
          id: d.id,
          title: displayTitleFromDocId(d.id),
          docPath: d.path,
          path: withLocalePrefix(customPath ?? normalizedDocPath),
        };
      })
      .filter((d) => d.id.toLowerCase().includes(q) || d.title.toLowerCase().includes(q))
      .slice(0, 10);
  }, [allDocs, searchAll]);

  useEffect(() => {
    setHighlightIndex(-1);
  }, [searchAll]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const el = searchWrapRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
      <>
        <section className={styles.categoriesSection} data-section="categories">
          <div className={clsx('margin-top--sm', styles.searchWrapper)} ref={searchWrapRef}>
            <span className={styles.searchIcon} aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                className={styles.searchIconSvg}
                focusable="false"
              >
                <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
                <line x1="15" y1="15" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            <input
              type="text"
              placeholder={locale === 'vi' ? 'Tìm kiếm bài viết...' : 'Search articles...'}
              value={searchAll}
              onChange={e => {
                setSearchAll(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={(e) => {
                if (!suggestions.length) return;
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setIsOpen(true);
                  setHighlightIndex((prev) =>
                    prev < suggestions.length - 1 ? prev + 1 : 0,
                  );
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setIsOpen(true);
                  setHighlightIndex((prev) =>
                    prev > 0 ? prev - 1 : suggestions.length - 1,
                  );
                } else if (e.key === 'Enter') {
                  if (highlightIndex >= 0 && highlightIndex < suggestions.length) {
                    const target = suggestions[highlightIndex];
                    history.push(target.path);
                    setIsOpen(false);
                  }
                } else if (e.key === 'Escape') {
                  setIsOpen(false);
                }
              }}
              className={clsx('rounded-full', styles.searchInput)}
            />
            {isOpen && suggestions.length > 0 && (
              <div className={styles.suggestions} role="listbox">
                {suggestions.map((s, index) => (
                  <Link
                    key={s.id}
                    to={s.path}
                    className={clsx(
                      styles.suggestionItem,
                      index === highlightIndex && styles.suggestionItemActive,
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className={styles.suggestionRow}>
                      <div className={styles.suggestionTitle}>{s.title}</div>
                      <div className={styles.suggestionTypeName}>{handleSuggestionType(s.path)}</div>
                    </div>
                    {/*<div className={styles.suggestionPath}>{s.path}</div>*/}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="container">
            <Heading as="h2" className={styles.sectionTitle}>
              {sectionTitle}
            </Heading>
            <div className={styles.grid}>
              {items.map((item) => (
                <CategoryCard
                  key={item.path}
                  title={item.title[locale] ?? item.title.en}
                  description={item.description[locale] ?? item.description.en}
                  path={item.path}
                />
              ))}
            </div>
          </div>
        </section>
      </>
  );
}
