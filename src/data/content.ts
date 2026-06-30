// ─────────────────────────────────────────────────────────────────────────────
// Central content model for Hexa Space.
// Pricing & inclusions are editable here in one place; pages render from this.
// ─────────────────────────────────────────────────────────────────────────────

export type Workspace = {
  slug: string;
  name: string;
  price: string;
  unit: string;
  tagline: string;
  description: string;
  capacity: string;
  image: string;
  inclusions: string[];
  /** inherits the inclusions of the tier below it (shown as "Everything in X, plus") */
  inherits?: string;
};

export const WORKSPACES: Workspace[] = [
  {
    slug: 'virtual-office',
    name: 'Virtual Office',
    price: 'From $75',
    unit: '/ month',
    tagline: 'A prestigious presence, without the desk.',
    description:
      'Establish your business at one of Box Hill’s most recognised addresses — with mail, meetings and the Hexa community on call whenever you need them.',
    capacity: 'Address only',
    image: '/photos/reception.jpg',
    inclusions: [
      'Prestigious Level 4, 830 Whitehorse Road business address',
      'Use of address for ASIC & business registration',
      'Mail & parcel receipt and handling',
      'Pay-as-you-go meeting room access at member rates',
      'Discounted event & studio hire',
      'Invitations to member community events',
    ],
  },
  {
    slug: 'flexible-desk',
    name: 'Flexible Desk',
    price: 'From $350',
    unit: '/ month',
    tagline: 'Work anywhere on the floor, around the clock.',
    description:
      'The freedom of the whole space. Settle wherever the day takes you — a quiet corner, the members lounge, or a sunlit bench by the window.',
    capacity: '1 person',
    image: '/photos/flexible-desk.jpg',
    inclusions: [
      '24/7 secure access',
      'Hot desking across all flexible areas',
      'High-speed business-grade Wi-Fi',
      'Members lounge & breakout spaces',
      '2 hours of meeting room credit each month',
      'Barista-style coffee, tea & filtered water',
      'End-of-trip facilities — showers & lockers',
      'Community events & programming',
    ],
  },
  {
    slug: 'dedicated-desk',
    name: 'Dedicated Desk',
    price: 'From $500',
    unit: '/ month',
    tagline: 'Your own desk, exactly as you left it.',
    description:
      'A permanent home base in the shared space — a desk that’s yours alone, with somewhere to lock your work away at the end of the day.',
    capacity: '1 person',
    image: '/photos/dedicated-desk.jpg',
    inherits: 'Flexible Desk',
    inclusions: [
      'Your own permanent, reserved desk',
      'Lockable storage pedestal',
      'Ergonomic chair & sit-stand option',
      'Business address & mail handling included',
      '5 hours of meeting room credit each month',
      'Personalised name plate',
    ],
  },
  {
    slug: 'private-office',
    name: 'Private Office',
    price: 'On application',
    unit: '',
    tagline: 'A room of your own, bathed in natural light.',
    description:
      'Architecturally designed private offices framed by floor-to-ceiling windows — lockable, configurable and ready for teams of two to twenty.',
    capacity: '2 – 20 people',
    image: '/photos/private-office.jpg',
    inherits: 'Dedicated Desk',
    inclusions: [
      'Lockable, fully furnished private office',
      'Floor-to-ceiling windows & natural light',
      'Configurable for 2 – 20 people',
      'Premium ergonomic furniture',
      'Optional branding on your door',
      '10 hours of meeting room credit each month',
      'Priority event & studio booking',
    ],
  },
  {
    slug: 'enterprise-suites',
    name: 'Enterprise Suites',
    price: 'On application',
    unit: '',
    tagline: 'A self-contained home for an established team.',
    description:
      'Sophisticated, fully contained suites offering complete privacy and independence — tailored to the way your organisation works.',
    capacity: '20+ people',
    image: '/photos/enterprise.jpg',
    inherits: 'Private Office',
    inclusions: [
      'Self-contained, customisable suite',
      'Bespoke fit-out & space planning',
      'Dedicated, secure entrance',
      'Private amenities & kitchenette options',
      'Bespoke IT, AV & network configuration',
      'Dedicated account manager',
      'Scalable across multiple floors',
    ],
  },
];

