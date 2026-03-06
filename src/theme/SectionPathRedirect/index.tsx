/**
 * Redirect /sections/:pathIdAndSlug theo id (section id) — slug có thể sai vẫn mở đúng section.
 * VD: /sections/1020125093-reporting-and-moderationvsdvsd vẫn mở section 1020125093.
 * Dùng useLocation (không dùng useParams vì @docusaurus/router không export useParams).
 */
import React, { useEffect } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';

import sectionIdToPath from '@site/src/data/sectionIdToPath.json';

type SectionIdToPath = Record<
  string,
  { path: string; docPath: string }
>;

function getPathIdAndSlugFromPathname(pathname: string): string {
  const match = pathname.match(/\/sections\/(.+)$/);
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

export default function SectionPathRedirect(): React.ReactElement {
  const { siteConfig } = useDocusaurusContext();
  const { withBaseUrl } = useBaseUrlUtils();
  const history = useHistory();
  const location = useLocation();
  const pathname = location.pathname;
  const pathWithoutBase = getPathnameWithoutBaseUrl(pathname, siteConfig.baseUrl ?? '/');
  const pathIdAndSlug = getPathIdAndSlugFromPathname(pathWithoutBase);
  const mapping = sectionIdToPath as SectionIdToPath;

  const sectionId = pathIdAndSlug ? pathIdAndSlug.replace(/^(\d+)(?:-|$).*$/, '$1') : '';
  const entry = sectionId ? mapping[sectionId] : undefined;
  const localePrefix = getLocalePrefix(pathWithoutBase);

  useEffect(() => {
    if (!pathIdAndSlug || !entry) return;
    const targetDocPath = localePrefix ? localePrefix + entry.docPath : entry.docPath;
    history.replace(withBaseUrl(targetDocPath), { fromPath: entry.path });
  }, [pathIdAndSlug, entry, history, localePrefix, withBaseUrl]);

  if (!entry) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        Không tìm thấy section với id {sectionId ?? pathIdAndSlug}.
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      Đang chuyển hướng…
    </div>
  );
}
