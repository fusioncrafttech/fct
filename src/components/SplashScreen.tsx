import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Updated timing for premium animations: 1.2 (logo) + 1.0 (text) + 0.8 (loading) + 2.0 (display) + 0.8 (fade out)
    const totalDisplayTime = 3500; // 5.5 seconds total for premium experience
    const fadeOutDuration = 800; // 0.8 seconds fade out for smoother transition
    
    // Start fade out after full display time
    const visibilityTimer = setTimeout(() => {
      setIsVisible(false);
    }, totalDisplayTime);

    // Call onComplete after fade out completes
    const completionTimer = setTimeout(() => {
      onComplete();
    }, totalDisplayTime + fadeOutDuration);

    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(completionTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.8, ease: "easeInOut" }
      }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex items-center justify-center hero-gradient"
    >
      {/* Premium animated background with particles */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20"></div>
        
        {/* Animated particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Premium floating shapes with enhanced effects */}
        <motion.div
          className="floating-shape w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96"
          style={{ 
            top: '10%', 
            left: '10%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 70%)',
            filter: 'blur(60px)'
          }}
          animate={{ 
            x: [0, 60, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="floating-shape w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80"
          style={{ 
            bottom: '10%', 
            right: '10%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 70%)',
            filter: 'blur(60px)'
          }}
          animate={{ 
            x: [0, -60, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="floating-shape w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64"
          style={{ 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0.1) 50%, transparent 70%)',
            filter: 'blur(60px)'
          }}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.8, 0.4],
            rotate: [0, 180, 360],
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Light rays effect */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(255,255,255,0.1) 60deg, transparent 120deg, rgba(255,255,255,0.1) 180deg, transparent 240deg, rgba(255,255,255,0.1) 300deg, transparent 360deg)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Premium logo animation with glow effects */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 1.2,
          ease: "easeOut",
          type: "spring",
          stiffness: 100
        }}
        className="relative z-10 text-center"
      >
        {/* Logo container with premium effects */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 mx-auto mb-6 sm:mb-8 relative"
        >
          {/* Glow effect */}
          <motion.div 
            className="absolute inset-0 rounded-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 70%)',
              filter: 'blur(20px)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Premium gradient background */}
          <div className="absolute inset-0 premium-gradient rounded-3xl opacity-30 blur-xl"></div>
          
          {/* Logo image */}
          <div className="relative z-10 w-full h-full rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <img 
              src="/FCT Logo.webp" 
              alt="Fusioncrafttech Logo" 
              className="w-3/4 h-3/4 object-contain drop-shadow-2xl"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = '<span class="text-white font-bold text-2xl sm:text-3xl lg:text-4xl">FCT</span>';
              }}
            />
          </div>
        </motion.div>
        
        {/* Premium title with enhanced effects */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1,
            delay: 0.5,
            ease: "easeOut",
            type: "spring",
            stiffness: 100
          }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-3 sm:mb-4"
        >
          <span className="inline-block">
            <span className="gradient-text drop-shadow-2xl">Fusioncrafttech</span>
            {/* Subtle underline effect */}
            <motion.div 
              className="h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent mt-2"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1, delay: 1, ease: "easeOut" }}
            />
          </span>
        </motion.h1>
        
        {/* Enhanced subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            delay: 0.8,
            ease: "easeOut"
          }}
          className="text-base sm:text-lg lg:text-xl text-gray-200 font-light tracking-wide mb-8 sm:mb-10"
        >
          <span className="inline-block">
            Premium Development Solutions
            {/* Decorative dots */}
            <span className="inline-flex items-center gap-2 ml-2">
              <span className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></span>
              <span className="w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-75"></span>
              <span className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse delay-150"></span>
            </span>
          </span>
        </motion.p>

        {/* Premium loading animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: 0.8,
            delay: 1.2,
            ease: "easeOut"
          }}
          className="flex flex-col items-center space-y-4"
        >
          {/* Enhanced loading dots */}
          <div className="flex justify-center space-x-2 sm:space-x-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.4, 1, 0.4],
                  borderRadius: ['50%', '30%', '50%'],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
                className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-blue-400 to-purple-400 shadow-lg shadow-blue-400/50"
              />
            ))}
          </div>
          
          {/* Loading text with fade effect */}
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-xs sm:text-sm text-gray-300 font-medium tracking-widest uppercase"
          >
            Initializing
          </motion.div>
          
          {/* Progress bar */}
          <div className="w-32 sm:w-40 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.5, delay: 1.5, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
        
        
      </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
