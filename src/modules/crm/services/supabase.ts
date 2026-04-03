import { supabase } from '../../../services/supabase';
import type { ProjectTracker, Task, Client, TeamMember } from '@/types/global';

// Clients CRUD
export const clientsService = {
  async getAll(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, client: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update({ ...client, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Tasks CRUD
export const tasksService = {
  async getAll(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, task: Partial<Task>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update({ ...task, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async updateStatus(id: string, status: Task['status']): Promise<Task> {
    return this.update(id, { status });
  }
};

// Project Tracker CRUD
export const projectsTrackerService = {
  async getAll(): Promise<ProjectTracker[]> {
    const { data, error } = await supabase
      .from('project_tracker')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(project: Omit<ProjectTracker, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectTracker> {
    const { data, error } = await supabase
      .from('project_tracker')
      .insert(project)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, project: Partial<ProjectTracker>): Promise<ProjectTracker> {
    const { data, error } = await supabase
      .from('project_tracker')
      .update({ ...project, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('project_tracker')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async updateStatus(id: string, status: ProjectTracker['status']): Promise<ProjectTracker> {
    return this.update(id, { status });
  }
};

// Team Members CRUD
export const teamMembersService = {
  async getAll(): Promise<TeamMember[]> {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('joined_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(member: Omit<TeamMember, 'id' | 'joined_at'>): Promise<TeamMember> {
    const { data, error } = await supabase
      .from('team_members')
      .insert({ ...member, joined_at: new Date().toISOString() })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, member: Partial<TeamMember>): Promise<TeamMember> {
    const { data, error } = await supabase
      .from('team_members')
      .update(member)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async updateRole(id: string, role: TeamMember['role']): Promise<TeamMember> {
    return this.update(id, { role });
  },

  async toggleActive(id: string, isActive: boolean): Promise<TeamMember> {
    return this.update(id, { is_active: isActive });
  }
};
