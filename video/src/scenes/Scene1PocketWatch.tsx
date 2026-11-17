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

  const watchScale = interpolate(enter, [0, 1], [0.82, 1]) * interpolate(watchLift, [0, 1], [1.14, 0.92]);
  const watchY = interpolate(watchLift, [0, 1], [85, -42]);

  // Second hand sweep: smooth sweep + crisp mechanical 4Hz escapement micro-pulse
  const smoothDeg = (frame / 60) * 36; // Graceful cinematic sweep
  const tickStep = Math.floor(frame / 15);
  const tickFrac = (frame % 15) / 15;
  const escapementImpulse = Math.exp(-tickFrac * 6) * 1.4;
  const secondAngle = smoothDeg + (tickStep % 2 === 0 ? escapementImpulse : -escapementImpulse * 0.5);
  const minuteAngle = -35 + (frame / 300) * 18;
  const hourAngle = 295 + (frame / 300) * 3;

  // Specular sweep across gold bezel
  const rimGlowDeg = interpolate(frame, [0, 300], [-35, 220]);

  // Title + Red Pen reveal
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
      <AuroraBackdrop monoMix={0.85} goldGlow={0.95} />

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
        {/* Gold-Rimmed Vintage Pocket Watch */}
        <div
          style={{
            transform: `translateY(${watchY}px) scale(${watchScale})`,
            opacity: enter,
            marginBottom: 18,
          }}
        >
          <svg width="280" height="318" viewBox="0 0 280 318" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="goldBezelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E6CE97" />
                <stop offset="35%" stopColor={BRAND_COLORS.gold} />
                <stop offset="70%" stopColor="#8E723C" />
                <stop offset="100%" stopColor="#DFC58B" />
              </linearGradient>
              <radialGradient id="dialGrad" cx="50%" cy="45%" r="58%">
                <stop offset="0%" stopColor="#1B1917" />
                <stop offset="75%" stopColor="#0C0B0A" />
                <stop offset="100%" stopColor="#050505" />
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
                <stop offset="100%" stopColor="rgba(197,168,106,0.14)" />
              </linearGradient>
            </defs>

            {/* Ambient Gold Halo */}
            <circle cx="140" cy="176" r="126" fill="rgba(197,168,106,0.10)" />

            {/* Top Pocket Watch Bow Ring */}
            <circle
              cx="140"
              cy="30"
              r="22"
              fill="none"
              stroke="url(#goldBezelGrad)"
              strokeWidth="6"
            />
            {/* Winding Stem / Crown */}
            <rect
              x="128"
              y="40"
              width="24"
              height="18"
              rx="4"
              fill="url(#goldBezelGrad)"
            />
            <rect
              x="133"
              y="56"
              width="14"
              height="10"
              fill="#9E824B"
            />

            {/* Outer Brushed Gold Case */}
            <circle
              cx="140"
              cy="176"
              r="114"
              fill="url(#goldBezelGrad)"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="1.2"
            />
            {/* Inner Bezel Step */}
            <circle
              cx="140"
              cy="176"
              r="102"
              fill="#151310"
              stroke="#A3864C"
              strokeWidth="2"
            />
            {/* Obsidian Dial */}
            <circle cx="140" cy="176" r="97" fill="url(#dialGrad)" />
            {/* Inner Chapter Ring */}
            <circle
              cx="140"
              cy="176"
              r="76"
              fill="none"
              stroke="rgba(197,168,106,0.22)"
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
                  stroke={isHour ? BRAND_COLORS.goldSoft : 'rgba(244,243,237,0.35)'}
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
              fill={BRAND_COLORS.gold}
              fontSize="9.5"
              letterSpacing="3.2"
              fontFamily={FONT_MONO}
              opacity="0.88"
            >
              PICKUP · MMXXVI
            </text>

            {/* Small Sub-Seconds Ring */}
            <circle
              cx="140"
              cy="214"
              r="18"
              fill="none"
              stroke="rgba(197,168,106,0.28)"
              strokeWidth="1"
            />
            <line
              x1="140"
              y1="214"
              x2={140 + Math.sin((secondAngle * 2 * Math.PI) / 180) * 14}
              y2={214 - Math.cos((secondAngle * 2 * Math.PI) / 180) * 14}
              stroke={BRAND_COLORS.redPen}
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

            {/* Sweeping Gold Second Hand */}
            <g transform={`rotate(${secondAngle} 140 176)`}>
              <line
                x1="140"
                y1="196"
                x2="140"
                y2="92"
                stroke={BRAND_COLORS.goldSoft}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <circle cx="140" cy="176" r="5" fill={BRAND_COLORS.gold} />
            </g>

            {/* Liquid Glass Watch Crystal Overlay */}
            <circle
              cx="140"
              cy="176"
              r="98"
              fill="url(#crystalGlint)"
              stroke="rgba(255,255,255,0.18)"
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
            color: BRAND_COLORS.goldSoft,
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
          <LiquidGlassCapsule dotColor={BRAND_COLORS.gold} monoMix={0.85}>
            iOS 26 Liquid Glass · 本地私密留存
          </LiquidGlassCapsule>
        </div>
      </div>
    </AbsoluteFill>
  );
};
