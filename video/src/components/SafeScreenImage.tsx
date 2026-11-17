import React from 'react';

interface SafeScreenImageProps {
  /** Path relative to public/, e.g. "screens/iphone-journal.png" */
  screenPath: string;
  alt: string;
  fallback: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Renders the kinetic live-animated Liquid Glass device UI screens directly
 * (enabling smooth Purple Dark <-> Monochrome morphs, animated red-pen strokes,
 * and live storage rings without async delayRender network blocking).
 */
export const SafeScreenImage: React.FC<SafeScreenImageProps> = ({ fallback }) => {
  return <>{fallback}</>;
};
