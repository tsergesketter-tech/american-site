import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [showHolidayBanner, setShowHolidayBanner] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  return (
    <header>
      {/* Salesforce Demo Disclaimer */}
      {showDisclaimer && (
        <div className="bg-aa-blue text-white border-b border-blue-800">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm">
                <span className="font-semibold">Salesforce Marketing Cloud Demo Site</span> - This is not the official American Airlines website. This site is for demonstration purposes only.
              </p>
            </div>
            <button
              onClick={() => setShowDisclaimer(false)}
              className="text-white hover:text-gray-200 ml-4"
              aria-label="Close disclaimer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Holiday Travel Banner */}
      {showHolidayBanner && (
        <div className="bg-aa-light-gray border-b border-gray-300">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-aa-light-blue flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Holiday travel</h3>
                <p className="text-sm text-gray-700 mb-2">
                  Arrive at the airport early to allow plenty of time to check in (with or without bags) and clear security before your scheduled departure.
                </p>
                <div className="flex flex-col gap-1">
                  <a href="#" className="text-sm text-aa-light-blue hover:underline flex items-center gap-1">
                    When to arrive at the airport
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <a href="#" className="text-sm text-aa-light-blue hover:underline flex items-center gap-1">
                    Download the American app and manage your travel on the go
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowHolidayBanner(false)}
              className="text-gray-500 hover:text-gray-700 ml-4"
              aria-label="Close banner"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo and Main Nav */}
            <div className="flex items-center gap-8">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 cursor-pointer">
                <img
                  src="/logos/logo-american-short-header.png"
                  alt="American Airlines"
                  className="h-10"
                />
                <img
                  src="/logos/Oneworld_logo.svg.png"
                  alt="oneworld alliance"
                  className="h-8"
                />
              </Link>

              {/* Main Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                <a href="#" className="text-gray-700 hover:text-aa-light-blue font-medium">
                  Plan travel
                </a>
                <a href="#" className="text-gray-700 hover:text-aa-light-blue font-medium">
                  Travel information
                </a>
                <a href="#" className="text-gray-700 hover:text-aa-light-blue font-medium">
                  AAdvantage®
                </a>
                <a href="/admin" className="text-gray-500 hover:text-aa-light-blue font-medium text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Admin
                </a>
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <div className="hidden md:flex items-center gap-1 text-sm">
                <span className="text-2xl">🇺🇸</span>
                <select className="border-none bg-transparent text-gray-700 cursor-pointer">
                  <option>English</option>
                </select>
              </div>

              {/* Search */}
              <div className="hidden md:flex items-center bg-gray-100 rounded px-3 py-2 gap-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search AA.com®"
                  className="bg-transparent border-none outline-none text-sm w-40"
                />
              </div>

              {/* Auth Buttons */}
              <button className="bg-aa-light-blue text-white px-6 py-2 rounded hover:bg-blue-600 transition">
                Log in
              </button>
              <button className="border-2 border-aa-light-blue text-aa-light-blue px-6 py-2 rounded hover:bg-aa-light-blue hover:text-white transition">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
