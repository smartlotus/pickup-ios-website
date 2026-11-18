import React, { useId } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { BRAND_COLORS, FONT_SANS, mixHex } from '../theme';

interface AuroraBackdropProps {
  /** 0 = Obsidian Frosted Glass (#080808), 1 = Paper Light Frosted Glass (#F5F4EF) */
  lightMix?: number;
}

/**
 * Pure monochrome frosted ambient stage:
 * Obsidian (#080808) <-> Paper Light (#F5F4EF) with soft drifting alabaster/silver
 * optical light beams that refract behind glass cards and crisp 1px hairlines.
 */
export const AuroraBackdrop: React.FC<AuroraBackdropProps> = ({
  lightMix = 0,
}) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, Math.min(1, lightMix));
  const baseBg = mixHex(BRAND_COLORS.obsidian, BRAND_COLORS.paperLight, t);
  const driftX = Math.sin(frame * 0.014) * 44;
  const driftY = Math.cos(frame * 0.011) * 28;

  const darkBeamOpacity = (1 - t);
  const lightWashOpacity = t;
  const gridLineColor =
    t < 0.5
      ? `rgba(244, 243, 237, ${interpolate(t, [0, 0.5], [0.24, 0.14])})`
      : `rgba(17, 17, 17, ${interpolate(t, [0.5, 1], [0.06, 0.09])})`;
  const gridOpacity = interpolate(t, [0, 1], [0.055, 0.08]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: baseBg,
        overflow: 'hidden',
      }}
    >
      {/* Obsidian stage: top-right drifting alabaster light beam */}
      <div
        style={{
          position: 'absolute',
          top: -280 + driftY,
          right: -180 + driftX,
          width: 1180,
          height: 920,
          borderRadius: '50%',
          opacity: 0.24 * darkBeamOpacity,
          background:
            'radial-gradient(circle, rgba(244,243,237,0.42) 0%, rgba(216,215,208,0.14) 44%, rgba(8,8,8,0) 72%)',
          filter: 'blur(70px)',
        }}
      />

      {/* Obsidian stage: bottom-left soft silver counter-reflection */}
      <div
        style={{
          position: 'absolute',
          bottom: -320 - driftY * 0.7,
          left: -180 - driftX * 0.6,
          width: 960,
          height: 820,
          borderRadius: '50%',
          opacity: 0.16 * darkBeamOpacity,
          background:
            'radial-gradient(circle, rgba(216,215,208,0.34) 0%, rgba(162,161,154,0.10) 48%, rgba(8,8,8,0) 74%)',
          filter: 'blur(75px)',
        }}
      />

      {/* Obsidian stage: diagonal luminous frosted refraction band */}
      <div
        style={{
          position: 'absolute',
          top: '18%',
          left: '-12%',
          width: '124%',
          height: 360,
          transform: `translate(${driftX * 0.5}px, ${driftY * 0.4}px) rotate(-14deg)`,
          opacity: 0.10 * darkBeamOpacity,
          background:
            'linear-gradient(90deg, transparent 0%, rgba(244,243,237,0.35) 38%, rgba(216,215,208,0.22) 64%, transparent 100%)',
          filter: 'blur(48px)',
        }}
      />

      {/* Paper Light stage: drifting warm-graphite & pure white optical pools */}
      <div
        style={{
          position: 'absolute',
          top: -240 + driftY,
          right: -140 + driftX,
          width: 1120,
          height: 880,
          borderRadius: '50%',
          opacity: 0.78 * lightWashOpacity,
          background:
            'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.38) 46%, rgba(245,244,239,0) 72%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -260 - driftY * 0.6,
          left: -140 - driftX * 0.5,
          width: 980,
          height: 820,
          borderRadius: '50%',
          opacity: 0.55 * lightWashOpacity,
          background:
            'radial-gradient(circle, rgba(17,17,17,0.09) 0%, rgba(92,91,85,0.04) 48%, rgba(245,244,239,0) 74%)',
          filter: 'blur(70px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '28%',
          left: '-10%',
          width: '120%',
          height: 320,
          transform: `translate(${driftX * 0.4}px, ${driftY * 0.35}px) rotate(-14deg)`,
          opacity: 0.45 * lightWashOpacity,
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.90) 42%, rgba(17,17,17,0.045) 68%, transparent 100%)',
          filter: 'blur(42px)',
        }}
      />

      {/* Crisp 1px architectural hairline grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: gridOpacity,
          backgroundImage: `linear-gradient(to right, ${gridLineColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridLineColor} 1px, transparent 1px)`,
          backgroundSize: '120px 120px',
          maskImage:
            'radial-gradient(ellipse 84% 78% at 50% 50%, black 34%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 84% 78% at 50% 50%, black 34%, transparent 100%)',
        }}
      />

      {/* Horizontal editorial refraction hairlines */}
      <div
        style={{
          position: 'absolute',
          top: 176,
          left: 80,
          right: 80,
          height: 1,
          backgroundColor:
            t < 0.5 ? 'rgba(255,255,255,0.07)' : 'rgba(17,17,17,0.06)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 112,
          left: 80,
          right: 80,
          height: 1,
          backgroundColor:
            t < 0.5 ? 'rgba(255,255,255,0.05)' : 'rgba(17,17,17,0.05)',
        }}
      />
    </div>
  );
};

interface LiquidGlassCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  radius?: number;
  /** 0 = Obsidian Dark glass, 1 = Paper Light glass */
  lightMix?: number;
  highlightColor?: string;
  specularSpeed?: number;
  /** Optional crisp SVG specular rim */
  refractiveGlow?: boolean;
}

/**
 * Pure Monochrome Translucent Frosted Glass Card:
 * Neutral white translucent fill with 28px backdrop blur and crisp white/silver SVG rim.
 */
