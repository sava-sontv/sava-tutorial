import React from 'react';
import { useThemeConfig } from '@docusaurus/theme-common';
import styles from './styles.module.css';

type SocialIcon = 'facebook' | 'linkedin' | 'tiktok' | 'youtube';

type FooterLinkItem = {
  label: string;
  href?: string;
  to?: string;
};

type FooterLinkColumn = {
  title: string;
  items: FooterLinkItem[];
};

type FooterConfig = {
  style?: 'dark' | 'light';
  links?: FooterLinkColumn[];
  copyright?: string;
};

function detectSocialIcon(href: string, label: string): SocialIcon | undefined {
  const url = href?.toLowerCase() || '';
  const lbl = label?.toLowerCase() || '';

  if (url.includes('facebook.com') || lbl.includes('facebook')) {
    return 'facebook';
  }
  if (url.includes('linkedin.com') || lbl.includes('linkedin')) {
    return 'linkedin';
  }
  if (url.includes('tiktok.com') || lbl.includes('tiktok')) {
    return 'tiktok';
  }
  if (url.includes('youtube.com') || lbl.includes('youtube')) {
    return 'youtube';
  }
  return undefined;
}

const socialIcons: Record<SocialIcon, React.ReactNode> = {
  facebook: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99
        4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007
        1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491
        0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612
        23.027 24 18.062 24 12.073z" />
      </svg>
  ),
  linkedin: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853
        0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9
        1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337
        7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063
        1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782
        13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0
        1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24
        22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
  ),
  tiktok: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75
        4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01
        2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58
        3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9
        1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04
        4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15
        1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66
        2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
  ),
  youtube: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12
        3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502
        6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122
        2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015
        0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545
        15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
  ),
};

function FooterLink({ item }: { item: FooterLinkItem }) {
  const href = item.href || item.to || '';
  const iconType = detectSocialIcon(href, item.label);
  const hasIcon = iconType && socialIcons[iconType];

  return (
      <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={hasIcon ? styles.socialLink : styles.link}
      >
        {hasIcon && (
            <span className={styles.iconWrapper}>
          {socialIcons[iconType]}
        </span>
        )}
        <span>{item.label}</span>
      </a>
  );
}

function FooterColumn({ column }: { column: FooterLinkColumn }) {
  const hasSocialIcons = column.items.some((item) => {
    const href = item.href || item.to || '';
    return detectSocialIcon(href, item.label);
  });

  return (
      <div className={styles.column}>
        <div className={styles.columnTitle}>{column.title}</div>
        <ul className={hasSocialIcons ? styles.socialList : styles.linkList}>
          {column.items.map((item, idx) => (
              <li key={idx}>
                <FooterLink item={item} />
              </li>
          ))}
        </ul>
      </div>
  );
}

function FooterBrand(): React.JSX.Element {
  return (
      <div className={styles.brandColumn}>
        <a href="/" className={styles.brandLogo}>
          <img
              src="/help/img/logo.svg"
              alt="SAVRSE LOGO"
          />
        </a>
        <p className={styles.brandDescription}>
          <strong>Meta Music Experience</strong> — explore a world of music in virtual reality. Join live events, connect with the community, and experience sound in a whole new way.
        </p>
      </div>
  );
}

function Footer(): React.JSX.Element | undefined {
  const { footer } = useThemeConfig() as { footer: FooterConfig };

  if (!footer) {
    return undefined;
  }

  const { links, copyright, style } = footer;

  return (
      <footer
          className={`${styles.footer} ${style === 'dark' ? styles.footerDark : ''
          }`}
      >
        <div className={styles.container}>
          <div className={styles.linksWrapper}>
            <FooterBrand />
            {links && links.length > 0 && (
                <>
                  {links.map((column, idx) => (
                      <FooterColumn key={idx} column={column} />
                  ))}
                </>
            )}
          </div>
          {copyright && (
              <div
                  className={styles.copyright}
                  dangerouslySetInnerHTML={{ __html: copyright }}
              />
          )}
        </div>
      </footer>
  );
}

export default React.memo(Footer);
