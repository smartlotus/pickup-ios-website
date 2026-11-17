import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { BRAND_COLORS, FONT_MONO, FONT_SANS, FONT_SERIF, mixHex } from '../theme';
import { RedPenCircle } from './RedPenMark';

interface DeviceBezelProps {
  children: React.ReactNode;
  width: number;
  height: number;
  style?: React.CSSProperties;
  accentColor?: string;
}

/** Floating specular iPhone bezel (iOS 26 style) */
export const IPhoneBezel: React.FC<DeviceBezelProps> = ({
  children,
  width,
  height,
  style,
  accentColor = BRAND_COLORS.purpleLight,
}) => {
  const frame = useCurrentFrame();
  const radius = Math.round(width * 0.145);
  const innerRadius = Math.max(24, radius - 10);
  const sweep = interpolate((frame % 240) / 240, [0, 1], [-45, 145]);

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: radius,
        padding: 11,
        background:
          'linear-gradient(145deg, rgba(72,70,82,0.95) 0%, rgba(22,22,26,0.98) 42%, rgba(44,42,52,0.92) 100%)',
        boxShadow: `0 34px 80px rgba(0,0,0,0.68), 0 0 0 1px rgba(255,255,255,0.22), inset 0 1.5px 1px rgba(255,255,255,0.34), 0 0 56px ${accentColor}22`,
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
          background: 'rgba(255,255,255,0.28)',
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
          background: 'rgba(255,255,255,0.24)',
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
          background: 'rgba(255,255,255,0.24)',
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
          backgroundColor: '#09090D',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
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
            backgroundColor: '#020203',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.08)',
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
            backgroundColor: 'rgba(244,243,237,0.45)',
            zIndex: 11,
          }}
        />
      </div>
    </div>
  );
};

/** Floating specular landscape iPad Pro bezel */
export const IPadProBezel: React.FC<DeviceBezelProps> = ({
  children,
  width,
  height,
  style,
  accentColor = BRAND_COLORS.purpleLight,
}) => {
  const frame = useCurrentFrame();
  const radius = 34;
  const innerRadius = 24;
  const sweep = interpolate(((frame + 80) % 260) / 260, [0, 1], [-45, 145]);

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: radius,
        padding: 14,
        background:
          'linear-gradient(140deg, rgba(76,74,88,0.94) 0%, rgba(20,20,24,0.98) 46%, rgba(42,40,50,0.92) 100%)',
        boxShadow: `0 36px 90px rgba(0,0,0,0.68), 0 0 0 1px rgba(255,255,255,0.22), inset 0 1.5px 1px rgba(255,255,255,0.34), 0 0 64px ${accentColor}22`,
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
          backgroundColor: '#1E2438',
          boxShadow: 'inset 0 0 2px rgba(167,139,250,0.6)',
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
          backgroundColor: '#0A0A0F',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
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
            backgroundColor: 'rgba(244,243,237,0.42)',
            zIndex: 11,
          }}
        />
      </div>
    </div>
  );
};

function getFallbackTheme(monoMix: number) {
  return {
    bg: mixHex('#0D0C12', '#060606', monoMix),
    card: mixHex('#1B1924', '#111111', monoMix),
    elevated: mixHex('#242031', '#191919', monoMix),
    accent: mixHex('#A78BFA', '#F4F3ED', monoMix),
    accentDeep: mixHex('#7C4DFF', '#2A2A2A', monoMix),
    muted: mixHex('#B3AFC0', '#A2A19A', monoMix),
    hairline:
      monoMix > 0.5 ? 'rgba(255,255,255,0.14)' : 'rgba(167,139,250,0.22)',
  };
}

const PhoneStatusBar: React.FC = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 24px 8px',
      fontFamily: FONT_SANS,
      fontSize: 12,
      fontWeight: 600,
      color: BRAND_COLORS.ivory,
    }}
  >
    <span>9:41</span>
    <span style={{ letterSpacing: '0.06em', opacity: 0.78 }}>5G · 96%</span>
  </div>
);

const FloatingGlassTabBar: React.FC<{
  activeTab: 'journal' | 'timeline' | 'revisit' | 'ai' | 'data';
  monoMix?: number;
}> = ({ activeTab, monoMix = 0 }) => {
  const t = getFallbackTheme(monoMix);
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
        background: 'rgba(22, 20, 30, 0.78)',
        border: `1px solid ${t.hairline}`,
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.22), 0 12px 28px rgba(0,0,0,0.55)',
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
              backgroundColor: active ? `${t.accent}2B` : 'transparent',
              border: active ? `1px solid ${t.accent}55` : '1px solid transparent',
              fontFamily: FONT_SANS,
              fontSize: 11,
              fontWeight: active ? 600 : 400,
              color: active ? BRAND_COLORS.ivory : t.muted,
            }}
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );
};

