import React, { useId } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { BRAND_COLORS, FONT_SANS, mixHex } from '../theme';

interface AuroraBackdropProps {
  /** 0 = Purple Dark, 1 = Monochrome */
  monoMix?: number;
  /** Optional subtle warm gold glow intensity (0..1) */
  goldGlow?: number;
}

/**
 * Ambient backdrop implementing Pickup's dual aesthetic:
 * Aurora Purple Dark (#0D0C12 / #7C4DFF / #A78BFA) <-> Monochrome (#060606 / #080808).
 */
export const AuroraBackdrop: React.FC<AuroraBackdropProps> = ({
  monoMix = 0,
  goldGlow = 0,
}) => {
  const frame = useCurrentFrame();
  const baseBg = mixHex('#0D0C12', '#060606', monoMix);
  const purpleAlpha = 1 - Math.max(0, Math.min(1, monoMix));
  const driftX = Math.sin(frame * 0.015) * 40;
  const driftY = Math.cos(frame * 0.012) * 26;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: baseBg,
        overflow: 'hidden',
      }}
    >
      {/* Top-right Aurora Purple glow (fades out during Monochrome morph) */}
      <div
        style={{
          position: 'absolute',
          top: -260 + driftY,
          right: -180 + driftX,
          width: 1120,
          height: 920,
          borderRadius: '50%',
          opacity: 0.36 * purpleAlpha,
          background:
            'radial-gradient(circle, rgba(124,77,255,0.65) 0%, rgba(167,139,250,0.22) 45%, rgba(13,12,18,0) 72%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Bottom-left soft Red-Pen / Violet whisper */}
      <div
        style={{
          position: 'absolute',
          bottom: -300 - driftY * 0.7,
          left: -160 - driftX * 0.6,
          width: 860,
          height: 760,
          borderRadius: '50%',
          opacity: 0.22 * purpleAlpha,
          background:
            'radial-gradient(circle, rgba(244,104,98,0.34) 0%, rgba(124,77,255,0.14) 48%, rgba(0,0,0,0) 74%)',
          filter: 'blur(70px)',
        }}
      />

      {/* Monochrome top-left crisp alabaster glow */}
      <div
        style={{
          position: 'absolute',
          top: -220,
          left: -120,
          width: 980,
          height: 760,
          borderRadius: '50%',
          opacity: 0.08 + 0.08 * (1 - purpleAlpha),
          background:
            'radial-gradient(circle, rgba(244,243,237,0.35) 0%, rgba(244,243,237,0) 70%)',
          filter: 'blur(65px)',
        }}
      />

      {/* Optional vintage gold center halo (Intro / Vault / Outro) */}
      {goldGlow > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 980,
            height: 980,
            borderRadius: '50%',
            opacity: goldGlow * 0.24,
            background:
              'radial-gradient(circle, rgba(197,168,106,0.42) 0%, rgba(197,168,106,0.08) 46%, rgba(0,0,0,0) 72%)',
            filter: 'blur(45px)',
          }}
        />
      )}

      {/* Subtle architectural hairline grid for editorial precision */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.045,
          backgroundImage:
            'linear-gradient(to right, rgba(244,243,237,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(244,243,237,0.35) 1px, transparent 1px)',
          backgroundSize: '120px 120px',
          maskImage:
            'radial-gradient(ellipse 80% 75% at 50% 50%, black 30%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 75% at 50% 50%, black 30%, transparent 100%)',
        }}
      />
    </div>
  );
};

interface LiquidGlassCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  radius?: number;
  /** Tint mode or interpolated blend */
  monoMix?: number;
  highlightColor?: string;
  specularSpeed?: number;
  /** Optional SVG refractive glow border intensity */
  refractiveGlow?: boolean;
}

/**
 * iOS 26 Liquid Glass surface with SVG refractive border glow and diagonal specular sweep.
 */
export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  children,
  style,
  radius = 28,
  monoMix = 0,
  highlightColor,
  specularSpeed = 1,
  refractiveGlow = true,
}) => {
  const frame = useCurrentFrame();
  const uid = useId().replace(/:/g, '');
  const purpleAlpha = 1 - Math.max(0, Math.min(1, monoMix));

  const sweepProgress = ((frame * 0.0065 * specularSpeed) % 1.8) - 0.4;
  const sweepPercent = interpolate(sweepProgress, [-0.4, 1.4], [-60, 160]);

  const bgTop = `rgba(${Math.round(32 - 14 * monoMix)}, ${Math.round(28 - 10 * monoMix)}, ${Math.round(48 - 30 * monoMix)}, 0.74)`;
  const bgBot = `rgba(${Math.round(18 - 8 * monoMix)}, ${Math.round(16 - 6 * monoMix)}, ${Math.round(25 - 15 * monoMix)}, 0.86)`;
  const accentEdge = highlightColor ?? (purpleAlpha > 0.5 ? BRAND_COLORS.purpleLight : BRAND_COLORS.ivory);

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: radius,
        background: `linear-gradient(155deg, ${bgTop} 0%, ${bgBot} 100%)`,
        backdropFilter: 'blur(28px) saturate(165%)',
        WebkitBackdropFilter: 'blur(28px) saturate(165%)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(255,255,255,0.04), 0 28px 64px rgba(0,0,0,0.52)',
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
          background: `linear-gradient(118deg, transparent ${sweepPercent - 18}%, rgba(255,255,255,0.08) ${sweepPercent}%, transparent ${sweepPercent + 18}%)`,
        }}
      />

      {/* Top-left ambient caustic sheen */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(110% 70% at 12% 0%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 58%)',
        }}
      />

      {/* SVG Refractive Border Glow */}
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
              <stop offset="0%" stopColor="rgba(255,255,255,0.52)" />
              <stop offset="35%" stopColor={accentEdge} stopOpacity={0.35 + 0.25 * purpleAlpha} />
              <stop offset="70%" stopColor="rgba(255,255,255,0.08)" />
              <stop offset="100%" stopColor={accentEdge} stopOpacity={0.28} />
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
            strokeWidth="2.5"
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
  monoMix?: number;
}

export const LiquidGlassCapsule: React.FC<LiquidGlassCapsuleProps> = ({
  children,
  style,
  dotColor = BRAND_COLORS.purpleLight,
  monoMix = 0,
}) => {
  const borderColor =
    monoMix > 0.5 ? 'rgba(244, 243, 237, 0.24)' : 'rgba(167, 139, 250, 0.34)';
  const bg =
    monoMix > 0.5
      ? 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(20,20,20,0.72))'
      : 'linear-gradient(135deg, rgba(167,139,250,0.18), rgba(24,20,38,0.78))';

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
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.28), 0 10px 28px rgba(0,0,0,0.38)',
        fontFamily: FONT_SANS,
        fontSize: 16,
        fontWeight: 500,
        letterSpacing: '0.03em',
        color: BRAND_COLORS.ivory,
        ...style,
      }}
    >
      {dotColor && (
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: dotColor,
            boxShadow: `0 0 10px ${dotColor}`,
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </div>
  );
};
