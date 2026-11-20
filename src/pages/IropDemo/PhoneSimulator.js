import React, { useEffect, useRef } from 'react';
import CallScreen from './CallScreen';
import IosKeyboard from './IosKeyboard';
import useDragScroll from './useDragScroll';
import { BoardingPass, DelayCard, OptionsCarousel } from './RichCards';
import {
  BatteryIcon,
  BellSlashIcon,
  ChevronLeft,
  ChevronRightSmall,
  MessagesAppIcon,
  MicIcon,
  PlusIcon,
  SendArrow,
  SignalIcon,
  VerifiedSeal,
  WifiIcon,
} from './icons';

const LOGO = '/irop/aa-logo.png';
const APP_BACKDROP = '/irop/aa-app-home.jpg';
export const SENDER_NAME = 'American Airlines';

const StatusBar = ({ time }) => (
  <div className="ios-status-bar">
    <div className="ios-status-left">
      <span>{time}</span>
      <BellSlashIcon />
    </div>
    <div className="ios-status-right">
      <SignalIcon />
      <WifiIcon />
      <BatteryIcon level={83} />
    </div>
  </div>
);

const Avatar = ({ size }) => (
  <div className="ios-avatar" style={{ width: size, height: size }}>
    <img src={LOGO} alt="American Airlines" />
  </div>
);

const NotificationBanner = ({ state, text }) => (
  <div
    className={`ios-notification ${state !== 'hidden' ? 'ios-notification-in' : ''} ${
      state === 'pressed' ? 'ios-notification-pressed' : ''
    } ${state === 'gone' ? 'ios-notification-gone' : ''}`}
  >
    <div className="ios-notif-icon">
      <Avatar size={38} />
      <div className="ios-notif-badge">
        <MessagesAppIcon size={17} />
      </div>
    </div>
    <div className="ios-notif-text">
      <div className="ios-notif-title-row">
        <span className="ios-notif-title">{SENDER_NAME}</span>
        <span className="ios-notif-time">now</span>
      </div>
      <div className="ios-notif-body">{text}</div>
    </div>
  </div>
);

const TypingIndicator = () => (
  <div className="ios-row ios-row-in">
    <div className="ios-bubble ios-bubble-in ios-typing ios-tail-in">
      <span />
      <span />
      <span />
    </div>
  </div>
);

const Chips = ({ msg, pressedChip }) => {
  const ref = useRef(null);
  useDragScroll(ref);
  return (
    <div className="ios-chips" ref={ref}>
      {msg.chips.map((c, i) => (
        <div
          key={c}
          className={`ios-chip ${pressedChip === `${msg.id}:${i}` ? 'ios-chip-pressed' : ''}`}
        >
          {c}
          {pressedChip === `${msg.id}:${i}` && <span className="ios-touch" />}
        </div>
      ))}
    </div>
  );
};

const MessageItem = ({ msg, tail, pressedChip, carouselPeek }) => {
  const isMe = msg.from === 'me';
  let content;
  if (msg.kind === 'delayCard') content = <DelayCard />;
  else if (msg.kind === 'options') content = <OptionsCarousel peek={carouselPeek} />;
  else if (msg.kind === 'boardingPass') content = <BoardingPass />;
  else
    content = (
      <div
        className={`ios-bubble ${isMe ? 'ios-bubble-out' : 'ios-bubble-in'} ${
          tail ? (isMe ? 'ios-tail-out' : 'ios-tail-in') : ''
        }`}
      >
        {msg.text}
      </div>
    );

  return (
    <div className={`ios-msg-enter ${tail ? 'ios-group-end' : ''}`} data-msg={msg.id}>
      <div className={`ios-row ${isMe ? 'ios-row-out' : 'ios-row-in'} ${msg.kind === 'options' ? 'ios-row-full' : ''}`}>
        {content}
      </div>
      {msg.chips && !msg.chipsDone && <Chips msg={msg} pressedChip={pressedChip} />}
    </div>
  );
};

// Eased, slower-than-native scroll so the camera can pan across a tall card.
const panScroll = (el, top, ms, frame) => {
  const from = el.scrollTop;
  const to = Math.max(0, Math.min(top, el.scrollHeight - el.clientHeight));
  const start = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - start) / ms);
    const ease = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
    el.scrollTop = from + (to - from) * ease;
    if (t < 1) frame.current = requestAnimationFrame(step);
  };
  frame.current = requestAnimationFrame(step);
};

// Clearance for the translucent nav header that floats over the thread.
const HEADER_CLEARANCE = 150;

