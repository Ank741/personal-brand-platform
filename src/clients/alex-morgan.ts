import { ClientProfile } from '@/types/client';

export const alexMorganClient: ClientProfile = {
  id: 'alex-morgan',
  domain: 'alexmorgan.com',
  name: 'Alex Morgan',
  professionalTitle: 'Business Transformation Leader',
  headline: 'Navigating Enterprise Growth & Digital Modernization',
  subHeadline: 'Empowering Fortune 500 leadership to scale operations, modernize core infrastructure, and build high-performance organizations.',
  location: 'Chicago, IL',
  profileImage: '/clients/alex-morgan/profile/alex.jpg',
  shortBio: 'Executive strategist with 15+ years driving global enterprise transformation and operational excellence.',
  longBio: 'Alex Morgan specializes in guiding boardrooms and leadership teams through complex organizational pivots, merger integrations, and modern technology adoption. With a track record spanning major industrial sectors, Alex brings clarity to complex market shifts and builds resilient leadership frameworks.',

  brand: {
    accentColor: '#2563eb', // Executive Sapphire
    heroVariant: 'executive',
    aboutVariant: 'split',
    portfolioVariant: 'cards',
  },

  social: {
    linkedin: 'https://linkedin.com/in/fictional-alex-morgan',
    x: 'https://x.com/fictional_alexmorgan',
    email: 'alex.morgan@fictional-domain.com',
  },

  expertise: [
    {
      title: 'Enterprise Architecture & Scale',
      description: 'Designing sustainable operational frameworks that align business strategy with technological execution.',
    },
    {
      title: 'Change Governance & Leadership',
      description: 'Guiding global teams through structural pivots with clear communication and empathetic change management.',
    },
    {
      title: 'Strategic Capital Allocation',
      description: 'Optimizing portfolio investments to maximize long-term shareholder value and digital efficiency.',
    },
  ],

  achievements: [
    { value: '15+', label: 'Years Transformation Experience' },
    { value: '$450M+', label: 'Portfolio Modernization Value Created' },
    { value: '40+', label: 'Global Enterprise Initiatives Led' },
  ],

  ideas: [
    {
      title: 'The Blueprint for Legacy System Modernization',
      summary: 'How legacy enterprises can dismantle technical debt without interrupting business-critical operations.',
      category: 'Strategy',
      url: '#',
    },
    {
      title: 'Leadership Alignment in Times of Rapid Market Shifts',
      summary: 'Key consensus-building tactics for C-suite leaders navigating ambiguous industry headwinds.',
      category: 'Leadership',
      url: '#',
    },
  ],

  speaking: [
    {
      title: 'Keynote: Scalable Operational Excellence',
      description: 'Annual Executive Summit — Delivering actionable insights on modernizing supply chains and enterprise workflows.',
    },
    {
      title: 'Panel: The Next Decade of Corporate Agility',
      description: 'Global Business Leaders Forum — Strategies for fostering cross-functional alignment.',
    },
  ],

  videos: [
    {
      title: 'Fireside Chat: Enterprise Resilience in 2026',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
  ],

  portfolio: [
    {
      title: 'Global Supply Chain Modernization Framework',
      description: 'Redesigned core logistics tracking across 12 regional hubs, improving throughput by 34%.',
      url: '#',
    },
    {
      title: 'Post-Merger IT Integration Strategy',
      description: 'Harmonized dual enterprise architectures for a multi-billion dollar entity within 9 months.',
      url: '#',
    },
  ],

  courses: [],
  communities: [],

  contact: {
    email: 'alex.morgan@fictional-domain.com',
    location: 'Chicago, IL',
    contactFormEnabled: true,
  },

  seo: {
    title: 'Alex Morgan | Business Transformation Leader',
    description: 'Official website of Alex Morgan, executive strategist in enterprise transformation, digital scale, and operational excellence.',
    keywords: ['Business Transformation', 'Enterprise Leadership', 'Digital Modernization', 'Change Management'],
    ogImage: '/clients/alex-morgan/hero/og-image.png',
  },

  sections: {
    about: true,
    expertise: true,
    achievements: true,
    ideas: true,
    speaking: true,
    videos: true,
    courses: false, // Disabled for Alex
    communities: false, // Disabled for Alex
    portfolio: true,
    contact: true,
  },
};
