import type { ReactNode } from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useLocation } from '@docusaurus/router';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function LocaleSwitcher() {
  const {
    i18n: { currentLocale, locales, defaultLocale },
    siteConfig,
  } = useDocusaurusContext();
  const { pathname } = useLocation();

  if (locales.length <= 1) return null;

  // Strip baseUrl (vd /help) để path hoạt động đúng khi baseUrl !== '/'
  const baseUrlStrip = (siteConfig.baseUrl ?? '/').replace(/\/$/, '') || '';
  const pathWithoutBase =
    baseUrlStrip && baseUrlStrip !== '/'
      ? pathname.startsWith(baseUrlStrip)
        ? pathname.slice(baseUrlStrip.length) || '/'
        : pathname
      : pathname;

  const pathWithoutLocale =
    currentLocale === defaultLocale
      ? pathWithoutBase
      : pathWithoutBase.replace(new RegExp(`^/${currentLocale}/?`), '') || '/';

  return (
    <div className={styles.localeSwitcher}>
      {locales.map((locale) => {
        const isActive = locale === currentLocale;
        const isRoot = pathWithoutLocale === '/' || pathWithoutLocale === '';
        const href =
          locale === defaultLocale
            ? pathWithoutLocale || '/'
            : isRoot
              ? `/${locale}/`
              : `/${locale}${pathWithoutLocale.startsWith('/') ? pathWithoutLocale : `/${pathWithoutLocale}`}`;
        return (
          <Link
            key={locale}
            to={href}
            className={clsx(styles.localeLink, isActive && styles.localeLinkActive)}>
          </Link>
        );
      })}
    </div>
  );
}

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <LocaleSwitcher />
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
