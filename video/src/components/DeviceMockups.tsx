import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { BRAND_COLORS, FONT_MONO, FONT_SANS, FONT_SERIF, mixHex } from '../theme';
import { RedPenCircle } from './RedPenMark';

interface DeviceBezelProps {
  children: React.ReactNode;
  width: number;
  height: number;
  style?: React.CSSProperties;
  /** 0 = Obsidian Dark screen chrome, 1 = Paper Light screen chrome */
  lightMix?: number;
}

/** Floating specular iPhone bezel in anodized black/silver titanium */
export const IPhoneBezel: React.FC<DeviceBezelProps> = ({
  children,
  width,
  height,
  style,
  lightMix = 0,
}) => {
  const frame = useCurrentFrame();
  const radius = Math.round(width * 0.145);
  const innerRadius = Math.max(24, radius - 10);
  const sweep = interpolate((frame % 240) / 240, [0, 1], [-45, 145]);
  const t = Math.max(0, Math.min(1, lightMix));
  const dropAlpha = interpolate(t, [0, 1], [0.64, 0.24]);
  const homeIndicatorColor =
    t < 0.5
      ? `rgba(244, 243, 237, ${interpolate(t, [0, 0.5], [0.46, 0.32]).toFixed(2)})`
      : `rgba(17, 17, 17, ${interpolate(t, [0.5, 1], [0.22, 0.34]).toFixed(2)})`;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: radius,
        padding: 11,
        background:
          'linear-gradient(145deg, #52524F 0%, #141414 38%, #2E2E2B 74%, #1A1A18 100%)',
        boxShadow: `0 34px 80px rgba(0,0,0,${dropAlpha.toFixed(2)}), 0 0 0 1px rgba(255,255,255,0.24), inset 0 1.5px 1px rgba(255,255,255,0.40), 0 0 48px rgba(255,255,255,0.05)`,
        ...style,
      }}
    >
      {/* Side buttons */}
      <div
        style={{
          position: 'absolute',
          right: -3,
          top: height * 0.27,
          width: 3,
          height: height * 0.12,
          borderRadius: 2,
          background: 'rgba(216,215,208,0.45)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -3,
          top: height * 0.22,
          width: 3,
          height: height * 0.08,
          borderRadius: 2,
          background: 'rgba(216,215,208,0.38)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -3,
          top: height * 0.33,
          width: 3,
          height: height * 0.08,
          borderRadius: 2,
          background: 'rgba(216,215,208,0.38)',
        }}
      />

      {/* Screen viewport */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: innerRadius,
          overflow: 'hidden',
          backgroundColor: mixHex(BRAND_COLORS.obsidian, BRAND_COLORS.paperLight, t),
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.10)',
        }}
      >
        {children}

        {/* Dynamic Island */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            width: Math.round(width * 0.29),
            height: Math.round(width * 0.082),
            borderRadius: 999,
            backgroundColor: '#040404',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.10)',
            zIndex: 10,
          }}
        />

        {/* Specular glass reflection sweep */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `linear-gradient(115deg, transparent ${sweep - 16}%, rgba(255,255,255,0.085) ${sweep}%, transparent ${sweep + 16}%)`,
            zIndex: 12,
          }}
        />

        {/* Home Indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: Math.round(width * 0.34),
            height: 4,
            borderRadius: 999,
            backgroundColor: homeIndicatorColor,
            zIndex: 11,
          }}
        />
      </div>
    </div>
  );
};

/** Floating specular landscape iPad Pro bezel in anodized black/silver titanium */
export const IPadProBezel: React.FC<DeviceBezelProps> = ({
  children,
  width,
  height,
  style,
  lightMix = 0,
}) => {
  const frame = useCurrentFrame();
  const radius = 34;
  const innerRadius = 24;
  const sweep = interpolate(((frame + 80) % 260) / 260, [0, 1], [-45, 145]);
  const t = Math.max(0, Math.min(1, lightMix));
  const dropAlpha = interpolate(t, [0, 1], [0.64, 0.22]);
  const homeIndicatorColor =
    t < 0.5
      ? `rgba(244, 243, 237, ${interpolate(t, [0, 0.5], [0.42, 0.30]).toFixed(2)})`
      : `rgba(17, 17, 17, ${interpolate(t, [0.5, 1], [0.22, 0.32]).toFixed(2)})`;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: radius,
        padding: 14,
        background:
          'linear-gradient(140deg, #545450 0%, #141414 44%, #2B2B29 76%, #181817 100%)',
        boxShadow: `0 36px 90px rgba(0,0,0,${dropAlpha.toFixed(2)}), 0 0 0 1px rgba(255,255,255,0.24), inset 0 1.5px 1px rgba(255,255,255,0.40), 0 0 56px rgba(255,255,255,0.05)`,
        ...style,
      }}
    >
      {/* Top landscape camera dot */}
      <div
        style={{
          position: 'absolute',
          top: 5,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: '#141414',
          boxShadow: 'inset 0 0 2px rgba(255,255,255,0.28)',
          zIndex: 10,
        }}
      />

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: innerRadius,
          overflow: 'hidden',
          backgroundColor: mixHex(BRAND_COLORS.obsidian, BRAND_COLORS.paperLight, t),
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.10)',
        }}
      >
        {children}

        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `linear-gradient(115deg, transparent ${sweep - 16}%, rgba(255,255,255,0.065) ${sweep}%, transparent ${sweep + 16}%)`,
            zIndex: 12,
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: Math.round(width * 0.22),
            height: 4,
            borderRadius: 999,
            backgroundColor: homeIndicatorColor,
            zIndex: 11,
          }}
        />
      </div>
    </div>
  );
};

