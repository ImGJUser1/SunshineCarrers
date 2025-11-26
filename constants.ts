import { Job, University, CountryProfile, AITool, Course, FreelanceGig, Consultant } from './types';

export const FEATURED_JOBS: Job[] = [
  { id: '1', title: 'Senior React Developer', company: 'TechFlow', location: 'Remote', type: 'Remote', salary: '₹25L - ₹35L', tags: ['React', 'TypeScript'] },
  { id: '2', title: 'AI Research Intern', company: 'DeepMind', location: 'London, UK', type: 'On-site', salary: '₹1.5L/mo', tags: ['Python', 'PyTorch'] },
  { id: '3', title: 'Product Manager', company: 'Spotify', location: 'Mumbai, India', type: 'Hybrid', salary: '₹40L+', tags: ['Agile', 'Strategy'] },
  { id: '4', title: 'Frontend Engineer', company: 'Airbnb', location: 'Remote', type: 'Remote', salary: '₹30L - ₹50L', tags: ['Vue', 'Design Systems'] },
];

export const TOP_UNIVERSITIES: University[] = [
  { id: '1', name: 'Massachusetts Institute of Technology (MIT)', country: 'USA', ranking: 1, tuition: '₹48 Lakh/yr', image: 'https://picsum.photos/400/200?random=1' },
  { id: '2', name: 'University of Cambridge', country: 'UK', ranking: 2, tuition: '₹32 Lakh/yr', image: 'https://picsum.photos/400/200?random=2' },
  { id: '3', name: 'University of Toronto', country: 'Canada', ranking: 21, tuition: '₹38 Lakh/yr', image: 'https://picsum.photos/400/200?random=3' },
  { id: '4', name: 'Technical University of Munich', country: 'Germany', ranking: 50, tuition: '₹1.5 Lakh/yr', image: 'https://picsum.photos/400/200?random=4' },
];

export const COUNTRIES: CountryProfile[] = [
  { id: '1', name: 'United Kingdom', capital: 'London', currency: 'GBP', avgCostOfLiving: '₹1.2 Lakh/mo', safetyIndex: 88, topIndustries: ['Finance', 'Tech'], image: 'https://picsum.photos/400/200?random=5' },
  { id: '2', name: 'Germany', capital: 'Berlin', currency: 'EUR', avgCostOfLiving: '₹1.0 Lakh/mo', safetyIndex: 92, topIndustries: ['Engineering', 'Auto'], image: 'https://picsum.photos/400/200?random=6' },
  { id: '3', name: 'Canada', capital: 'Ottawa', currency: 'CAD', avgCostOfLiving: '₹1.1 Lakh/mo', safetyIndex: 94, topIndustries: ['Tech', 'Healthcare'], image: 'https://picsum.photos/400/200?random=7' },
  { id: '4', name: 'Australia', capital: 'Canberra', currency: 'AUD', avgCostOfLiving: '₹1.3 Lakh/mo', safetyIndex: 90, topIndustries: ['Mining', 'Education'], image: 'https://picsum.photos/400/200?random=8' },
];

export const AI_TOOLS: AITool[] = [
  { id: '1', name: 'CodeGpt Pro', category: 'Development', description: 'Advanced code completion and refactoring.', pricing: 'Paid', rating: 4.8 },
  { id: '2', name: 'DesignWiz', category: 'Design', description: 'Generate UI layouts from text prompts.', pricing: 'Freemium', rating: 4.5 },
  { id: '3', name: 'DataCrunch', category: 'Analytics', description: 'Instant data visualization and insights.', pricing: 'Free', rating: 4.2 },
];

export const COURSES: Course[] = [
  { id: '1', title: 'Full Stack Development Bootcamp', instructor: 'Angela Yu', duration: '40 Hours', level: 'Beginner', rating: 4.9 },
  { id: '2', title: 'Data Science with Python', instructor: 'Jose Portilla', duration: '25 Hours', level: 'Intermediate', rating: 4.7 },
  { id: '3', title: 'Advanced Machine Learning', instructor: 'Andrew Ng', duration: '60 Hours', level: 'Advanced', rating: 4.9 },
];

export const FREELANCE_GIGS: FreelanceGig[] = [
  { id: '1', title: 'Build a custom React Dashboard', freelancer: 'Arjun Verma', rating: 4.9, price: '₹15,000', image: 'https://picsum.photos/200/200?random=30', category: 'Web Dev' },
  { id: '2', title: 'Logo Design & Branding', freelancer: 'Sofia Rossi', rating: 4.8, price: '₹5,000', image: 'https://picsum.photos/200/200?random=31', category: 'Design' },
  { id: '3', title: 'SEO Article Writing (1000 words)', freelancer: 'Mike Chen', rating: 4.7, price: '₹2,500', image: 'https://picsum.photos/200/200?random=32', category: 'Content' },
  { id: '4', title: 'Python Script for Automation', freelancer: 'Priya D.', rating: 5.0, price: '₹8,000', image: 'https://picsum.photos/200/200?random=33', category: 'Automation' },
];

export const CONSULTANTS_LIST: Consultant[] = [
  { id: '1', name: 'Dr. Emily Carter', expertise: 'Study Abroad (USA/UK)', rating: 4.9, rate: '₹2,000/hr', image: 'https://picsum.photos/200/200?random=40', verified: true },
  { id: '2', name: 'Rajesh Kumar', expertise: 'Career Counseling & Resume Review', rating: 4.8, rate: '₹1,500/hr', image: 'https://picsum.photos/200/200?random=41', verified: true },
  { id: '3', name: 'Anita Desai', expertise: 'Visa & Immigration Expert', rating: 5.0, rate: '₹2,500/hr', image: 'https://picsum.photos/200/200?random=42', verified: true },
];