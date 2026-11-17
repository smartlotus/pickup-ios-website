import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  FallbackAiHubPhone,
  FallbackJournalScreen,
  FallbackRevisitScreen,
  FallbackTimelineScreen,
  IPhoneBezel,
} from '../components/DeviceMockups';
import {
  AuroraBackdrop,
  LiquidGlassCapsule,
  LiquidGlassCard,
} from '../components/LiquidGlass';
import { RedPenCircle } from '../components/RedPenMark';
import { SafeScreenImage } from '../components/SafeScreenImage';
import { BRAND_COLORS, FONT_MONO, FONT_SANS, FONT_SERIF } from '../theme';

interface ChapterSpec {
  id: string;
  indexLabel: string;
  title: string;
  subtitle: string;
  accent: string;
  tags: string[];
  detailBody: string;
}

const CHAPTERS: ChapterSpec[] = [
  {
    id: 'journal',
    indexLabel: '01',
    title: '日记 Capture',
    subtitle: '实况照片 Live Photo + 此刻配乐 Soundtrack',
    accent: BRAND_COLORS.purpleLight,
    tags: ['Live Photo 3.0s', '此刻在听', '手绘涂鸦', '本机草稿自动存'],
    detailBody:
      '写下当下的念头、添一张会动的实况照片，并把耳机里正在播放的那首歌一并封存进日记卡片。',
  },
  {
    id: 'timeline',
    indexLabel: '02',
    title: '时间线 Timeline',
    subtitle: '红笔圈起有迹之日 · 往昔同日 On This Day',
    accent: BRAND_COLORS.redPen,
    tags: ['手绘红笔圈点', '连续记录计数', '往昔同日回响', '情绪天气检索'],
    detailBody:
      '翻开月历，每一个留过文字的日子都被温润的朱红笔迹轻轻圈起；往年今日的旧片段自动浮现。',
  },
  {
    id: 'revisit',
    indexLabel: '03',
    title: '去留 Revisit',
    subtitle: '每日偶遇旧日 · 给当时的自己留一句话',
    accent: BRAND_COLORS.goldSoft,
    tags: ['今日偶遇卡片', '跨时空回复', '随机重温旧梦', '置顶星标收藏'],
    detailBody:
      '每天在“去留”里随机偶遇一条旧日瞬间，写下一条新的回看回应，与过去的自己轻轻对话。',
  },
  {
    id: 'ai',
    indexLabel: '04',
    title: 'AI Hub',
    subtitle: '仅确认披露预览后发送文字 · 媒体字节零外传',
    accent: BRAND_COLORS.emeraldSafe,
    tags: ['显式披露预览', '0 bytes 媒体发送', 'DeepSeek / Gemini', '本地密钥直连'],
    detailBody:
      '每次调用前必经透明披露确认面板：清晰展示发送的文字条数与字符数，严格承诺绝不上传任何照片与视频。',
  },
];