/** Fallback 1: iPhone Journal UI (Live Photo + Soundtrack + Liquid Glass Search) */
export const FallbackJournalScreen: React.FC<{ monoMix?: number }> = ({
  monoMix = 0,
}) => {
  const frame = useCurrentFrame();
  const t = getFallbackTheme(monoMix);
  const livePulse = 0.72 + 0.28 * Math.sin(frame * 0.14);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: t.bg,
        color: BRAND_COLORS.ivory,
        position: 'relative',
        fontFamily: FONT_SANS,
        overflow: 'hidden',
      }}
    >
      {/* Top ambient purple/mono glow inside app */}
      <div
        style={{
          position: 'absolute',
          top: -70,
          right: -60,
          width: 240,
          height: 240,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${t.accentDeep}44 0%, transparent 70%)`,
        }}
      />

      <PhoneStatusBar />

      <div style={{ padding: '12px 18px 0' }}>
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
            <div style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>
              把日子，拾起来。
            </div>
          </div>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${t.accent}33, rgba(255,255,255,0.08))`,
              border: `1px solid ${t.hairline}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              color: BRAND_COLORS.ivory,
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
            background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${t.hairline}`,
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px',
            fontSize: 11,
            color: t.muted,
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
                backgroundColor: idx === 0 ? t.accent : 'rgba(255,255,255,0.05)',
                color: idx === 0 ? '#0A0A0C' : t.muted,
                fontWeight: idx === 0 ? 600 : 400,
              }}
            >
              {chip}
            </div>
          ))}
        </div>

        {/* Featured Journal Card with Live Photo + Soundtrack */}
        <div
          style={{
            borderRadius: 20,
            backgroundColor: t.card,
            border: `1px solid ${t.hairline}`,
            padding: 14,
            marginBottom: 12,
            boxShadow: '0 14px 30px rgba(0,0,0,0.35)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 10,
              color: t.muted,
              marginBottom: 8,
            }}
          >
            <span>今天 · 21:40 · 晚风微凉</span>
            <span style={{ color: BRAND_COLORS.gold }}>★ 置顶</span>
          </div>

          <div
            style={{
              fontFamily: FONT_SERIF,
              fontSize: 14,
              lineHeight: 1.55,
              color: BRAND_COLORS.ivory,
              marginBottom: 10,
            }}
          >
            穿过梧桐树影慢慢走回家，耳机里刚好放到副歌。原来安静的夜晚也会发光。
          </div>

          {/* Live Photo Preview */}
          <div
            style={{
              height: 112,
              borderRadius: 14,
              background: `linear-gradient(150deg, ${t.accentDeep}66 0%, #262038 48%, rgba(244,104,98,0.34) 100%)`,
              border: '1px solid rgba(255,255,255,0.16)',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: 10,
            }}
          >
            {/* Stylized twilight evening scene */}
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 260 112"
              preserveAspectRatio="none"
              style={{ position: 'absolute', inset: 0, opacity: 0.72 }}
            >
              <circle cx="204" cy="34" r="22" fill="rgba(197,168,106,0.35)" />
              <circle cx="204" cy="34" r="9" fill="rgba(244,243,237,0.65)" />
              <path
                d="M0 84 Q 55 58 118 76 T 260 66 L 260 112 L 0 112 Z"
                fill="rgba(10, 9, 15, 0.58)"
              />
              <path
                d="M0 95 Q 92 78 175 90 T 260 84 L 260 112 L 0 112 Z"
                fill="rgba(8, 8, 12, 0.85)"
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                top: 8,
                left: 8,
                padding: '3px 8px',
                borderRadius: 999,
                background: 'rgba(10,10,14,0.65)',
                border: '1px solid rgba(255,255,255,0.22)',
                fontSize: 9,
                letterSpacing: '0.08em',
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
                  backgroundColor: BRAND_COLORS.gold,
                  opacity: livePulse,
                }}
              />
              LIVE
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: 8,
                left: 10,
                fontSize: 10,
                color: 'rgba(244,243,237,0.78)',
              }}
            >
              街角路灯与晚风 · Live Photo 3.0s
            </div>
          </div>

          {/* Soundtrack Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 10px',
              borderRadius: 999,
              backgroundColor: t.elevated,
              border: `1px solid ${t.hairline}`,
              fontSize: 10,
              color: t.accent,
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
            backgroundColor: t.card,
            border: `1px solid ${t.hairline}`,
            padding: '12px 14px',
          }}
        >
          <div style={{ fontSize: 10, color: t.muted, marginBottom: 5 }}>
            11 月 14 日 · 08:15 · 晴
          </div>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 13, lineHeight: 1.45 }}>
            晨光落在桌面笔记本上，决定今天少刷手机，把灵感都留给自己。
          </div>
        </div>
      </div>

      <FloatingGlassTabBar activeTab="journal" monoMix={monoMix} />
    </div>
  );
};

/** Fallback 2: iPadOS 26 Split-View Editorial Canvas */
export const FallbackIPadSplitScreen: React.FC<{ monoMix?: number }> = ({
  monoMix = 0,
}) => {
  const t = getFallbackTheme(monoMix);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: t.bg,
        color: BRAND_COLORS.ivory,
        display: 'flex',
        fontFamily: FONT_SANS,
        position: 'relative',
      }}
    >
      {/* Left Liquid Glass Sidebar */}
      <div
        style={{
          width: 175,
          padding: '22px 14px',
          borderRight: `1px solid ${t.hairline}`,
          background:
            monoMix > 0.5
              ? 'rgba(18,18,18,0.88)'
              : 'linear-gradient(180deg, rgba(32,26,52,0.72), rgba(16,14,24,0.92))',
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
          <div style={{ fontSize: 10, color: t.muted, marginBottom: 18 }}>
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
                backgroundColor: nav.active ? `${t.accent}26` : 'transparent',
                border: nav.active ? `1px solid ${t.accent}55` : '1px solid transparent',
                color: nav.active ? BRAND_COLORS.ivory : t.muted,
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
            backgroundColor: t.card,
            border: `1px solid ${t.hairline}`,
            fontSize: 10,
            color: t.muted,
          }}
        >
          <div style={{ color: BRAND_COLORS.ivory, fontWeight: 600 }}>
            {monoMix > 0.5 ? '纯黑白 Monochrome' : '紫黑 Purple Dark'}
          </div>
          <div style={{ marginTop: 2 }}>100% 本地加密存储</div>
        </div>
      </div>

      {/* Middle Entry Feed Column */}
      <div
        style={{
          width: 245,
          padding: '22px 16px',
          borderRight: `1px solid ${t.hairline}`,
        }}
      >
        <div style={{ fontSize: 12, color: t.muted, marginBottom: 12 }}>
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
              backgroundColor: item.active ? t.elevated : t.card,
              border: `1px solid ${item.active ? t.accent : t.hairline}`,
            }}
          >
            <div style={{ fontSize: 10, color: t.muted, marginBottom: 4 }}>
              {item.date}
            </div>
            <div
              style={{
                fontFamily: FONT_SERIF,
                fontSize: 12,
                lineHeight: 1.5,
                color: BRAND_COLORS.ivory,
              }}
            >
              {item.text}
            </div>
          </div>
        ))}
      </div>

      {/* Right Reading & Reflection Canvas */}
      <div style={{ flex: 1, padding: '24px 26px', position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
          }}
        >
          <span style={{ fontSize: 11, color: t.muted }}>
            2026 年 11 月 17 日 · 周二
          </span>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 999,
              backgroundColor: `${t.accent}22`,
              border: `1px solid ${t.accent}44`,
              fontSize: 10,
              color: t.accent,
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
            color: BRAND_COLORS.ivory,
            marginBottom: 16,
          }}
        >
          穿过梧桐树影慢慢走回家，耳机里刚好放到副歌。原来安静的夜晚也会发光。
        </div>

        {/* Media + Sketch Duo */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <div
            style={{
              flex: 1.4,
              height: 118,
              borderRadius: 16,
              background: `linear-gradient(145deg, ${t.accentDeep}66, #252038 52%, rgba(197,168,106,0.28))`,
              border: '1px solid rgba(255,255,255,0.16)',
              padding: 12,
              display: 'flex',
              alignItems: 'flex-end',
              fontSize: 11,
              color: 'rgba(244,243,237,0.88)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 220 118"
              preserveAspectRatio="none"
              style={{ position: 'absolute', inset: 0, opacity: 0.72 }}
            >
              <circle cx="172" cy="36" r="20" fill="rgba(197,168,106,0.34)" />
              <circle cx="172" cy="36" r="8" fill="rgba(244,243,237,0.62)" />
              <path
                d="M0 86 Q 48 64 102 80 T 220 72 L 220 118 L 0 118 Z"
                fill="rgba(10, 9, 15, 0.56)"
              />
              <path
                d="M0 98 Q 84 82 150 94 T 220 88 L 220 118 L 0 118 Z"
                fill="rgba(8, 8, 12, 0.85)"
              />
            </svg>
            <span style={{ position: 'relative', zIndex: 2 }}>
              实况照片 · 秋夜林荫道
            </span>
          </div>
          <div
            style={{
              flex: 1,
              height: 118,
              borderRadius: 16,
              backgroundColor: t.card,
              border: `1px solid ${t.hairline}`,
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ fontSize: 10, color: t.muted }}>手绘小涂鸦</div>
            <svg width="100%" height="58" viewBox="0 0 120 58">
              <path
                d="M10 42 C 26 12, 48 52, 68 24 C 82 6, 98 38, 112 22"
                fill="none"
                stroke={BRAND_COLORS.redPen}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Reflection Reply Card */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 16,
            backgroundColor: t.card,
            border: `1px solid ${t.hairline}`,
          }}
        >
          <div style={{ fontSize: 10, color: BRAND_COLORS.gold, marginBottom: 4 }}>
            回看与回应
          </div>
          <div style={{ fontSize: 12, color: t.muted }}>
            “给当时的自己留一句话：那晚的风很轻，别忘了这份平静。”
          </div>
        </div>
      </div>
    </div>
  );
};

