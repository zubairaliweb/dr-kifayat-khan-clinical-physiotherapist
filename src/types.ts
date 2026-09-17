export interface VideoItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string; // URL or /uploads/videos/...
  thumbnailUrl?: string;
  duration?: string;
  category: string;
  createdAt: string;
  isUploaded?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  authorRole: string;
  coverImage: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  category: string;
  indications: string[];
  benefits: string[];
  featured?: boolean;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  duration: string;
  grade?: string;
  activities?: string;
  location: string;
  highlights: string[];
}

export interface SkillCategory {
  title: string;
  description: string;
  skills: {
    name: string;
    level?: string;
    description?: string;
  }[];
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  preferredDate?: string;
  service?: string;
  createdAt: string;
  status: 'new' | 'reviewed' | 'contacted';
}

export interface ClinicProfile {
  fullName: string;
  title: string;
  jobTitles: string[];
  experienceYears: number;
  statement: string;
  aboutBio: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: {
    room: string;
    floor: string;
    building: string;
    street: string;
    block: string;
    area: string;
    city: string;
    postalCode: string;
    country: string;
  };
  googleMapsUrl: string;
  socialLinks: {
    facebook: string;
    tiktok: string;
    whatsapp: string;
    linkedin?: string;
  };
  timings: string;
}
