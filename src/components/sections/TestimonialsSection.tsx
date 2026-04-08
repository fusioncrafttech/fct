import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Edit3 } from 'lucide-react';
import type { Testimonial } from '@/types/global';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  testimonialsLoading: boolean;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials, testimonialsLoading }) => {
  return (
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
  );
};

export default TestimonialsSection;
