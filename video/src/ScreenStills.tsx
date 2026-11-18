import React from 'react';
import {
  FallbackDataVaultScreen,
  FallbackIPadSplitScreen,
  FallbackJournalScreen,
  FallbackRevisitScreen,
  FallbackTimelineScreen,
} from './components/DeviceMockups';

// Base viewport sizes matching DeviceMockups.tsx internal typography/padding
const PHONE_BASE_W = 310;
const PHONE_BASE_H = 674;
const IPAD_BASE_W = 852;
const IPAD_BASE_H = 638;

const ScaledPhone: React.FC<{
  children: React.ReactNode;
  background?: string;
}> = ({ children, background = '#080808' }) => {
  const scale = 588 / PHONE_BASE_W; // -> 588 x 1278
  return (
    <div style={{ width: 588, height: 1278, overflow: 'hidden', background }}>
      <div
        style={{
          width: PHONE_BASE_W,
          height: PHONE_BASE_H,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </div>
  );
};

const ScaledIpad: React.FC<{
  children: React.ReactNode;
  background?: string;
}> = ({ children, background = '#080808' }) => {
  const scale = 1366 / IPAD_BASE_W; // -> 1366 x 1024
  return (
    <div style={{ width: 1366, height: 1024, overflow: 'hidden', background }}>
      <div
        style={{
          width: IPAD_BASE_W,
          height: IPAD_BASE_H,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const StillIphoneJournal: React.FC = () => (
  <ScaledPhone background="#080808">
    <FallbackJournalScreen lightMode={false} />
  </ScaledPhone>
);

export const StillIphoneTimeline: React.FC = () => (
  <ScaledPhone background="#080808">
    <FallbackTimelineScreen localFrame={90} />
  </ScaledPhone>
);

export const StillIphoneRevisit: React.FC = () => (
  <ScaledPhone background="#080808">
    <FallbackRevisitScreen />
  </ScaledPhone>
);

export const StillIphoneDataVault: React.FC = () => (
  <ScaledPhone background="#080808">
    <FallbackDataVaultScreen />
  </ScaledPhone>
);

export const StillIphoneMono: React.FC = () => (
  <ScaledPhone background="#F5F4EF">
    <FallbackJournalScreen lightMode={true} />
  </ScaledPhone>
);

export const StillIpadSplitView: React.FC = () => (
  <ScaledIpad background="#080808">
    <FallbackIPadSplitScreen lightMode={false} />
  </ScaledIpad>
);
