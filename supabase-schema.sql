-- Fusioncrafttech Toolkit Database Schema
-- Generated for Supabase PostgreSQL

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE priority_enum AS ENUM ('low', 'medium', 'high');
CREATE TYPE task_status_enum AS ENUM ('pending', 'working', 'review', 'done');
CREATE TYPE project_status_enum AS ENUM ('planning', 'in_progress', 'testing', 'completed');
CREATE TYPE message_status_enum AS ENUM ('new', 'read', 'replied');
CREATE TYPE team_role_enum AS ENUM ('super_admin', 'admin', 'team_member', 'viewer');
CREATE TYPE toolkit_category_enum AS ENUM ('authentication_templates', 'dashboard_layouts', 'contact_form_templates', 'api_utilities', 'ui_components');

-- Services table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    price DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image TEXT,
    tech_stack TEXT[] DEFAULT '{}',
    github_url TEXT,
    live_url TEXT,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts table (for messages)
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status message_status_enum DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    photo TEXT,
    review_text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    project_history TEXT[] DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    assigned_member VARCHAR(255) NOT NULL,
    deadline DATE NOT NULL,
    priority priority_enum DEFAULT 'medium',
    linked_project UUID REFERENCES projects(id) ON DELETE SET NULL,
    status task_status_enum DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project tracker table
CREATE TABLE project_tracker (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    client VARCHAR(255) NOT NULL,
    assigned_members TEXT[] DEFAULT '{}',
    deadline DATE NOT NULL,
    priority priority_enum DEFAULT 'medium',
    status project_status_enum DEFAULT 'planning',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members table
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role team_role_enum DEFAULT 'team_member',
    designation VARCHAR(255),
    description TEXT,
    avatar TEXT,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Toolkit items table
CREATE TABLE toolkit_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    github_link TEXT,
    code_snippet TEXT,
    category toolkit_category_enum NOT NULL,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_services_active ON services(is_active);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created_at ON contacts(created_at);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assigned_member ON tasks(assigned_member);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_project_tracker_status ON project_tracker(status);
CREATE INDEX idx_project_tracker_deadline ON project_tracker(deadline);
CREATE INDEX idx_team_members_active ON team_members(is_active);
CREATE INDEX idx_toolkit_items_category ON toolkit_items(category);
CREATE INDEX idx_toolkit_items_tags ON toolkit_items USING GIN(tags);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_tracker_updated_at BEFORE UPDATE ON project_tracker FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_toolkit_items_updated_at BEFORE UPDATE ON toolkit_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE toolkit_items ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (adjust as needed for your authentication system)
CREATE POLICY "Allow all operations" ON services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON project_tracker FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON team_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON toolkit_items FOR ALL USING (true) WITH CHECK (true);

-- Insert sample data (optional)
INSERT INTO services (title, description, icon, price, is_active) VALUES
('Web Development', 'Custom web applications built with modern technologies', '🚀', 2999.00, true),
('Mobile Development', 'Native and cross-platform mobile applications', '📱', 3999.00, true),
('UI/UX Design', 'Beautiful and intuitive user interface designs', '🎨', 1999.00, true),
('Consulting', 'Technical consulting and architecture planning', '💼', 1499.00, true);

INSERT INTO projects (title, description, tech_stack, github_url, live_url, featured) VALUES
('E-commerce Platform', 'Full-stack e-commerce solution with payment integration', ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe'], 'https://github.com/example/ecommerce', 'https://example-ecommerce.com', true),
('Task Management App', 'Collaborative task management application', ARRAY['Vue.js', 'Express', 'MongoDB'], 'https://github.com/example/taskapp', 'https://example-tasks.com', false),
('Portfolio Website', 'Personal portfolio with dynamic content management', ARRAY['Next.js', 'TailwindCSS', 'Vercel'], 'https://github.com/example/portfolio', 'https://example-portfolio.com', true);

INSERT INTO toolkit_items (title, description, github_link, code_snippet, category, tags) VALUES
('React Auth Hook', 'Custom authentication hook for React applications', 'https://github.com/example/react-auth-hook', 'const useAuth = () => { const [user, setUser] = useState(null); // ... };', 'authentication_templates', ARRAY['react', 'hooks', 'auth']),
('Dashboard Layout', 'Responsive dashboard layout component', 'https://github.com/example/dashboard-layout', 'const DashboardLayout = ({ children }) => { return <div className="dashboard">{children}</div>; };', 'dashboard_layouts', ARRAY['layout', 'responsive', 'dashboard']),
('Contact Form', 'Multi-step contact form with validation', 'https://github.com/example/contact-form', 'const ContactForm = () => { const [step, setStep] = useState(1); // ... };', 'contact_form_templates', ARRAY['form', 'validation', 'contact']);

-- Create views for common queries
CREATE VIEW v_project_stats AS
SELECT 
    COUNT(*) as total_projects,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_projects,
    COUNT(*) FILTER (WHERE status = 'in_progress') as active_projects,
    COUNT(*) FILTER (WHERE priority = 'high') as high_priority_projects
FROM project_tracker;

CREATE VIEW v_task_stats AS
SELECT 
    COUNT(*) as total_tasks,
    COUNT(*) FILTER (WHERE status = 'done') as completed_tasks,
    COUNT(*) FILTER (WHERE status = 'working') as active_tasks,
    COUNT(*) FILTER (WHERE deadline < CURRENT_DATE AND status != 'done') as overdue_tasks
FROM tasks;

CREATE VIEW v_team_stats AS
SELECT 
    COUNT(*) as total_members,
    COUNT(*) FILTER (WHERE is_active = true) as active_members,
    COUNT(*) FILTER (WHERE role = 'admin') as admin_members,
    COUNT(*) FILTER (WHERE role = 'team_member') as team_members
FROM team_members;
