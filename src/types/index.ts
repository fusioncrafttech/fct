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
  id: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  screenshots?: string[];
  tech_stack: string[];
  featured: boolean;
  client_name?: string;
  project_url?: string;
  github_url?: string;
  created_at: string;
  updated_at: string;
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
  id: string;
  title: string;
  description?: string;
  assigned_to?: string;
  project_id?: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  department?: string;
  joined_at: string;
  created_at: string;
  updated_at: string;
}

export interface ToolkitItem {
  id: string;
  title: string;
  description: string;
  category: 'auth' | 'dashboard' | 'contact' | 'api' | 'ui' | 'other';
  code_snippet?: string;
  github_url?: string;
  demo_url?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
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
