-- Create a fresh admin user
-- Step 1: Insert into team_members table
INSERT INTO team_members (
  id, 
  name, 
  email, 
  role, 
  is_active, 
  created_at
) VALUES (
  'temp-admin-id', -- This will be replaced with real auth user ID
  'Admin User', 
  'admin@fusioncrafttech.com', 
  'super_admin', 
  true, 
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  role = 'super_admin',
  is_active = true;

-- After creating the auth user in Supabase dashboard, 
-- update the ID with this:
-- UPDATE team_members SET id = 'YOUR_REAL_AUTH_USER_ID' WHERE email = 'admin@fusioncrafttech.com';
