/**
 * Redirect /articles/:pathIdAndSlug theo id (pathId) — slug có thể sai vẫn mở đúng bài.
 * VD: /articles/1998028660-how-the-community-and-vr-app-work-togetherabab vẫn mở bài 1998028660.
 * Dùng useLocation (không dùng useParams vì @docusaurus/router không export useParams).
 * Hỗ trợ baseUrl (vd /help/) và giữ locale khi redirect.
 */
import React, { useEffect } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';

import articleIdToDocPath from '@site/src/data/articleIdToDocPath.json';

type ArticleIdToDocPath = Record<
  string,
  { docPath: string; path: string }
>;

/** Lấy pathIdAndSlug từ pathname: /help/articles/123-slug hoặc /help/vi/articles/123-slug → 123-slug */
function getPathIdAndSlugFromPathname(pathname: string): string {
  const match = pathname.match(/\/articles\/(.+)$/);
  return match ? match[1] : '';
}

function getPathnameWithoutBaseUrl(pathname: string, baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, '');
  if (!base || base === '/') return pathname;
  return pathname.startsWith(base) ? pathname.slice(base.length) || '/' : pathname;
}

function getLocalePrefix(pathnameWithoutBase: string): string {
  if (pathnameWithoutBase.startsWith('/vi/') || pathnameWithoutBase === '/vi') return '/vi';
  if (pathnameWithoutBase.startsWith('/en/') || pathnameWithoutBase === '/en') return '/en';
  return '';
}

export default function ArticlePathRedirect(): React.ReactElement {
  const { siteConfig } = useDocusaurusContext();
  const { withBaseUrl } = useBaseUrlUtils();
  const history = useHistory();
  const location = useLocation();
  const pathWithoutBase = getPathnameWithoutBaseUrl(location.pathname, siteConfig.baseUrl ?? '/');
  const pathIdAndSlug = getPathIdAndSlugFromPathname(pathWithoutBase);
  const mapping = articleIdToDocPath as ArticleIdToDocPath;

  const pathId = pathIdAndSlug ? pathIdAndSlug.replace(/^(\d+)(?:-|$).*$/, '$1') : '';
  const entry = pathId ? mapping[pathId] : undefined;
  const localePrefix = getLocalePrefix(pathWithoutBase);

  useEffect(() => {
    if (!pathIdAndSlug || !entry) return;
    const targetDocPath = localePrefix ? localePrefix + entry.docPath : entry.docPath;
    history.replace(withBaseUrl(targetDocPath), { fromPath: entry.path });
  }, [pathIdAndSlug, entry, history, localePrefix, withBaseUrl]);

  if (!entry) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        Không tìm thấy bài viết với id {pathId ?? pathIdAndSlug}.
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      Đang chuyển hướng…
    </div>
  );
}
