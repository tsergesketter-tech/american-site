import React, { useCallback, useEffect, useRef, useState } from 'react';
import PhoneSimulator from './PhoneSimulator';
import './iosSim.css';

const PHONE_W = 430;
const PHONE_H = 902;

const NOTIFICATION_TEXT =
  "Theodore, AA 1423 to Chicago is delayed about 3 hours due to weather. As an Executive Platinum member, we're holding seats for you on earlier flights.";

const initialState = {
  scene: 'app',
  notification: 'hidden',
  messages: [],
  typing: false,
  inputText: '',
  keyboard: false,
  activeKey: null,
  shift: false,
  pressedChip: null,
  carouselPeek: {},
  time: '3:02',
  call: null,
  scrollFocus: null,
};

// Global pacing for the script; 0.87 runs every pause and keystroke ~13% faster.
const PACE = 0.87;

class Cancelled extends Error {}

const usePhoneScale = () => {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const update = () => {
      const byHeight = (window.innerHeight - 110) / PHONE_H;
      const byWidth = (window.innerWidth - 32) / PHONE_W;
      setScale(Math.max(0.5, Math.min(1, byHeight, byWidth)));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
};

const IropDemo = () => {
  const [state, setState] = useState(initialState);
  const [status, setStatus] = useState('idle'); // idle | playing | done
  const [speed, setSpeed] = useState(1);
  const runId = useRef(0);
  const speedRef = useRef(1);
  const scale = usePhoneScale();

  useEffect(() => () => { runId.current += 1; }, []);

  const play = useCallback(async () => {
    const id = ++runId.current;
    const msgId = { n: 0 };

    const set = (patch) => {
      if (runId.current !== id) throw new Cancelled();
      setState((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }));
    };
    const wait = (ms) =>
      new Promise((resolve, reject) =>
        setTimeout(() => (runId.current === id ? resolve() : reject(new Cancelled())), (ms * PACE) / speedRef.current)
      );
    const push = (msg) =>
      set((s) => ({
        // A reply from the user retires any outstanding suggested replies, as RCS clients do.
        messages: [
          ...(msg.from === 'me' ? s.messages.map((m) => (m.chips ? { ...m, chipsDone: true } : m)) : s.messages),
          { id: `m${++msgId.n}`, ...msg },
        ],
      }));
    const lastId = () => `m${msgId.n}`;

    const amy = async (msg, typingMs = 1800) => {
      set({ typing: true });
      await wait(typingMs);
      set({ typing: false });
      push({ from: 'aa', kind: 'text', ...msg });
      await wait(450);
    };

    const userTypes = async (text) => {
      set({ keyboard: true });
      await wait(650);
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        const lower = ch.toLowerCase();
        set({
          shift: ch !== lower,
          activeKey: /[a-z ]/.test(lower) ? lower : null,
          inputText: text.slice(0, i + 1),
        });
        // Natural rhythm: quicker inside words, a beat longer after spaces/punctuation.
        await wait(ch === ' ' ? 95 : /[,.?!]/.test(ch) ? 160 : 52 + ((i * 37) % 40));
        set({ activeKey: null });
        await wait(14);
      }
      set({ shift: false });
      await wait(550);
      set({ inputText: '' });
      push({ from: 'me', kind: 'text', text });
      await wait(450);
      set({ keyboard: false });
      await wait(500);
    };

    const lastChipMsg = { current: null };
    const withChips = (msg) => {
      lastChipMsg.current = `m${msgId.n + 1}`;
      return msg;
    };

    const tapChip = async (index, text) => {
      const target = lastChipMsg.current;
      set({ pressedChip: `${target}:${index}` });
      await wait(380);
      set({ pressedChip: null });
      push({ from: 'me', kind: 'text', text });
      await wait(700);
    };

    // Tapping an RCS dial action hands off to the Phone app; no reply bubble is sent.
    const tapCallChip = async (index) => {
      const target = lastChipMsg.current;
      set({ pressedChip: `${target}:${index}` });
      await wait(380);
      set((s) => ({
        pressedChip: null,
        messages: s.messages.map((m) => (m.chips ? { ...m, chipsDone: true } : m)),
      }));
      await wait(250);
    };

    const lineId = { n: 0 };
    const setCall = (patch) => set((s) => ({ call: { ...s.call, ...(typeof patch === 'function' ? patch(s.call) : patch) } }));
    // Live transcript: words land at speaking pace while the speaker's waveform animates.
    const say = async (who, text) => {
      const id = `l${++lineId.n}`;
      const words = text.split(' ');
      setCall((c) => ({ speaker: who, lines: [...c.lines, { id, who, text, words: 0 }] }));
      for (let i = 1; i <= words.length; i++) {
        setCall((c) => ({ lines: c.lines.map((l) => (l.id === id ? { ...l, words: i } : l)) }));
        await wait(/[,.?!]$/.test(words[i - 1]) ? 380 : 190 + ((i * 29) % 70));
      }
      setCall({ speaker: null });
      await wait(900);
    };

    setState(initialState);
    setStatus('playing');

    try {
      // 1. In the app
      await wait(2600);

      // 2. Notification
      push({ from: 'aa', kind: 'delayCard' });
      push(withChips({
        from: 'aa',
        kind: 'text',
        text: 'Want to get to Chicago sooner? Executive Platinum members get first pick of open seats. Just reply here.',
        chips: ['Rebook me', 'Keep my flight', 'Talk to an agent'],
      }));
      set({ notification: 'shown' });
      await wait(4200);
      set({ notification: 'pressed' });
      await wait(260);
      set({ notification: 'gone', scene: 'messages' });
      await wait(2600);

      // 3. Ask for options → Amy intro + carousel
      await userTypes('What are my options?');
      await amy({
        text: "Hi Theodore, I'm Amy 👋 the American Airlines mobile assistant, powered by Agentforce ✨ Thanks for being an Executive Platinum member 💎 I found 3 ways to get you to Chicago today:",
      }, 2200);
      set({ typing: true });
      await wait(1500);
      set({ typing: false, time: '3:03' });
      push(withChips({ from: 'aa', kind: 'options', chips: ['Book Option 1', 'Book Option 2', 'Compare options'] }));
      const carousel = lastId();
      await wait(2000);
      set((s) => ({ carouselPeek: { ...s.carouselPeek, [carousel]: 1 } }));
      await wait(1700);
      set((s) => ({ carouselPeek: { ...s.carouselPeek, [carousel]: 2 } }));
      await wait(1700);
      set((s) => ({ carouselPeek: { ...s.carouselPeek, [carousel]: 0 } }));
      await wait(1400);

      // 4. Free-form GenAI question
      await userTypes('What about my checked bag?');
      await amy(withChips({
        text: "No need to do anything. Your bag will move to whichever flight you choose automatically. Want me to lock in Option 1? It lands at 7:05 PM, you'll keep seat 8C, and you stay #1 on the upgrade list.",
        chips: ['Yes, rebook me', 'Show me other seats', 'Book Option 2'],
      }), 2600);
      set({ time: '3:04' });
      await wait(2600);

      // 5. One-tap confirm
      await tapChip(0, 'Yes, rebook me');
      await amy({
        text: "Done ✅ You're confirmed on AA 2187, departing 4:50 PM from Gate C22. Boarding starts at 4:15 PM, and you're in Group 1. Your confirmation code is KXQ7RT.",
      }, 2400);

      // 6. Boarding pass
      await amy({ text: "Here's your new boarding pass. Questions? Call in anytime and talk to me, Amy 📞" }, 1500);
      set({ typing: true });
      await wait(1300);
      set({ typing: false });
      push(withChips({ from: 'aa', kind: 'boardingPass', chips: ['Directions to Gate C22', 'Admirals Club® near me'] }));
      // Pan across the pass: hold on the header, then glide down to the QR code and Wallet button.
      set({ scrollFocus: lastId() });
      await wait(2200);
      set({ scrollFocus: null });
      await wait(3600);

      // 7. Ask to talk it through → hand off to Agentforce Voice
      await userTypes('Thanks Amy! Can I call to talk through tonight?');
      await amy(withChips({
        text: "Of course! Tap below and I'll pick up right away, with everything from our chat in front of me.",
        chips: ['📞 Call Amy', 'Maybe later'],
      }), 2000);
      await wait(1600);
      await tapCallChip(0);
      set({ scene: 'call', call: { phase: 'calling', lines: [], speaker: null, endPressed: false }, time: '3:05' });
      await wait(2600);
      setCall({ phase: 'connected' });
      await wait(700);

      await say('amy', "Hi Theodore, it's Amy. I've got you on AA 2187 to Chicago, departing 4:50. What can I help with?");
      await say('me', "I've got a dinner downtown at 8. Am I going to make it?");
      await say('amy', "You should. You land at 7:05, and your bag has priority tags, so it'll be one of the first out. Want me to text you a car option for when you land?");
      await say('me', 'Yes please. That would be great.');
      await say('amy', "Done. It's in our messages now. Enjoy your dinner, and safe travels!");
      await say('me', 'Thanks Amy, bye.');
      await wait(400);

      setCall({ endPressed: true });
      await wait(380);
      setCall({ endPressed: false, phase: 'ended' });
      await wait(1500);
      set({ scene: 'messages' });
      await wait(900);
      await amy(withChips({
        text: "Great talking with you, Theodore! 🚗 Here's that car option for when you land at 7:05 PM. I'll keep an eye on AA 2187 and message you here if anything changes ✈️",
        chips: ['Book the car', 'No thanks'],
      }), 2000);
      setStatus('done');
    } catch (e) {
      if (!(e instanceof Cancelled)) throw e;
    }
  }, []);

  // ?autoplay=1 (optionally &speed=1.5) starts the conversation on load, e.g. for kiosk displays.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('autoplay')) return;
    const s = Number(params.get('speed'));
    if ([1, 1.5, 2].includes(s)) {
      speedRef.current = s;
      setSpeed(s);
    }
    play();
  }, [play]);

  const reset = () => {
    runId.current += 1;
    setState(initialState);
    setStatus('idle');
  };

  return (
    <section className={`irop-stage ${status === 'playing' ? 'irop-stage-playing' : ''}`}>
      <div className="irop-phone-slot" style={{ width: PHONE_W * scale, height: PHONE_H * scale }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <PhoneSimulator {...state} notificationText={NOTIFICATION_TEXT} />
        </div>
      </div>

      <div className="irop-controls">
        {status === 'playing' ? (
          <button className="irop-btn" onClick={reset}>
            ■ Stop
          </button>
        ) : (
          <button className="irop-btn" onClick={play}>
            {status === 'done' ? '↻ Replay' : '▶ Play'}
          </button>
        )}
        <div className="irop-speed" role="group" aria-label="Playback speed">
          {[1, 1.5, 2].map((s) => (
            <button
              key={s}
              className={speed === s ? 'irop-speed-on' : ''}
              onClick={() => { speedRef.current = s; setSpeed(s); }}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IropDemo;
