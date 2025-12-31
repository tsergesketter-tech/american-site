import React from 'react';
import { useNavigate } from 'react-router-dom';

const AAdvantageCitiCard = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block bg-aa-red text-white px-4 py-1 rounded text-sm font-semibold mb-4">
                LIMITED-TIME OFFER
              </div>
              <h1 className="text-5xl font-light mb-4">
                Earn up to 90,000 bonus miles
              </h1>
              <p className="text-xl mb-6 opacity-90">
                The new Citi® / AAdvantage® Globe™ card has landed
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Earn 60,000 bonus miles after spending $3,000 in first 3 months</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Plus 30,000 bonus miles after spending $10,000 total in first 12 months</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>$0 intro annual fee for the first 12 months, then $99</span>
                </li>
              </ul>
              <button className="bg-white text-blue-900 px-8 py-4 rounded font-semibold text-lg hover:bg-gray-100 transition">
                Apply Now
              </button>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                {/* Credit Card Visual */}
                <div className="w-full max-w-md mx-auto">
                  <div className="aspect-[1.586/1] bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-4 right-4 opacity-30">
                      <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    </div>
                    <div className="relative z-10">
                      <div className="text-white mb-8">
                        <div className="text-sm mb-1 opacity-80">AAdvantage®</div>
                        <div className="text-2xl font-bold">Globe™</div>
                      </div>
                      <div className="text-white mb-4">
                        <div className="text-xl tracking-wider mb-2">•••• •••• •••• 1234</div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-white">
                          <div className="text-xs opacity-80 mb-1">CARDHOLDER</div>
                          <div className="text-sm font-medium">YOUR NAME</div>
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

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-light text-gray-900 mb-8 text-center">Card Benefits</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-aa-light-blue" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Earn 2X Miles</h3>
            <p className="text-gray-600">
              Earn 2 AAdvantage® miles per $1 spent on eligible American Airlines purchases and on gas station and restaurant purchases
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-aa-light-blue" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">First Checked Bag Free</h3>
            <p className="text-gray-600">
              Save up to $120 per round trip with your first checked bag free on domestic American Airlines itineraries
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-aa-light-blue" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Preferred Boarding</h3>
            <p className="text-gray-600">
              Board in Group 5 on American Airlines flights, ensuring overhead bin space for your carry-on
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-aa-light-blue" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">No Foreign Transaction Fees</h3>
            <p className="text-gray-600">
              Use your card internationally without worrying about additional fees on foreign purchases
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-aa-light-blue" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Reduced Mileage Awards</h3>
            <p className="text-gray-600">
              Save 25% on AAdvantage® miles award redemptions when you book on aa.com for travel on American Airlines
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-aa-light-blue" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Premium Perks</h3>
            <p className="text-gray-600">
              Access to exclusive Citi Entertainment® presale tickets and special experiences
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-aa-blue text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-light mb-4">Ready to start earning?</h2>
          <p className="text-xl mb-8 opacity-90">
            Apply today and start your journey to more miles, more benefits, and more travel.
          </p>
          <button className="bg-white text-aa-blue px-8 py-4 rounded font-semibold text-lg hover:bg-gray-100 transition">
            Apply for the Card
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

export default AAdvantageCitiCard;