function getScreenTheme(lightMix: number) {
  const t = Math.max(0, Math.min(1, lightMix));
  const cardAlpha = interpolate(t, [0, 1], [0.055, 0.68]);
  const elevatedAlpha = interpolate(t, [0, 1], [0.09, 0.84]);
  const recessedGray = Math.round(interpolate(t, [0, 1], [255, 17]));
  const recessedAlpha = interpolate(t, [0, 1], [0.05, 0.055]);
  const hairlineGray = Math.round(interpolate(t, [0, 1], [255, 17]));
  const hairlineAlpha = interpolate(t, [0, 1], [0.13, 0.11]);
  const strongAlpha = interpolate(t, [0, 1], [0.28, 0.22]);

  const dockBase = Math.round(interpolate(t, [0, 1], [22, 255]));
  const dockAlpha = interpolate(t, [0, 1], [0.76, 0.78]);
  const dockActiveGray = Math.round(interpolate(t, [0, 1], [255, 17]));
  const dockActiveAlpha = interpolate(t, [0, 1], [0.14, 0.10]);

  return {
    t,
    bg: mixHex(BRAND_COLORS.obsidian, BRAND_COLORS.paperLight, t),
    primaryText: mixHex(BRAND_COLORS.ivory, BRAND_COLORS.ink, t),
    secondaryText: mixHex(BRAND_COLORS.muted, BRAND_COLORS.mutedLight, t),
    tertiaryText: mixHex(BRAND_COLORS.subtle, '#8A8880', t),
    cardBg: `rgba(255, 255, 255, ${cardAlpha.toFixed(3)})`,
    elevatedBg: `rgba(255, 255, 255, ${elevatedAlpha.toFixed(3)})`,
    recessedBg: `rgba(${recessedGray}, ${recessedGray}, ${recessedGray}, ${recessedAlpha.toFixed(3)})`,
    hairline: `rgba(${hairlineGray}, ${hairlineGray}, ${hairlineGray}, ${hairlineAlpha.toFixed(3)})`,
    hairlineStrong: `rgba(${hairlineGray}, ${hairlineGray}, ${hairlineGray}, ${strongAlpha.toFixed(3)})`,
    ctaBg: mixHex(BRAND_COLORS.ivory, BRAND_COLORS.ink, t),
    ctaText: mixHex(BRAND_COLORS.obsidian, BRAND_COLORS.paperLight, t),
    cardShadow:
      t < 0.5
        ? `inset 0 1px 0 rgba(255,255,255,0.12), 0 14px 30px rgba(0,0,0,${interpolate(t, [0, 0.5], [0.34, 0.12]).toFixed(2)})`
        : `inset 0 1px 0 rgba(255,255,255,0.92), 0 12px 26px rgba(17,17,17,${interpolate(t, [0.5, 1], [0.04, 0.065]).toFixed(3)})`,
    dockBg: `rgba(${dockBase}, ${dockBase}, ${dockBase}, ${dockAlpha.toFixed(2)})`,
    dockActiveBg: `rgba(${dockActiveGray}, ${dockActiveGray}, ${dockActiveGray}, ${dockActiveAlpha.toFixed(2)})`,
    dockShadow:
      t < 0.5
        ? 'inset 0 1px 0 rgba(255,255,255,0.22), 0 14px 30px rgba(0,0,0,0.55)'
        : 'inset 0 1px 0 rgba(255,255,255,0.95), 0 12px 26px rgba(17,17,17,0.10)',
  };
}

/** Subtle monochrome optical field inside the device viewport so frosted cards refract light */
const ScreenBackdropWash: React.FC<{ lightMix?: number }> = ({ lightMix = 0 }) => {
  const t = Math.max(0, Math.min(1, lightMix));
  const darkOpacity = 1 - t;
  const lightOpacity = t;

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: -75,
          right: -65,
          width: 240,
          height: 240,
          borderRadius: '50%',
          opacity: 0.14 * darkOpacity,
          background: 'radial-gradient(circle, rgba(244,243,237,0.7) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: -80,
          width: 220,
          height: 220,
          borderRadius: '50%',
          opacity: 0.09 * darkOpacity,
          background: 'radial-gradient(circle, rgba(216,215,208,0.6) 0%, transparent 72%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: -60,
          right: -40,
          width: 250,
          height: 250,
          borderRadius: '50%',
          opacity: 0.85 * lightOpacity,
          background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 180,
          left: -70,
          width: 230,
          height: 230,
          borderRadius: '50%',
          opacity: 0.55 * lightOpacity,
          background: 'radial-gradient(circle, rgba(17,17,17,0.065) 0%, transparent 72%)',
          pointerEvents: 'none',
        }}
      />
    </>
  );
};

