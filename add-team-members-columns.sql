-- Migration: Add designation and description columns to team_members table
-- Run this SQL to update your existing Supabase database

-- Add designation column
ALTER TABLE team_members 
ADD COLUMN IF NOT EXISTS designation VARCHAR(255);

-- Add description column  
ALTER TABLE team_members 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Optional: Add comments for documentation
COMMENT ON COLUMN team_members.designation IS 'Job title or position of the team member';
COMMENT ON COLUMN team_members.description IS 'Bio or detailed description of the team member';
