export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  project_history: string[];
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  assigned_member?: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  linked_project?: string;
  status: 'pending' | 'working' | 'review' | 'done';
  created_at: string;
  updated_at: string;
}

export interface ProjectTracker {
  id: string;
  title: string;
  client: string;
  assigned_members: string[];
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  status: 'planning' | 'in_progress' | 'testing' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'team_member' | 'viewer';
  avatar?: string;
  phone?: string;
  joined_at: string;
  is_active: boolean;
}

export type ProjectStatus = 'planning' | 'in_progress' | 'testing' | 'completed';
export type TaskStatus = 'pending' | 'working' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high';
export type TeamRole = 'super_admin' | 'admin' | 'team_member' | 'viewer';
