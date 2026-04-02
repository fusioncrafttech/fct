-- Update your existing admin user with the correct Supabase Auth ID
-- REPLACE 'YOUR_COPIED_USER_ID_HERE' with the actual ID from Supabase Auth

UPDATE team_members 
SET id = 'YOUR_COPIED_USER_ID_HERE'
WHERE email = 'admin@fusioncrafttech.com';

-- If no admin exists, insert one
INSERT INTO team_members (
  id, 
  name, 
  email, 
  role, 
  is_active, 
  created_at
) VALUES (
  'YOUR_COPIED_USER_ID_HERE',
  'Admin User', 
  'admin@fusioncrafttech.com', 
  'super_admin', 
  true, 
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  id = 'YOUR_COPIED_USER_ID_HERE',
  role = 'super_admin',
  is_active = true;

-- Verify the admin user
SELECT id, name, email, role, is_active 
FROM team_members 
WHERE email = 'admin@fusioncrafttech.com';
