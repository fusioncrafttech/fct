-- Add description column to project_tracker table
ALTER TABLE project_tracker ADD COLUMN description TEXT;

-- Add comment to describe the new column
COMMENT ON COLUMN project_tracker.description IS 'Detailed description of the project work and requirements';

-- Update the updated_at trigger to include the new column
-- (This is optional as the existing trigger should handle it)
