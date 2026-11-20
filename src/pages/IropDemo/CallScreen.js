import React, { useEffect, useState } from 'react';
import { EllipsisIcon, EndCallIcon, KeypadIcon, MuteIcon, SpeakerIcon, VideoIcon } from './icons';

const LOGO = '/irop/aa-logo.png';

// Ticks in wall-clock time once the call connects; freezes on "ended" like the Phone app.
const useCallTimer = (phase) => {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    if (phase !== 'connected') {
      if (phase !== 'ended') setSecs(0);
      return undefined;
    }
    const start = Date.now();
    const id = setInterval(() => setSecs(Math.floor((Date.now() - start) / 1000)), 250);
    return () => clearInterval(id);
  }, [phase]);
  return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
};

const Waveform = ({ active }) => (
  <span className={`call-wave ${active ? 'call-wave-on' : ''}`} aria-hidden="true">
    <i />
    <i />
    <i />
    <i />
    <i />
  </span>
);

const CONTROLS = [
  { label: 'speaker', icon: <SpeakerIcon /> },
  { label: 'FaceTime', icon: <VideoIcon /> },
  { label: 'mute', icon: <MuteIcon /> },
  { label: 'more', icon: <EllipsisIcon /> },
  { label: 'end', icon: <EndCallIcon />, end: true },
  { label: 'keypad', icon: <KeypadIcon /> },
];

const CallScreen = ({ open, call, statusBar }) => {
  const phase = call?.phase ?? 'calling';
  const timer = useCallTimer(call ? phase : null);
  const lines = call?.lines ?? [];

  const status = phase === 'calling' ? 'calling…' : phase === 'ended' ? 'Call Ended' : timer;

  return (
    <div className={`ios-call ${open ? 'ios-call-open' : ''} ios-call-${phase}`}>
      {/* Contact poster */}
      <div className="call-poster">
        <img src={LOGO} alt="" draggable="false" />
      </div>
      <div className="call-dim" />

      <div className="call-content">
        {statusBar}
        <div className="call-header">
          <div className="call-status">{status}</div>
          <div className="call-name">American Airlines</div>
          <div className="call-agent">
            <span className="call-sparkle">✨</span> Amy · Agentforce Voice
          </div>
        </div>

        <div className="call-transcript">
          <div className="call-transcript-head">
            <Waveform active={call?.speaker === 'amy'} />
            <span>{call?.speaker === 'me' ? 'Listening…' : 'Live transcript'}</span>
          </div>
          <div className="call-lines">
            {lines.slice(-3).map((l) => (
              <div key={l.id} className={`call-line call-line-${l.who}`}>
                <div className="call-line-who">{l.who === 'amy' ? 'Amy' : 'Theodore'}</div>
                <div className="call-line-text">{l.text.split(' ').slice(0, l.words).join(' ')}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="call-controls">
          {CONTROLS.map((c) => (
            <div key={c.label} className="call-ctl">
              <div
                className={`call-btn ${c.end ? 'call-btn-end' : ''} ${
                  c.end && call?.endPressed ? 'call-btn-pressed' : ''
                }`}
              >
                {c.icon}
                {c.end && call?.endPressed && <span className="ios-touch" />}
              </div>
              <div className="call-ctl-label">{c.label}</div>
            </div>
          ))}
        </div>
        <div className="call-home">
          <div className="ios-home-indicator" />
        </div>
      </div>
    </div>
  );
};

export default CallScreen;
