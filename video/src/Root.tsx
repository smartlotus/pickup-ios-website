import React from 'react';
import { Composition, Still } from 'remotion';
import { PickupIntroVideo } from './PickupIntroVideo';
import {
  StillIpadSplitView,
  StillIphoneDataVault,
  StillIphoneJournal,
  StillIphoneMono,
  StillIphoneRevisit,
  StillIphoneTimeline,
} from './ScreenStills';
import {
  VIDEO_DURATION_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from './theme';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PickupIntro"
        component={PickupIntroVideo}
        durationInFrames={VIDEO_DURATION_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Still id="ScreenIphoneJournal" component={StillIphoneJournal} width={588} height={1278} />
      <Still id="ScreenIphoneTimeline" component={StillIphoneTimeline} width={588} height={1278} />
      <Still id="ScreenIphoneRevisit" component={StillIphoneRevisit} width={588} height={1278} />
      <Still id="ScreenIphoneDataVault" component={StillIphoneDataVault} width={588} height={1278} />
      <Still id="ScreenIphoneMono" component={StillIphoneMono} width={588} height={1278} />
      <Still id="ScreenIpadSplitView" component={StillIpadSplitView} width={1366} height={1024} />
    </>
  );
};
