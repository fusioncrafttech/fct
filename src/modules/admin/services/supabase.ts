import { supabase } from '../../../services/supabase';
import type { Service, Project, ContactMessage, Testimonial, DashboardStats, Slideshow } from '@/types/global';

// Services CRUD
export const servicesService = {
  async getAll(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .insert(service)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, service: Partial<Service>): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .update({ ...service, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async toggleActive(id: string, isActive: boolean): Promise<Service> {
    return this.update(id, { is_active: isActive });
  }
};

// Projects CRUD
export const projectsService = {
  async getAll(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, project: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...project, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async toggleFeatured(id: string, featured: boolean): Promise<Project> {
    return this.update(id, { featured });
  }
};

// Messages CRUD
export const messagesService = {
  async getAll(): Promise<ContactMessage[]> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: ContactMessage['status']): Promise<ContactMessage> {
    const { data, error } = await supabase
      .from('contacts')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getUnreadCount(): Promise<number> {
    const { count, error } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new');
    
    if (error) throw error;
    return count || 0;
  }
};

// Testimonials CRUD
export const testimonialsService = {
  async getAll(): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>): Promise<Testimonial> {
    const { data, error } = await supabase
      .from('testimonials')
      .insert(testimonial)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, testimonial: Partial<Testimonial>): Promise<Testimonial> {
    const { data, error } = await supabase
      .from('testimonials')
      .update({ ...testimonial, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Slideshow CRUD
export const slideshowService = {
  async getAll(): Promise<Slideshow[]> {
    const { data, error } = await supabase
      .from('slideshow')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async create(slideshow: Omit<Slideshow, 'id' | 'created_at' | 'updated_at'>): Promise<Slideshow> {
    const { data, error } = await supabase
      .from('slideshow')
      .insert(slideshow)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, slideshow: Partial<Slideshow>): Promise<Slideshow> {
    const { data, error } = await supabase
      .from('slideshow')
      .update({ ...slideshow, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('slideshow')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async toggleActive(id: string, isActive: boolean): Promise<Slideshow> {
    return this.update(id, { is_active: isActive });
  }
};

// Dashboard Stats
export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const [servicesCount, projectsCount, messagesCount] = await Promise.all([
      supabase.from('services').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('status', 'new')
    ]);

    return {
      total_services: servicesCount.count || 0,
      total_projects: projectsCount.count || 0,
      new_messages: messagesCount.count || 0,
      team_members: 4 // Placeholder - will be implemented with team members table
    };
  }
};
