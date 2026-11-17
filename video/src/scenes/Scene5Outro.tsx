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
      <AuroraBackdrop monoMix={0.35} goldGlow={0.65} />

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
        {/* Authentic App Icon inside Liquid Glass Halo */}
        <div
          style={{
            position: 'relative',
            marginBottom: 38,
            transform: `scale(${interpolate(iconSpring, [0, 1], [0.8, 1])})`,
            opacity: iconSpring,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: -36,
              borderRadius: '50%',
              transform: `scale(${haloScale})`,
              background:
                'radial-gradient(circle, rgba(167,139,250,0.34) 0%, rgba(197,168,106,0.16) 45%, transparent 72%)',
              filter: 'blur(20px)',
            }}
          />

          <div
            style={{
              position: 'relative',
              width: 186,
              height: 186,
              borderRadius: 44,
              padding: 6,
              background:
                'linear-gradient(145deg, rgba(255,255,255,0.42), rgba(167,139,250,0.26) 50%, rgba(197,168,106,0.32))',
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

        {/* Title */}
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
              fontFamily: FONT_SANS,
              fontSize: 32,
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: BRAND_COLORS.purpleLight,
              marginBottom: 16,
            }}
          >
            Pickup for iPhone &amp; iPad
          </div>

          <div
            style={{
              position: 'relative',
              fontFamily: FONT_SERIF,
              fontSize: 74,
              fontWeight: 700,
              color: BRAND_COLORS.ivory,
              letterSpacing: '0.05em',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <span>留在设备里，也可以带走。</span>
            <span
              style={{
                position: 'absolute',
                right: -28,
                width: 13,
                height: 13,
                borderRadius: '50%',
                backgroundColor: BRAND_COLORS.redPen,
                boxShadow: `0 0 18px ${BRAND_COLORS.redPen}`,
              }}
            />
          </div>
        </div>

        {/* Bottom Website & GitHub Pill */}
        <div
          style={{
            marginTop: 48,
            opacity: linkSpring,
            transform: `translateY(${interpolate(linkSpring, [0, 1], [16, 0])}px)`,
          }}
        >
          <LiquidGlassCapsule
            dotColor={BRAND_COLORS.gold}
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
