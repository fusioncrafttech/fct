-- Migration script to fix testimonials table field names
-- Run this in Supabase SQL editor if you have existing data with wrong field names

-- Check if the 'name' column exists and rename it to 'client_name' if needed
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'testimonials' 
        AND column_name = 'name'
    ) THEN
        ALTER TABLE testimonials RENAME COLUMN name TO client_name;
        RAISE NOTICE 'Renamed column "name" to "client_name"';
    END IF;
    
    -- Remove columns that shouldn't exist
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'testimonials' 
        AND column_name = 'role'
    ) THEN
        ALTER TABLE testimonials DROP COLUMN role;
        RAISE NOTICE 'Dropped column "role"';
    END IF;
    
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'testimonials' 
        AND column_name = 'is_active'
    ) THEN
        ALTER TABLE testimonials DROP COLUMN is_active;
        RAISE NOTICE 'Dropped column "is_active"';
    END IF;
    
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'testimonials' 
        AND column_name = 'content'
    ) THEN
        ALTER TABLE testimonials DROP COLUMN content;
        RAISE NOTICE 'Dropped column "content"';
    END IF;
    
    RAISE NOTICE 'Testimonials table migration completed successfully';
END $$;
