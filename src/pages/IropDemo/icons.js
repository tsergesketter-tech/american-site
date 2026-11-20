import React from 'react';

// SF Symbols–style glyphs used by the iOS simulator.

export const SignalIcon = ({ color = '#fff' }) => (
  <svg width="19" height="12" viewBox="0 0 19 12" aria-hidden="true">
    <rect x="0" y="7.5" width="3.2" height="4.5" rx="0.9" fill={color} />
    <rect x="5" y="5" width="3.2" height="7" rx="0.9" fill={color} />
    <rect x="10" y="2.5" width="3.2" height="9.5" rx="0.9" fill={color} opacity="0.35" />
    <rect x="15" y="0" width="3.2" height="12" rx="0.9" fill={color} opacity="0.35" />
  </svg>
);

export const WifiIcon = ({ color = '#fff' }) => (
  <svg width="17" height="12" viewBox="0 0 17 12" aria-hidden="true">
    <path
      fill={color}
      d="M8.5 2.3c2.4 0 4.6.9 6.3 2.5.1.1.3.1.4 0l1.2-1.2c.1-.1.1-.3 0-.4A11.2 11.2 0 0 0 8.5 0C5.6 0 2.8 1.1.6 3.2c-.1.1-.1.3 0 .4l1.2 1.2c.1.1.3.1.4 0A9.06 9.06 0 0 1 8.5 2.3Zm0 3.7c1.4 0 2.6.5 3.7 1.4.1.1.3.1.4 0l1.2-1.2c.1-.1.1-.3 0-.4a7.6 7.6 0 0 0-10.6 0c-.1.1-.1.3 0 .4l1.2 1.2c.1.1.3.1.4 0 1.1-.9 2.3-1.4 3.7-1.4Zm2.3 2.9c.1-.1.1-.3 0-.4a3.4 3.4 0 0 0-4.6 0c-.1.1-.1.3 0 .4l2.1 2.1c.1.1.3.1.4 0l2.1-2.1Z"
    />
  </svg>
);

export const BatteryIcon = ({ level = 83 }) => (
  <svg width="28" height="13" viewBox="0 0 28 13" aria-hidden="true">
    <defs>
      <mask id="battery-text-mask">
        <rect width="28" height="13" fill="#fff" />
        <text
          x="12.2"
          y="10"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fontFamily="-apple-system, 'SF Pro Text', system-ui, sans-serif"
          fill="#000"
        >
          {level}
        </text>
      </mask>
    </defs>
    <rect x="0" y="0" width="24.5" height="13" rx="4" fill="#fff" mask="url(#battery-text-mask)" />
    <path d="M26 4.3v4.4c.9-.3 1.5-1.2 1.5-2.2s-.6-1.9-1.5-2.2Z" fill="#fff" opacity="0.4" />
  </svg>
);

