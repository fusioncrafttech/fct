import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Monitor, Smartphone, Palette, Cloud } from 'lucide-react';

interface Service {
  title: string;
  description: string;
  icon: any;
  color: string;
}

const ServicesSection: React.FC = () => {
  const services: Service[] = [
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
                  aria-label="Learn more about our services"
                >
                  Learn more about our services
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
