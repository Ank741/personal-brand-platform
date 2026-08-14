import { ClientProfile } from '@/types/client';

export const alexMorganClient: ClientProfile = {
  id: 'alex-morgan',
  domain: 'alexmorgan.com',
  name: 'Alex Morgan',
  professionalTitle: 'Business Transformation Leader',
  headline: 'Navigating Enterprise Scale, Operating Strategy & Modernization',
  subHeadline: 'Advising executive boards and leadership teams on multi-market pivots, capital allocation, and resilient governance.',
  location: 'Chicago, IL',
  profileImage: '/clients/alex-morgan/profile/alex.jpg',
  shortBio: 'Executive strategist with 15+ years guiding Fortune 500 boards through complex organizational shifts and digital operating model modernization.',
  longBio: 'Alex Morgan operates at the intersection of enterprise architecture, operational governance, and technology investment strategy. Having led post-merger integrations and operating pivots across major industrial sectors, Alex brings structural clarity to complex market headwinds and aligns cross-functional leadership teams behind long-term enterprise value.',
  storyHeadline: 'Building Resilient Enterprises in Times of Rapid Industry Shifts',
  philosophyQuote: 'True organizational scale is not built by adding complexity, but by mastering operational clarity and aligning capital behind disciplined execution.',
  credibilityLabel: 'Verified Leadership Track Record',

  brand: {
    accentColor: '#2563eb', // Royal Executive Blue
    secondaryColor: '#0f172a',
    heroVariant: 'executive',
    aboutVariant: 'executive-split',
    expertiseVariant: 'editorial-list',
    achievementsVariant: 'executive-stats',
    portfolioVariant: 'case-study-cards',
  },

  social: {
    linkedin: 'https://linkedin.com/in/fictional-alex-morgan',
    x: 'https://x.com/fictional_alexmorgan',
    email: 'alex.morgan@fictional-domain.com',
  },

  expertise: [
    {
      title: 'Enterprise Operating Model Design',
      description: 'Designing sustainable operational frameworks that align multi-market business strategy with technology execution.',
    },
    {
      title: 'Change Governance & Leadership Alignment',
      description: 'Guiding C-suite executives through complex organizational pivots with structured change communication.',
    },
    {
      title: 'Post-Merger Integration & Optimization',
      description: 'Harmonizing legacy architectures, operational workflows, and team structures during large-scale enterprise mergers.',
    },
    {
      title: 'Strategic Capital & Asset Allocation',
      description: 'Evaluating technology investments and modernization programs to maximize long-term enterprise resilience.',
    },
  ],

  achievements: [
    { value: '15+', label: 'Years Advisory Experience', sublabel: 'Fortune 500 & Global Entities' },
    { value: '$450M+', label: 'Portfolio Value Impacted', sublabel: 'Operating & Digital Scale' },
    { value: '40+', label: 'Multi-Market Pivots Led', sublabel: 'Cross-functional Governance' },
    { value: '100%', label: 'Board Alignment Success', sublabel: 'Post-Merger Integrations' },
  ],

  ideas: [
    {
      title: 'The Blueprint for Legacy Infrastructure Modernization',
      summary: 'How established enterprises dismantle technical debt without interrupting business-critical operations.',
      category: 'Strategy & Scale',
      type: 'Article',
      date: 'January 2026',
      url: '#',
    },
    {
      title: 'C-Suite Consensus in Unpredictable Markets',
      summary: 'Tactics for building board alignment when navigating ambiguous macro-economic headwinds.',
      category: 'Executive Leadership',
      type: 'Perspective',
      date: 'Fall 2025',
      url: '#',
    },
  ],

  speaking: [
    {
      title: 'Keynote: Scalable Enterprise Governance',
      description: 'Global Business Summit — Delivering actionable insights on modernizing multi-national supply chains and operations.',
      location: 'Chicago, IL',
      date: 'Fall 2025',
      type: 'Keynote',
    },
    {
      title: 'Panel: The Next Decade of Corporate Agility',
      description: 'Executive Leadership Forum — Strategies for cross-functional alignment and rapid decision-making.',
      location: 'New York, NY',
      date: 'Spring 2025',
      type: 'Panel',
    },
  ],

  videos: [
    {
      title: 'Fireside Chat: Enterprise Operating Models in 2026',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: '24 mins',
      category: 'Keynote Interview',
    },
  ],

  portfolio: [
    {
      title: 'Multi-Market Logistics Modernization',
      description: 'Redesigned core supply chain operational architecture across 12 regional hubs, improving throughput and tracking clarity.',
      category: 'Operational Scale',
      metrics: '34% Throughput Gain',
      url: '#',
    },
    {
      title: 'Global Post-Merger Platform Integration',
      description: 'Harmonized dual enterprise technology infrastructures for a multi-billion dollar entity within a 9-month timeframe.',
      category: 'Mergers & Acquisitions',
      metrics: '$18M Efficiency Optimization',
      url: '#',
    },
  ],

  courses: [],
  communities: [],

  contact: {
    email: 'alex.morgan@fictional-domain.com',
    location: 'Chicago, IL',
    contactFormEnabled: true,
    officeHours: 'Mon-Thu by Appointment',
  },

  seo: {
    title: 'Alex Morgan | Business Transformation Leader',
    description: 'Official website of Alex Morgan, executive strategy advisor specializing in enterprise operating models and digital scale.',
    keywords: ['Business Transformation', 'Enterprise Leadership', 'Digital Modernization', 'Executive Strategy'],
    ogImage: '/clients/alex-morgan/hero/og-image.png',
  },

  sections: {
    about: true,
    expertise: true,
    achievements: true,
    ideas: true,
    speaking: true,
    videos: true,
    courses: false,
    communities: false,
    portfolio: true,
    contact: true,
  },
};
