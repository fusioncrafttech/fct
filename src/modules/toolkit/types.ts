export interface ToolkitItem {
  id: string
  title: string
  description?: string
  category?: string
  tags?: string[]
  code_snippet?: string
  github_link?: string
  created_at?: string
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
  total_items: number
  active_items: number
  categories: Record<string, number>
  recent_additions: ToolkitItem[]
}
