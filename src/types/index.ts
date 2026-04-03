export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'team_member' | 'viewer';
  avatar?: string;
  created_at: string;
  updated_at: string;
}

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

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  status: 'pending' | 'read' | 'responded';
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string
  title: string
  description: string
  assigned_member?: string
  linked_project?: string
  deadline?: string
  priority?: "low" | "medium" | "high" | "urgent"
  status?: "pending" | "working" | "review" | "done"
}

export interface TeamMember {
  id: string
  user_id: string
  role: string
  department?: string
  joined_at: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface ToolkitItem {
  id: string
  title: string
  description?: string
  category?: string
  tags?: string[]
  code_snippet?: string
  github_link?: string
}

export interface Testimonial {
  id: string
  name: string
  role?: string
  company_name?: string
  photo?: string
  content?: string
  review_text?: string
  rating?: number
  is_active?: boolean
}

export interface ProjectTracker {
  id: string
  title: string
  description: string
  client?: string
  assigned_members?: string[]
  deadline?: string
  progress?: number
  priority?: "low" | "medium" | "high" | "urgent"
  status?: "todo" | "in_progress" | "review" | "completed"
}

export interface ToolkitStats {
  total_items: number
  active_items: number
  categories: number
  recent_additions: number
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface ThemeState {
  isDark: boolean;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}
