export interface ToolkitItem {
  id: string;
  title: string;
  description: string;
  github_link: string;
  code_snippet: string;
  category: ToolkitCategory;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export type ToolkitCategory = 
  | 'authentication_templates'
  | 'dashboard_layouts'
  | 'contact_form_templates'
  | 'api_utilities'
  | 'ui_components';

export interface ToolkitStats {
  total_items: number;
  categories: Record<ToolkitCategory, number>;
  recent_additions: ToolkitItem[];
}
