export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'active' | 'inactive' | 'prospect';
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  due_date?: string;
  project_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectTracker {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'in_progress' | 'testing' | 'completed' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  client_id?: string;
  assigned_to?: string;
  start_date?: string;
  end_date?: string;
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'team_member' | 'viewer';
  avatar?: string;
  joined_at: string;
  is_active: boolean;
}
