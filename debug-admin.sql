-- Check existing admin users in your database
SELECT 
  id,
  name, 
  email, 
  role, 
  is_active,
  created_at
FROM team_members 
WHERE role IN ('admin', 'super_admin')
ORDER BY created_at DESC;

-- Check all users in team_members table
SELECT 
  id,
  name, 
  email, 
  role, 
  is_active,
  created_at
FROM team_members 
ORDER BY created_at DESC;

-- Check if there are any Supabase auth users
-- Note: This query depends on your auth schema setup
-- You might need to check in the Supabase dashboard directly
