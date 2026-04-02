export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tech: string[];
  category: string;
  featured: boolean;
  project_url: string;
  github_url: string;
  created_at: string;
  updated_at: string;
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
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_services: number;
  total_projects: number;
  new_messages: number;
  team_members: number;
}
