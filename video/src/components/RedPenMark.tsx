import React from 'react';
import { interpolate } from 'remotion';
import { BRAND_COLORS } from '../theme';

interface RedPenMarkProps {
  /** Animation progress 0..1 */
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  style?: React.CSSProperties;
}

/**
 * Organic hand-drawn red-pen circle (#F46862) matching RedPenCircleShape in RedPenCircle.swift.
 */
export const RedPenCircle: React.FC<RedPenMarkProps> = ({
  progress,
  size = 116,
  strokeWidth = 4.2,
  color = BRAND_COLORS.redPen,
  style,
}) => {
  const clamped = Math.max(0, Math.min(1, progress));
  // Path length ~310 units in 100x100 viewBox
  const pathLen = 325;
  const dashOffset = interpolate(clamped, [0, 1], [pathLen, 0]);
  const opacity = interpolate(clamped, [0, 0.08], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Exact cubic Bezier loop ported from Pickup/App/Design/RedPenCircle.swift (cx=50, cy=50, rx=44, ry=41)
  const d =
    'M 87.4 27.4 ' +
    'C 58.8 2.8, 12.6 11.0, 9.5 39.8 ' +
    'C 3.8 71.3, 34.6 91.8, 56.6 89.4 ' +
    'C 81.7 86.1, 97.5 64.4, 93.1 45.1 ' +
    'C 91.8 31.6, 84.3 22.1, 74.2 19.7';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        overflow: 'visible',
        transform: 'rotate(-10deg)',
        opacity,
        filter: `drop-shadow(0 0 12px ${color}66)`,
        pointerEvents: 'none',
        ...style,
      }}
    >
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLen}
        strokeDashoffset={dashOffset}
      />
    </svg>
  );
};
