import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Code, Zap, Shield, Globe, Monitor, Smartphone, Palette, Cloud, Edit3 } from 'lucide-react';
import { projectsService } from '../../admin/services/supabase';
import { testimonialsService } from '../../admin/services/supabase';
import type { Project, Testimonial } from '@/types/global';
import ReviewForm from '../../../components/ReviewForm';

const HomePage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchTestimonials();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectsService.getAll();
      // Get only the first 3 projects for the preview
      setProjects((data || []).slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setProjects([]);
    }
  };

  const fetchTestimonials = async () => {
    try {
      setTestimonialsLoading(true);
      const data = await testimonialsService.getAll();
      // Get only the first 3 testimonials for the preview
      setTestimonials((data || []).slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
      setTestimonials([]);
    } finally {
      setTestimonialsLoading(false);
    }
  };

  const handleReviewSubmit = () => {
    // Refresh testimonials after a new review is submitted
    fetchTestimonials();
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
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh] py-12 sm:py-16 lg:py-20">
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
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight"
              >
                Premium Full Stack
                <br />
                <span className="gradient-text">Development Solutions</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl"
              >
                Modern scalable web applications for startups and businesses. Transform your ideas into powerful digital experiences.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <Link
                  to="/projects"
                  className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
                  aria-label="View Portfolio"
                >
                  View Portfolio
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/contact"
                  className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
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
            className="mt-16 sm:mt-20 lg:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                className="glass-card p-4 sm:p-6 text-center group hover:shadow-2xl transition-all duration-300"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-purple-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Our Services
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              We offer comprehensive digital solutions to help your business thrive in the modern world
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 sm:p-8 group cursor-pointer hover:shadow-2xl transition-all duration-300 border border-white/10 hover:border-white/20"
              >
                <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                  {React.createElement(service.icon, { className: "w-8 h-8 sm:w-10 sm:h-10 text-white" })}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-gray-100 transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 leading-relaxed flex-grow">
                  {service.description}
                </p>
                <div className="mt-auto">
                  <Link
                    to="/services"
                    className="inline-flex items-center text-white font-semibold group-hover:text-purple-200 transition-colors text-sm sm:text-base"
                  >
                    Learn more
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Preview Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-800 via-gray-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Recent Projects
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Take a look at some of our latest work and see how we've helped businesses like yours
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300 border border-white/10 hover:border-white/20"
              >
                <div className="aspect-video bg-gray-800 overflow-hidden relative">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-4 sm:p-6 flex flex-col h-full">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 group-hover:text-purple-200 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4 leading-relaxed flex-grow">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                    {project.tech_stack?.map((tech: string, techIndex: number) => (
                      <span
                        key={techIndex}
                        className="px-2 sm:px-3 py-1 bg-white/10 text-gray-300 text-xs sm:text-sm font-medium rounded-full border border-white/20 hover:bg-white/20 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto">
                    <Link
                      to="/projects"
                      className="inline-flex items-center text-white font-semibold group-hover:text-purple-200 transition-colors text-sm sm:text-base"
                    >
                      View project
                      <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Link
              to="/projects"
              className="btn-primary inline-flex items-center text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
            >
              View All Projects
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              What Our Clients Say
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Don't just take our word for it - hear from our satisfied clients
            </p>
            
            {/* Write a Review Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6"
            >
              <button
                onClick={() => setIsReviewFormOpen(true)}
                className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg border border-white/20 hover:border-white/30 transition-all duration-200 backdrop-blur-sm"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Write a Review
              </button>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonialsLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="glass-card p-8 h-full flex flex-col animate-pulse"
                >
                  <div className="flex mb-6">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-6 h-6 bg-gray-600 rounded-full mr-1" />
                    ))}
                  </div>
                  <div className="flex-grow">
                    <div className="h-20 bg-gray-600 rounded mb-8"></div>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-600 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-6 bg-gray-600 rounded mb-2 w-3/4"></div>
                        <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : testimonials.length > 0 ? (
              testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card p-6 sm:p-8 group cursor-pointer hover:shadow-2xl transition-all duration-300 border border-white/10 hover:border-white/20 h-full flex flex-col"
                >
                  <div className="flex-grow">
                    <div className="flex mb-6">
                      {[...Array(testimonial.rating || 0)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-6 sm:mb-8 italic text-base sm:text-lg leading-relaxed">
                      "{testimonial.review_text}"
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {testimonial.photo ? (
                          <img
                            src={testimonial.photo}
                            alt={testimonial.client_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.parentElement!.innerHTML = `<span class="text-white font-bold text-xl">${testimonial.client_name?.charAt(0) || 'C'}</span>`;
                            }}
                          />
                        ) : (
                          <span className="text-white font-bold text-xl">
                            {testimonial.client_name?.charAt(0) || 'C'}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-white text-base sm:text-lg">
                          {testimonial.client_name}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {testimonial.company_name}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              // Empty state
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-400 text-lg">No testimonials available yet.</p>
                <p className="text-gray-500 mt-2">Client testimonials will appear here once they are added.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Review Form Modal */}
      <ReviewForm
        isOpen={isReviewFormOpen}
        onClose={() => setIsReviewFormOpen(false)}
        onSubmit={handleReviewSubmit}
      />

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 premium-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-100 mb-6 sm:mb-8 px-4">
              Let's work together to bring your ideas to life. Get in touch with us today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
              <Link
                to="/contact"
                className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all hover:scale-105 inline-flex items-center justify-center shadow-lg text-base sm:text-lg"
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link
                to="/about"
                className="border-2 border-white text-white hover:bg-white hover:text-purple-600 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all hover:scale-105 inline-flex items-center justify-center text-base sm:text-lg"
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