const PhoneStatusBar: React.FC<{ color: string }> = ({ color }) => (
  <div
    style={{
      position: 'relative',
      zIndex: 2,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 24px 8px',
      fontFamily: FONT_SANS,
      fontSize: 12,
      fontWeight: 600,
      color,
    }}
  >
    <span>9:41</span>
    <span style={{ letterSpacing: '0.06em', opacity: 0.76 }}>5G · 96%</span>
  </div>
);

const FloatingGlassTabBar: React.FC<{
  activeTab: 'journal' | 'timeline' | 'revisit' | 'ai' | 'data';
  lightMix?: number;
}> = ({ activeTab, lightMix = 0 }) => {
  const s = getScreenTheme(lightMix);
  const tabs: Array<{ id: typeof activeTab; label: string }> = [
    { id: 'journal', label: '日记' },
    { id: 'timeline', label: '时间线' },
    { id: 'revisit', label: '去留' },
    { id: 'ai', label: 'AI' },
    { id: 'data', label: '数据' },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 20,
        left: 16,
        right: 16,
        height: 46,
        borderRadius: 999,
        backgroundColor: s.dockBg,
        border: `1px solid ${s.hairline}`,
        backdropFilter: 'blur(24px) saturate(115%)',
        WebkitBackdropFilter: 'blur(24px) saturate(115%)',
        boxShadow: s.dockShadow,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 8px',
        zIndex: 8,
      }}
    >
      {tabs.map((item) => {
        const active = item.id === activeTab;
        return (
          <div
            key={item.id}
            style={{
              padding: '6px 11px',
              borderRadius: 999,
              backgroundColor: active ? s.dockActiveBg : 'transparent',
              border: active ? `1px solid ${s.hairlineStrong}` : '1px solid transparent',
              fontFamily: FONT_SANS,
              fontSize: 11,
              fontWeight: active ? 600 : 400,
              color: active ? s.primaryText : s.secondaryText,
            }}
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );
};

/** Atmospheric grayscale silver-gelatin sample photo card shared by iPhone & iPad screens */
const SilverGelatinPhotoCard: React.FC<{
  height: number;
  caption: string;
  showLiveBadge?: boolean;
  livePulse?: number;
  borderRadius?: number;
}> = ({ height, caption, showLiveBadge = false, livePulse = 1, borderRadius = 14 }) => (
  <div
    style={{
      height,
      borderRadius,
      background: 'linear-gradient(135deg, #2C2C2A 0%, #141414 100%)',
      border: '1px solid rgba(255,255,255,0.16)',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 260 112"
      preserveAspectRatio="none"
      style={{ position: 'absolute', inset: 0 }}
    >
      {/* Soft misty ridge */}
      <path
        d="M0 84 Q 55 58 118 76 T 260 66 L 260 112 L 0 112 Z"
        fill="rgba(26, 26, 25, 0.72)"
      />
      {/* Deep charcoal foreground */}
      <path
        d="M0 95 Q 92 78 175 90 T 260 84 L 260 112 L 0 112 Z"
        fill="rgba(10, 10, 10, 0.90)"
      />
    </svg>

    {/* Silver-gelatin soft moon glow (always circular across aspect ratios) */}
    <div
      style={{
        position: 'absolute',
        top: Math.round(height * 0.14),
        right: Math.round(height * 0.24),
        width: 42,
        height: 42,
        borderRadius: '50%',
        backgroundColor: 'rgba(244,243,237,0.16)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          backgroundColor: 'rgba(244,243,237,0.80)',
        }}
      />
    </div>

    {showLiveBadge && (
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          padding: '3px 8px',
          borderRadius: 999,
          backgroundColor: 'rgba(12,12,12,0.62)',
          border: '1px solid rgba(255,255,255,0.24)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          fontSize: 9,
          letterSpacing: '0.08em',
          color: BRAND_COLORS.ivory,
          display: 'flex',
          alignItems: 'center',
          gap: 5,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: BRAND_COLORS.ivory,
            opacity: livePulse,
          }}
        />
        LIVE
      </div>
    )}

    <div
      style={{
        position: 'absolute',
        bottom: 9,
        left: 11,
        fontSize: 10,
        color: 'rgba(244,243,237,0.84)',
        letterSpacing: '0.01em',
      }}
    >
      {caption}
    </div>
  </div>
);

/** Screen 1 & 5: iPhone Journal UI supporting Obsidian Dark (#080808) & Paper Light (#F5F4EF) */
export const FallbackJournalScreen: React.FC<{
  lightMode?: boolean;
  lightMix?: number;
}> = ({ lightMode = false, lightMix }) => {
  const frame = useCurrentFrame();
  const mix = lightMix ?? (lightMode ? 1 : 0);
  const s = getScreenTheme(mix);
  const livePulse = 0.68 + 0.32 * Math.sin(frame * 0.14);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: s.bg,
        color: s.primaryText,
        position: 'relative',
        fontFamily: FONT_SANS,
        overflow: 'hidden',
      }}
    >
      <ScreenBackdropWash lightMix={mix} />
      <PhoneStatusBar color={s.primaryText} />

      <div style={{ position: 'relative', zIndex: 2, padding: '12px 18px 0' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 25, fontWeight: 700 }}>
              日记
            </div>
            <div style={{ fontSize: 11, color: s.secondaryText, marginTop: 2 }}>
              把日子，拾起来。
            </div>
          </div>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              backgroundColor: s.cardBg,
              border: `1px solid ${s.hairline}`,
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              boxShadow: s.cardShadow,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              color: s.primaryText,
            }}
          >
            +
          </div>
        </div>

        {/* Liquid Glass Search Bar */}
        <div
          style={{
            height: 34,
            borderRadius: 999,
            backgroundColor: s.cardBg,
            border: `1px solid ${s.hairline}`,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px',
            fontSize: 11,
            color: s.secondaryText,
            marginBottom: 10,
          }}
        >
          搜索记录、歌曲、标签或回看…
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          {['全部', '今天', '有图', '星标'].map((chip, idx) => (
            <div
              key={chip}
              style={{
                padding: '4px 10px',
                borderRadius: 999,
                fontSize: 10,
                backgroundColor: idx === 0 ? s.ctaBg : s.recessedBg,
                border: `1px solid ${idx === 0 ? s.ctaBg : s.hairline}`,
                color: idx === 0 ? s.ctaText : s.secondaryText,
                fontWeight: idx === 0 ? 600 : 400,
              }}
            >
              {chip}
            </div>
          ))}
        </div>

        {/* Featured Journal Card with Silver-Gelatin Photo + Soundtrack */}
        <div
          style={{
            borderRadius: 20,
            backgroundColor: s.cardBg,
            border: `1px solid ${s.hairline}`,
            backdropFilter: 'blur(24px) saturate(115%)',
            WebkitBackdropFilter: 'blur(24px) saturate(115%)',
            padding: 14,
            marginBottom: 12,
            boxShadow: s.cardShadow,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 10,
              color: s.secondaryText,
              marginBottom: 8,
            }}
          >
            <span>今天 · 21:40 · 晚风微凉</span>
            <span style={{ color: s.primaryText, fontWeight: 600 }}>★ 置顶</span>
          </div>

          <div
            style={{
              fontFamily: FONT_SERIF,
              fontSize: 14,
              lineHeight: 1.55,
              color: s.primaryText,
              marginBottom: 10,
            }}
          >
            穿过梧桐树影慢慢走回家，耳机里刚好放到副歌。原来安静的夜晚也会发光。
          </div>

          <div style={{ marginBottom: 10 }}>
            <SilverGelatinPhotoCard
              height={112}
              caption="街角路灯与晚风 · Live Photo 3.0s"
              showLiveBadge
              livePulse={livePulse}
            />
          </div>

          {/* Soundtrack Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 10px',
              borderRadius: 999,
              backgroundColor: s.recessedBg,
              border: `1px solid ${s.hairline}`,
              fontSize: 10,
              color: s.primaryText,
            }}
          >
            <span>♪</span>
            <span>此刻在听 · 落日飞车 - My Jinji</span>
          </div>
        </div>

        {/* Second Entry Card */}
        <div
          style={{
            borderRadius: 18,
            backgroundColor: s.cardBg,
            border: `1px solid ${s.hairline}`,
            backdropFilter: 'blur(24px) saturate(115%)',
            WebkitBackdropFilter: 'blur(24px) saturate(115%)',
            padding: '12px 14px',
            boxShadow: s.cardShadow,
          }}
        >
          <div style={{ fontSize: 10, color: s.secondaryText, marginBottom: 5 }}>
            11 月 14 日 · 08:15 · 晴
          </div>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 13, lineHeight: 1.45, color: s.primaryText }}>
            晨光落在桌面笔记本上，决定今天少刷手机，把灵感都留给自己。
          </div>
        </div>
      </div>

      <FloatingGlassTabBar activeTab="journal" lightMix={mix} />
    </div>
  );
};

