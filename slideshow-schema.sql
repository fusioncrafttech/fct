-- Slideshow table for homepage image slideshow
CREATE TABLE slideshow (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_slideshow_active ON slideshow(is_active);
CREATE INDEX idx_slideshow_sort_order ON slideshow(sort_order);

-- Create trigger for updated_at
CREATE TRIGGER update_slideshow_updated_at BEFORE UPDATE ON slideshow FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE slideshow ENABLE ROW LEVEL SECURITY;

-- Basic RLS policy
CREATE POLICY "Allow all operations" ON slideshow FOR ALL USING (true) WITH CHECK (true);

-- Insert sample data
INSERT INTO slideshow (title, description, image, sort_order, is_active) VALUES
('Premium Web Development', 'Creating stunning, responsive websites that drive business growth and user engagement.', '/advertisement-CqiYVZlG.jpg', 1, true),
('Mobile App Solutions', 'Building powerful mobile applications for iOS and Android with exceptional user experiences.', '/flyer-designoutput-TPdGMFzh.jpg', 2, true),
('Full-Stack Development', 'End-to-end development solutions from concept to deployment and maintenance.', '/FCT Logo.png', 3, true);
