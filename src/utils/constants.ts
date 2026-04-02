export const APP_NAME = 'Fusioncrafttech Toolkit';
export const APP_DESCRIPTION = 'Premium SaaS-style internal freelance agency toolkit';

export const NAVIGATION_ITEMS = {
  public: [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Projects', href: '/projects' },
    { name: 'Contact', href: '/contact' },
  ],
  admin: [
    { name: 'Dashboard', href: '/admin/dashboard', icon: 'Dashboard' },
    { name: 'Services', href: '/admin/services', icon: 'Cube' },
    { name: 'Projects', href: '/admin/projects', icon: 'Folder' },
    { name: 'Messages', href: '/admin/messages', icon: 'MessageSquare' },
    { name: 'Testimonials', href: '/admin/testimonials', icon: 'Quote' },
    { name: 'Settings', href: '/admin/settings', icon: 'Settings' },
  ],
  crm: [
    { name: 'Dashboard', href: '/dashboard', icon: 'Dashboard' },
    { name: 'Projects', href: '/dashboard/projects', icon: 'Folder' },
    { name: 'Tasks', href: '/dashboard/tasks', icon: 'CheckSquare' },
    { name: 'Clients', href: '/dashboard/clients', icon: 'Users' },
    { name: 'Team', href: '/dashboard/team', icon: 'UserPlus' },
  ],
  toolkit: [
    { name: 'Dashboard', href: '/toolkit', icon: 'Dashboard' },
    { name: 'Authentication', href: '/toolkit/auth', icon: 'Lock' },
    { name: 'Dashboard Layouts', href: '/toolkit/dashboard', icon: 'Layout' },
    { name: 'Contact Forms', href: '/toolkit/contact', icon: 'Mail' },
    { name: 'API Utilities', href: '/toolkit/api', icon: 'Code' },
    { name: 'UI Components', href: '/toolkit/ui', icon: 'Component' },
  ],
};

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  TEAM_MEMBER: 'team_member',
  VIEWER: 'viewer',
} as const;

export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  COMPLETED: 'completed',
} as const;

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export const TOOLKIT_CATEGORIES = {
  AUTH: 'auth',
  DASHBOARD: 'dashboard',
  CONTACT: 'contact',
  API: 'api',
  UI: 'ui',
  OTHER: 'other',
} as const;
