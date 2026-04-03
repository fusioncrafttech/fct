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
  id: string
  title: string
  description: string
  assigned_member?: string
  linked_project?: string
  deadline?: string
  priority?: "low" | "medium" | "high" | "urgent"
  status?: "pending" | "working" | "review" | "done"
}

export type TaskStatus = Task['status']
export type Priority = Task['priority']

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

export type ProjectTrackerStatus = "todo" | "in_progress" | "review" | "completed"
export type ProjectTrackerPriority = "low" | "medium" | "high" | "urgent"

export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'team_member' | 'viewer'
  avatar?: string
  joined_at: string
  phone?: string
  is_active?: boolean
}
