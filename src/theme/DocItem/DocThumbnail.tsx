import type { JSX } from 'react';
import React, { useState } from 'react';
import { useDoc } from '@docusaurus/plugin-content-docs/client';

interface ThumbnailItem {
  url: string;
  width: number | null;
  height: number | null;
}

function DocThumbnail(): JSX.Element | null {
  let thumbnails: ThumbnailItem[] | null = null;
  let thumbnail: string | null = null;
  let thumbnailWidth: number | null = null;
  let thumbnailHeight: number | null = null;
  let thumbnailPosition: string = 'bottom';

  try {
    const docContext = useDoc();
    const frontMatter = docContext.metadata?.frontMatter;
    
    // Check for multiple thumbnails first
    const thumbnailsData = frontMatter?.thumbnails;
    if (thumbnailsData && Array.isArray(thumbnailsData) && thumbnailsData.length > 0) {
      thumbnails = thumbnailsData as ThumbnailItem[];
    } else {
      // Fallback to single thumbnail for backward compatibility
      thumbnail = frontMatter?.thumbnail as string | null;
      thumbnailWidth = frontMatter?.thumbnailWidth as number | null;
      thumbnailHeight = frontMatter?.thumbnailHeight as number | null;
    }
    
    thumbnailPosition = (frontMatter?.thumbnailPosition as string) || 'bottom';
  } catch (e) {
    console.error('Error in DocThumbnail:', e);
  }

  // If no thumbnails at all, return null
  if (!thumbnails && !thumbnail) {
    return null;
  }

  // If multiple thumbnails, render slider
  if (thumbnails && thumbnails.length > 1) {
    return <ThumbnailSlider thumbnails={thumbnails} position={thumbnailPosition} />;
  }

  // Single thumbnail - render normally
  const singleThumbnail = thumbnails?.[0] || {
    url: thumbnail!,
    width: thumbnailWidth,
    height: thumbnailHeight,
  };

  // Build style object with custom dimensions if available
  const imageStyle: React.CSSProperties = {
    borderRadius: '8px',
    display: 'block',
  };

  // Add margin based on position
  if (thumbnailPosition === 'top') {
    imageStyle.marginBottom = '20px';
  } else if (thumbnailPosition === 'bottom') {
    imageStyle.marginTop = '20px';
  }
  // left/right positions don't need margin as they use flexbox gap

  if (singleThumbnail.width && singleThumbnail.height) {
    // Use exact dimensions from Strapi
    imageStyle.width = `${singleThumbnail.width}px`;
    imageStyle.height = `${singleThumbnail.height}px`;
    imageStyle.objectFit = 'cover';
  } else if (singleThumbnail.width) {
    // Only width specified
    imageStyle.width = `${singleThumbnail.width}px`;
    imageStyle.height = 'auto';
  } else if (singleThumbnail.height) {
    // Only height specified
    imageStyle.height = `${singleThumbnail.height}px`;
    imageStyle.width = 'auto';
  } else {
    // Default: responsive
    imageStyle.maxWidth = '100%';
    imageStyle.height = 'auto';
  }

  return (
    <img
      src={singleThumbnail.url}
      alt="Thumbnail"
      style={imageStyle}
    />
  );
}

function ThumbnailSlider({ 
  thumbnails, 
  position 
}: { 
  thumbnails: ThumbnailItem[];
  position: string;
}): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? thumbnails.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === thumbnails.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentThumbnail = thumbnails[currentIndex];

  // Calculate max dimensions from all thumbnails to ensure consistent container size
  const maxWidth = Math.max(...thumbnails.map(t => t.width || 0));
  const maxHeight = Math.max(...thumbnails.map(t => t.height || 0));

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: maxHeight > 0 ? `${maxHeight}px` : '100px',
    minWidth: maxWidth > 0 ? `${maxWidth}px` : '100px',
  };

  // Add margin based on position
  if (position === 'top') {
    containerStyle.marginBottom = '20px';
  } else if (position === 'bottom') {
    containerStyle.marginTop = '20px';
  }

  // Build image wrapper style for centering
  const imageWrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  };

  const imageStyle: React.CSSProperties = {
    display: 'block',
    borderRadius: '8px',
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    margin: '0 auto',
  };

  if (currentThumbnail.width && currentThumbnail.height) {
    imageStyle.width = `${currentThumbnail.width}px`;
    imageStyle.height = `${currentThumbnail.height}px`;
    imageStyle.maxWidth = '100%';
    imageStyle.maxHeight = '100%';
  } else if (currentThumbnail.width) {
    imageStyle.width = `${currentThumbnail.width}px`;
    imageStyle.maxWidth = '100%';
    imageStyle.height = 'auto';
  } else if (currentThumbnail.height) {
    imageStyle.height = `${currentThumbnail.height}px`;
    imageStyle.maxHeight = '100%';
    imageStyle.width = 'auto';
  } else {
    // Default: responsive but centered
    imageStyle.maxWidth = '100%';
    imageStyle.maxHeight = '100%';
    imageStyle.height = 'auto';
  }

  // Button styles
  const buttonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    zIndex: 1,
    transition: 'background-color 0.3s',
  };

  const prevButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    left: '10px',
  };

  const nextButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    right: '10px',
  };

  // Dots container style
  const dotsContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '10px',
  };

  // Dot style
  const dotStyle: React.CSSProperties = {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const activeDotStyle: React.CSSProperties = {
    ...dotStyle,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  };

  return (
    <div>
      <div style={containerStyle}>
        <div style={imageWrapperStyle}>
          <img
            src={currentThumbnail.url}
            alt={`Thumbnail ${currentIndex + 1}`}
            style={imageStyle}
          />
        </div>
        {thumbnails.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              style={prevButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
              }}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              onClick={goToNext}
              style={nextButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
              }}
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}
      </div>
      {thumbnails.length > 1 && (
        <div style={dotsContainerStyle}>
          {thumbnails.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={index === currentIndex ? activeDotStyle : dotStyle}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DocThumbnail;
