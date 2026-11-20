// Demo-only "next best offer" engine. All data is fictional.

export const MEMBER = {
  firstName: 'Jordan',
  status: 'AAdvantage Gold',
  homeAirport: 'DFW',
  milesBalance: 42300,
  hasCobrandCard: false,
};

const DESTINATIONS = {
  PHX: {
    code: 'PHX',
    city: 'Phoenix',
    match: ['phoenix', 'phx', 'scottsdale', 'arizona', 'sky harbor', 'tempe'],
    awardMiles: 15000,
    weeklyFlights: 84,
    region: 'domestic',
  },
  MIA: {
    code: 'MIA',
    city: 'Miami',
    match: ['miami', 'mia', 'south beach', 'florida'],
    awardMiles: 15000,
    weeklyFlights: 98,
    region: 'domestic',
  },
  LAX: {
    code: 'LAX',
    city: 'Los Angeles',
    match: ['los angeles', 'lax', 'la ', 'california', 'santa monica'],
    awardMiles: 20000,
    weeklyFlights: 112,
    region: 'domestic',
  },
  LHR: {
    code: 'LHR',
    city: 'London',
    match: ['london', 'lhr', 'heathrow', 'england', 'uk'],
    awardMiles: 60000,
    weeklyFlights: 28,
    region: 'international',
  },
  CUN: {
    code: 'CUN',
    city: 'Cancún',
    match: ['cancun', 'cancún', 'cun', 'mexico', 'riviera maya'],
    awardMiles: 30000,
    weeklyFlights: 56,
    region: 'international',
  },
};

const CARDS = {
  platinum: {
    product: 'Citi® / AAdvantage® Platinum Select®',
    shortName: 'Platinum Select',
    bonusMiles: 75000,
    spend: '$3,500 in the first 4 months',
    annualFee: '$0 intro annual fee, then $99',
    perks: ['First checked bag free', 'Preferred boarding', '2X miles on American purchases'],
    linkUrl: '/credit-cards/aadvantage-citi',
    art: 'silver',
  },
  globe: {
    product: 'Citi® / AAdvantage® Globe™',
    shortName: 'Globe',
    bonusMiles: 90000,
    spend: '$5,000 in the first 4 months',
    annualFee: '$350 annual fee',
    perks: ['4 Admirals Club® passes a year', 'No foreign transaction fees', '3X miles on American purchases'],
    linkUrl: '/credit-cards/aadvantage-citi',
    art: 'navy',
  },
};

const fmt = (n) => n.toLocaleString('en-US');

export const SUGGESTIONS = [
  "What's the best promotion for me traveling to Phoenix?",
  'I’m heading to London this spring. Any offers?',
  'How can I earn miles faster for a Miami trip?',
  'Show me offers for a family trip to Cancún',
];

export const findDestination = (text) => {
  const q = ` ${text.toLowerCase()} `;
  return Object.values(DESTINATIONS).find((d) => d.match.some((m) => q.includes(m))) || null;
};

// Returns { steps, reply, offers } for a member question.
export const recommend = (text) => {
  const dest = findDestination(text);

  if (!dest) {
    return {
      steps: ['Reviewed your AAdvantage profile', 'Checked open promotions'],
      reply:
        'Tell me where you’re headed and I’ll match the offer with the most value for that trip. Meanwhile, here’s the strongest offer on your account today.',
      offers: [cardOffer(CARDS.platinum, null)],
    };
  }

  const card = dest.region === 'international' ? CARDS.globe : CARDS.platinum;
  const primary = cardOffer(card, dest);
  const tripsCovered = Math.floor((MEMBER.milesBalance + card.bonusMiles) / dest.awardMiles);

  return {
    steps: [
      `Reviewed your ${MEMBER.status} profile and ${fmt(MEMBER.milesBalance)}-mile balance`,
      `Found ${dest.weeklyFlights} weekly flights ${MEMBER.homeAirport}–${dest.code}`,
      `Ranked 14 eligible offers for ${dest.city}`,
    ],
    reply: `For ${dest.city}, the ${card.shortName} card is your best offer. The welcome bonus plus your current balance covers about ${tripsCovered} round-trip award tickets from ${MEMBER.homeAirport}, and you don’t hold an AAdvantage® card yet, so you’re eligible.`,
    offers: [primary, ...companionOffers(dest)],
  };
};

