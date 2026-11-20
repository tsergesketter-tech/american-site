import React, { useEffect, useRef } from 'react';
import { PlaneGlyph, WalletGlyph } from './icons';
import useDragScroll from './useDragScroll';

const LOGO = '/irop/aa-logo.png';

/* ---------- Proactive IROP alert ---------- */

export const DelayCard = () => (
  <div className="ios-rich-card">
    <div className="rc-delay-media">
      <div className="rc-delay-top">
        <div className="rc-brand">
          <img src={LOGO} alt="" />
          <span>American Airlines</span>
        </div>
        <span className="rc-pill rc-pill-delay">DELAYED</span>
      </div>
      <div className="rc-route">
        <div>
          <div className="rc-iata">DFW</div>
          <div className="rc-city">Dallas/Fort Worth</div>
        </div>
        <div className="rc-route-line">
          <span />
          <PlaneGlyph color="#9DB7DA" size={18} />
          <span />
        </div>
        <div className="rc-align-right">
          <div className="rc-iata">ORD</div>
          <div className="rc-city">Chicago O'Hare</div>
        </div>
      </div>
      <div className="rc-delay-times">
        <div>
          <div className="rc-label">AA 1423 · Departs</div>
          <div className="rc-time-row">
            <span className="rc-strike">4:15 PM</span>
            <span className="rc-new-time">7:20 PM</span>
          </div>
        </div>
        <div className="rc-align-right">
          <div className="rc-label">Gate</div>
          <div className="rc-time-row"><span className="rc-new-time rc-white">C14</span></div>
        </div>
      </div>
    </div>
    <div className="rc-body">
      <div className="rc-title">Your flight to Chicago is delayed</div>
      <div className="rc-desc">
        Weather at O'Hare is slowing arrivals, so AA 1423 is now expected to depart at 7:20 PM. As an
        Executive Platinum member, you get priority rebooking. We're already holding seats for you on
        earlier flights.
      </div>
    </div>
    <div className="rc-exp-strip">
      <span className="rc-exp-badge">EXECUTIVE PLATINUM</span>
      <span>Priority rebooking unlocked</span>
    </div>
  </div>
);

/* ---------- Rebooking options carousel ---------- */

const OPTIONS = [
  {
    tag: 'FASTEST · RECOMMENDED',
    flight: 'AA 2187',
    dep: '4:50 PM',
    arr: '7:05 PM',
    duration: '2h 15m · Nonstop',
    lines: ['Main Cabin Extra · Seat 8C', 'Upgrade waitlist: #1 of 4', 'Bag rerouted automatically'],
    accent: true,
  },
  {
    tag: 'FIRST CLASS CONFIRMED',
    flight: 'AA 3310',
    dep: '5:45 PM',
    arr: '8:02 PM',
    duration: '2h 17m · Nonstop',
    lines: ['First Class · Seat 3A', 'Complimentary EXP upgrade', 'Flagship dining'],
  },
  {
    tag: 'KEEP ORIGINAL',
    flight: 'AA 1423',
    dep: '7:20 PM',
    arr: '9:38 PM',
    duration: '2h 18m · Nonstop',
    lines: ['First Class · Seat 2A', 'Admirals Club® pass added', '$25 meal credit'],
  },
];

const CARD_STEP = 262; // card width (252) + gap (10)

