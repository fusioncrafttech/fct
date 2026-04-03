export interface Service {
  id: string
  title: string
  description: string
  price?: string
  icon?: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface Project {
  id: string
  title: string
  description: string
  image: string
  github_url?: string
  live_url?: string
  tech_stack?: string[]
  tech?: string[]
  category?: string
  project_url?: string
  featured?: boolean
  created_at?: string
  updated_at?: string
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string
  client_name: string
  company_name?: string
  photo?: string
  review_text: string
  rating: number
  created_at?: string
  updated_at?: string
}

export interface DashboardStats {
  total_services: number;
  total_projects: number;
  new_messages: number;
  team_members: number;
}

export interface AdminSettings {
  theme: 'light' | 'dark';
  email_notifications: boolean;
  push_notifications: boolean;
  two_factor_auth: boolean;
  social_links?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}