/** Screen 6: iPadOS 26 Split-View Editorial Canvas (Obsidian Dark <-> Paper Light) */
export const FallbackIPadSplitScreen: React.FC<{
  lightMode?: boolean;
  lightMix?: number;
}> = ({ lightMode = false, lightMix }) => {
  const mix = lightMix ?? (lightMode ? 1 : 0);
  const s = getScreenTheme(mix);
  const sidebarBg =
    mix < 0.5
      ? `rgba(255, 255, 255, ${interpolate(mix, [0, 0.5], [0.03, 0.14]).toFixed(3)})`
      : `rgba(255, 255, 255, ${interpolate(mix, [0.5, 1], [0.36, 0.56]).toFixed(3)})`;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: s.bg,
        color: s.primaryText,
        display: 'flex',
        fontFamily: FONT_SANS,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <ScreenBackdropWash lightMix={mix} />

      {/* Left Liquid Glass Sidebar */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: 175,
          padding: '22px 14px',
          borderRight: `1px solid ${s.hairline}`,
          backgroundColor: sidebarBg,
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: FONT_SERIF,
              fontSize: 21,
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            Pickup
          </div>
          <div style={{ fontSize: 10, color: s.secondaryText, marginBottom: 18 }}>
            iPadOS 26 · Split View
          </div>
          {[
            { label: '日记 Journal', active: true },
            { label: '时间线 Timeline', active: false },
            { label: '去留 Revisit', active: false },
            { label: 'AI Hub', active: false },
            { label: '数据保险箱', active: false },
          ].map((nav) => (
            <div
              key={nav.label}
              style={{
                padding: '9px 12px',
                borderRadius: 12,
                marginBottom: 6,
                fontSize: 12,
                fontWeight: nav.active ? 600 : 400,
                backgroundColor: nav.active ? s.dockActiveBg : 'transparent',
                border: nav.active ? `1px solid ${s.hairlineStrong}` : '1px solid transparent',
                color: nav.active ? s.primaryText : s.secondaryText,
              }}
            >
              {nav.label}
            </div>
          ))}
        </div>

        <div
          style={{
            padding: '10px 12px',
            borderRadius: 14,
            backgroundColor: s.cardBg,
            border: `1px solid ${s.hairline}`,
            fontSize: 10,
            color: s.secondaryText,
          }}
        >
          <div style={{ color: s.primaryText, fontWeight: 600 }}>
            {mix >= 0.5 ? '纸墨 Paper Light' : '黑曜 Obsidian Dark'}
          </div>
          <div style={{ marginTop: 2 }}>100% 本地加密存储</div>
        </div>
      </div>

      {/* Middle Entry Feed Column */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: 245,
          padding: '22px 16px',
          borderRight: `1px solid ${s.hairline}`,
        }}
      >
        <div style={{ fontSize: 12, color: s.secondaryText, marginBottom: 12 }}>
          十一月 · 28 条回忆
        </div>
        {[
          {
            date: '今天 21:40',
            text: '穿过梧桐树影慢慢走回家，耳机里刚好放到副歌。',
            active: true,
          },
          {
            date: '11 月 14 日',
            text: '晨光落在桌面笔记本上，决定今天少刷手机。',
            active: false,
          },
          {
            date: '11 月 11 日',
            text: '和老朋友在巷口小馆聊了三个小时，热茶暖胃。',
            active: false,
          },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              padding: 12,
              borderRadius: 16,
              marginBottom: 10,
              backgroundColor: item.active ? s.elevatedBg : s.cardBg,
              border: `1px solid ${item.active ? s.hairlineStrong : s.hairline}`,
              boxShadow: item.active ? s.cardShadow : 'none',
            }}
          >
            <div style={{ fontSize: 10, color: s.secondaryText, marginBottom: 4 }}>
              {item.date}
            </div>
            <div
              style={{
                fontFamily: FONT_SERIF,
                fontSize: 12,
                lineHeight: 1.5,
                color: s.primaryText,
              }}
            >
              {item.text}
            </div>
          </div>
        ))}
      </div>

      {/* Right Reading & Reflection Canvas */}
      <div style={{ flex: 1, padding: '24px 26px', position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
          }}
        >
          <span style={{ fontSize: 11, color: s.secondaryText }}>
            2026 年 11 月 17 日 · 周二
          </span>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 999,
              backgroundColor: s.recessedBg,
              border: `1px solid ${s.hairline}`,
              fontSize: 10,
              color: s.primaryText,
            }}
          >
            ♪ 落日飞车 · 散步
          </span>
        </div>

        <div
          style={{
            fontFamily: FONT_SERIF,
            fontSize: 20,
            lineHeight: 1.65,
            color: s.primaryText,
            marginBottom: 16,
          }}
        >
          穿过梧桐树影慢慢走回家，耳机里刚好放到副歌。原来安静的夜晚也会发光。
        </div>

        {/* Media + Sketch Duo */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1.4 }}>
            <SilverGelatinPhotoCard
              height={118}
              caption="实况照片 · 秋夜林荫道"
              borderRadius={16}
            />
          </div>
          <div
            style={{
              flex: 1,
              height: 118,
              borderRadius: 16,
              backgroundColor: s.cardBg,
              border: `1px solid ${s.hairline}`,
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: s.cardShadow,
            }}
          >
            <div style={{ fontSize: 10, color: s.secondaryText }}>手绘小涂鸦</div>
            <svg width="100%" height="58" viewBox="0 0 120 58">
              <path
                d="M10 42 C 26 12, 48 52, 68 24 C 82 6, 98 38, 112 22"
                fill="none"
                stroke={s.primaryText}
                strokeWidth="2.4"
                strokeLinecap="round"
                opacity="0.88"
              />
            </svg>
          </div>
        </div>

        {/* Reflection Reply Card */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 16,
            backgroundColor: s.cardBg,
            border: `1px solid ${s.hairline}`,
            boxShadow: s.cardShadow,
          }}
        >
          <div style={{ fontSize: 10, color: s.primaryText, fontWeight: 600, marginBottom: 4 }}>
            回看与回应
          </div>
          <div style={{ fontSize: 12, color: s.secondaryText }}>
            “给当时的自己留一句话：那晚的风很轻，别忘了这份平静。”
          </div>
        </div>
      </div>
    </div>
  );
};

