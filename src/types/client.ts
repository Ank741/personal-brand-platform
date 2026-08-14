export interface ExpertiseItem {
  title: string;
  description: string;
}

export interface AchievementItem {
  value: string;
  label: string;
  sublabel?: string;
}

export interface IdeaItem {
  title: string;
  summary: string;
  image?: string;
  url?: string;
  category?: string;
  type?: 'Article' | 'LinkedIn Post' | 'Research' | 'Podcast' | 'Perspective' | string;
  date?: string;
}

export interface SpeakingItem {
  title: string;
  description: string;
  image?: string;
  date?: string;
  location?: string;
  type?: 'Keynote' | 'Panel' | 'Moderation' | 'Podcast' | string;
}

export interface VideoItem {
  title: string;
  thumbnail?: string;
  youtubeUrl: string;
  duration?: string;
  category?: string;
}

export interface CourseItem {
  title: string;
  platform: string;
  image?: string;
  description: string;
  url?: string;
}

export interface CommunityItem {
  name: string;
  description: string;
  image?: string;
  url?: string;
  role?: string;
}

export interface PortfolioItem {
  title: string;
  image?: string;
  description: string;
  url?: string;
  category?: string;
  metrics?: string;
}

export interface ClientSocials {
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  x?: string;
  email?: string;
}

export interface ClientBrand {
  accentColor: string;
  secondaryColor?: string;
  heroVariant: 'executive' | 'modern';
  aboutVariant?: 'executive-split' | 'modern-narrative';
  expertiseVariant?: 'editorial-list' | 'cards-grid';
  achievementsVariant?: 'executive-stats' | 'modern-strip';
  portfolioVariant?: 'case-study-cards' | 'minimal-grid';
}

export interface ClientContact {
  email: string;
  location?: string;
  contactFormEnabled: boolean;
  officeHours?: string;
}

export interface ClientSEO {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

export interface ClientSectionVisibility {
  about: boolean;
  expertise: boolean;
  achievements: boolean;
  ideas: boolean;
  speaking: boolean;
  videos: boolean;
  courses: boolean;
  communities: boolean;
  portfolio: boolean;
  contact: boolean;
}

export interface ClientProfile {
  // Identity
  id: string;
  domain: string;
  name: string;
  professionalTitle: string;
  headline: string;
  subHeadline: string;
  location: string;
  profileImage?: string;
  shortBio: string;
  longBio: string;
  storyHeadline?: string;
  philosophyQuote?: string;

  // Brand Styling & Layout Variants
  brand: ClientBrand;

  // Social Links
  social: ClientSocials;

  // Credibility Header Label
  credibilityLabel?: string;

  // Content Sections
  expertise?: ExpertiseItem[];
  achievements?: AchievementItem[];
  ideas?: IdeaItem[];
  speaking?: SpeakingItem[];
  videos?: VideoItem[];
  courses?: CourseItem[];
  communities?: CommunityItem[];
  portfolio?: PortfolioItem[];

  // Contact Info
  contact: ClientContact;

  // SEO Info
  seo: ClientSEO;

  // Section Visibility Toggles
  sections: ClientSectionVisibility;
}
