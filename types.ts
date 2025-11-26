// Domain models

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Remote' | 'On-site' | 'Hybrid';
  salary: string;
  tags: string[];
}

export interface University {
  id: string;
  name: string;
  country: string;
  ranking: number;
  tuition: string;
  image: string;
}

export interface CountryProfile {
  id: string;
  name: string;
  capital: string;
  currency: string;
  avgCostOfLiving: string;
  safetyIndex: number; // 1-100
  topIndustries: string[];
  image: string;
}

export interface AITool {
  id: string;
  name: string;
  category: string;
  description: string;
  pricing: 'Free' | 'Freemium' | 'Paid';
  rating: number;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
}

export interface FreelanceGig {
  id: string;
  title: string;
  freelancer: string;
  rating: number;
  price: string;
  image: string;
  category: string;
}

export interface Consultant {
  id: string;
  name: string;
  expertise: string;
  rating: number;
  rate: string;
  image: string;
  verified: boolean;
}

// CMS Types

export interface PageMeta {
  title: string;
  description: string;
  keywords: string[];
}

export interface CMSPage {
  id: string; // slug
  title: string;
  content: string; // markdown
  excerpt: string;
  meta: PageMeta;
  published: boolean;
  featuredImage?: string;
  authorId: string;
  updatedAt: string; // ISO string
  version: number;
}

export interface CMSPageHistory {
  version: number;
  content: string;
  changedBy: string;
  timestamp: string;
}

// Collections supported by admin + Firebase services
export type CollectionType =
  | 'pages'
  | 'jobs'
  | 'universities'
  | 'countries'
  | 'scholarships'
  | 'ai_tools'
  | 'courses'
  | 'freelance_gigs'
  | 'consultants';

// Routing enum

export enum AppRoute {
  DASHBOARD = '/',
  STUDY_ABROAD = '/study-abroad',
  JOBS = '/jobs',
  INTERNSHIPS = '/internships',
  FREELANCE = '/freelance',
  COUNTRIES = '/countries',
  AI_MARKETPLACE = '/ai-tools',
  LEARNING = '/learning',
  CONSULTANTS = '/consultants',
  ABOUT = '/about',
  ADMIN = '/admin',
  DYNAMIC_PAGE = '/p/:slug',
  CONTACT = '/contact',
  PRIVACY = '/privacy',
  TERMS = '/terms',
  HELP = '/help',
  SUCCESS_STORIES = '/success-stories',
  PARTNER_WITH_US = '/partner-with-us',
}