/** Screen 2: iPhone Timeline with Red-Pen Circled Days + On This Day */
export const FallbackTimelineScreen: React.FC<{ localFrame?: number }> = ({
  localFrame = 90,
}) => {
  const s = getScreenTheme(0);
  const circledDays = new Set([3, 7, 11, 14, 17, 21, 24]);
  const circleProgress = interpolate(localFrame, [15, 75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: s.bg,
        color: s.primaryText,
        fontFamily: FONT_SANS,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <ScreenBackdropWash lightMix={0} />
      <PhoneStatusBar color={s.primaryText} />

      <div style={{ position: 'relative', zIndex: 2, padding: '12px 18px 0' }}>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 24, fontWeight: 700 }}>
          时间线
        </div>
        <div style={{ fontSize: 11, color: s.secondaryText, marginTop: 2, marginBottom: 14 }}>
          红笔圈起有记录的日子 · 连续记录 18 天
        </div>

        {/* Frosted Calendar Card */}
        <div
          style={{
            borderRadius: 20,
            backgroundColor: s.cardBg,
            border: `1px solid ${s.hairline}`,
            backdropFilter: 'blur(24px) saturate(115%)',
            WebkitBackdropFilter: 'blur(24px) saturate(115%)',
            padding: 14,
            marginBottom: 14,
            boxShadow: s.cardShadow,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            <span>2026 年 11 月</span>
            <span style={{ color: s.secondaryText }}>7 天有迹</span>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 6,
              textAlign: 'center',
              fontSize: 11,
            }}
          >
            {['日', '一', '二', '三', '四', '五', '六'].map((d) => (
              <div key={d} style={{ color: s.secondaryText, fontSize: 10, paddingBottom: 4 }}>
                {d}
              </div>
            ))}
            {Array.from({ length: 28 }, (_, idx) => {
              const day = idx + 1;
              const marked = circledDays.has(day);
              return (
                <div
                  key={day}
                  style={{
                    position: 'relative',
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: marked ? s.primaryText : s.secondaryText,
                    fontWeight: marked ? 600 : 400,
                  }}
                >
                  {day}
                  {marked && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: -3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <RedPenCircle
                        progress={circleProgress}
                        size={30}
                        strokeWidth={5.5}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* On This Day Echo */}
        <div
          style={{
            borderRadius: 18,
            backgroundColor: s.elevatedBg,
            border: `1px solid ${s.hairlineStrong}`,
            backdropFilter: 'blur(24px) saturate(115%)',
            WebkitBackdropFilter: 'blur(24px) saturate(115%)',
            padding: 14,
            boxShadow: s.cardShadow,
          }}
        >
          <div style={{ fontSize: 10, color: BRAND_COLORS.silver, fontWeight: 600, marginBottom: 4 }}>
            记忆回响 · 往昔同日（1 年前）
          </div>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 13, lineHeight: 1.5, color: s.primaryText }}>
            去年今日在海边吹风，写下“希望明年还能保有这份松弛感”。
          </div>
        </div>
      </div>

      <FloatingGlassTabBar activeTab="timeline" />
    </div>
  );
};

/** Screen 3: iPhone Revisit Screen */
export const FallbackRevisitScreen: React.FC = () => {
  const s = getScreenTheme(0);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: s.bg,
        color: s.primaryText,
        fontFamily: FONT_SANS,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <ScreenBackdropWash lightMix={0} />
      <PhoneStatusBar color={s.primaryText} />

      <div style={{ position: 'relative', zIndex: 2, padding: '12px 18px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 23, fontWeight: 700 }}>
            去留 · 偶遇旧日
          </div>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 999,
              backgroundColor: s.recessedBg,
              border: `1px solid ${s.hairlineStrong}`,
              fontSize: 10,
              color: s.primaryText,
            }}
          >
            今日偶遇
          </span>
        </div>

        <div
          style={{
            marginTop: 14,
            borderRadius: 22,
            backgroundColor: s.cardBg,
            border: `1px solid ${s.hairline}`,
            backdropFilter: 'blur(24px) saturate(115%)',
            WebkitBackdropFilter: 'blur(24px) saturate(115%)',
            padding: 16,
            boxShadow: s.cardShadow,
          }}
        >
          <div style={{ fontSize: 11, color: s.secondaryText, marginBottom: 8 }}>
            2025 年 11 月 17 日 · 365 天前
          </div>
          <div
            style={{
              fontFamily: FONT_SERIF,
              fontSize: 15,
              lineHeight: 1.65,
              marginBottom: 12,
              color: s.primaryText,
            }}
          >
            深夜加班后买到刚出炉的菠萝包，热气把镜片熏雾了一秒，突然觉得生活很温柔。
          </div>
          <div
            style={{
              padding: '6px 10px',
              borderRadius: 999,
              backgroundColor: s.recessedBg,
              border: `1px solid ${s.hairline}`,
              display: 'inline-block',
              fontSize: 10,
              color: s.primaryText,
              marginBottom: 14,
            }}
          >
            ♪ 陈绮贞 - 鱼
          </div>

          <div
            style={{
              borderTop: `1px solid ${s.hairline}`,
              paddingTop: 12,
            }}
          >
            <div style={{ fontSize: 10, color: BRAND_COLORS.silver, fontWeight: 600, marginBottom: 6 }}>
              回看与回应 · 刚刚写入
            </div>
            <div
              style={{
                padding: '10px 12px',
                borderRadius: 14,
                backgroundColor: s.elevatedBg,
                border: `1px solid ${s.hairline}`,
                fontSize: 12,
                lineHeight: 1.5,
                color: s.primaryText,
              }}
            >
              一年后的我依然会被热乎乎的面包治愈。谢谢当时认真记录的自己。
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 14,
            height: 36,
            borderRadius: 999,
            backgroundColor: s.ctaBg,
            color: s.ctaText,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          ↻ 换一条记忆
        </div>
      </div>

      <FloatingGlassTabBar activeTab="revisit" />
    </div>
  );
};

