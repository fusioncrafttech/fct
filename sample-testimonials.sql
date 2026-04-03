-- Sample testimonials for the homepage
-- Run this SQL in your Supabase SQL editor to add sample testimonials

INSERT INTO testimonials (
  id,
  client_name,
  company_name,
  photo,
  review_text,
  rating,
  created_at,
  updated_at
) VALUES
(
  gen_random_uuid(),
  'Sarah Johnson',
  'TechStart',
  'https://images.unsplash.com/photo-1494790108755-2616b332c6ca?w=150&h=150&fit=crop&crop=face',
  'Fusioncrafttech delivered an exceptional product that exceeded our expectations. Their attention to detail and technical expertise is unmatched.',
  5,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Michael Chen',
  'DataFlow',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  'Working with Fusioncrafttech was a game-changer for our company. They helped us scale our infrastructure and improve performance significantly.',
  5,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Emily Rodriguez',
  'InnovateCo',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  'The team''s professionalism and dedication to quality is impressive. They turned our vision into reality with outstanding results.',
  5,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'David Kim',
  'GrowthLabs',
  NULL,
  'Great service and excellent communication throughout the project. Highly recommend!',
  4,
  NOW(),
  NOW()
);