export const BellSlashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
    <path
      fill="#fff"
      d="M10 19.2c1.2 0 2.1-.8 2.3-1.9H7.7c.2 1.1 1.1 1.9 2.3 1.9Zm6.7-4.6c-.9-.9-1.5-1.7-1.5-4.8 0-.8-.1-1.5-.3-2.2L5.6 16.4h10.6c.7 0 1-.8.5-1.3v-.5ZM4.8 9.8c0 3.1-.6 3.9-1.5 4.8l-.2.2 9.7-9.7a5.1 5.1 0 0 0-2.1-1.2V3c0-.7-.6-1.3-1.3-1.3h-.8c-.7 0-1.3.6-1.3 1.3v.9A5.4 5.4 0 0 0 4.8 9.8Z"
    />
    <path d="M2.5 17.5 17.5 2.5" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const ChevronLeft = ({ color = '#0A84FF' }) => (
  <svg width="12" height="21" viewBox="0 0 12 21" aria-hidden="true">
    <path d="M10.5 1.5 1.5 10.5l9 9" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChevronRightSmall = ({ color = '#8E8E93' }) => (
  <svg width="6" height="10" viewBox="0 0 6 10" aria-hidden="true">
    <path d="m1 1 4 4-4 4" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const VerifiedSeal = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-label="Verified business">
    <path
      fill="#0A84FF"
      d="M12 1.5l2.6 1.9 3.2-.2 1 3.1 2.6 1.9-1 3.1 1 3.1-2.6 1.9-1 3.1-3.2-.2L12 22.5l-2.6-1.9-3.2.2-1-3.1-2.6-1.9 1-3.1-1-3.1 2.6-1.9 1-3.1 3.2.2z"
    />
    <path d="m7.8 12.2 2.8 2.8 5.6-5.8" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M8 2v12M2 8h12" stroke="#AEAEB2" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const MicIcon = () => (
  <svg width="13" height="19" viewBox="0 0 13 19" aria-hidden="true">
    <rect x="3.5" y="0.8" width="6" height="11" rx="3" fill="#8E8E93" />
    <path d="M1 8.8a5.5 5.5 0 0 0 11 0M6.5 14.3v3.6" fill="none" stroke="#8E8E93" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const SendArrow = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
    <circle cx="14" cy="14" r="14" fill="#34C759" />
    <path d="M14 20.5V8.2M8.8 13.2 14 8l5.2 5.2" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const MessagesAppIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" aria-hidden="true">
    <defs>
      <linearGradient id="msg-icon-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5BF675" />
        <stop offset="1" stopColor="#0CBD2A" />
      </linearGradient>
    </defs>
    <rect width="60" height="60" rx="13.5" fill="url(#msg-icon-grad)" />
    <path
      fill="#fff"
      d="M30 12c-11.6 0-21 7.6-21 17 0 5.4 3.1 10.2 8 13.3-.4 2.6-1.8 5.1-3.7 6.9 3.6.1 7.4-1.2 10.2-3.4 2 .5 4.2.8 6.5.8 11.6 0 21-7.6 21-17S41.6 12 30 12Z"
    />
  </svg>
);

export const PlaneGlyph = ({ color = '#fff', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill={color}
      d="M21.4 11.1 14 7.2V3.5c0-1.1-.9-2-2-2s-2 .9-2 2v3.7l-7.4 3.9c-.4.2-.6.6-.6 1v.9l8-2.3v4.8l-2.3 1.6v1.4L12 17.8l4.3.7v-1.4L14 15.5v-4.8l8 2.3v-.9c0-.4-.2-.8-.6-1Z"
      transform="rotate(90 12 12)"
    />
  </svg>
);

export const EmojiIcon = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
    <circle cx="13" cy="13" r="11" fill="none" stroke="#C7C7CC" strokeWidth="1.8" />
    <circle cx="9.3" cy="10.5" r="1.5" fill="#C7C7CC" />
    <circle cx="16.7" cy="10.5" r="1.5" fill="#C7C7CC" />
    <path d="M8 15.2c1.2 2 3 3 5 3s3.8-1 5-3" fill="none" stroke="#C7C7CC" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const KeyboardMicIcon = () => (
  <svg width="16" height="24" viewBox="0 0 13 19" aria-hidden="true">
    <rect x="3.5" y="0.8" width="6" height="11" rx="3" fill="#C7C7CC" />
    <path d="M1 8.8a5.5 5.5 0 0 0 11 0M6.5 14.3v3.6" fill="none" stroke="#C7C7CC" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const ShiftIcon = () => (
  <svg width="20" height="19" viewBox="0 0 20 19" aria-hidden="true">
    <path d="M10 1.5 1.8 10h4.4v7h7.6v-7h4.4L10 1.5Z" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

export const DeleteIcon = () => (
  <svg width="24" height="18" viewBox="0 0 24 18" aria-hidden="true">
    <path d="M7.5 1.5h14a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5h-14L1.2 9l6.3-7.5Z" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="m11 5.5 7 7m0-7-7 7" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const WalletGlyph = () => (
  <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden="true">
    <rect x="0.5" y="0.5" width="21" height="15" rx="3" fill="#fff" />
    <rect x="0.5" y="2" width="21" height="3" fill="#FF9F0A" />
    <rect x="0.5" y="5" width="21" height="3" fill="#30D158" />
    <rect x="0.5" y="8" width="21" height="3" fill="#0A84FF" />
    <path d="M0.5 10.5h7.5c.8 1.6 1.8 2.4 3 2.4s2.2-.8 3-2.4h7.5v2.5a2.5 2.5 0 0 1-2.5 2.5h-16A2.5 2.5 0 0 1 .5 13v-2.5Z" fill="#E5E5EA" />
  </svg>
);

// In-call controls (Phone app).
export const SpeakerIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#fff" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
  </svg>
);

export const VideoIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#fff" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
  </svg>
);

export const MuteIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#fff" d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z" />
  </svg>
);

export const EllipsisIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="5" cy="12" r="2.1" fill="#fff" />
    <circle cx="12" cy="12" r="2.1" fill="#fff" />
    <circle cx="19" cy="12" r="2.1" fill="#fff" />
  </svg>
);

export const EndCallIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#fff" d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
  </svg>
);

export const KeypadIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
    {[4.5, 9.5, 14.5, 19.5].flatMap((y, r) =>
      (r === 3 ? [12] : [6, 12, 18]).map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.9" fill="#fff" />)
    )}
  </svg>
);
