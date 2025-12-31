import React from 'react';

const OffersSection = () => {
  // Placeholder offers - these will be replaced with Marketing Cloud Personalization recommendations
  const offers = [
    {
      id: 1,
      title: 'Make waves in 2026',
      description: "Next year's hottest cruises are still available. Book now and earn AAdvantage® miles on every sailing.",
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=500&fit=crop',
      linkText: 'Search sailing dates',
      linkUrl: '#'
    },
    {
      id: 2,
      title: 'Slam dunk moments',
      description: 'Cheer for your favorite team — earn or use AAdvantage® miles on AAdvantage Events™ tickets',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=500&fit=crop',
      linkText: 'Search games and buy tickets',
      linkUrl: '#'
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
                <a
                  href={offer.linkUrl}
                  className="text-aa-light-blue hover:underline font-medium flex items-center gap-1"
                >
                  {offer.linkText}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
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
