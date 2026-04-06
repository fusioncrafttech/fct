-- Add sort_order column to services table
ALTER TABLE services 
ADD COLUMN sort_order INTEGER;

-- Update existing services with sort_order based on creation date
UPDATE services 
SET sort_order = (
  SELECT row_number - 1
  FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as row_number
    FROM services
  ) ranked
  WHERE ranked.id = services.id
);

-- Add index for better performance
CREATE INDEX idx_services_sort_order ON services(sort_order);

-- Add comment
COMMENT ON COLUMN services.sort_order IS 'Display order for services (0 = first)';