/** Fallback 3: iPhone Timeline with Red-Pen Circled Days + On This Day */
export const FallbackTimelineScreen: React.FC<{ localFrame?: number }> = ({
  localFrame = 90,
}) => {
  const t = getFallbackTheme(0);
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
        backgroundColor: t.bg,
        color: BRAND_COLORS.ivory,
        fontFamily: FONT_SANS,
        position: 'relative',
      }}
    >
      <PhoneStatusBar />
      <div style={{ padding: '12px 18px 0' }}>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 24, fontWeight: 700 }}>
          时间线
        </div>
        <div style={{ fontSize: 11, color: t.muted, marginTop: 2, marginBottom: 14 }}>
          红笔圈起有记录的日子 · 连续记录 18 天
        </div>

        {/* Calendar Card */}
        <div
          style={{
            borderRadius: 20,
            backgroundColor: t.card,
            border: `1px solid ${t.hairline}`,
            padding: 14,
            marginBottom: 14,
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
            <span style={{ color: BRAND_COLORS.redPen }}>● 7 天有迹</span>
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
              <div key={d} style={{ color: t.muted, fontSize: 10, paddingBottom: 4 }}>
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
                    color: marked ? BRAND_COLORS.ivory : t.muted,
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
            backgroundColor: t.elevated,
            border: `1px solid ${BRAND_COLORS.gold}55`,
            padding: 14,
          }}
        >
          <div style={{ fontSize: 10, color: BRAND_COLORS.gold, marginBottom: 4 }}>
            记忆回响 · 往昔同日（1 年前）
          </div>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 13, lineHeight: 1.5 }}>
            去年今日在海边吹风，写下“希望明年还能保有这份松弛感”。
          </div>
        </div>
      </div>

      <FloatingGlassTabBar activeTab="timeline" />
    </div>
  );
};

