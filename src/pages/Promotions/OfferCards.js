import React from 'react';
import { Link } from 'react-router-dom';

const OfferLink = ({ to, className, children, onClick }) =>
  to.startsWith('/') ? (
    <Link to={to} className={className} onClick={onClick}>{children}</Link>
  ) : (
    <a href={to} className={className} onClick={onClick}>{children}</a>
  );

const Arrow = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const Check = () => (
  <svg className="w-4 h-4 text-aa-light-blue flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z" clipRule="evenodd" />
  </svg>
);

export const CardArt = ({ variant, name }) => (
  <div className={`nbo-card-art ${variant} p-5 flex flex-col justify-between`}>
    <div className="flex items-start justify-between">
      <div>
        <div className="text-[10px] tracking-[0.18em] uppercase opacity-70">AAdvantage®</div>
        <div className="text-lg font-semibold leading-tight">{name}</div>
      </div>
      <img
        src="/irop/aa-logo.png"
        alt=""
        className={`w-10 h-10 ${variant === 'silver' ? 'mix-blend-multiply' : 'rounded-md bg-white p-0.5'}`}
      />
    </div>
    <div className="chip" />
    <div className="flex items-end justify-between text-xs">
      <span className="tracking-[0.2em]">•••• 4021</span>
      <span className="font-semibold italic tracking-wide">citi</span>
    </div>
  </div>
);

export const PrimaryOffer = ({ offer, delay = 0, onSelect }) => (
  <article
    className="nbo-rise bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden md:col-span-2"
    style={{ animationDelay: `${delay}ms` }}
  >
    <span className="aa-stripe" />
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,15rem)_1fr] gap-6 p-6">
      <div className="max-w-[15rem] w-full">
        <CardArt variant={offer.art} name={offer.product.includes('Globe') ? 'Globe™' : 'Platinum Select®'} />
      </div>
      <div className="min-w-0">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-aa-red">
          <span className="w-1.5 h-1.5 rounded-full bg-aa-red" />
          {offer.eyebrow}
        </span>
        <h3 className="mt-1 text-2xl md:text-3xl font-light text-aa-blue">{offer.title}</h3>
        <p className="text-sm text-aa-gray mt-1">{offer.product}</p>

        <dl className="mt-5 grid grid-cols-3 border-y border-gray-100 divide-x divide-gray-100">
          {offer.stats.map((s) => (
            <div key={s.label} className="py-3 px-3 first:pl-0">
              <dt className="text-[11px] uppercase tracking-wider text-aa-gray">{s.label}</dt>
              <dd className="text-xl font-semibold text-aa-blue tabular-nums mt-0.5">{s.value}</dd>
            </div>
          ))}
        </dl>

        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
          {offer.perks.map((p) => (
            <li key={p} className="flex items-start gap-1.5 text-sm text-gray-700"><Check />{p}</li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <OfferLink
            to={offer.linkUrl}
            onClick={() => onSelect(offer)}
            className="inline-flex items-center gap-2 bg-aa-light-blue hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded transition"
          >
            {offer.cta} <Arrow />
          </OfferLink>
          <p className="text-xs text-aa-gray">{offer.terms}</p>
        </div>
      </div>
    </div>
  </article>
);

const KIND_ICON = {
  flight: 'M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z',
  hotel: 'M3 21V7a2 2 0 012-2h6a2 2 0 012 2v4h6a2 2 0 012 2v8M3 21h18M7 9h2m-2 4h2m-2 4h2m6 0h2',
};

export const CompanionOffer = ({ offer, delay = 0, onSelect }) => (
  <article
    className="nbo-rise bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col"
    style={{ animationDelay: `${delay}ms` }}
  >
    {offer.route ? (
      <div className="h-32 bg-aa-blue text-white px-6 flex items-center justify-between">
        <span className="text-4xl font-light tracking-wide">{offer.route.from}</span>
        <span className="flex-1 flex items-center gap-2 mx-4 text-white/50" aria-hidden="true">
          <span className="flex-1 border-t border-dashed border-white/40" />
          <svg className="w-5 h-5 rotate-90 text-white" fill="currentColor" viewBox="0 0 24 24"><path d={KIND_ICON.flight} /></svg>
          <span className="flex-1 border-t border-dashed border-white/40" />
        </span>
        <span className="text-4xl font-light tracking-wide">{offer.route.to}</span>
      </div>
    ) : (
      <div className="h-32 bg-aa-light-gray flex items-center justify-center">
        <svg className="w-10 h-10 text-aa-blue/70" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d={KIND_ICON[offer.kind]} />
        </svg>
      </div>
    )}
    <div className="p-5 flex flex-col flex-1">
      <span className="text-xs font-semibold uppercase tracking-wider text-aa-gray">{offer.eyebrow}</span>
      <h3 className="mt-1 text-lg font-semibold text-gray-900">{offer.title}</h3>
      <p className="mt-1 text-sm text-gray-600 leading-relaxed flex-1">{offer.body}</p>
      <OfferLink
        to={offer.linkUrl}
        onClick={() => onSelect(offer)}
        className="mt-4 inline-flex items-center gap-1 text-aa-light-blue font-medium hover:underline"
      >
        {offer.cta} <Arrow />
      </OfferLink>
    </div>
  </article>
);
