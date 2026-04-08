import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Zap, Shield, Globe } from 'lucide-react';
import { projectsService, testimonialsService, slideshowService } from '../../admin/services/supabase';
import type { Project, Testimonial } from '@/types/global';
import ImageSlideshow from '../../../components/ImageSlideshow';

// Lazy load below-fold sections
const ServicesSection = lazy(() => import('../../../components/sections/ServicesSection'));
const ProjectsSection = lazy(() => import('../../../components/sections/ProjectsSection'));
const TestimonialsSection = lazy(() => import('../../../components/sections/TestimonialsSection'));

// Define Slide interface to match ImageSlideshow component expectations
interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
}

const HomePage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
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

      {/* Services Preview Section - Lazy Loaded */}
      <Suspense fallback={<div className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">Loading services...</div></div>}>
        <ServicesSection />
      </Suspense>

      {/* Projects Preview Section - Lazy Loaded */}
      <Suspense fallback={<div className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-white to-gray-50"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">Loading projects...</div></div>}>
        <ProjectsSection projects={projects} />
      </Suspense>

      {/* Testimonials Section - Lazy Loaded */}
      <Suspense fallback={<div className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-indigo-100"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">Loading testimonials...</div></div>}>
        <TestimonialsSection testimonials={testimonials} testimonialsLoading={testimonialsLoading} />
      </Suspense>

      
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
                aria-label="Learn more about our company"
              >
                Learn More About Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
