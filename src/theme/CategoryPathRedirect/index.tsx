/**
 * Redirect /categories/:pathIdAndSlug theo id (category id) — slug có thể sai vẫn mở đúng category.
 * VD: /categories/1443555064-getting-startedsdf vẫn mở category 1443555064.
 * Dùng useLocation (không dùng useParams vì @docusaurus/router không export useParams).
 * Hỗ trợ baseUrl (vd /help/): pathname có thể là /help/categories/... hoặc /help/vi/categories/...
 */
import React, { useEffect } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';

import categoryIdToPath from '@site/src/data/categoryIdToPath.json';

type CategoryIdToPath = Record<
  string,
  { path: string; docPath: string }
>;

/** Lấy pathIdAndSlug từ pathname: /help/categories/123-slug hoặc /help/vi/categories/123-slug → 123-slug */
function getPathIdAndSlugFromPathname(pathname: string): string {
  const match = pathname.match(/\/categories\/(.+)$/);
  return match ? match[1] : '';
}

/** Pathname sau khi bỏ baseUrl: /help/vi/categories/... → /vi/categories/... */
function getPathnameWithoutBaseUrl(pathname: string, baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, '');
  if (!base || base === '/') return pathname;
  return pathname.startsWith(base) ? pathname.slice(base.length) || '/' : pathname;
}

/** Giữ locale khi redirect (vd /vi/categories/... → /vi/docs/...). */
function getLocalePrefix(pathnameWithoutBase: string): string {
  if (pathnameWithoutBase.startsWith('/vi/') || pathnameWithoutBase === '/vi') return '/vi';
  if (pathnameWithoutBase.startsWith('/en/') || pathnameWithoutBase === '/en') return '/en';
  return '';
}

export default function CategoryPathRedirect(): React.ReactElement {
  const { siteConfig } = useDocusaurusContext();
  const { withBaseUrl } = useBaseUrlUtils();
  const history = useHistory();
  const location = useLocation();
  const pathname = location.pathname;
  const pathWithoutBase = getPathnameWithoutBaseUrl(pathname, siteConfig.baseUrl ?? '/');
  const pathIdAndSlug = getPathIdAndSlugFromPathname(pathWithoutBase);
  const mapping = categoryIdToPath as CategoryIdToPath;

  const categoryId = pathIdAndSlug ? pathIdAndSlug.replace(/^(\d+)(?:-|$).*$/, '$1') : '';
  const entry = categoryId ? mapping[categoryId] : undefined;
  const localePrefix = getLocalePrefix(pathWithoutBase);

  useEffect(() => {
    if (!pathIdAndSlug || !entry) return;
    const targetDocPath = localePrefix ? localePrefix + entry.docPath : entry.docPath;
    history.replace(withBaseUrl(targetDocPath), { fromPath: entry.path });
  }, [pathIdAndSlug, entry, history, localePrefix, withBaseUrl]);

  if (!entry) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        Không tìm thấy category với id {categoryId ?? pathIdAndSlug}.
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      Đang chuyển hướng…
    </div>
  );
}

