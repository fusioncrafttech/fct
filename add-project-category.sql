-- Add category column to projects table
ALTER TABLE projects ADD COLUMN category VARCHAR(100);

-- Update existing projects to have a default category
UPDATE projects SET category = 'Web' WHERE category IS NULL;
