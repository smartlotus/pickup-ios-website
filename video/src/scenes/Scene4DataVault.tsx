import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { FallbackDataVaultScreen, IPhoneBezel } from '../components/DeviceMockups';
import {
  AuroraBackdrop,
  LiquidGlassCapsule,
  LiquidGlassCard,
} from '../components/LiquidGlass';
import { SafeScreenImage } from '../components/SafeScreenImage';
import { BRAND_COLORS, FONT_MONO, FONT_SANS, FONT_SERIF } from '../theme';

export const Scene4DataVault: React.FC = () => {
  const frame = useCurrentFrame(); // 0..420 (global 1380..1800)
  const { fps } = useVideoConfig();

  const enterOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const exitOpacity = interpolate(frame, [400, 420], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ringSpring = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: { damping: 18, stiffness: 65 },
  });

  const shieldPulse = 0.72 + 0.28 * Math.sin(frame * 0.1);

  // Storage donut ring circumference (r = 96 -> C ≈ 603.19)
  const r = 96;
  const circ = 2 * Math.PI * r;
  const seg1Len = circ * 0.56 * ringSpring; // Media 112.0 MB
  const seg2Len = circ * 0.24 * ringSpring; // Journal Text 18.4 MB
  const seg3Len = circ * 0.16 * ringSpring; // Snapshots 12.4 MB
  const totalMb = (142.8 * ringSpring).toFixed(1);

  return (
    <AbsoluteFill style={{ opacity: enterOpacity * exitOpacity }}>
      <AuroraBackdrop lightMix={0} />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          padding: '48px 80px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div>
            <LiquidGlassCapsule dotColor={BRAND_COLORS.ivory} lightMix={0}>
              数据保险箱 · Data Vault &amp; Sideload Freedom
            </LiquidGlassCapsule>
            <div
              style={{
                fontFamily: FONT_SERIF,
                fontSize: 48,
                fontWeight: 700,
                color: BRAND_COLORS.ivory,
                marginTop: 14,
              }}
            >
              留在设备里，也可以随时完整带走
            </div>
          </div>

          <LiquidGlassCapsule dotColor={BRAND_COLORS.silver} lightMix={0}>
            无需 $99 开发者费用 · 本地永久留存
          </LiquidGlassCapsule>
        </div>

        {/* 3-Column Bento Architecture */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 32,
            marginTop: 22,
          }}
        >
          {/* Left: Animated Monochrome Tonal Storage Ring Card */}
          <LiquidGlassCard
            lightMix={0}
            radius={30}
            style={{ flex: 1, height: 676, padding: '32px 28px' }}
          >
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 13,
                    letterSpacing: '0.14em',
                    color: BRAND_COLORS.muted,
                  }}
                >
                  LOCAL STORAGE OVERVIEW
                </div>
                <div
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: 28,
                    fontWeight: 700,
                    color: BRAND_COLORS.ivory,
                    marginTop: 6,
                  }}
                >
                  本机存储概览
                </div>
              </div>

              {/* Animated SVG Monochrome Tonal Donut Ring */}
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 250,
                }}
              >
                <svg width="240" height="240" viewBox="0 0 240 240">
                  <circle
                    cx="120"
                    cy="120"
                    r={r}
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="22"
                  />
                  {/* Segment 1: Media (#F4F3ED) */}
                  <circle
                    cx="120"
                    cy="120"
                    r={r}
                    fill="none"
                    stroke={BRAND_COLORS.ivory}
                    strokeWidth="22"
                    strokeLinecap="round"
                    strokeDasharray={`${seg1Len} ${circ}`}
                    transform="rotate(-90 120 120)"
                  />
                  {/* Segment 2: Journal Text (#A2A19A) */}
                  <circle
                    cx="120"
                    cy="120"
                    r={r}
                    fill="none"
                    stroke={BRAND_COLORS.muted}
                    strokeWidth="22"
                    strokeLinecap="round"
                    strokeDasharray={`${seg2Len} ${circ}`}
                    strokeDashoffset={-seg1Len - 12}
                    transform="rotate(-90 120 120)"
                  />
                  {/* Segment 3: Auto-Backup Snapshots (#6E6D68) */}
                  <circle
                    cx="120"
                    cy="120"
                    r={r}
                    fill="none"
                    stroke={BRAND_COLORS.subtle}
                    strokeWidth="22"
                    strokeLinecap="round"
                    strokeDasharray={`${seg3Len} ${circ}`}
                    strokeDashoffset={-(seg1Len + seg2Len) - 24}
                    transform="rotate(-90 120 120)"
                  />
                </svg>

                <div
                  style={{
                    position: 'absolute',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 32,
                      fontWeight: 700,
                      color: BRAND_COLORS.ivory,
                    }}
                  >
                    {totalMb} MB
                  </div>
                  <div
                    style={{
                      fontFamily: FONT_SANS,
                      fontSize: 13,
                      color: BRAND_COLORS.muted,
                      marginTop: 4,
                    }}
                  >
                    100% 存放于本机
                  </div>
                </div>
              </div>

              {/* Monochrome Tonal Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: '实况照片与视频媒体', val: '112.0 MB', color: BRAND_COLORS.ivory },
                  { label: '日记正文与回看索引', val: '18.4 MB', color: BRAND_COLORS.muted },
                  { label: '本地安全备份快照', val: '12.4 MB', color: BRAND_COLORS.subtle },
                  { label: '强制云端同步上传', val: '0 KB', color: BRAND_COLORS.redPen },
                ].map((row) => (
                  <div
                    key={row.label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      borderRadius: 14,
                      backgroundColor: 'rgba(255,255,255,0.045)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      fontFamily: FONT_SANS,
                      fontSize: 15,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span
                        style={{
                          width: 9,
                          height: 9,
                          borderRadius: '50%',
                          backgroundColor: row.color,
                        }}
                      />
                      <span style={{ color: BRAND_COLORS.ivory }}>{row.label}</span>
                    </div>
                    <span style={{ fontFamily: FONT_MONO, color: row.color, fontWeight: 600 }}>
                      {row.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </LiquidGlassCard>

          {/* Center: iPhone Scheduled Auto-Backup Preview */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              flexShrink: 0,
            }}
          >
            <IPhoneBezel width={316} height={646}>
              <SafeScreenImage
                screenPath="screens/iphone-datavault.png"
                alt="Pickup Data Vault"
                fallback={<FallbackDataVaultScreen />}
              />
            </IPhoneBezel>
          </div>

          {/* Right Stack: Portability Bridge + Zero-Fee Sideload Freedom */}
          <div
            style={{
              flex: 1.15,
              height: 676,
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
            }}
          >
            {/* Card 1: Android v2 <-> iOS Portable ZIP & .pickupvault Shield */}
            <LiquidGlassCard
              lightMix={0}
              radius={28}
              style={{ flex: 1.1, padding: '28px 30px' }}
            >
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 13,
                        color: BRAND_COLORS.muted,
                        letterSpacing: '0.12em',
                      }}
                    >
                      PORTABLE &amp; ENCRYPTED
                    </div>
                    <div
                      style={{
                        fontFamily: FONT_SERIF,
                        fontSize: 28,
                        fontWeight: 700,
                        color: BRAND_COLORS.ivory,
                        marginTop: 4,
                      }}
                    >
                      Android v2 ↔ iOS 无缝迁移
                    </div>
                  </div>

                  {/* Frosted Monochrome Encryption Shield SVG */}
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 18,
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.24)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 0 ${20 * shieldPulse}px rgba(244,243,237,0.16)`,
                    }}
                  >
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2L4 5.5V11.5C4 16.8 7.4 21.6 12 23C16.6 21.6 20 16.8 20 11.5V5.5L12 2Z"
                        stroke={BRAND_COLORS.ivory}
                        strokeWidth="1.8"
                        fill="rgba(255,255,255,0.10)"
                      />
                      <path
                        d="M9 12L11 14L15.5 9.5"
                        stroke={BRAND_COLORS.ivory}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    {
                      ext: '.zip',
                      title: '标准便携备份包',
                      desc: '100% 兼容 Pickup Android / Web v2，含文字与原始媒体',
                      accent: BRAND_COLORS.ivory,
                    },
                    {
                      ext: '.pickupvault',
                      title: 'AES-256-GCM 加密保险箱',
                      desc: '口令派生高强度加密，防篡改校验适合网盘/NAS 归档',
                      accent: BRAND_COLORS.silver,
                    },
                    {
                      ext: '.md.zip',
                      title: 'Markdown 文集归档',
                      desc: '百年可读的纯文本排版与独立附件文件夹',
                      accent: BRAND_COLORS.muted,
                    },
                  ].map((fmt) => (
                    <div
                      key={fmt.ext}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '11px 14px',
                        borderRadius: 16,
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.11)',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: FONT_MONO,
                          fontSize: 13,
                          fontWeight: 700,
                          color: fmt.accent,
                          padding: '5px 10px',
                          borderRadius: 10,
                          backgroundColor: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          minWidth: 112,
                          textAlign: 'center',
                        }}
                      >
                        {fmt.ext}
                      </span>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: BRAND_COLORS.ivory }}>
                          {fmt.title}
                        </div>
                        <div style={{ fontSize: 13, color: BRAND_COLORS.muted, marginTop: 2 }}>
                          {fmt.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </LiquidGlassCard>

            {/* Card 2: Zero-Fee Sideload Freedom */}
            <LiquidGlassCard
              lightMix={0}
              radius={28}
              style={{ flex: 0.85, padding: '26px 30px' }}
            >
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span
                    style={{
                      padding: '5px 12px',
                      borderRadius: 999,
                      backgroundColor: 'rgba(255,255,255,0.09)',
                      border: '1px solid rgba(255,255,255,0.24)',
                      fontFamily: FONT_MONO,
                      fontSize: 13,
                      color: BRAND_COLORS.ivory,
                      fontWeight: 600,
                    }}
                  >
                    ZERO $99 FEE · SIDELOAD READY
                  </span>
                </div>

                <div>
                  <div
                    style={{
                      fontFamily: FONT_SERIF,
                      fontSize: 30,
                      fontWeight: 700,
                      color: BRAND_COLORS.ivory,
                    }}
                  >
                    无需 $99 开发者费用 · 本地永久留存
                  </div>
                  <div
                    style={{
                      fontFamily: FONT_SANS,
                      fontSize: 16,
                      lineHeight: 1.65,
                      color: BRAND_COLORS.muted,
                      marginTop: 8,
                    }}
                  >
                    提供免费开源自签包，支持 AltStore / SideStore 免签自装；内置自动定时本地备份与文件 App / NAS 外部快照，7 天续签或重装零丢失。
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {['AltStore / SideStore 自签', '7 天续签防丢提醒', '自动本地快照'].map(
                    (chip) => (
                      <span
                        key={chip}
                        style={{
                          padding: '6px 13px',
                          borderRadius: 999,
                          backgroundColor: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.16)',
                          fontFamily: FONT_SANS,
                          fontSize: 13,
                          color: BRAND_COLORS.ivory,
                        }}
                      >
                        {chip}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </LiquidGlassCard>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
