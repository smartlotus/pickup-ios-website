import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  FallbackIPadSplitScreen,
  FallbackJournalScreen,
  IPadProBezel,
  IPhoneBezel,
} from '../components/DeviceMockups';
import {
  AuroraBackdrop,
  LiquidGlassCapsule,
  LiquidGlassCard,
} from '../components/LiquidGlass';
import { SafeScreenImage } from '../components/SafeScreenImage';
import { BRAND_COLORS, FONT_SANS, FONT_SERIF, mixHex } from '../theme';

export const Scene2LiquidGlass: React.FC = () => {
  const frame = useCurrentFrame(); // 0..480 (global 300..780)
  const { fps } = useVideoConfig();

  const enterOpacity = interpolate(frame, [0, 22], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const exitOpacity = interpolate(frame, [460, 480], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Smooth morph: Obsidian Frosted Glass (0..185) -> morph (185..305) -> Paper Light Frosted Glass (305..480)
  const lightMix = interpolate(frame, [185, 305], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const phoneSpring = spring({
    frame: Math.max(0, frame - 6),
    fps,
    config: { damping: 16, stiffness: 82 },
  });
  const padSpring = spring({
    frame: Math.max(0, frame - 14),
    fps,
    config: { damping: 16, stiffness: 76 },
  });

  const phoneY = interpolate(phoneSpring, [0, 1], [64, 0]) + Math.sin(frame * 0.03) * 6;
  const padY = interpolate(padSpring, [0, 1], [72, 0]) + Math.cos(frame * 0.025) * 5;

  const titleColor = mixHex(BRAND_COLORS.ivory, BRAND_COLORS.ink, lightMix);
  const subtitleColor = mixHex(BRAND_COLORS.muted, BRAND_COLORS.mutedLight, lightMix);

  const thumbGray = Math.round(interpolate(lightMix, [0, 1], [255, 17]));
  const thumbAlpha = interpolate(lightMix, [0, 1], [0.16, 0.88]);
  const thumbBorderAlpha = interpolate(lightMix, [0, 1], [0.34, 0.92]);
  const leftLabelColor =
    lightMix < 0.5 ? BRAND_COLORS.ivory : BRAND_COLORS.mutedLight;
  const rightLabelColor =
    lightMix >= 0.5 ? BRAND_COLORS.paperLight : BRAND_COLORS.muted;

  return (
    <AbsoluteFill style={{ opacity: enterOpacity * exitOpacity }}>
      <AuroraBackdrop lightMix={lightMix} />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          padding: '54px 86px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Top Editorial Header + Live Obsidian <-> Paper Theme Morph Switcher */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <LiquidGlassCapsule dotColor={titleColor} lightMix={lightMix}>
              iOS 26 Liquid Glass · iPhone &amp; iPad
            </LiquidGlassCapsule>
            <div
              style={{
                fontFamily: FONT_SERIF,
                fontSize: 52,
                fontWeight: 700,
                color: titleColor,
                marginTop: 18,
                letterSpacing: '0.03em',
              }}
            >
              光影折射，质感随主题流动
            </div>
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 20,
                color: subtitleColor,
                marginTop: 8,
              }}
            >
              黑曜深色与纸墨浅白双主题实时切换 · 透明毛玻璃折射边界与高光扫掠
            </div>
          </div>

          {/* Animated Theme Morph Pill */}
          <LiquidGlassCard
            lightMix={lightMix}
            radius={999}
            style={{ width: 348, height: 60, padding: 6 }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {/* Sliding Glass Thumb */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${lightMix * 50}%`,
                  width: '50%',
                  borderRadius: 999,
                  backgroundColor: `rgba(${thumbGray}, ${thumbGray}, ${thumbGray}, ${thumbAlpha.toFixed(2)})`,
                  border: `1px solid rgba(${thumbGray}, ${thumbGray}, ${thumbGray}, ${thumbBorderAlpha.toFixed(2)})`,
                  boxShadow:
                    lightMix < 0.5
                      ? '0 4px 16px rgba(0,0,0,0.28)'
                      : '0 4px 16px rgba(17,17,17,0.16)',
                }}
              />
              <div
                style={{
                  flex: 1,
                  textAlign: 'center',
                  fontFamily: FONT_SANS,
                  fontSize: 15,
                  fontWeight: lightMix < 0.5 ? 600 : 400,
                  color: leftLabelColor,
                  zIndex: 2,
                }}
              >
                黑曜 Obsidian
              </div>
              <div
                style={{
                  flex: 1,
                  textAlign: 'center',
                  fontFamily: FONT_SANS,
                  fontSize: 15,
                  fontWeight: lightMix >= 0.5 ? 600 : 400,
                  color: rightLabelColor,
                  zIndex: 2,
                }}
              >
                纸墨 Paper
              </div>
            </div>
          </LiquidGlassCard>
        </div>

        {/* Center Hardware Showcase: Side-by-Side iPhone & iPad Pro */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 64,
            marginTop: 8,
            flex: 1,
          }}
        >
          {/* Floating Specular iPhone */}
          <div
            style={{
              transform: `translateY(${phoneY}px) scale(${interpolate(phoneSpring, [0, 1], [0.94, 1])})`,
              opacity: phoneSpring,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <IPhoneBezel width={332} height={678} lightMix={lightMix}>
              <SafeScreenImage
                screenPath="screens/iphone-journal.png"
                alt="Pickup iPhone Journal"
                fallback={<FallbackJournalScreen lightMix={lightMix} />}
              />
            </IPhoneBezel>
          </div>

          {/* Floating Specular iPad Pro */}
          <div
            style={{
              transform: `translateY(${padY}px) scale(${interpolate(padSpring, [0, 1], [0.95, 1])})`,
              opacity: padSpring,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 18,
            }}
          >
            <IPadProBezel width={880} height={610} lightMix={lightMix}>
              <SafeScreenImage
                screenPath="screens/ipad-splitview.png"
                alt="Pickup iPad Split View"
                fallback={<FallbackIPadSplitScreen lightMix={lightMix} />}
              />
            </IPadProBezel>

            {/* Bottom Floating Glass Feature Bar */}
            <div style={{ display: 'flex', gap: 14 }}>
              <LiquidGlassCapsule dotColor={titleColor} lightMix={lightMix}>
                杂志衬线 × 现代无衬线双排版
              </LiquidGlassCapsule>
              <LiquidGlassCapsule dotColor={subtitleColor} lightMix={lightMix}>
                悬浮胶囊底栏 · 滚动自动收敛
              </LiquidGlassCapsule>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
