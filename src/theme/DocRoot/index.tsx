/**
 * DocRoot: giữ URL /categories|sections|articles/... khi vào từ redirect (state.fromPath)
 * hoặc khi vào từ /docs/... (sidebar) thì replaceState sang path tương ứng.
 */
import React, { useEffect } from 'react';
import clsx from 'clsx';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { HtmlClassNameProvider, ThemeClassNames } from '@docusaurus/theme-common';
import {
  DocsSidebarProvider,
  useDocRootMetadata,
} from '@docusaurus/plugin-content-docs/client';
import DocRootLayout from '@theme/DocRoot/Layout';
import NotFoundContent from '@theme/NotFound/Content';

// docPath -> path (sinh bởi ensure-category-json)
import docPathToPath from '@site/src/data/docPathToPath.json';

type DocPathToPath = Record<string, string>;

type DocRootProps = Parameters<typeof useDocRootMetadata>[0];

function getPathnameWithoutBaseUrl(pathname: string, baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, '');
  if (!base || base === '/') return pathname;
  return pathname.startsWith(base) ? pathname.slice(base.length) || '/' : pathname;
}

export default function DocRoot(props: DocRootProps): React.ReactElement {
  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();
  const currentDocRouteMetadata = useDocRootMetadata(props);
  const baseUrlStrip = (siteConfig.baseUrl ?? '/').replace(/\/$/, '') || '';

  useEffect(() => {
    if (typeof window === 'undefined' || !window.history.replaceState) return;
    const state = location.state as { fromPath?: string } | undefined;
    const fromPath = state?.fromPath;
    const pathname = location.pathname;
    const pathWithoutBase = getPathnameWithoutBaseUrl(pathname, siteConfig.baseUrl ?? '/');

    if (fromPath && typeof fromPath === 'string') {
      const locale = pathWithoutBase.startsWith('/vi') ? '/vi' : pathWithoutBase.startsWith('/en') ? '/en' : '';
      const pathPart = locale && !fromPath.startsWith('/en') && !fromPath.startsWith('/vi') ? locale + fromPath : fromPath;
      const url = baseUrlStrip && baseUrlStrip !== '/' ? baseUrlStrip + pathPart : pathPart;
      window.history.replaceState({ ...window.history.state, fromPath }, '', url);
      return;
    }
    // Vào từ /docs/... (vd sidebar): thay URL thành /categories|sections|articles/...
    const normalized = pathWithoutBase.replace(/^\/(en|vi)\//, '/');
    const path = (docPathToPath as DocPathToPath)[normalized];
    if (path) {
      const localePrefix = /^\/(en|vi)(?:\/|$)/.exec(pathWithoutBase)?.[0] ?? '';
      const url = baseUrlStrip && baseUrlStrip !== '/' ? baseUrlStrip + localePrefix + path : localePrefix + path;
      window.history.replaceState(window.history.state, '', url);
    }
  }, [location.pathname, location.state, baseUrlStrip, siteConfig.baseUrl]);

  if (!currentDocRouteMetadata) {
    return <NotFoundContent />;
  }

  const { docElement, sidebarName, sidebarItems } = currentDocRouteMetadata;
  return (
    <HtmlClassNameProvider className={clsx(ThemeClassNames.page.docsDocPage)}>
      <DocsSidebarProvider name={sidebarName} items={sidebarItems}>
        <DocRootLayout>{docElement}</DocRootLayout>
      </DocsSidebarProvider>
    </HtmlClassNameProvider>
  );
}