const cardOffer = (card, dest) => {
  const total = MEMBER.milesBalance + card.bonusMiles;
  return {
    id: `card-${card.shortName}-${dest ? dest.code : 'any'}`,
    kind: 'card',
    rank: 1,
    eyebrow: 'Best match',
    title: `Earn ${fmt(card.bonusMiles)} bonus miles`,
    product: card.product,
    terms: `After ${card.spend}. ${card.annualFee}.`,
    perks: card.perks,
    art: card.art,
    linkUrl: card.linkUrl,
    cta: 'Apply now',
    stats: dest
      ? [
          { label: 'Bonus miles', value: fmt(card.bonusMiles) },
          { label: 'Your balance after', value: fmt(total) },
          { label: `Round trips to ${dest.code}`, value: `${Math.floor(total / dest.awardMiles)}` },
        ]
      : [
          { label: 'Bonus miles', value: fmt(card.bonusMiles) },
          { label: 'Your balance after', value: fmt(total) },
        ],
  };
};

const companionOffers = (dest) => [
  {
    id: `fare-${dest.code}`,
    kind: 'flight',
    eyebrow: 'Flight promo',
    title: `2X miles on ${MEMBER.homeAirport}–${dest.code}`,
    body: `Book a round trip to ${dest.city} by Nov. 30 and earn double base miles on travel through Feb. 28.`,
    route: { from: MEMBER.homeAirport, to: dest.code },
    cta: 'Search flights',
    linkUrl: '/',
  },
  {
    id: `hotel-${dest.code}`,
    kind: 'hotel',
    eyebrow: 'AAdvantage Hotels℠',
    title: `Up to 10 miles per $1 in ${dest.city}`,
    body: `Stack hotel miles on your ${dest.city} stay. Gold members earn an extra 1,000 miles on 3+ night bookings.`,
    cta: 'Browse hotels',
    linkUrl: '#',
  },
];

export const ALL_PROMOTIONS = [
  {
    id: 'p1',
    category: 'Credit cards',
    title: 'Earn 75,000 bonus miles',
    body: 'Citi® / AAdvantage® Platinum Select® card. $0 intro annual fee for the first year.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop',
    linkUrl: '/credit-cards/aadvantage-citi',
  },
  {
    id: 'p2',
    category: 'Credit cards',
    title: 'Business travel, elevated',
    body: 'CitiBusiness® / AAdvantage® Platinum Select®. Earn up to 75,000 bonus miles.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop',
    linkUrl: '/credit-cards/business',
  },
  {
    id: 'p3',
    category: 'Flights',
    title: 'Winter sun: fares from $129',
    body: 'One-way Main Cabin fares to Phoenix, Tucson and Palm Springs. Book by Nov. 30.',
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&h=500&fit=crop',
    linkUrl: '/',
  },
  {
    id: 'p4',
    category: 'Flights',
    title: 'Fly to London for 20% fewer miles',
    body: 'MileSAAver® awards to Heathrow on select dates in January and February.',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=500&fit=crop',
    linkUrl: '/',
  },
  {
    id: 'p5',
    category: 'Hotels & cars',
    title: '3,000 bonus miles on car rentals',
    body: 'Rent for 4+ days with Avis® or Budget® at participating airport locations.',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=500&fit=crop',
    linkUrl: '#',
  },
  {
    id: 'p6',
    category: 'AAdvantage',
    title: 'Dine your way to more miles',
    body: 'Earn 2,000 bonus miles after spending $50 with AAdvantage Dining℠. Terms apply.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=500&fit=crop',
    linkUrl: '#',
  },
];
