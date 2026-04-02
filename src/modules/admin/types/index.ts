export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tech_stack: string[];
  github_url: string;
  live_url: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  company_name: string;
  photo: string;
  review_text: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_services: number;
  total_projects: number;
  new_messages: number;
  team_members: number;
}

export interface AdminSettings {
  site_name: string;
  site_description: string;
  contact_email: string;
  social_links: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}
