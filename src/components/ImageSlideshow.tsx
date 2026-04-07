import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
}

interface ImageSlideshowProps {
  slides: Slide[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
  loading?: boolean;
}

const ImageSlideshow: React.FC<ImageSlideshowProps> = ({
  slides,
  autoPlay = true,
  interval = 5000,
  className = '',
  loading = false
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!autoPlay || !slides || slides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, slides?.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    if (!slides || slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    if (!slides || slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  if (loading) {
    return (
      <div className={`w-full h-64 sm:h-80 md:h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading slideshow...</p>
        </div>
      </div>
    );
  }

  if (!slides || slides.length === 0) {
    return (
      <div className={`w-full h-64 sm:h-80 md:h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">No slides available</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-64 sm:h-80 md:h-96 lg:h-[450px] rounded-2xl overflow-hidden ${className}`}>
      {/* Main Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {slides && slides[currentSlide] && slides[currentSlide].image ? (
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title || 'Slide image'}
              className="w-full h-full object-contain sm:object-cover"
              style={{
                objectPosition: 'center',
                backgroundColor: '#f3f4f6'
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/800x600/f3f4f6/6b7280?text=Image+Not+Available';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Image not available</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Slide Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 text-white"
          >
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">
              {slides[currentSlide]?.title || 'Untitled'}
            </h3>
            <p className="text-xs sm:text-sm lg:text-base text-gray-200 max-w-2xl">
              {slides[currentSlide]?.description || ''}
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full hover:bg-white/30 transition-all duration-200 z-20 touch-manipulation"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full hover:bg-white/30 transition-all duration-200 z-20 touch-manipulation"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 touch-manipulation ${
                index === currentSlide
                  ? 'w-8 h-2 bg-white'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/70'
              } rounded-full`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlideshow;
