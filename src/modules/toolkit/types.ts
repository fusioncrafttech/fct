export interface ToolkitItem {
  id: string;
  title: string;
  description: string;
  category: 'auth' | 'dashboard' | 'contact' | 'api' | 'ui' | 'other';
  type: 'component' | 'template' | 'utility' | 'service';
  code?: string;
  preview?: string;
  documentation?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ToolkitCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  item_count: number;
}

export interface ToolkitStats {
  total_items: number;
  categories: number;
  active_items: number;
  recent_additions: number;
}