// Inclusions shared by every desk & office membership
export const COMMON_INCLUSIONS = [
  'Business-grade high-speed Wi-Fi',
  'Barista-style coffee & curated tea',
  'Daily cleaning & professionally maintained spaces',
  'Staffed reception & front-of-house',
  'End-of-trip facilities',
  'Members app for bookings & access',
];

export type MeetingRoom = {
  name: string; // SKY
  alt: string; // 天 Tian
  note?: string; // e.g. "Consulting Room"
  capacity: string; // "Up to 4 guests"
  price: string; // "$20 +GST / hour"
  features: string[];
  image: string;
};

export type Space = {
  slug: string;
  name: string;
  kicker: string;
  capacity: string;
  /** short tagline used on the overview card / dropdown */
  summary: string;
  description: string;
  image: string;
  inclusions: string[];
  /** longer lead paragraph for the detail page */
  intro: string;
  /** layout options shown on the detail page */
  configurations?: { layout: string; capacity: string }[];
  /** individually bookable rooms (meeting rooms) */
  rooms?: MeetingRoom[];
  gallery?: string[];
  /** label for the primary action on the detail page */
  bookingLabel: string;
};

export const SPACES: Space[] = [
  {
    slug: 'function-space',
    name: 'The Function Space',
    kicker: 'Events · 20 – 100 guests',
    capacity: '20 – 100 guests',
    summary: 'Launches, dinners & conferences',
    description:
      'A versatile, light-filled venue framed by the Box Hill skyline — built for launches, seminars, conferences and celebrations. Configure it cocktail, seminar, classroom or boardroom, and let our team handle the rest.',
    intro:
      'Hexa Space’s function space is Box Hill’s most considered address for gathering. Floor-to-ceiling windows frame the skyline, the room reconfigures to whatever the occasion asks of it, and a dedicated coordinator manages every detail — from AV and staging to catering and bar. Whether it’s a 20-person board dinner or a 100-guest product launch, you arrive to a room that’s ready.',
    image: '/photos/event-space.jpg',
    configurations: [
      { layout: 'Cocktail', capacity: 'Up to 100' },
      { layout: 'Seminar', capacity: 'Up to 80' },
      { layout: 'Classroom', capacity: 'Up to 45' },
      { layout: 'Boardroom', capacity: 'Up to 26' },
    ],
    inclusions: [
      'Flexible layouts — cocktail, seminar, classroom & boardroom',
      'Full PA, microphones & large-format display screens',
      'Staging & feature lighting options',
      'In-house or external catering & bar service',
      'Dedicated event coordinator',
      'Skyline views & abundant natural light',
      'High-speed Wi-Fi & on-site technical support',
      'Flexible half-day, full-day & evening hire',
    ],
    gallery: ['/photos/event-space.jpg', '/photos/function-2.jpg', '/photos/function-3.jpg'],
    bookingLabel: 'Enquire about your event',
  },
  {
    slug: 'meeting-rooms',
    name: 'Meeting Rooms',
    kicker: 'Meetings · 4 – 12 guests',
    capacity: '4 – 12 guests',
    summary: 'Six named rooms, by the hour',
    description:
      'Six individually named rooms — from an intimate consulting room to a traditional Chinese tearoom — each with floor-to-ceiling windows and broadcast-quality conferencing, bookable by the hour.',
    intro:
      'A meeting room should make the work easier, not harder. Each of ours carries its own name and character, drawn from the four directions and the elements — light-filled and quiet, wired for effortless video conferencing, and bookable by the hour straight from the members app. Coffee, premium tea and catering arrive without you having to ask.',
    image: '/photos/meeting-room.jpg',
    inclusions: [
      'Six individually named, bookable rooms',
      'Floor-to-ceiling windows & natural light',
      'State-of-the-art presentation & video-conferencing',
      'Hourly booking via the members app',
      'Unlimited premium tea, artisan coffee & filtered water',
      'Curated catering on request',
    ],
    rooms: [
      {
        name: 'Sky',
        alt: '天 Tian',
        note: 'Consulting Room',
        capacity: 'Up to 4 guests',
        price: '$20 +GST / hour',
        image: '/photos/room-sky.jpg',
        features: [
          'A calm consulting room, furnished for focused one-on-one conversations',
          'A layout designed to put clients at ease',
          'Premium tea, artisan coffee & filtered water',
        ],
      },
      {
        name: 'Earth',
        alt: '地 Di',
        capacity: 'Up to 4 guests',
        price: '$20 +GST / hour',
        image: '/photos/room-earth.jpg',
        features: [
          'Elegant furnishings for a professional, comfortable atmosphere',
          'Flipchart for capturing ideas and brainstorming',
          'Curated catering options on request',
          'Unlimited premium tea, artisan coffee & filtered water',
        ],
      },
      {
        name: 'North',
        alt: '北 Bei',
        capacity: 'Up to 8 guests',
        price: '$80 +GST / hour',
        image: '/photos/room-north.jpg',
        features: [
          'State-of-the-art presentation & video-conferencing',
          'Floor-to-ceiling windows showering the room in natural light',
          'Inspired meeting-room furnishings',
          'Curated catering on request',
          'Unlimited tea, great coffee & filtered water',
        ],
      },
      {
        name: 'South',
        alt: '南 Nan',
        capacity: 'Up to 8 guests',
        price: '$80 +GST / hour',
        image: '/photos/room-south.jpg',
        features: [
          'State-of-the-art presentation & video-conferencing',
          'Floor-to-ceiling windows showering the room in natural light',
          'Inspired meeting-room furnishings',
          'Curated catering on request',
          'Unlimited tea, great coffee & filtered water',
        ],
      },
      {
        name: 'East',
        alt: '东 Dong',
        note: 'Chinese Tearoom',
        capacity: 'Up to 8 guests',
        price: '$120 +GST / hour',
        image: '/photos/room-east.jpg',
        features: [
          'Styled as a traditional Chinese tearoom, with tea facilities integrated',
          '“Guests come from afar and meet over tea” — a room made for hospitality',
          'State-of-the-art presentation & video-conferencing',
          'Floor-to-ceiling windows & natural light',
          'Curated catering on request',
          'Unlimited tea, great coffee & filtered water',
        ],
      },
      {
        name: 'West',
        alt: '西 Xi',
        capacity: 'Up to 10 guests · 12 central',
        price: '$80 +GST / hour',
        image: '/photos/room-west.jpg',
        features: [
          'Boardroom table seating six, plus tiered seating for four with laptop desks',
          'Comfortable for up to twelve in a central configuration',
          'State-of-the-art presentation & video-conferencing',
          'Floor-to-ceiling windows & natural light',
          'Curated catering on request',
          'Unlimited tea, great coffee & filtered water',
        ],
      },
    ],
    gallery: ['/photos/room-north.jpg', '/photos/room-east.jpg', '/photos/room-west.jpg'],
    bookingLabel: 'Book a meeting room',
  },
  {
    slug: 'media-studios',
    name: 'Media Studios',
    kicker: 'Create · Photo & video',
    capacity: 'Photo · Video',
    summary: 'Shoot, light & edit on demand',
    description:
      'Purpose-built studios for photography, video and content — professional lighting and equipment available on demand, by the hour.',
    intro:
      'Content shouldn’t mean booking an external studio across town. Ours sits a few steps from your desk — professional lighting, a choice of backdrops, camera and audio gear to hire, and editing bays to finish the job. Shoot a product range, a brand film or a week of social content, then walk back to your office.',
    image: '/photos/media-1.jpg',
    inclusions: [
      'Professional lighting rigs',
      'Paper & fabric backdrop options',
      'Camera, lens & audio equipment hire',
      'Green screen capability',
      'On-site editing bays',
      'Hourly or day-rate booking',
    ],
    gallery: ['/photos/media-1.jpg', '/photos/media-2.jpg', '/photos/media-3.jpg'],
    bookingLabel: 'Book a studio',
  },
  {
    slug: 'podcast-studio',
    name: 'The Podcast Studio',
    kicker: 'New · Record & publish',
    capacity: 'Up to 4 guests',
    summary: 'Broadcast-ready, soundproofed',
    description:
      'A broadcast-ready, soundproofed studio for podcasting, interviews and long-form conversation — record, edit and publish entirely in-house.',
    intro:
      'A broadcast-ready studio inside Hexa Space — soundproofed, beautifully lit and equipped for podcasting, interviews and long-form conversation. Record with up to four around the table, then hand it to our in-house team to edit, master and publish. It’s also where we record the Hexa Space podcast.',
    image: '/photos/podcast-studio.jpg',
    inclusions: [
      'Acoustically treated, soundproofed room',
      'Broadcast microphones & mixing console',
      'Multi-camera video recording',
      'Seating for up to four guests',
      'In-house editing & post-production',
      'Publishing & distribution support',
    ],
    gallery: ['/photos/podcast-studio.jpg', '/photos/gallery-2.jpg', '/photos/lounge-2.jpg'],
    bookingLabel: 'Book the studio',
  },
];

