import React from 'react';

const AAdvantageBusinessCard = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block bg-aa-red text-white px-4 py-1 rounded text-sm font-semibold mb-4">
                BUSINESS EXCLUSIVE
              </div>
              <h1 className="text-5xl font-light mb-4">
                CitiBusiness® / AAdvantage® Platinum Select®
              </h1>
              <p className="text-xl mb-6 opacity-90">
                Earn up to 75,000 American Airlines AAdvantage® bonus miles
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>50,000 bonus miles after $3,000 in purchases within first 3 months</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Plus 25,000 bonus miles when you fly 25,000 miles in first 12 months</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>$99 annual fee, waived for the first 12 months</span>
                </li>
              </ul>
              <button className="bg-white text-gray-900 px-8 py-4 rounded font-semibold text-lg hover:bg-gray-100 transition">
                Apply Now
              </button>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                {/* Business Card Visual */}
                <div className="w-full max-w-md mx-auto">
                  <div className="aspect-[1.586/1] bg-gradient-to-br from-gray-600 via-gray-700 to-gray-900 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-4 right-4 opacity-20">
                      <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                      </svg>
                    </div>
                    <div className="relative z-10">
                      <div className="text-white mb-8">
                        <div className="text-sm mb-1 opacity-80">CitiBusiness®</div>
                        <div className="text-xl font-bold">AAdvantage® Platinum Select®</div>
                      </div>
                      <div className="text-white mb-4">
                        <div className="text-xl tracking-wider mb-2">•••• •••• •••• 5678</div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-white">
                          <div className="text-xs opacity-80 mb-1">BUSINESS NAME</div>
                          <div className="text-sm font-medium">YOUR COMPANY</div>
                        </div>
                        <div className="text-white text-right">
                          <svg className="w-12 h-8" fill="currentColor" viewBox="0 0 48 32">
                            <circle cx="15" cy="16" r="14" opacity="0.8"/>
                            <circle cx="33" cy="16" r="14" opacity="0.8"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Business Benefits */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-light text-gray-900 mb-8 text-center">Business Travel Benefits</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg p-8 shadow-md border-l-4 border-aa-blue">
            <h3 className="text-2xl font-semibold mb-4">Earn More on Business Expenses</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-aa-light-blue flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>2 AAdvantage® miles per $1 spent on eligible American Airlines purchases</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-aa-light-blue flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>2 miles per $1 on eligible purchases at gas stations, restaurants, and telecom merchants</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-aa-light-blue flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>1 mile per $1 on all other eligible purchases</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-md border-l-4 border-gray-700">
            <h3 className="text-2xl font-semibold mb-4">Premium Travel Perks</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-aa-light-blue flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>First checked bag free for you and up to 8 employees on the same reservation</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-aa-light-blue flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Preferred boarding on American Airlines (Group 5)</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-aa-light-blue flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>25% savings on inflight food and beverage purchases</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Additional Features */}
        <div className="bg-gradient-to-r from-blue-50 to-gray-50 rounded-lg p-8">
          <h3 className="text-2xl font-semibold mb-6 text-center">Why Business Owners Choose This Card</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-aa-blue mb-2">$99</div>
              <div className="text-sm text-gray-600">Annual fee waived first year</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-aa-blue mb-2">0%</div>
              <div className="text-sm text-gray-600">Foreign transaction fees</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-aa-blue mb-2">25%</div>
              <div className="text-sm text-gray-600">Discount on award travel</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-light mb-4">Elevate Your Business Travel</h2>
          <p className="text-xl mb-8 opacity-90">
            Turn business expenses into miles and premium travel benefits.
          </p>
          <button className="bg-aa-light-blue text-white px-8 py-4 rounded font-semibold text-lg hover:bg-blue-600 transition">
            Apply for Business Card
          </button>
          <p className="text-sm mt-6 opacity-75">
            Terms and conditions apply. Subject to credit approval.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong>Disclaimer:</strong> This is a demonstration page created for Salesforce Marketing Cloud purposes only. This is not an official Citi or American Airlines credit card offer. All card benefits, terms, and bonus mile amounts are fictional and for demonstration purposes only. For actual credit card offers, please visit the official American Airlines or Citi websites.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AAdvantageBusinessCard;
