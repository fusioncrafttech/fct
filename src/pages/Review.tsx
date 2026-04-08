import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { testimonialsService } from '../modules/admin/services/supabase';

const ReviewPage: React.FC = () => {
  const [formData, setFormData] = useState({
    client_name: '',
    company_name: '',
    review_text: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Update page title
    document.title = 'Submit Review | Fusioncrafttech';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Share your experience working with Fusioncrafttech digital solutions.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Share your experience working with Fusioncrafttech digital solutions.';
      document.head.appendChild(meta);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await testimonialsService.create(formData);
      setSubmitStatus('success');
      
      // Store in localStorage as backup
      const reviews = JSON.parse(localStorage.getItem('fct_reviews') || '[]');
      reviews.push({
        ...formData,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      });
      localStorage.setItem('fct_reviews', JSON.stringify(reviews));
      
      // Reset form after delay
      setTimeout(() => {
        setFormData({
          client_name: '',
          company_name: '',
          review_text: '',
          rating: 5
        });
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Failed to submit review:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  const containerVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    in: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <div className="text-sm text-gray-500">
              Fusioncrafttech Review Form
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        initial="initial"
        animate="in"
        variants={containerVariants}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="max-w-2xl mx-auto">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Share Your Experience
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We value your feedback! Help us improve by sharing your experience working with Fusioncrafttech digital solutions.
            </p>
          </motion.div>

          {/* Review Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            <div className="p-8 sm:p-12">
              {/* Success Message */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl"
                >
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                    <p className="text-green-800 text-center font-medium">
                      Thank you for your review! It has been submitted successfully.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl"
                >
                  <p className="text-red-800 text-center font-medium">
                    Something went wrong. Please try again or contact us directly.
                  </p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name Input */}
                <div>
                  <label htmlFor="reviewer-name" className="block text-sm font-semibold text-gray-700 mb-3">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="reviewer-name"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    required
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                    placeholder="John Doe"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Company Name Input */}
                <div>
                  <label htmlFor="reviewer-company" className="block text-sm font-semibold text-gray-700 mb-3">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="reviewer-company"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                    placeholder="Acme Inc."
                    disabled={isSubmitting}
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Rating *
                  </label>
                  <div className="flex justify-center space-x-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(star)}
                        className="p-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                        disabled={isSubmitting}
                      >
                        <Star
                          className={`w-10 h-10 ${
                            star <= formData.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          } transition-colors duration-200`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-2">
                    {formData.rating === 5 ? 'Excellent!' : 
                     formData.rating === 4 ? 'Very Good' :
                     formData.rating === 3 ? 'Good' :
                     formData.rating === 2 ? 'Fair' : 'Poor'}
                  </p>
                </div>

                {/* Review Text */}
                <div>
                  <label htmlFor="review-text" className="block text-sm font-semibold text-gray-700 mb-3">
                    Your Review *
                  </label>
                  <textarea
                    id="review-text"
                    value={formData.review_text}
                    onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg resize-none"
                    placeholder="Tell us about your experience working with Fusioncrafttech..."
                    disabled={isSubmitting}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {formData.review_text.length}/500 characters
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || submitStatus === 'success'}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Submitting...
                      </>
                    ) : submitStatus === 'success' ? (
                      <>
                        <CheckCircle className="w-5 h-5 mr-3" />
                        Submitted Successfully
                      </>
                    ) : (
                      <>
                        Submit Review
                        <Send className="ml-3 w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Additional Info */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="text-center text-gray-500 text-sm">
                  <p className="mb-2">
                    Your review helps us improve our services and assists other clients in making informed decisions.
                  </p>
                  <p>
                    By submitting this review, you agree that it may be displayed on our website and marketing materials.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Back to Home Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mt-8"
          >
            <Link
              to="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Homepage
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReviewPage;