export const Scene3Chapters: React.FC = () => {
  const frame = useCurrentFrame(); // 0..600 (global 780..1380)
  const { fps } = useVideoConfig();

  const enterOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const exitOpacity = interpolate(frame, [580, 600], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const chapterDuration = 150;
  const activeIdx = Math.min(3, Math.floor(frame / chapterDuration));
  const localFrame = frame - activeIdx * chapterDuration;
  const chapter = CHAPTERS[activeIdx];

  const cardSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 16, stiffness: 95 },
  });

  const phoneSlideX = interpolate(cardSpring, [0, 1], [-24, 0]);
  const contentOpacity = interpolate(localFrame, [0, 16, 136, 150], [0, 1, 1, 0.25], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const renderSpotlightPhone = () => {
    if (activeIdx === 0) {
      return (
        <SafeScreenImage
          screenPath="screens/iphone-journal.png"
          alt="Pickup Journal"
          fallback={<FallbackJournalScreen monoMix={0} />}
        />
      );
    }
    if (activeIdx === 1) {
      return (
        <SafeScreenImage
          screenPath="screens/iphone-timeline.png"
          alt="Pickup Timeline"
          fallback={<FallbackTimelineScreen localFrame={localFrame} />}
        />
      );
    }
    if (activeIdx === 2) {
      return (
        <SafeScreenImage
          screenPath="screens/iphone-revisit.png"
          alt="Pickup Revisit"
          fallback={<FallbackRevisitScreen />}
        />
      );
    }
    return <FallbackAiHubPhone />;
  };

  return (
    <AbsoluteFill style={{ opacity: enterOpacity * exitOpacity }}>
      <AuroraBackdrop monoMix={0.12} goldGlow={activeIdx === 2 ? 0.45 : 0.1} />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          padding: '48px 80px',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        {/* Top Row: Section Header + 4-Chapter Progress Pills */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <LiquidGlassCapsule dotColor={chapter.accent}>
              Four Everyday Chapters · 四重日常篇章
            </LiquidGlassCapsule>
            <div
              style={{
                fontFamily: FONT_SERIF,
                fontSize: 46,
                fontWeight: 700,
                color: BRAND_COLORS.ivory,
                marginTop: 14,
              }}
            >
              把生活的每一面，安放得当
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {CHAPTERS.map((ch, idx) => {
              const active = idx === activeIdx;
              return (
                <div
                  key={ch.id}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 999,
                    backgroundColor: active
                      ? `${ch.accent}2A`
                      : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${active ? ch.accent : 'rgba(255,255,255,0.12)'}`,
                    fontFamily: FONT_SANS,
                    fontSize: 15,
                    fontWeight: active ? 600 : 400,
                    color: active ? BRAND_COLORS.ivory : BRAND_COLORS.muted,
                  }}
                >
                  {ch.indexLabel} {ch.id === 'ai' ? 'AI Hub' : ch.title.split(' ')[0]}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Bento Spotlight Grid */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            gap: 32,
            minHeight: 0,
          }}
        >
          {/* Left Main Spotlight Card */}
          <LiquidGlassCard
            highlightColor={chapter.accent}
            radius={32}
            style={{
              flex: 1.62,
              padding: '38px 44px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 44,
                height: '100%',
                opacity: contentOpacity,
              }}
            >
              {/* Active iPhone Preview */}
              <div
                style={{
                  transform: `translateX(${phoneSlideX}px) scale(${interpolate(cardSpring, [0, 1], [0.95, 1])})`,
                  flexShrink: 0,
                }}
              >
                <IPhoneBezel width={316} height={646} accentColor={chapter.accent}>
                  {renderSpotlightPhone()}
                </IPhoneBezel>
              </div>

              {/* Active Chapter Editorial Details + Visual Highlight */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: 22,
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 15,
                    letterSpacing: '0.18em',
                    color: chapter.accent,
                  }}
                >
                  CHAPTER {chapter.indexLabel}
                </div>

                <div
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: 52,
                    fontWeight: 700,
                    color: BRAND_COLORS.ivory,
                    lineHeight: 1.15,
                  }}
                >
                  {chapter.title}
                </div>

                <div
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 21,
                    fontWeight: 500,
                    color: chapter.accent,
                  }}
                >
                  {chapter.subtitle}
                </div>

                <div
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 19,
                    lineHeight: 1.7,
                    color: BRAND_COLORS.mutedPurple,
                  }}
                >
                  {chapter.detailBody}
                </div>

                {/* Chapter-specific dynamic widget preview */}
                <div
                  style={{
                    padding: '18px 22px',
                    borderRadius: 20,
                    backgroundColor: 'rgba(10, 9, 15, 0.56)',
                    border: `1px solid ${chapter.accent}44`,
                  }}
                >
                  {activeIdx === 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: 13, color: BRAND_COLORS.muted }}>
                          实时音画封装
                        </div>
                        <div style={{ fontSize: 17, color: BRAND_COLORS.ivory, marginTop: 4, fontWeight: 600 }}>
                          ♪ 落日飞车 - My Jinji · LIVE 实况
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 28 }}>
                        {[14, 24, 18, 28, 16, 22].map((h, i) => (
                          <div
                            key={i}
                            style={{
                              width: 4,
                              height:
                                10 + Math.abs(Math.sin(localFrame * 0.18 + i)) * (h - 8),
                              borderRadius: 2,
                              backgroundColor: BRAND_COLORS.purpleLight,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {activeIdx === 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                      <div style={{ position: 'relative', width: 54, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontFamily: FONT_SERIF, fontSize: 22, fontWeight: 700, color: BRAND_COLORS.ivory }}>
                          17
                        </span>
                        <RedPenCircle
                          progress={interpolate(localFrame, [10, 65], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
                          size={54}
                          strokeWidth={4.5}
                          style={{ position: 'absolute', inset: 0 }}
                        />
                      </div>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: BRAND_COLORS.ivory }}>
                          连续记录 18 天 · 记忆回响已触发
                        </div>
                        <div style={{ fontSize: 13, color: BRAND_COLORS.muted, marginTop: 3 }}>
                          去年今日：海边吹风写下的备忘再次亮起
                        </div>
                      </div>
                    </div>
                  )}

                  {activeIdx === 2 && (
                    <div>
                      <div style={{ fontSize: 12, color: BRAND_COLORS.goldSoft, marginBottom: 4 }}>
                        来自 365 天后的回应
                      </div>
                      <div style={{ fontFamily: FONT_SERIF, fontSize: 17, color: BRAND_COLORS.ivory }}>
                        “一年后的我依然会被热乎乎的面包治愈，谢谢当时认真记录的自己。”
                      </div>
                    </div>
                  )}

                  {activeIdx === 3 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: BRAND_COLORS.emeraldSafe }}>
                          ✓ 隐私披露预览已就绪 · Text-Only
                        </div>
                        <div style={{ fontFamily: FONT_MONO, fontSize: 13, color: BRAND_COLORS.muted, marginTop: 5 }}>
                          12 条文字 (1,840 chars) · 媒体字节：0 bytes
                        </div>
                      </div>
                      <div
                        style={{
                          padding: '8px 14px',
                          borderRadius: 999,
                          backgroundColor: `${BRAND_COLORS.emeraldSafe}22`,
                          border: `1px solid ${BRAND_COLORS.emeraldSafe}66`,
                          fontSize: 13,
                          color: BRAND_COLORS.emeraldSafe,
                          fontWeight: 600,
                        }}
                      >
                        零图传保障
                      </div>
                    </div>
                  )}
                </div>

                {/* Feature Tag Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {chapter.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: '7px 14px',
                        borderRadius: 999,
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        fontFamily: FONT_SANS,
                        fontSize: 14,
                        color: BRAND_COLORS.ivory,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </LiquidGlassCard>

          {/* Right Bento Stack (4 Chapter Tiles) */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
          >
            {CHAPTERS.map((item, idx) => {
              const isActive = idx === activeIdx;
              const progressPct = isActive
                ? Math.min(100, (localFrame / chapterDuration) * 100)
                : idx < activeIdx
                  ? 100
                  : 0;

              return (
                <LiquidGlassCard
                  key={item.id}
                  radius={24}
                  highlightColor={isActive ? item.accent : undefined}
                  refractiveGlow={isActive}
                  style={{
                    flex: isActive ? 1.25 : 0.92,
                    padding: '22px 26px',
                    opacity: isActive ? 1 : 0.62,
                    transform: `scale(${isActive ? 1 : 0.985})`,
                  }}
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
                      <span
                        style={{
                          fontFamily: FONT_MONO,
                          fontSize: 13,
                          color: isActive ? item.accent : BRAND_COLORS.muted,
                          letterSpacing: '0.14em',
                        }}
                      >
                        CHAPTER {item.indexLabel}
                      </span>
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: isActive ? item.accent : 'rgba(255,255,255,0.18)',
                          boxShadow: isActive ? `0 0 12px ${item.accent}` : 'none',
                        }}
                      />
                    </div>

                    <div>
                      <div
                        style={{
                          fontFamily: FONT_SERIF,
                          fontSize: isActive ? 28 : 24,
                          fontWeight: 700,
                          color: BRAND_COLORS.ivory,
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontFamily: FONT_SANS,
                          fontSize: 15,
                          color: isActive ? BRAND_COLORS.mutedPurple : BRAND_COLORS.muted,
                          marginTop: 6,
                        }}
                      >
                        {item.subtitle}
                      </div>
                    </div>

                    {/* Progress hairline */}
                    <div
                      style={{
                        height: 3,
                        borderRadius: 999,
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${progressPct}%`,
                          height: '100%',
                          backgroundColor: item.accent,
                          borderRadius: 999,
                        }}
                      />
                    </div>
                  </div>
                </LiquidGlassCard>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
