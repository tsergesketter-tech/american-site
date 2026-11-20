import React from 'react';
import { DeleteIcon, EmojiIcon, KeyboardMicIcon, ShiftIcon } from './icons';

const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

// Dark-mode iOS keyboard. `activeKey` is the lowercase character currently
// being "pressed" (or ' ' for space, '\n' for return).
const IosKeyboard = ({ visible, activeKey, shift }) => {
  const letterKey = (ch) => (
    <div key={ch} className={`kb-key ${activeKey === ch ? 'kb-key-down' : ''}`}>
      {shift ? ch.toUpperCase() : ch}
      {activeKey === ch && <div className="kb-popup">{shift ? ch.toUpperCase() : ch}</div>}
    </div>
  );

  return (
    <div className={`ios-keyboard ${visible ? 'ios-keyboard-visible' : ''}`} aria-hidden="true">
      <div className="kb-rows">
        <div className="kb-row">{ROWS[0].split('').map(letterKey)}</div>
        <div className="kb-row kb-row-inset">{ROWS[1].split('').map(letterKey)}</div>
        <div className="kb-row">
          <div className={`kb-key kb-fn kb-shift ${shift ? 'kb-shift-on' : ''}`}>
            <ShiftIcon />
          </div>
          <div className="kb-row-mid">{ROWS[2].split('').map(letterKey)}</div>
          <div className="kb-key kb-fn kb-shift">
            <DeleteIcon />
          </div>
        </div>
        <div className="kb-row">
          <div className="kb-key kb-fn kb-123">123</div>
          <div className={`kb-key kb-space ${activeKey === ' ' ? 'kb-key-down' : ''}`}>space</div>
          <div className={`kb-key kb-fn kb-return ${activeKey === '\n' ? 'kb-return-down' : ''}`}>return</div>
        </div>
      </div>
      <div className="kb-bottom">
        <EmojiIcon />
        <KeyboardMicIcon />
      </div>
      <div className="kb-home-indicator" />
    </div>
  );
};

export default IosKeyboard;