/** Screen 4: iPhone Data Vault Screen with Monochrome Tonal Storage & AES-256-GCM Exports */
export const FallbackDataVaultScreen: React.FC = () => {
  const s = getScreenTheme(0);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: s.bg,
        color: s.primaryText,
        fontFamily: FONT_SANS,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <ScreenBackdropWash lightMix={0} />
      <PhoneStatusBar color={s.primaryText} />

      <div style={{ position: 'relative', zIndex: 2, padding: '12px 18px 0' }}>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 23, fontWeight: 700 }}>
          数据保险箱
        </div>
        <div style={{ fontSize: 11, color: s.secondaryText, marginTop: 2, marginBottom: 14 }}>
          留在设备里，也可以随时完整带走
        </div>

        {/* Monochrome Tonal Local Storage Card */}
        <div
          style={{
            borderRadius: 18,
            backgroundColor: s.cardBg,
            border: `1px solid ${s.hairline}`,
            backdropFilter: 'blur(24px) saturate(115%)',
            WebkitBackdropFilter: 'blur(24px) saturate(115%)',
            padding: '12px 14px',
            marginBottom: 10,
            boxShadow: s.cardShadow,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 11, color: s.secondaryText }}>本机存储总计</span>
            <span style={{ fontFamily: FONT_MONO, fontSize: 13, fontWeight: 700, color: BRAND_COLORS.ivory }}>
              142.8 MB
            </span>
          </div>

          {/* Tonal Segmented Bar */}
          <div
            style={{
              height: 7,
              borderRadius: 999,
              backgroundColor: 'rgba(255,255,255,0.08)',
              display: 'flex',
              overflow: 'hidden',
              gap: 2,
              marginBottom: 9,
            }}
          >
            <div style={{ width: '74%', backgroundColor: BRAND_COLORS.ivory, borderRadius: 999 }} />
            <div style={{ width: '15%', backgroundColor: BRAND_COLORS.muted, borderRadius: 999 }} />
            <div style={{ width: '11%', backgroundColor: BRAND_COLORS.subtle, borderRadius: 999 }} />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 9.5,
              color: s.secondaryText,
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: BRAND_COLORS.ivory }} />
              媒体 112M
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: BRAND_COLORS.muted }} />
              正文 18.4M
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: BRAND_COLORS.subtle }} />
              快照 12.4M
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: BRAND_COLORS.redPen }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: BRAND_COLORS.redPen }} />
              云端 0K
            </span>
          </div>
        </div>

        {/* Auto Backup Card */}
        <div
          style={{
            borderRadius: 18,
            backgroundColor: s.cardBg,
            border: `1px solid ${s.hairline}`,
            backdropFilter: 'blur(24px) saturate(115%)',
            WebkitBackdropFilter: 'blur(24px) saturate(115%)',
            padding: 13,
            marginBottom: 10,
            boxShadow: s.cardShadow,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 7,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600 }}>自动定时本地备份</span>
            <span
              style={{
                padding: '3px 9px',
                borderRadius: 999,
                backgroundColor: s.ctaBg,
                color: s.ctaText,
                fontSize: 10,
                fontWeight: 600,
              }}
            >
              已开启
            </span>
          </div>
          <div style={{ fontSize: 10.5, color: s.secondaryText, lineHeight: 1.5 }}>
            每日 22:30 · 保留最近 7 份快照 · 文件 App / iCloud
          </div>
        </div>

        {/* Export Formats */}
        {[
          {
            title: '导出标准备份 (.zip)',
            sub: '100% 兼容 Android / Web v2',
            badge: 'Portable',
          },
          {
            title: '导出加密保险箱 (.pickupvault)',
            sub: 'AES-256-GCM 口令加密完整备份',
            badge: 'AES-256',
          },
          {
            title: '导出 Markdown 文集 (.md.zip)',
            sub: '纯文本排版与独立媒体附件',
            badge: 'Readable',
          },
        ].map((row) => (
          <div
            key={row.title}
            style={{
              borderRadius: 16,
              backgroundColor: s.cardBg,
              border: `1px solid ${s.hairline}`,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              padding: '10px 12px',
              marginBottom: 8,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 600 }}>{row.title}</div>
              <div style={{ fontSize: 10, color: s.secondaryText, marginTop: 2 }}>{row.sub}</div>
            </div>
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 9,
                color: s.primaryText,
                padding: '3px 7px',
                borderRadius: 8,
                backgroundColor: s.recessedBg,
                border: `1px solid ${s.hairline}`,
              }}
            >
              {row.badge}
            </div>
          </div>
        ))}
      </div>

      <FloatingGlassTabBar activeTab="data" />
    </div>
  );
};

