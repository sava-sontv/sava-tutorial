import type { JSX } from 'react';
import React from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';
import DocThumbnail from '../DocThumbnail';
import { slugToTitle, isSlugLike } from '../../../data/categories';

function useDisplayTitle(): string | null {
  const { metadata, frontMatter, contentTitle } = useDoc();
  const shouldRender =
    !frontMatter.hide_title && typeof contentTitle === 'undefined';
  if (!shouldRender) return null;
  const title = metadata.title ?? '';
  return isSlugLike(title) ? slugToTitle(title) : title;
}

export default function DocItemContentWrapper({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const displayTitle = useDisplayTitle();
  let thumbnailPosition: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  try {
    const docContext = useDoc();
    const position = docContext.metadata?.frontMatter?.thumbnailPosition as string;
    if (position && ['top', 'bottom', 'left', 'right'].includes(position)) {
      thumbnailPosition = position as 'top' | 'bottom' | 'left' | 'right';
    }
  } catch (e) {
    console.error('Error reading thumbnail position:', e);
  }

  const content = (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
      {displayTitle && (
        <header>
          <Heading as="h1">{displayTitle}</Heading>
        </header>
      )}
      <MDXContent>{children}</MDXContent>
    </div>
  );

  if (thumbnailPosition === 'top') {
    return (
      <>
        <DocThumbnail />
        {content}
      </>
    );
  }
  if (thumbnailPosition === 'left' || thumbnailPosition === 'right') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: thumbnailPosition === 'left' ? 'row' : 'row-reverse',
          gap: '20px',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}>
        <div
          style={{
            flexShrink: 0,
            minWidth: '200px',
            maxWidth: '300px',
            flex: '0 0 auto',
          }}>
          <DocThumbnail />
        </div>
        <div style={{ flex: '1 1 250px', minWidth: '250px' }}>{content}</div>
      </div>
    );
  }
  return (
    <>
      {content}
      <DocThumbnail />
    </>
  );
}
