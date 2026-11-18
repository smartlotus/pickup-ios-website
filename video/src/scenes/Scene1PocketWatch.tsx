import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { AuroraBackdrop, LiquidGlassCapsule } from '../components/LiquidGlass';
import { RedPenCircle } from '../components/RedPenMark';
import { BRAND_COLORS, FONT_MONO, FONT_SANS, FONT_SERIF } from '../theme';

export const Scene1PocketWatch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 85, mass: 0.9 },
  });

  // Watch subtly lifts upward after 0.6s to frame the editorial headline below
  const watchLift = spring({
    frame: Math.max(0, frame - 32),
    fps,
    config: { damping: 18, stiffness: 70 },
  });

  const watchScale =
    interpolate(enter, [0, 1], [0.82, 1]) * interpolate(watchLift, [0, 1], [1.14, 0.92]);
  const watchY = interpolate(watchLift, [0, 1], [85, -42]);

  // Second hand sweep: smooth sweep + crisp mechanical 4Hz escapement micro-pulse
  const smoothDeg = (frame / 60) * 36;
  const tickStep = Math.floor(frame / 15);
  const tickFrac = (frame % 15) / 15;
  const escapementImpulse = Math.exp(-tickFrac * 6) * 1.4;
  const secondAngle =
    smoothDeg + (tickStep % 2 === 0 ? escapementImpulse : -escapementImpulse * 0.5);
  const minuteAngle = -35 + (frame / 300) * 18;
  const hourAngle = 295 + (frame / 300) * 3;

  const rimGlowDeg = interpolate(frame, [0, 300], [-35, 220]);

  const brandOpacity = interpolate(frame, [42, 72], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const brandY = interpolate(frame, [42, 80], [24, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const headlineOpacity = interpolate(frame, [60, 92], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const headlineY = interpolate(frame, [60, 98], [28, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const redPenProgress = interpolate(frame, [95, 168], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const subOpacity = interpolate(frame, [150, 188], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const exitOpacity = interpolate(frame, [282, 300], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: exitOpacity }}>
      <AuroraBackdrop lightMix={0} />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 20,
        }}
      >
        {/* Minimalist Monochrome Brushed-Steel Watch Dial */}
        <div
          style={{
            transform: `translateY(${watchY}px) scale(${watchScale})`,
            opacity: enter,
            marginBottom: 18,
          }}
        >
          <svg width="280" height="318" viewBox="0 0 280 318" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="steelBezelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={BRAND_COLORS.ivory} />
                <stop offset="35%" stopColor="#B8B7B0" />
                <stop offset="70%" stopColor="#52524E" />
                <stop offset="100%" stopColor={BRAND_COLORS.silver} />
              </linearGradient>
              <radialGradient id="dialGrad" cx="50%" cy="45%" r="58%">
                <stop offset="0%" stopColor="#181817" />
                <stop offset="75%" stopColor="#0C0C0B" />
                <stop offset="100%" stopColor="#040404" />
              </radialGradient>
              <linearGradient
                id="crystalGlint"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
                gradientTransform={`rotate(${rimGlowDeg} 0.5 0.5)`}
              >
                <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
                <stop offset="45%" stopColor="rgba(255,255,255,0.02)" />
                <stop offset="100%" stopColor="rgba(244,243,237,0.12)" />
              </linearGradient>
            </defs>

            {/* Ambient Alabaster Halo */}
            <circle cx="140" cy="176" r="126" fill="rgba(244,243,237,0.05)" />

            {/* Top Watch Bow Ring */}
            <circle
              cx="140"
              cy="30"
              r="22"
              fill="none"
              stroke="url(#steelBezelGrad)"
              strokeWidth="6"
            />
            {/* Winding Stem / Crown */}
            <rect
              x="128"
              y="40"
              width="24"
              height="18"
              rx="4"
              fill="url(#steelBezelGrad)"
            />
            <rect x="133" y="56" width="14" height="10" fill="#7A7972" />

            {/* Outer Brushed Steel Case */}
            <circle
              cx="140"
              cy="176"
              r="114"
              fill="url(#steelBezelGrad)"
              stroke="rgba(255,255,255,0.42)"
              strokeWidth="1.2"
            />
            {/* Inner Bezel Step */}
            <circle
              cx="140"
              cy="176"
              r="102"
              fill="#121211"
              stroke="#6E6D68"
              strokeWidth="1.8"
            />
            {/* Obsidian Dial */}
            <circle cx="140" cy="176" r="97" fill="url(#dialGrad)" />
            {/* Inner Chapter Ring */}
            <circle
              cx="140"
              cy="176"
              r="76"
              fill="none"
              stroke="rgba(244,243,237,0.16)"
              strokeWidth="1"
            />

            {/* 60 Mechanical Dial Ticks */}
            {Array.from({ length: 60 }, (_, idx) => {
              const angle = (idx * 6 * Math.PI) / 180;
              const isHour = idx % 5 === 0;
              const rOut = 92;
              const rIn = isHour ? 81 : 87;
              const x1 = 140 + Math.sin(angle) * rIn;
              const y1 = 176 - Math.cos(angle) * rIn;
              const x2 = 140 + Math.sin(angle) * rOut;
              const y2 = 176 - Math.cos(angle) * rOut;
              return (
                <line
                  key={idx}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isHour ? BRAND_COLORS.ivory : 'rgba(244,243,237,0.32)'}
                  strokeWidth={isHour ? 2.2 : 1}
                  strokeLinecap="round"
                />
              );
            })}

            {/* Dial Inscription */}
            <text
              x="140"
              y="142"
              textAnchor="middle"
              fill={BRAND_COLORS.muted}
              fontSize="9.5"
              letterSpacing="3.2"
              fontFamily={FONT_MONO}
              opacity="0.92"
            >
              PICKUP · MMXXVI
            </text>

            {/* Small Sub-Seconds Ring */}
            <circle
              cx="140"
              cy="214"
              r="18"
              fill="none"
              stroke="rgba(244,243,237,0.24)"
              strokeWidth="1"
            />
            <line
              x1="140"
              y1="214"
              x2={140 + Math.sin((secondAngle * 2 * Math.PI) / 180) * 14}
              y2={214 - Math.cos((secondAngle * 2 * Math.PI) / 180) * 14}
              stroke={BRAND_COLORS.silver}
              strokeWidth="1.4"
              strokeLinecap="round"
            />

            {/* Hour Hand */}
            <g transform={`rotate(${hourAngle} 140 176)`}>
              <line
                x1="140"
                y1="184"
                x2="140"
                y2="128"
                stroke={BRAND_COLORS.ivory}
                strokeWidth="4.2"
                strokeLinecap="round"
              />
            </g>

            {/* Minute Hand */}
            <g transform={`rotate(${minuteAngle} 140 176)`}>
              <line
                x1="140"
                y1="188"
                x2="140"
                y2="104"
                stroke={BRAND_COLORS.ivory}
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            </g>

            {/* Sweeping Silver Second Hand */}
            <g transform={`rotate(${secondAngle} 140 176)`}>
              <line
                x1="140"
                y1="196"
                x2="140"
                y2="92"
                stroke={BRAND_COLORS.silver}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <circle cx="140" cy="176" r="5" fill={BRAND_COLORS.ivory} />
            </g>

            {/* Liquid Glass Watch Crystal Overlay */}
            <circle
              cx="140"
              cy="176"
              r="98"
              fill="url(#crystalGlint)"
              stroke="rgba(255,255,255,0.20)"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* Wordmark */}
        <div
          style={{
            opacity: brandOpacity,
            transform: `translateY(${brandY}px)`,
            fontFamily: FONT_SERIF,
            fontSize: 40,
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: BRAND_COLORS.silver,
            marginBottom: 14,
          }}
        >
          Pickup
        </div>

        {/* Main Editorial Headline with Red-Pen Circle around "拾" */}
        <div
          style={{
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            fontFamily: FONT_SERIF,
            fontSize: 88,
            fontWeight: 700,
            color: BRAND_COLORS.ivory,
            letterSpacing: '0.06em',
            lineHeight: 1.2,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span>把日子，</span>
          <span
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 4px',
            }}
          >
            <span style={{ position: 'relative', zIndex: 2 }}>拾</span>
            <RedPenCircle
              progress={redPenProgress}
              size={138}
              strokeWidth={4.4}
              style={{
                position: 'absolute',
                top: -11,
                left: -25,
                zIndex: 1,
              }}
            />
          </span>
          <span>起来。</span>
        </div>

        {/* Subtitle & Capsule */}
        <div
          style={{
            opacity: subOpacity,
            marginTop: 28,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              fontFamily: FONT_SANS,
              fontSize: 23,
              color: BRAND_COLORS.muted,
              letterSpacing: '0.06em',
            }}
          >
            写给时间与日常的私人记忆胶囊 · iPhone &amp; iPad
          </div>
          <LiquidGlassCapsule dotColor={BRAND_COLORS.ivory} lightMix={0}>
            iOS 26 Liquid Glass · 本地私密留存
          </LiquidGlassCapsule>
        </div>
      </div>
    </AbsoluteFill>
  );
};