/** Chapter 4 Visual: Explicit Text-Only Privacy Disclosure Preview for AI Hub */
export const FallbackAiHubPhone: React.FC = () => {
  const s = getScreenTheme(0);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: s.bg,
        color: s.primaryText,
        fontFamily: FONT_SANS,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <ScreenBackdropWash lightMix={0} />
      <PhoneStatusBar color={s.primaryText} />

      <div style={{ position: 'relative', zIndex: 2, padding: '12px 18px 0' }}>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 23, fontWeight: 700 }}>
          AI Hub
        </div>
        <div style={{ fontSize: 10, color: s.secondaryText, marginTop: 2, marginBottom: 12 }}>
          仅在确认披露预览后发送选定文字
        </div>

        {/* Provider Pills */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
          {['DeepSeek', 'Gemini', 'GLM', 'OpenAI'].map((p, idx) => (
            <span
              key={p}
              style={{
                padding: '4px 9px',
                borderRadius: 999,
                fontSize: 10,
                backgroundColor: idx === 0 ? s.dockActiveBg : s.cardBg,
                border: `1px solid ${idx === 0 ? s.hairlineStrong : s.hairline}`,
                color: idx === 0 ? s.primaryText : s.secondaryText,
              }}
            >
              {p}
            </span>
          ))}
        </div>

        {/* Explicit Disclosure Modal Card */}
        <div
          style={{
            borderRadius: 20,
            backgroundColor: s.elevatedBg,
            border: `1px solid ${s.hairlineStrong}`,
            backdropFilter: 'blur(24px) saturate(115%)',
            WebkitBackdropFilter: 'blur(24px) saturate(115%)',
            padding: 14,
            boxShadow: s.cardShadow,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
            发送前隐私披露确认
          </div>

          <div
            style={{
              padding: '8px 10px',
              borderRadius: 12,
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.24)',
              fontSize: 10,
              color: BRAND_COLORS.ivory,
              marginBottom: 10,
              fontWeight: 600,
            }}
          >
            ✓ 媒体字节：0 bytes · 绝不发送照片与视频
          </div>

          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 10,
              color: s.secondaryText,
              backgroundColor: '#0C0C0C',
              border: `1px solid ${s.hairline}`,
              borderRadius: 10,
              padding: 10,
              lineHeight: 1.5,
              marginBottom: 12,
            }}
          >
            范围：智能匹配 12 条文字
            <br />
            总字符：1,840 chars
            <br />
            字段：日期 · 正文 · 标签 · 歌名
          </div>

          <div
            style={{
              height: 34,
              borderRadius: 999,
              backgroundColor: s.ctaBg,
              color: s.ctaText,
              fontSize: 11,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            确认发送文字上下文
          </div>
        </div>
      </div>

      <FloatingGlassTabBar activeTab="ai" />
    </div>
  );
};
