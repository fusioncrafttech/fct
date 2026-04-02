-- Updated Internal Messaging System Schema
-- Run these SQL commands to update your existing database

-- First, add the missing columns to internal_messages table
ALTER TABLE internal_messages 
ADD COLUMN IF NOT EXISTS reply_to UUID REFERENCES internal_messages(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS forwarded_from UUID REFERENCES internal_messages(id) ON DELETE SET NULL;

-- Create message attachments table
CREATE TABLE IF NOT EXISTS message_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES internal_messages(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_type TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for message attachments
CREATE INDEX IF NOT EXISTS idx_message_attachments_message_id ON message_attachments(message_id);
CREATE INDEX IF NOT EXISTS idx_message_attachments_uploaded_at ON message_attachments(uploaded_at);

-- Enable Row Level Security for message_attachments
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;

-- Drop policy if it exists, then create it
DROP POLICY IF EXISTS "Allow all operations on message_attachments" ON message_attachments;
CREATE POLICY "Allow all operations on message_attachments" ON message_attachments FOR ALL USING (true) WITH CHECK (true);

-- Update the priority_enum type if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'priority_enum') THEN
        CREATE TYPE priority_enum AS ENUM ('low', 'medium', 'high');
    END IF;
END $$;

-- If you need to add a users table for admin functionality
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Enable RLS for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop policy if it exists, then create it
DROP POLICY IF EXISTS "Allow all operations on users" ON users;
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true) WITH CHECK (true);

-- Sample admin users (optional)
-- INSERT INTO users (name, email, role) VALUES 
-- ('Admin User', 'admin@fusioncrafttech.com', 'admin'),
-- ('Super Admin', 'superadmin@fusioncrafttech.com', 'super_admin')
-- ON CONFLICT (email) DO NOTHING;

-- Update existing message_recipients to ensure proper structure
ALTER TABLE message_recipients 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if it exists, then create it
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT ALL ON internal_messages TO authenticated;
-- GRANT ALL ON message_recipients TO authenticated;
-- GRANT ALL ON message_attachments TO authenticated;
-- GRANT ALL ON users TO authenticated;
