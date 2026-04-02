import { supabase } from '../../../services/supabase';
import type { ToolkitItem, ToolkitCategory, ToolkitStats } from '../types';

// Toolkit Items CRUD
export const toolkitService = {
  async getAll(): Promise<ToolkitItem[]> {
    const { data, error } = await supabase
      .from('toolkit_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getByCategory(category: ToolkitCategory): Promise<ToolkitItem[]> {
    const { data, error } = await supabase
      .from('toolkit_items')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(item: Omit<ToolkitItem, 'id' | 'created_at' | 'updated_at'>): Promise<ToolkitItem> {
    const { data, error } = await supabase
      .from('toolkit_items')
      .insert(item)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, item: Partial<ToolkitItem>): Promise<ToolkitItem> {
    const { data, error } = await supabase
      .from('toolkit_items')
      .update({ ...item, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('toolkit_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getStats(): Promise<ToolkitStats> {
    const [allItems, categoriesData] = await Promise.all([
      supabase.from('toolkit_items').select('*'),
      supabase.from('toolkit_items').select('category')
    ]);

    const categories = categoriesData.data?.reduce((acc: Record<string, number>, item: any) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {} as Record<string, number>;

    return {
      total_items: allItems.data?.length || 0,
      categories,
      recent_additions: (allItems.data || []).slice(0, 5)
    };
  }
};
