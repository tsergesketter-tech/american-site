import React from 'react';
import { Link } from 'react-router-dom';

const OffersSection = () => {
  // Placeholder offers - these will be replaced with Marketing Cloud Personalization recommendations
  const offers = [
    {
      id: 1,
      title: 'Earn up to 90,000 bonus miles',
      description: 'The new Citi® / AAdvantage® Globe™ card is here. Get 60,000 bonus miles after $3,000 spend, plus more.',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=500&fit=crop',
      linkText: 'Learn more about this card',
      linkUrl: '/credit-cards/aadvantage-citi'
    },
    {
      id: 2,
      title: 'Business travel, elevated',
      description: 'CitiBusiness® / AAdvantage® Platinum Select® card. Earn up to 75,000 bonus miles on business expenses.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop',
      linkText: 'Explore business card benefits',
      linkUrl: '/credit-cards/business'
    },
    {
      id: 3,
      title: 'Dine your way to more miles',
      description: 'Earn 2,000 AAdvantage® bonus miles after spending $50 by Jan. 7. Terms apply.',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=500&fit=crop',
      linkText: 'Join the AAdvantage Dining℠ program',
      linkUrl: '#'
    }
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <h2 className="text-3xl md:text-4xl font-light text-aa-blue mb-8">
          Today's offers
        </h2>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              {/* Offer Image */}
              <div className="h-56 overflow-hidden">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Offer Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {offer.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {offer.description}
                </p>
{offer.linkUrl.startsWith('/') ? (
                  <Link
                    to={offer.linkUrl}
                    className="text-aa-light-blue hover:underline font-medium flex items-center gap-1"
                  >
                    {offer.linkText}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                ) : (
                  <a
                    href={offer.linkUrl}
                    className="text-aa-light-blue hover:underline font-medium flex items-center gap-1"
                  >
                    {offer.linkText}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Personalization Note (will be removed later) */}
        <div className="mt-8 p-4 bg-blue-50 border-l-4 border-aa-light-blue rounded">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-aa-blue">Marketing Cloud Integration Point:</span> This section will be populated with personalized recommendations from Salesforce Marketing Cloud Personalization based on user behavior, preferences, and journey stage.
          </p>
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