export type Episode = {
  number: number;
  title: string;
  guest: string;
  role: string;
  duration: string;
  blurb: string;
  image: string;
};

export const EPISODES: Episode[] = [
  {
    number: 7,
    title: 'Building a brand worth belonging to',
    guest: 'Coming soon',
    role: 'Founder & creative director',
    duration: '48 min',
    blurb:
      'On the difference between a logo and a world — and why the best brands are the ones people want to be part of.',
    image: '/photos/gallery-1.jpg',
  },
  {
    number: 6,
    title: 'Designing for focus',
    guest: 'Coming soon',
    role: 'Workplace architect',
    duration: '52 min',
    blurb:
      'How light, acoustics and proportion quietly shape the way we think, meet and do our best work.',
    image: '/photos/gallery-2.jpg',
  },
  {
    number: 5,
    title: 'The new geography of work',
    guest: 'Coming soon',
    role: 'Founder, technology',
    duration: '41 min',
    blurb:
      'Why Box Hill — and what it means to build a global business from Melbourne’s east.',
    image: '/photos/gallery-3.jpg',
  },
];

export const PLATFORMS = ['Spotify', 'Apple Podcasts', 'YouTube', 'Pocket Casts'];

export type MembershipBenefit = {
  title: string;
  copy: string;
};

export const MEMBERSHIP_BENEFITS: MembershipBenefit[] = [
  {
    title: 'A global network',
    copy: 'Through our Ucommune partnership, your membership opens the door to a network of workspaces across Australia, China and beyond — desk space wherever business takes you.',
  },
  {
    title: 'The members lounge',
    copy: 'A hosted lounge to meet, work and unwind — espresso in the morning, somewhere considered to take a call, and the quiet hum of good company.',
  },
  {
    title: 'Meeting & event credits',
    copy: 'Every desk and office membership includes monthly meeting room credit, with member rates on the function space, media and podcast studios.',
  },
  {
    title: 'Community & programming',
    copy: 'A year-round calendar of events, workshops and conversations — and a podcast that puts the people on our floor at the centre of the story.',
  },
  {
    title: 'Business address & mail',
    copy: 'A prestigious Box Hill address for your business registration and correspondence, with mail and parcels received and handled by our front desk.',
  },
  {
    title: 'Hospitality, handled',
    copy: 'Staffed reception, daily cleaning, end-of-trip facilities and a members app for access and bookings — the everyday, quietly taken care of.',
  },
];