export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  children,
  style,
  radius = 28,
  lightMix = 0,
  highlightColor,
  specularSpeed = 1,
  refractiveGlow = true,
}) => {
  const frame = useCurrentFrame();
  const uid = useId().replace(/:/g, '');
  const t = Math.max(0, Math.min(1, lightMix));

  const sweepProgress = ((frame * 0.0065 * specularSpeed) % 1.8) - 0.4;
  const sweepPercent = interpolate(sweepProgress, [-0.4, 1.4], [-60, 160]);

  const topAlpha = interpolate(t, [0, 1], [0.06, 0.72]);
  const botAlpha = interpolate(t, [0, 1], [0.02, 0.64]);
  const bgTop = `rgba(255, 255, 255, ${topAlpha.toFixed(3)})`;
  const bgBot = `rgba(255, 255, 255, ${botAlpha.toFixed(3)})`;

  const shadowInsetTop = interpolate(t, [0, 1], [0.22, 0.94]);
  const shadowDropAlpha = interpolate(t, [0, 1], [0.5, 0.085]);
  const sweepOpacity = interpolate(t, [0, 1], [0.085, 0.42]);
  const causticOpacity = interpolate(t, [0, 1], [0.10, 0.45]);

  const defaultRimColor = t < 0.5 ? BRAND_COLORS.ivory : BRAND_COLORS.silver;
  const rimAccent = highlightColor ?? defaultRimColor;

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: radius,
        background: `linear-gradient(155deg, ${bgTop} 0%, ${bgBot} 100%)`,
        backdropFilter: 'blur(28px) saturate(115%)',
        WebkitBackdropFilter: 'blur(28px) saturate(115%)',
        boxShadow: `inset 0 1px 0 rgba(255,255,255,${shadowInsetTop.toFixed(2)}), inset 0 -1px 0 rgba(255,255,255,0.06), 0 26px 60px rgba(0,0,0,${shadowDropAlpha.toFixed(3)})`,
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Diagonal Specular Sweep Highlight */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `linear-gradient(118deg, transparent ${sweepPercent - 18}%, rgba(255,255,255,${sweepOpacity.toFixed(3)}) ${sweepPercent}%, transparent ${sweepPercent + 18}%)`,
        }}
      />

      {/* Top-left ambient frosted caustic sheen */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(110% 70% at 12% 0%, rgba(255,255,255,${causticOpacity.toFixed(2)}) 0%, rgba(255,255,255,0) 58%)`,
        }}
      />

      {/* Crisp Specular White/Silver SVG Rim */}
      {refractiveGlow && (
        <svg
          width="100%"
          height="100%"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 3,
          }}
        >
          <defs>
            <linearGradient
              id={`lg-rim-${uid}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor="rgba(255,255,255,0.92)"
                stopOpacity={interpolate(t, [0, 1], [0.52, 0.96])}
              />
              <stop
                offset="38%"
                stopColor={rimAccent}
                stopOpacity={interpolate(t, [0, 1], [0.24, 0.18])}
              />
              <stop
                offset="72%"
                stopColor={t < 0.5 ? 'rgba(255,255,255,0.08)' : 'rgba(17,17,17,0.10)'}
              />
              <stop
                offset="100%"
                stopColor={t < 0.5 ? 'rgba(255,255,255,0.22)' : 'rgba(17,17,17,0.14)'}
              />
            </linearGradient>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            rx={radius}
            ry={radius}
            fill="none"
            stroke={`url(#lg-rim-${uid})`}
            strokeWidth="2"
          />
        </svg>
      )}

      <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
};

interface LiquidGlassCapsuleProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  dotColor?: string;
  /** 0 = Obsidian Dark glass, 1 = Paper Light glass */
  lightMix?: number;
}

export const LiquidGlassCapsule: React.FC<LiquidGlassCapsuleProps> = ({
  children,
  style,
  dotColor,
  lightMix = 0,
}) => {
  const t = Math.max(0, Math.min(1, lightMix));
  const bgTopAlpha = interpolate(t, [0, 1], [0.09, 0.78]);
  const bgBotAlpha = interpolate(t, [0, 1], [0.03, 0.62]);
  const bg = `linear-gradient(135deg, rgba(255,255,255,${bgTopAlpha.toFixed(2)}), rgba(255,255,255,${bgBotAlpha.toFixed(2)}))`;
  const borderColor =
    t < 0.5
      ? `rgba(255, 255, 255, ${interpolate(t, [0, 0.5], [0.20, 0.16]).toFixed(2)})`
      : `rgba(17, 17, 17, ${interpolate(t, [0.5, 1], [0.10, 0.13]).toFixed(2)})`;
  const textColor = mixHex(BRAND_COLORS.ivory, BRAND_COLORS.ink, t);
  const resolvedDot = dotColor ?? textColor;
  const shadowAlpha = interpolate(t, [0, 1], [0.36, 0.08]);

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 20px',
        borderRadius: 999,
        background: bg,
        border: `1px solid ${borderColor}`,
        backdropFilter: 'blur(24px) saturate(115%)',
        WebkitBackdropFilter: 'blur(24px) saturate(115%)',
        boxShadow: `inset 0 1px 0 rgba(255,255,255,${interpolate(t, [0, 1], [0.26, 0.92]).toFixed(2)}), 0 10px 26px rgba(0,0,0,${shadowAlpha.toFixed(2)})`,
        fontFamily: FONT_SANS,
        fontSize: 16,
        fontWeight: 500,
        letterSpacing: '0.03em',
        color: textColor,
        ...style,
      }}
    >
      {resolvedDot && (
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: resolvedDot,
            boxShadow: t < 0.5 ? `0 0 8px rgba(244,243,237,0.45)` : 'none',
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </div>
  );
};
