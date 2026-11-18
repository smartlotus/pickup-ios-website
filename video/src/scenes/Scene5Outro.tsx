import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { AuroraBackdrop, LiquidGlassCapsule } from '../components/LiquidGlass';
import { BRAND_COLORS, FONT_MONO, FONT_SANS, FONT_SERIF } from '../theme';

export const Scene5Outro: React.FC = () => {
  const frame = useCurrentFrame(); // 0..240 (global 1800..2040)
  const { fps } = useVideoConfig();

  const enterOpacity = interpolate(frame, [0, 24], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const finalFadeOut = interpolate(frame, [218, 240], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const iconSpring = spring({
    frame: Math.max(0, frame - 6),
    fps,
    config: { damping: 15, stiffness: 88 },
  });
  const textSpring = spring({
    frame: Math.max(0, frame - 22),
    fps,
    config: { damping: 16, stiffness: 80 },
  });
  const linkSpring = spring({
    frame: Math.max(0, frame - 42),
    fps,
    config: { damping: 16, stiffness: 78 },
  });

  const haloScale = 1 + 0.04 * Math.sin(frame * 0.06);

  return (
    <AbsoluteFill style={{ opacity: enterOpacity * finalFadeOut }}>
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
        }}
      >
        {/* Authentic App Icon inside Pure Monochrome Frosted Halo */}
        <div
          style={{
            position: 'relative',
            marginBottom: 34,
            transform: `scale(${interpolate(iconSpring, [0, 1], [0.8, 1])})`,
            opacity: iconSpring,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: -38,
              borderRadius: '50%',
              transform: `scale(${haloScale})`,
              background:
                'radial-gradient(circle, rgba(244,243,237,0.20) 0%, rgba(216,215,208,0.06) 48%, transparent 72%)',
              filter: 'blur(22px)',
            }}
          />

          <div
            style={{
              position: 'relative',
              width: 182,
              height: 182,
              borderRadius: 44,
              padding: 6,
              background:
                'linear-gradient(145deg, rgba(255,255,255,0.44), rgba(255,255,255,0.08) 52%, rgba(255,255,255,0.22))',
              boxShadow:
                '0 30px 70px rgba(0,0,0,0.72), inset 0 1.5px 1px rgba(255,255,255,0.55)',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 38,
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
              }}
            >
              <Img
                src={staticFile('icon.png')}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          </div>
        </div>

        {/* Clean "Pickup." Editorial Lockup */}
        <div
          style={{
            opacity: textSpring,
            transform: `translateY(${interpolate(textSpring, [0, 1], [22, 0])}px)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontFamily: FONT_SERIF,
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: '0.03em',
              color: BRAND_COLORS.ivory,
              lineHeight: 1.05,
              marginBottom: 14,
            }}
          >
            Pickup.
          </div>

          <div
            style={{
              fontFamily: FONT_SANS,
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: '0.14em',
              color: BRAND_COLORS.muted,
              textTransform: 'uppercase',
              marginBottom: 20,
            }}
          >
            for iPhone &amp; iPad
          </div>

          <div
            style={{
              fontFamily: FONT_SERIF,
              fontSize: 48,
              fontWeight: 600,
              color: BRAND_COLORS.silver,
              letterSpacing: '0.06em',
            }}
          >
            留在设备里，也可以带走。
          </div>
        </div>

        {/* Bottom Website & GitHub Pill */}
        <div
          style={{
            marginTop: 46,
            opacity: linkSpring,
            transform: `translateY(${interpolate(linkSpring, [0, 1], [16, 0])}px)`,
          }}
        >
          <LiquidGlassCapsule
            dotColor={BRAND_COLORS.ivory}
            lightMix={0}
            style={{
              padding: '14px 28px',
              fontSize: 20,
              fontFamily: FONT_MONO,
              letterSpacing: '0.04em',
            }}
          >
            pickup-ios.pages.dev &nbsp;·&nbsp; github.com/smartlotus/pickup-ios
          </LiquidGlassCapsule>
        </div>
      </div>
    </AbsoluteFill>
  );
};
