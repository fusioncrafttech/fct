-- Sample Users for Testing Role-Based Authentication
-- Run this in your Supabase SQL editor to create test users

-- Insert team members with different roles
INSERT INTO team_members (name, email, role, is_active, joined_at) VALUES
('Super Admin', 'superadmin@fusioncrafttech.com', 'super_admin', true, NOW()),
('Admin User', 'admin@fusioncrafttech.com', 'admin', true, NOW()),
('Team Member', 'teammember@fusioncrafttech.com', 'team_member', true, NOW()),
('Viewer User', 'viewer@fusioncrafttech.com', 'viewer', true, NOW());

-- Note: You'll need to create corresponding Supabase Auth users with the same emails
-- You can do this through the Supabase Dashboard > Authentication > Users

-- Expected behavior after login:
-- superadmin@fusioncrafttech.com -> /admin/dashboard
-- admin@fusioncrafttech.com -> /admin/dashboard  
-- teammember@fusioncrafttech.com -> /dashboard (CRM)
-- viewer@fusioncrafttech.com -> /dashboard (CRM)

-- Password for all test users should be set through Supabase Auth
-- Recommended password: "password123" (set in Supabase Auth)

-- To create auth users, go to Supabase Dashboard > Authentication > Users
-- Click "Add user" and create users with these emails and the same password