export const OptionsCarousel = ({ peek }) => {
  const ref = useRef(null);
  useDragScroll(ref, CARD_STEP);

  // "peek" simulates the user swiping through the carousel and back.
  useEffect(() => {
    const el = ref.current;
    if (!el || peek === undefined) return;
    el.scrollTo({ left: peek * CARD_STEP, behavior: 'smooth' });
  }, [peek]);

  return (
    <div className="rc-carousel" ref={ref}>
      {OPTIONS.map((o, i) => (
        <div key={o.flight + i} className="ios-rich-card rc-option">
          <div className={`rc-option-head ${o.accent ? 'rc-option-head-accent' : ''}`}>
            <span>{o.tag}</span>
            <span className="rc-opt-num">Option {i + 1}</span>
          </div>
          <div className="rc-option-body">
            <div className="rc-opt-flight">
              <img src={LOGO} alt="" />
              {o.flight}
              <span className="rc-opt-dur">{o.duration}</span>
            </div>
            <div className="rc-opt-times">
              <div>
                <div className="rc-opt-time">{o.dep}</div>
                <div className="rc-opt-ap">DFW</div>
              </div>
              <div className="rc-route-line rc-route-line-sm">
                <span />
                <PlaneGlyph color="#8E8E93" size={14} />
                <span />
              </div>
              <div className="rc-align-right">
                <div className="rc-opt-time">{o.arr}</div>
                <div className="rc-opt-ap">ORD</div>
              </div>
            </div>
            <ul className="rc-opt-lines">
              {o.lines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
          <div className="rc-action">{i === 2 ? 'Keep this flight' : `Select ${o.flight}`}</div>
        </div>
      ))}
    </div>
  );
};

/* ---------- Mobile boarding pass ---------- */

// Deterministic pseudo-QR so the pass looks real without a QR dependency.
const QrCode = ({ size = 112 }) => {
  const n = 29;
  let seed = 2187;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const inFinder = (x, y) =>
    (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
  const cells = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (inFinder(x, y)) continue;
      if (rand() > 0.52) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
    }
  }
  const finder = (x, y) => (
    <g key={`f${x}${y}`}>
      <rect x={x} y={y} width="7" height="7" />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
      <rect x={x + 2} y={y + 2} width="3" height="3" />
    </g>
  );
  return (
    <svg width={size} height={size} viewBox={`-1 -1 ${n + 2} ${n + 2}`} shapeRendering="crispEdges" aria-label="Boarding pass QR code">
      <rect x="-1" y="-1" width={n + 2} height={n + 2} fill="#fff" />
      <g fill="#0B1F3F">
        {cells}
        {finder(0, 0)}
        {finder(n - 7, 0)}
        {finder(0, n - 7)}
      </g>
    </svg>
  );
};

export const BoardingPass = () => (
  <div className="ios-rich-card rc-bp-wrap">
    <div className="rc-bp">
      <div className="rc-bp-head">
        <div className="rc-brand rc-brand-dark">
          <img src={LOGO} alt="" />
          <span>American Airlines</span>
        </div>
        <div className="rc-bp-group">
          <div className="rc-bp-label">GROUP</div>
          <div className="rc-bp-group-num">1</div>
        </div>
      </div>
      <div className="rc-bp-route">
        <div>
          <div className="rc-bp-iata">DFW</div>
          <div className="rc-bp-city">Dallas/Fort Worth</div>
        </div>
        <PlaneGlyph color="#0078D2" size={22} />
        <div className="rc-align-right">
          <div className="rc-bp-iata">ORD</div>
          <div className="rc-bp-city">Chicago O'Hare</div>
        </div>
      </div>
      <div className="rc-bp-name-row">
        <div>
          <div className="rc-bp-label">PASSENGER</div>
          <div className="rc-bp-val">THEODORE SERGESKETTER</div>
        </div>
        <span className="rc-exp-badge rc-exp-badge-light">EXP</span>
      </div>
      <div className="rc-bp-grid">
        <div>
          <div className="rc-bp-label">FLIGHT</div>
          <div className="rc-bp-val">AA 2187</div>
        </div>
        <div>
          <div className="rc-bp-label">BOARDS</div>
          <div className="rc-bp-val">4:15 PM</div>
        </div>
        <div>
          <div className="rc-bp-label">DEPARTS</div>
          <div className="rc-bp-val">4:50 PM</div>
        </div>
        <div>
          <div className="rc-bp-label">GATE</div>
          <div className="rc-bp-val rc-bp-big">C22</div>
        </div>
        <div>
          <div className="rc-bp-label">SEAT</div>
          <div className="rc-bp-val rc-bp-big">8C</div>
        </div>
        <div>
          <div className="rc-bp-label">CABIN</div>
          <div className="rc-bp-val">MCE</div>
        </div>
      </div>
      <div className="rc-bp-perf" />
      <div className="rc-bp-foot">
        <QrCode />
        <div className="rc-bp-foot-info">
          <div className="rc-bp-label">RECORD LOCATOR</div>
          <div className="rc-bp-val rc-mono">KXQ7RT</div>
          <div className="rc-bp-label rc-mt">TSA PRE✓®</div>
          <div className="rc-bp-chip">Upgrade waitlist #1</div>
        </div>
      </div>
    </div>
    <div className="rc-wallet-row">
      <div className="rc-wallet-btn">
        <WalletGlyph />
        <div>
          <div className="rc-wallet-small">Add to</div>
          <div className="rc-wallet-big">Apple Wallet</div>
        </div>
      </div>
    </div>
  </div>
);
