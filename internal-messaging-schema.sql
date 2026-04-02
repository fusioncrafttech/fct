-- Internal Messaging System Schema
-- Add these tables to your existing Supabase database

-- Internal messages table
CREATE TABLE internal_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    recipient_id UUID REFERENCES team_members(id) ON DELETE SET NULL, -- null for broadcast
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    priority priority_enum DEFAULT 'medium',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Message recipients table (for tracking who received which messages)
CREATE TABLE message_recipients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES internal_messages(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
    recipient_email TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_internal_messages_sender_id ON internal_messages(sender_id);
CREATE INDEX idx_internal_messages_recipient_id ON internal_messages(recipient_id);
CREATE INDEX idx_internal_messages_created_at ON internal_messages(created_at);
CREATE INDEX idx_internal_messages_priority ON internal_messages(priority);

CREATE INDEX idx_message_recipients_message_id ON message_recipients(message_id);
CREATE INDEX idx_message_recipients_recipient_id ON message_recipients(recipient_id);
CREATE INDEX idx_message_recipients_is_read ON message_recipients(is_read);

-- Row Level Security (RLS) policies
ALTER TABLE internal_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_recipients ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (adjust as needed for your authentication system)
CREATE POLICY "Allow all operations on internal_messages" ON internal_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on message_recipients" ON message_recipients FOR ALL USING (true) WITH CHECK (true);

-- Create trigger for updated_at (if needed)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
