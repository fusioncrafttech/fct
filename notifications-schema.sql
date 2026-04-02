-- Notifications System Schema
-- Run these SQL commands to add notifications to your database

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'message', 'task', 'project')),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE,
    action_url TEXT,
    metadata JSONB
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop policy if it exists, then create it
DROP POLICY IF EXISTS "Allow all operations on notifications" ON notifications;
CREATE POLICY "Allow all operations on notifications" ON notifications FOR ALL USING (true) WITH CHECK (true);

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT ALL ON notifications TO authenticated;

-- Sample notifications (optional - for testing)
-- INSERT INTO notifications (user_id, title, message, type, action_url) VALUES
-- ('your-user-id', 'New Message', 'You have received a new message from John Doe', 'message', '/dashboard/messages'),
-- ('your-user-id', 'Task Assigned', 'A new task has been assigned to you', 'task', '/dashboard/tasks'),
-- ('your-user-id', 'Project Update', 'Project status has been updated', 'project', '/dashboard/projects')
-- ON CONFLICT DO NOTHING;
