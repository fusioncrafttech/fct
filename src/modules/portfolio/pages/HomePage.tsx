import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Code, Zap, Shield, Globe, Monitor, Smartphone, Palette, Cloud, Edit3 } from 'lucide-react';
import { projectsService, testimonialsService, slideshowService } from '../../admin/services/supabase';
import type { Project, Testimonial } from '@/types/global';
import ImageSlideshow from '../../../components/ImageSlideshow';

// Define Slide interface to match ImageSlideshow component expectations
interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
}

const HomePage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'E-Commerce Platform',
      description: 'A modern, scalable e-commerce solution with real-time inventory management and secure payment processing.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=225&fit=crop&crop=center&auto=format',
      tech_stack: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      category: 'Web Development',
      featured: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Mobile Banking App',
      description: 'Secure and intuitive mobile banking application with biometric authentication and real-time transactions.',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=225&fit=crop&crop=center&auto=format',
      tech_stack: ['React Native', 'Firebase', 'Node.js', 'JWT'],
      category: 'Mobile Development',
      featured: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Analytics Dashboard',
      description: 'Comprehensive business analytics dashboard with real-time data visualization and reporting capabilities.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop&crop=center&auto=format',
      tech_stack: ['Vue.js', 'Python', 'PostgreSQL', 'D3.js'],
      category: 'Data Analytics',
      featured: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [slideshowSlides, setSlideshowSlides] = useState<Slide[]>([
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1920&h=1080&fit=crop&crop=center&auto=format',
      title: 'Web Development',
      description: 'Modern, responsive web applications built with cutting-edge technologies'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1920&h=1080&fit=crop&crop=center&auto=format',
      title: 'Mobile Solutions',
      description: 'Native and cross-platform mobile apps for iOS and Android'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1559028012-c72e03b6c9c0?w=1920&h=1080&fit=crop&crop=center&auto=format',
      title: 'Cloud Architecture',
      description: 'Scalable cloud solutions and infrastructure management'
    }
  ]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
    fetchTestimonials();
    fetchSlideshow();
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

  const fetchSlideshow = async () => {
    try {
      const data = await slideshowService.getAll();
      console.log('Raw slideshow data:', data);
      
      // Only replace default slides if there's actual data from API
      if (data && data.length > 0) {
        // Transform Slideshow data to match Slide interface expected by ImageSlideshow
        const transformedSlides = data.map((slide, index) => ({
          id: index + 1, // Convert to number as expected by Slide interface
          image: slide.image,
          title: slide.title,
          description: slide.description || ''
        }));
        console.log('Transformed slides:', transformedSlides);
        setSlideshowSlides(transformedSlides);
      }
      // If no data, keep the beautiful default slides
    } catch (error) {
      console.error('Failed to fetch slideshow:', error);
      // Keep default slides on error
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-100">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="floating-shape w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10"
            style={{ top: '10%', left: '10%' }}
            animate={{ 
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="floating-shape w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-gradient-to-r from-indigo-400/10 to-blue-400/10"
            style={{ bottom: '10%', right: '10%' }}
            animate={{ 
              x: [0, -50, 0],
              y: [0, 30, 0],
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="floating-shape w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10"
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
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
              >
                Premium Full Stack
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Development Solutions</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-base sm:text-lg lg:text-xl text-gray-700 mb-6 sm:mb-8 max-w-2xl"
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
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-base sm:text-lg"
                  aria-label="View Portfolio"
                >
                  View Portfolio
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 font-semibold rounded-xl border-2 border-blue-600 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-base sm:text-lg"
                  aria-label="Contact Me"
                >
                  Contact Us
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Right Slideshow */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <ImageSlideshow 
                slides={slideshowSlides}
                autoPlay={true}
                interval={4000}
                className="glass-card p-1 sm:p-2 md:p-3 rounded-2xl sm:rounded-3xl"
              />
            </motion.div>
          </div>
          
          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-20 sm:mt-24 lg:mt-32 mb-12 sm:mb-16 lg:mb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 lg:p-10 text-center group hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 hover:border-blue-300 relative overflow-hidden"
              >
                {/* Background gradient effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                
                {/* Icon container with enhanced styling */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-6 sm:mb-8 lg:mb-10 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl group-hover:shadow-blue-500/25">
                  <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white drop-shadow-sm" />
                </div>
                
                {/* Text content with better spacing */}
                <div className="relative z-10">
                  <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-5 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>

                {/* Decorative element */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              We offer comprehensive digital solutions to help your business thrive in the modern world
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:border-blue-200"
              >
                <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                  {React.createElement(service.icon, { className: "w-8 h-8 sm:w-10 sm:h-10 text-white" })}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed flex-grow">
                  {service.description}
                </p>
                <div className="mt-auto">
                  <Link
                    to="/services"
                    className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors text-sm sm:text-base"
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
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Recent Projects
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
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
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:border-blue-200"
              >
                <div className="aspect-video bg-gray-100 overflow-hidden relative">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/400x225/f3f4f6/6b7280?text=Project+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <span className="text-gray-500 text-sm font-medium">
                        No Image
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-4 sm:p-6 flex flex-col h-full">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed flex-grow">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                    {project.tech_stack?.map((tech: string, techIndex: number) => (
                      <span
                        key={techIndex}
                        className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 text-xs sm:text-sm font-medium rounded-full hover:bg-blue-200 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto">
                    <Link
                      to="/projects"
                      className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors text-sm sm:text-base"
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
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-base sm:text-lg"
            >
              View All Projects
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Don't just take our word for it - hear from our satisfied clients
            </p>
            
            {/* Write a Review Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6"
            >
              <Link
                to="/review"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg border border-blue-600 hover:border-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Write a Review
              </Link>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonialsLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 h-full flex flex-col animate-pulse"
                >
                  <div className="flex mb-6">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-6 h-6 bg-gray-300 rounded-full mr-1" />
                    ))}
                  </div>
                  <div className="flex-grow">
                    <div className="h-20 bg-gray-300 rounded mb-8"></div>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
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
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:border-blue-200 h-full flex flex-col"
                >
                  <div className="flex-grow">
                    <div className="flex mb-6">
                      {[...Array(testimonial.rating || 0)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 sm:mb-8 italic text-base sm:text-lg leading-relaxed">
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

      
      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600">
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
