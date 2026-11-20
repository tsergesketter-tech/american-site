import React, { useEffect, useRef, useState } from 'react';
import { MEMBER, SUGGESTIONS, recommend } from './offerEngine';
import { PrimaryOffer, CompanionOffer } from './OfferCards';
import { trackCustomEvent } from '../../services/salesforceTracking';

const STEP_MS = 650;

// The Interactions beacon can throw when it isn't fully configured; never let that break the demo.
const track = (name, data) => {
  try {
    trackCustomEvent(name, data);
  } catch (err) {
    console.warn('Tracking skipped:', name, err);
  }
};

export const AmyAvatar = ({ className = 'w-8 h-8' }) => (
  <span className={`${className} flex-shrink-0 rounded-full bg-white ring-1 ring-gray-200 flex items-center justify-center overflow-hidden`}>
    <img src="/irop/aa-logo.png" alt="" className="w-[78%] h-[78%] object-contain" />
  </span>
);

const StepIcon = ({ done }) =>
  done ? (
    <svg className="w-4 h-4 flex-shrink-0 text-[#2E844A]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z" clipRule="evenodd" />
    </svg>
  ) : (
    <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
      <span className="w-3 h-3 rounded-full border-2 border-aa-light-blue border-t-transparent animate-spin" />
    </span>
  );

const AmyAdvisor = () => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [turn, setTurn] = useState(null); // { question, result, stepsDone, done }
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const timers = useRef([]);

  useEffect(() => {
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('mousedown', onDown);
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const ask = (text) => {
    const question = text.trim();
    if (!question) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];

    const result = recommend(question);
    setTurn({ question, result, stepsDone: 0, done: false });
    setQuery('');
    setOpen(false);
    setActive(-1);
    inputRef.current?.blur();

    result.steps.forEach((_, i) => {
      timers.current.push(setTimeout(() => {
        setTurn((t) => t && { ...t, stepsDone: i + 1 });
      }, STEP_MS * (i + 1)));
    });
    timers.current.push(setTimeout(() => {
      setTurn((t) => t && { ...t, done: true });
    }, STEP_MS * (result.steps.length + 1)));

    track('NBO_Query', {
      question,
      recommendedOffer: result.offers[0]?.id,
    });
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % SUGGESTIONS.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (i <= 0 ? SUGGESTIONS.length - 1 : i - 1));
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActive(-1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      ask(open && active >= 0 ? SUGGESTIONS[active] : query);
    }
  };

  const onSelectOffer = (offer) => track('NBO_Offer_Click', { offerId: offer.id });

  const showSuggestions = open && !query;

  return (
    <div ref={rootRef} className="relative">
      {/* Conversation bar */}
      <div
        className={`bg-white rounded-xl shadow-lg ring-1 transition ${
          open ? 'ring-aa-light-blue ring-2' : 'ring-black/5'
        }`}
      >
        <div className="flex items-center gap-3 pl-4 pr-2 py-2">
          <AmyAvatar className="w-9 h-9" />
          <label htmlFor="nbo-input" className="sr-only">Ask Amy about offers</label>
          <input
            id="nbo-input"
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={showSuggestions}
            aria-controls="nbo-suggestions"
            aria-activedescendant={showSuggestions && active >= 0 ? `nbo-s-${active}` : undefined}
            autoComplete="off"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(-1); }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="Ask Amy about offers for your next trip…"
            className="flex-1 min-w-0 py-2.5 text-base text-gray-900 placeholder-gray-400 bg-transparent outline-none"
          />
          <button
            type="button"
            onClick={() => ask(query)}
            disabled={!query.trim()}
            className="flex-shrink-0 inline-flex items-center gap-2 bg-aa-red hover:bg-[#A50726] disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
          >
            Ask
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Dropdown */}
      {showSuggestions && (
        <div className="nbo-drop absolute z-20 left-0 right-0 mt-2 bg-white rounded-xl shadow-xl ring-1 ring-black/5 overflow-hidden">
          <div className="relative flex items-center justify-between px-4 py-3 bg-aa-blue text-white">
            <div className="flex items-center gap-3">
              <AmyAvatar className="w-8 h-8" />
              <div className="leading-tight">
                <div className="text-sm font-semibold">Amy</div>
                <div className="text-xs text-white/65">Your AAdvantage® offer assistant</div>
              </div>
            </div>
            <div className="text-right leading-tight">
              <div className="text-xs text-white/80">{MEMBER.firstName} · {MEMBER.status}</div>
              <div className="text-[10px] uppercase tracking-wider text-white/45 mt-0.5">Powered by Agentforce</div>
            </div>
            <span className="aa-stripe absolute left-0 right-0 bottom-0" />
          </div>
          <div className="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-aa-gray">
            Try asking
          </div>
          <ul id="nbo-suggestions" role="listbox" className="pb-2">
            {SUGGESTIONS.map((s, i) => (
              <li
                key={s}
                id={`nbo-s-${i}`}
                role="option"
                aria-selected={active === i}
                onMouseDown={(e) => { e.preventDefault(); ask(s); }}
                onMouseEnter={() => setActive(i)}
                className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm ${
                  active === i ? 'bg-[#EAF3FB] text-aa-blue' : 'text-gray-800'
                }`}
              >
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Conversation + next best offers */}
      {turn && (
        <div className="mt-4" aria-live="polite">
          <div className="nbo-rise bg-white/95 rounded-xl ring-1 ring-black/5 shadow-sm p-5">
            <div className="flex justify-end">
              <p className="max-w-[80%] bg-aa-light-gray text-gray-900 text-sm px-4 py-2.5 rounded-2xl rounded-br-sm">
                {turn.question}
              </p>
            </div>

            <div className="mt-4 flex gap-3">
              <AmyAvatar className="w-8 h-8" />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-aa-blue mb-1.5">Amy</div>
                <ul className="space-y-1.5">
                  {turn.result.steps.slice(0, turn.stepsDone + 1).map((step, i) => (
                    <li key={step} className="nbo-rise flex items-center gap-2 text-sm text-aa-gray">
                      <StepIcon done={i < turn.stepsDone} />
                      {step}
                    </li>
                  ))}
                </ul>
                {!turn.done && turn.stepsDone >= turn.result.steps.length && (
                  <div className="mt-3 flex items-center gap-1 text-aa-light-blue">
                    <span className="nbo-dot" /><span className="nbo-dot" /><span className="nbo-dot" />
                  </div>
                )}
                {turn.done && (
                  <p className="nbo-rise mt-3 text-[15px] leading-relaxed text-gray-900">
                    {turn.result.reply}
                  </p>
                )}
              </div>
            </div>
          </div>

          {turn.done && (
            <div className="mt-4">
              <div className="nbo-rise flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white/90">
                  Amy’s picks for you
                </h2>
                <button
                  type="button"
                  onClick={() => setTurn(null)}
                  className="text-sm text-white/70 hover:text-white"
                >
                  Clear
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {turn.result.offers.map((offer, i) =>
                  offer.kind === 'card' ? (
                    <PrimaryOffer key={offer.id} offer={offer} delay={120} onSelect={onSelectOffer} />
                  ) : (
                    <CompanionOffer key={offer.id} offer={offer} delay={260 + i * 120} onSelect={onSelectOffer} />
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AmyAdvisor;
