export interface Project {
  id?: string
  title: string
  description: string
  image?: string
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

export interface Service {
  id?: string
  title: string
  description: string
  price?: string
  icon?: string
  is_active?: boolean
  sort_order?: number
  created_at?: string
  updated_at?: string
}

export interface Testimonial {
  id?: string
  name?: string
  client_name?: string
  company_name?: string
  role?: string
  photo?: string
  content?: string
  review_text?: string
  rating?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface ContactMessage {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  status?: 'new' | 'read' | 'replied' | 'archived';
  created_at?: string;
  updated_at?: string;
}

export interface DashboardStats {
  total_services?: number;
  total_projects?: number;
  new_messages?: number;
  team_members?: number;
}

export interface AdminSettings {
  theme?: 'light' | 'dark';
  email_notifications?: boolean;
  push_notifications?: boolean;
  two_factor_auth?: boolean;
  social_links?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface Client {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: 'active' | 'inactive' | 'prospect';
  created_at?: string;
  updated_at?: string;
}

export interface ProjectTracker {
  id?: string
  title: string
  description?: string
  client?: string
  assigned_members?: string[]
  deadline?: string
  progress?: number
  priority?: "low" | "medium" | "high" | "urgent"
  status?: "todo" | "in_progress" | "review" | "completed"
}

export type ProjectTrackerStatus = "todo" | "in_progress" | "review" | "completed"
export type ProjectTrackerPriority = "low" | "medium" | "high" | "urgent"

export interface Task {
  id?: string
  title: string
  description?: string
  assigned_member?: string
  linked_project?: string
  deadline?: string
  priority?: "low" | "medium" | "high" | "urgent"
  status?: "pending" | "working" | "review" | "done"
}

export type TaskStatus = Task['status']
export type Priority = Task['priority']

export interface TeamMember {
  id?: string
  name?: string
  email?: string
  role?: 'super_admin' | 'admin' | 'team_member' | 'viewer'
  designation?: string
  description?: string
  avatar?: string
  joined_at?: string
  is_active?: boolean
}

export interface ToolkitItem {
  id?: string
  title: string
  description?: string
  category?: string
  tags?: string[]
  code_snippet?: string
  github_link?: string
  created_at?: string
}

export interface Slideshow {
  id?: string
  title: string
  description?: string
  image: string
  sort_order?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface ToolkitStats {
  total_items: number
  active_items: number
  categories: Record<string, number>
  recent_additions: ToolkitItem[]
}
