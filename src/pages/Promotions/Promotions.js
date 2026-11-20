import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AmyAdvisor, { AmyAvatar } from './AmyAdvisor';
import { ALL_PROMOTIONS, MEMBER } from './offerEngine';
import './promotions.css';

const CATEGORIES = ['All', 'Credit cards', 'Flights', 'Hotels & cars', 'AAdvantage'];

const Promotions = () => {
  const [category, setCategory] = useState('All');
  const promos = category === 'All' ? ALL_PROMOTIONS : ALL_PROMOTIONS.filter((p) => p.category === category);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero + Amy offer assistant */}
      <section className="relative bg-aa-blue">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div
            className="absolute inset-0 opacity-25 bg-cover bg-center"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1800&h=900&fit=crop)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-aa-blue/40 via-aa-blue/80 to-aa-blue" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 pt-12 pb-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <nav className="text-sm text-white/60 mb-5" aria-label="Breadcrumb">
                <Link to="/" className="hover:text-white">Home</Link>
                <span className="mx-2">/</span>
                <span className="text-white/90">Promotions</span>
              </nav>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C7CED6]">
                AAdvantage® promotions
              </div>
              <h1 className="mt-2 text-4xl md:text-5xl font-light text-white tracking-tight">
                Offers that take you further
              </h1>
            </div>

            {/* Member snapshot */}
            <div className="flex-shrink-0 self-start md:self-auto bg-white/10 ring-1 ring-white/15 rounded-lg px-4 py-3 text-white backdrop-blur-sm">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#E8C872] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#E8C872]" />
                {MEMBER.status}
              </div>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-sm text-white/80">{MEMBER.firstName}</span>
                <span className="text-xl font-semibold tabular-nums">{MEMBER.milesBalance.toLocaleString('en-US')}</span>
                <span className="text-xs text-white/60">miles</span>
              </div>
            </div>
          </div>

          {/* Amy */}
          <div className="mt-10 flex items-center gap-3">
            <AmyAvatar className="w-10 h-10" />
            <p className="text-white">
              <span className="font-semibold">Hi {MEMBER.firstName}, I’m Amy.</span>{' '}
              <span className="text-white/75">Tell me where you’re headed and I’ll find the offer worth the most for that trip.</span>
            </p>
          </div>
          <div className="mt-4">
            <AmyAdvisor />
          </div>
        </div>
        <span className="aa-stripe thick relative" />
      </section>

      {/* All promotions */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <h2 className="text-3xl font-light text-aa-blue">All promotions</h2>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter promotions">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={category === c}
                onClick={() => setCategory(c)}
                className={`px-4 py-1.5 rounded-full text-sm border transition ${
                  category === c
                    ? 'bg-aa-blue border-aa-blue text-white'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-aa-blue'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {promos.map((p) => (
            <article key={p.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col">
              <div className="h-48 overflow-hidden">
                <img src={p.image} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-aa-gray">{p.category}</span>
                <h3 className="mt-1 text-xl font-semibold text-gray-900">{p.title}</h3>
                <p className="mt-2 text-gray-600 leading-relaxed flex-1">{p.body}</p>
                {p.linkUrl.startsWith('/') ? (
                  <Link to={p.linkUrl} className="mt-4 text-aa-light-blue hover:underline font-medium">Learn more</Link>
                ) : (
                  <a href={p.linkUrl} className="mt-4 text-aa-light-blue hover:underline font-medium">Learn more</a>
                )}
              </div>
            </article>
          ))}
        </div>

        <p className="mt-12 text-xs text-aa-gray leading-relaxed max-w-4xl">
          Demo content. Offers, miles, fees and member details shown on this page are fictional and for
          demonstration purposes only. Amy is a scripted demo of an Agentforce assistant.
        </p>
      </section>
    </div>
  );
};

export default Promotions;
