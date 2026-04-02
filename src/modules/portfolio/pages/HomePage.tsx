import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Code, Zap, Shield, Globe, Monitor, Smartphone, Palette, Cloud } from 'lucide-react';
import { projectsService } from '../../admin/services/supabase';
import type { Project } from '../../admin/types';

const HomePage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectsService.getAll();
      // Get only the first 3 projects for the preview
      setProjects((data || []).slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };
  const features = [
    {
      icon: Code,
      title: 'Clean Code',
      description: 'Modern, maintainable code following best practices'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance for the best user experience'
    },
    {
      icon: Shield,
      title: 'Secure',
      description: 'Enterprise-grade security for your peace of mind'
    },
    {
      icon: Globe,
      title: 'Global Scale',
      description: 'Built to scale with your growing business'
    }
  ];

  const services = [
    {
      title: 'Web Development',
      description: 'Custom web applications built with modern technologies',
      icon: Monitor,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Mobile Apps',
      description: 'Native and cross-platform mobile solutions',
      icon: Smartphone,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'UI/UX Design',
      description: 'Beautiful, intuitive user interfaces',
      icon: Palette,
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Cloud Solutions',
      description: 'Scalable cloud infrastructure and deployment',
      icon: Cloud,
      color: 'from-green-500 to-teal-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO at TechStart',
      content: 'Fusioncrafttech delivered an exceptional product that exceeded our expectations. Their attention to detail and technical expertise is unmatched.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'CTO at DataFlow',
      content: 'Working with Fusioncrafttech was a game-changer for our company. They helped us scale our infrastructure and improve performance significantly.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Product Manager at InnovateCo',
      content: 'The team\'s professionalism and dedication to quality is impressive. They turned our vision into reality.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="floating-shape w-96 h-96 bg-purple-500/20"
            style={{ top: '10%', left: '10%' }}
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="floating-shape w-80 h-80 bg-blue-500/20"
            style={{ bottom: '10%', right: '10%' }}
            animate={{ 
              x: [0, -100, 0],
              y: [0, 50, 0],
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="floating-shape w-64 h-64 bg-indigo-500/20"
            style={{ top: '50%', left: '70%' }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              >
                Premium Full Stack
                <br />
                <span className="gradient-text">Development Solutions</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-xl text-gray-300 mb-8 max-w-2xl"
              >
                Modern scalable web applications for startups and businesses. Transform your ideas into powerful digital experiences.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  to="/projects"
                  className="btn-primary text-lg"
                  aria-label="View Portfolio"
                >
                  View Portfolio
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/contact"
                  className="btn-secondary text-lg"
                  aria-label="Contact Me"
                >
                  Contact Me
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Right Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative z-10">
                {/* Developer SVG Illustration */}
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="glass-card p-8 rounded-3xl"
                >
                  <svg
                    className="w-full h-64"
                    viewBox="0 0 400 300"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Code window */}
                    <rect x="50" y="50" width="300" height="200" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
                    
                    {/* Window controls */}
                    <circle cx="70" cy="70" r="4" fill="#ff5f56"/>
                    <circle cx="85" cy="70" r="4" fill="#ffbd2e"/>
                    <circle cx="100" cy="70" r="4" fill="#27c93f"/>
                    
                    {/* Code lines */}
                    <rect x="70" y="90" width="120" height="3" fill="rgba(102, 126, 234, 0.8)"/>
                    <rect x="70" y="100" width="80" height="3" fill="rgba(118, 75, 162, 0.8)"/>
                    <rect x="70" y="110" width="140" height="3" fill="rgba(240, 147, 251, 0.8)"/>
                    <rect x="70" y="120" width="100" height="3" fill="rgba(102, 126, 234, 0.8)"/>
                    <rect x="200" y="90" width="60" height="3" fill="rgba(240, 147, 251, 0.8)"/>
                    <rect x="200" y="100" width="90" height="3" fill="rgba(118, 75, 162, 0.8)"/>
                    <rect x="200" y="110" width="70" height="3" fill="rgba(102, 126, 234, 0.8)"/>
                    
                    {/* Floating elements */}
                    <motion.circle
                      cx="320" cy="80" r="8" fill="rgba(102, 126, 234, 0.6)"
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.circle
                      cx="80" cy="220" r="6" fill="rgba(240, 147, 251, 0.6)"
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: 0.5,
                        ease: "easeInOut"
                      }}
                    />
                  </svg>
                </motion.div>
              </div>
              
              {/* Background glow effect */}
              <div className="absolute inset-0 premium-gradient opacity-20 blur-3xl rounded-3xl"></div>
            </motion.div>
          </div>
          
          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                className="glass-card text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We offer comprehensive digital solutions to help your business thrive in the modern world
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card group cursor-pointer"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  {React.createElement(service.icon, { className: "w-8 h-8 text-white" })}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-300 mb-4">
                  {service.description}
                </p>
                <Link
                  to="/services"
                  className="text-white hover:text-gray-200 font-medium inline-flex items-center group"
                >
                  Learn more
                  <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Preview Section */}
      <section className="py-20 bg-gradient-to-br from-slate-800 via-gray-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Recent Projects
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Take a look at some of our latest work and see how we've helped businesses like yours
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card overflow-hidden group cursor-pointer"
              >
                <div className="aspect-video bg-gray-800 rounded-t-2xl mb-4 overflow-hidden">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/400x225/1e293b/64748b?text=Project+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                      <span className="text-gray-400 text-sm font-medium">
                        No Image
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-300 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech_stack?.map((tech: string, techIndex: number) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-white/10 text-gray-300 text-xs font-medium rounded-full border border-white/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <Link
                  to="/projects"
                  className="text-white hover:text-gray-200 font-medium inline-flex items-center group"
                >
                  View project
                  <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/projects"
              className="btn-primary inline-flex items-center"
            >
              View All Projects
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Don't just take our word for it - hear from our satisfied clients
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 premium-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-gray-100 mb-8">
              Let's work together to bring your ideas to life. Get in touch with us today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105 inline-flex items-center justify-center shadow-lg"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/about"
                className="border-2 border-white text-white hover:bg-white hover:text-purple-600 font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105 inline-flex items-center justify-center"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