/** Fallback 4: iPhone Revisit Screen */
export const FallbackRevisitScreen: React.FC = () => {
  const t = getFallbackTheme(0);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: t.bg,
        color: BRAND_COLORS.ivory,
        fontFamily: FONT_SANS,
        position: 'relative',
      }}
    >
      <PhoneStatusBar />
      <div style={{ padding: '12px 18px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 23, fontWeight: 700 }}>
            去留 · 偶遇旧日
          </div>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 999,
              backgroundColor: `${BRAND_COLORS.gold}22`,
              border: `1px solid ${BRAND_COLORS.gold}55`,
              fontSize: 10,
              color: BRAND_COLORS.gold,
            }}
          >
            今日偶遇
          </span>
        </div>

        <div
          style={{
            marginTop: 14,
            borderRadius: 22,
            backgroundColor: t.card,
            border: `1px solid ${t.hairline}`,
            padding: 16,
            boxShadow: '0 20px 44px rgba(0,0,0,0.45)',
          }}
        >
          <div style={{ fontSize: 11, color: t.muted, marginBottom: 8 }}>
            2025 年 11 月 17 日 · 365 天前
          </div>
          <div
            style={{
              fontFamily: FONT_SERIF,
              fontSize: 15,
              lineHeight: 1.65,
              marginBottom: 12,
            }}
          >
            深夜加班后买到刚出炉的菠萝包，热气把镜片熏雾了一秒，突然觉得生活很温柔。
          </div>
          <div
            style={{
              padding: '6px 10px',
              borderRadius: 999,
              backgroundColor: t.elevated,
              display: 'inline-block',
              fontSize: 10,
              color: t.accent,
              marginBottom: 14,
            }}
          >
            ♪ 陈绮贞 - 鱼
          </div>

          <div
            style={{
              borderTop: `1px solid ${t.hairline}`,
              paddingTop: 12,
            }}
          >
            <div style={{ fontSize: 10, color: BRAND_COLORS.redPen, marginBottom: 6 }}>
              回看与回应 · 刚刚写入
            </div>
            <div
              style={{
                padding: '10px 12px',
                borderRadius: 14,
                backgroundColor: t.elevated,
                fontSize: 12,
                lineHeight: 1.5,
              }}
            >
              一年后的我依然会被热乎乎的面包治愈。谢谢当时认真记录的自己。
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 12,
            height: 36,
            borderRadius: 999,
            backgroundColor: `${t.accent}22`,
            border: `1px solid ${t.accent}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          ↻ 换一条记忆
        </div>
      </div>

      <FloatingGlassTabBar activeTab="revisit" />
    </div>
  );
};

/** Fallback 5: iPhone Data Vault Screen */
export const FallbackDataVaultScreen: React.FC = () => {
  const t = getFallbackTheme(0);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: t.bg,
        color: BRAND_COLORS.ivory,
        fontFamily: FONT_SANS,
        position: 'relative',
      }}
    >
      <PhoneStatusBar />
      <div style={{ padding: '12px 18px 0' }}>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 23, fontWeight: 700 }}>
          数据保险箱
        </div>
        <div style={{ fontSize: 11, color: t.muted, marginTop: 2, marginBottom: 14 }}>
          留在设备里，也可以随时完整带走
        </div>

        {/* Auto Backup Card */}
        <div
          style={{
            borderRadius: 18,
            backgroundColor: t.card,
            border: `1px solid ${t.hairline}`,
            padding: 14,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600 }}>自动定时本地备份</span>
            <span
              style={{
                padding: '3px 9px',
                borderRadius: 999,
                backgroundColor: 'rgba(88, 214, 141, 0.2)',
                color: BRAND_COLORS.emeraldSafe,
                fontSize: 10,
                fontWeight: 600,
              }}
            >
              已开启
            </span>
          </div>
          <div style={{ fontSize: 11, color: t.muted, lineHeight: 1.55 }}>
            每日 22:30 · 保留最近 7 份快照 · 外部目录：文件 App / iCloud
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
              backgroundColor: t.card,
              border: `1px solid ${t.hairline}`,
              padding: '10px 12px',
              marginBottom: 8,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 600 }}>{row.title}</div>
              <div style={{ fontSize: 10, color: t.muted, marginTop: 2 }}>{row.sub}</div>
            </div>
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 9,
                color: t.accent,
                padding: '3px 7px',
                borderRadius: 8,
                backgroundColor: `${t.accent}1A`,
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
  const t = getFallbackTheme(0);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: t.bg,
        color: BRAND_COLORS.ivory,
        fontFamily: FONT_SANS,
        position: 'relative',
      }}
    >
      <PhoneStatusBar />
      <div style={{ padding: '12px 18px 0' }}>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 23, fontWeight: 700 }}>
          AI Hub
        </div>
        <div style={{ fontSize: 10, color: t.muted, marginTop: 2, marginBottom: 12 }}>
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
                backgroundColor: idx === 0 ? `${t.accent}2E` : t.card,
                border: `1px solid ${idx === 0 ? t.accent : t.hairline}`,
                color: idx === 0 ? BRAND_COLORS.ivory : t.muted,
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
            backgroundColor: t.elevated,
            border: `1px solid ${t.accent}66`,
            padding: 14,
            boxShadow: '0 18px 40px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
            发送前隐私披露确认
          </div>

          <div
            style={{
              padding: '8px 10px',
              borderRadius: 12,
              backgroundColor: 'rgba(88,214,141,0.14)',
              border: '1px solid rgba(88,214,141,0.42)',
              fontSize: 10,
              color: BRAND_COLORS.emeraldSafe,
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
              color: t.muted,
              backgroundColor: t.bg,
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
              background: `linear-gradient(135deg, ${BRAND_COLORS.purplePrimary}, ${BRAND_COLORS.purpleLight})`,
              color: '#0D0B14',
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
