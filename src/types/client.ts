export interface ExpertiseItem {
  title: string;
  description: string;
}

export interface AchievementItem {
  value: string;
  label: string;
}

export interface IdeaItem {
  title: string;
  summary: string;
  image?: string;
  url?: string;
  category?: string;
}

export interface SpeakingItem {
  title: string;
  description: string;
  image?: string;
}

export interface VideoItem {
  title: string;
  thumbnail?: string;
  youtubeUrl: string;
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
}

export interface PortfolioItem {
  title: string;
  image?: string;
  description: string;
  url?: string;
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
  heroVariant?: 'executive' | 'modern' | 'minimal' | string;
  aboutVariant?: 'split' | 'centered' | 'narrative' | string;
  portfolioVariant?: 'grid' | 'cards' | 'list' | string;
}

export interface ClientContact {
  email: string;
  location?: string;
  contactFormEnabled: boolean;
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

  // Brand Styling & Layout Variants
  brand: ClientBrand;

  // Social Links
  social: ClientSocials;

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
