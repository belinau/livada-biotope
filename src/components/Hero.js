import React from 'react';
import { motion } from 'framer-motion';

const Hero = ({ title, subtitle, language = 'sl', children }) => {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Glassmorphic hero card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`relative z-10 text-center max-w-4xl mx-4 p-8 md:p-12 bg-gradient-to-b from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)] backdrop-blur-sm border border-[var(--glass-border)] rounded-3xl shadow-xl`}
      >
        <motion.h1 
          className="heading-organic text-4xl md:text-6xl bg-gradient-to-r from-[var(--primary)] to-[var(--text-orange)] bg-clip-text text-transparent mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {title}
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl text-text-muted mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {subtitle}
        </motion.p>
        
        {children && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {children}
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center"
        >
          <div className="w-24 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--text-orange)] rounded-full"></div>
        </motion.div>
      </motion.div>
      
    </div>
  );
};

export default Hero;
