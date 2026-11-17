import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { Scene1PocketWatch } from './scenes/Scene1PocketWatch';
import { Scene2LiquidGlass } from './scenes/Scene2LiquidGlass';
import { Scene3Chapters } from './scenes/Scene3Chapters';
import { Scene4DataVault } from './scenes/Scene4DataVault';
import { Scene5Outro } from './scenes/Scene5Outro';
import { BRAND_COLORS, SCENES } from './theme';

export const PickupIntroVideo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND_COLORS.obsidian,
        overflow: 'hidden',
      }}
    >
      <Audio src={staticFile('soundtrack.wav')} />

      {/* Scene 1 (0–300 frames / 0–5s): Pocket Watch + Wordmark + "把日子，拾起来。" */}
      <Sequence from={SCENES.intro.from} durationInFrames={SCENES.intro.duration}>
        <Scene1PocketWatch />
      </Sequence>

      {/* Scene 2 (300–780 frames / 5–13s): iOS 26 Liquid Glass iPhone & iPad + Theme Morph */}
      <Sequence from={SCENES.glass.from} durationInFrames={SCENES.glass.duration}>
        <Scene2LiquidGlass />
      </Sequence>

      {/* Scene 3 (780–1380 frames / 13–23s): Four Everyday Chapters Bento Spotlight */}
      <Sequence from={SCENES.chapters.from} durationInFrames={SCENES.chapters.duration}>
        <Scene3Chapters />
      </Sequence>

      {/* Scene 4 (1380–1800 frames / 23–30s): Data Vault & Zero-Fee Sideload Freedom */}
      <Sequence from={SCENES.vault.from} durationInFrames={SCENES.vault.duration}>
        <Scene4DataVault />
      </Sequence>

      {/* Scene 5 (1800–2040 frames / 30–34s): Outro Lockup */}
      <Sequence from={SCENES.outro.from} durationInFrames={SCENES.outro.duration}>
        <Scene5Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