const MessagesApp = ({ open, messages, typing, inputText, keyboard, activeKey, shift, pressedChip, carouselPeek, time, scrollFocus }) => {
  const scrollRef = useRef(null);
  const panFrame = useRef(null);
  const panned = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Let the enter animation lay out first so scrollHeight is final.
    const id = requestAnimationFrame(() => {
      cancelAnimationFrame(panFrame.current);
      const node = scrollFocus && el.querySelector(`[data-msg="${scrollFocus}"]`);
      if (node) {
        // Show a tall card from its top, then the script releases focus to pan down over it.
        const top = el.scrollTop + node.getBoundingClientRect().top - el.getBoundingClientRect().top - HEADER_CLEARANCE;
        panScroll(el, top, 900, panFrame);
        panned.current = true;
      } else if (panned.current) {
        panned.current = false;
        panScroll(el, el.scrollHeight, 2600, panFrame);
      } else {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      }
    });
    return () => cancelAnimationFrame(id);
  }, [messages, typing, keyboard, scrollFocus]);

  useEffect(() => () => cancelAnimationFrame(panFrame.current), []);

  const lastOutIdx = messages.map((m) => m.from).lastIndexOf('me');
  const answered = lastOutIdx !== -1 && (typing || lastOutIdx < messages.length - 1);

  return (
    <div className={`ios-messages ${open ? 'ios-messages-open' : ''}`}>
      <div className="ios-msg-header">
        <StatusBar time={time} />
        <div className="ios-nav">
          <div className="ios-back">
            <ChevronLeft />
            <span className="ios-back-badge">12</span>
          </div>
          <div className="ios-nav-center">
            <Avatar size={52} />
            <div className="ios-nav-name">
              {SENDER_NAME}
              <VerifiedSeal size={12} />
              <ChevronRightSmall />
            </div>
          </div>
        </div>
      </div>

      <div className="ios-thread" ref={scrollRef}>
        <div className="ios-thread-inner">
          <div className="ios-thread-meta">
            <div>Text Message • RCS</div>
            <div>
              <b>Today</b> 3:02 PM
            </div>
          </div>
          {messages.map((m, i) => {
            const next = messages[i + 1];
            const tail = (!next || next.from !== m.from) && !(typing && m.from === 'aa' && !next);
            return (
              <React.Fragment key={m.id}>
                <MessageItem msg={m} tail={tail} pressedChip={pressedChip} carouselPeek={carouselPeek[m.id]} />
                {i === lastOutIdx && (
                  <div className="ios-receipt">{answered ? 'Read' : 'Delivered'}</div>
                )}
              </React.Fragment>
            );
          })}
          {typing && <TypingIndicator />}
        </div>
      </div>

      <div className="ios-composer">
        <div className="ios-plus">
          <PlusIcon />
        </div>
        <div className="ios-field">
          {inputText ? (
            <span className="ios-field-text">
              {inputText}
              <span className="ios-caret" />
            </span>
          ) : (
            <span className="ios-field-placeholder">
              {keyboard && <span className="ios-caret ios-caret-start" />}
              Text Message • RCS
            </span>
          )}
          <div className="ios-field-action">{inputText ? <SendArrow /> : <MicIcon />}</div>
        </div>
      </div>
      <IosKeyboard visible={keyboard} activeKey={activeKey} shift={shift} />
      <div className={`ios-home-area ${keyboard ? 'ios-home-area-hidden' : ''}`}>
        <div className="ios-home-indicator" />
      </div>
    </div>
  );
};

const PhoneSimulator = (props) => {
  const { scene, notification, notificationText, call, time } = props;
  return (
    <div className="iphone">
      <div className="iphone-btn iphone-btn-action" />
      <div className="iphone-btn iphone-btn-vol-up" />
      <div className="iphone-btn iphone-btn-vol-down" />
      <div className="iphone-btn iphone-btn-power" />
      <div className="iphone-btn iphone-btn-camera" />
      <div className="iphone-screen">
        <div className={`ios-aa-app ${scene !== 'app' ? 'ios-aa-app-behind' : ''}`}>
          <img src={APP_BACKDROP} alt="American Airlines app home screen" draggable="false" />
          <div className="ios-home-indicator" />
        </div>
        <MessagesApp open={scene !== 'app'} {...props} />
        <CallScreen open={scene === 'call'} call={call} statusBar={<StatusBar time={time} />} />
        <NotificationBanner state={notification} text={notificationText} />
        <div className="dynamic-island" />
      </div>
    </div>
  );
};

export default PhoneSimulator;
