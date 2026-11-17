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

  // Animated theme morph: Purple Dark (0..185) -> smooth morph (185..310) -> Monochrome (310..480)
  const monoMix = interpolate(frame, [185, 305], [0, 1], {
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

  const accentColor = mixHex('#A78BFA', '#F4F3ED', monoMix);
  const subtitleColor = mixHex('#B3AFC0', '#A2A19A', monoMix);

  return (
    <AbsoluteFill style={{ opacity: enterOpacity * exitOpacity }}>
      <AuroraBackdrop monoMix={monoMix} goldGlow={0.12} />

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
        {/* Top Editorial Header + Live Theme Morph Switcher */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <LiquidGlassCapsule dotColor={accentColor} monoMix={monoMix}>
              iOS 26 Liquid Glass · iPhone &amp; iPad
            </LiquidGlassCapsule>
            <div
              style={{
                fontFamily: FONT_SERIF,
                fontSize: 52,
                fontWeight: 700,
                color: BRAND_COLORS.ivory,
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
              紫黑极光与纯黑白极简双主题实时切换 · 原生 SVG 折射边界与高光扫掠
            </div>
          </div>

          {/* Animated Theme Morph Pill */}
          <LiquidGlassCard
            monoMix={monoMix}
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
                  left: `${monoMix * 50}%`,
                  width: '50%',
                  borderRadius: 999,
                  background:
                    monoMix > 0.5
                      ? 'linear-gradient(135deg, rgba(244,243,237,0.22), rgba(255,255,255,0.08))'
                      : 'linear-gradient(135deg, rgba(124,77,255,0.48), rgba(167,139,250,0.26))',
                  border: `1px solid ${accentColor}77`,
                  boxShadow: `0 4px 18px ${accentColor}33`,
                }}
              />
              <div
                style={{
                  flex: 1,
                  textAlign: 'center',
                  fontFamily: FONT_SANS,
                  fontSize: 15,
                  fontWeight: monoMix < 0.5 ? 600 : 400,
                  color: monoMix < 0.5 ? BRAND_COLORS.ivory : subtitleColor,
                  zIndex: 2,
                }}
              >
                紫黑 Purple Dark
              </div>
              <div
                style={{
                  flex: 1,
                  textAlign: 'center',
                  fontFamily: FONT_SANS,
                  fontSize: 15,
                  fontWeight: monoMix >= 0.5 ? 600 : 400,
                  color: monoMix >= 0.5 ? BRAND_COLORS.ivory : subtitleColor,
                  zIndex: 2,
                }}
              >
                纯黑白 Mono
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
            <IPhoneBezel width={332} height={678} accentColor={accentColor}>
              <SafeScreenImage
                screenPath="screens/iphone-journal.png"
                alt="Pickup iPhone Journal"
                fallback={<FallbackJournalScreen monoMix={monoMix} />}
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
            <IPadProBezel width={880} height={610} accentColor={accentColor}>
              <SafeScreenImage
                screenPath="screens/ipad-splitview.png"
                alt="Pickup iPad Split View"
                fallback={<FallbackIPadSplitScreen monoMix={monoMix} />}
              />
            </IPadProBezel>

            {/* Bottom Floating Glass Feature Bar */}
            <div style={{ display: 'flex', gap: 14 }}>
              <LiquidGlassCapsule dotColor={BRAND_COLORS.redPen} monoMix={monoMix}>
                杂志衬线 × 现代无衬线双排版
              </LiquidGlassCapsule>
              <LiquidGlassCapsule dotColor={BRAND_COLORS.gold} monoMix={monoMix}>
                悬浮胶囊底栏 · 滚动自动收敛
              </LiquidGlassCapsule>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
