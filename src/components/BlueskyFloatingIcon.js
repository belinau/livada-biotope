import React, { useState, useRef } from 'react';
import { cn } from '../lib/cn';
import SparklesEffect from './SparklesEffect';

const BlueskyFloatingIcon = ({ className }) => {
  const [showSparkles, setShowSparkles] = useState(false);
  const [showUsername, setShowUsername] = useState(false);
  const iconRef = useRef(null);

  const handleClick = () => {
    // Open Bluesky profile in new tab
    window.open('https://bsky.app/profile/livada.bio', '_blank');
  };

  const handleMouseEnter = () => {
    setShowSparkles(true);
    // Show username after a short delay to let sparkles appear first
    setTimeout(() => {
      setShowUsername(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    setShowSparkles(false);
    setShowUsername(false);
  };

  return (
    <>
      <div 
        ref={iconRef}
        className={cn(
          "fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:block",
          "bg-gradient-to-b from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)]",
          "border border-[var(--glass-border)] backdrop-blur-sm",
          "rounded-full w-16 h-16 flex items-center justify-center",
          "cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-xl",
          "shadow-lg",
          className
        )}
        style={{ 
          animation: 'float 12s ease-in-out infinite',
          willChange: 'transform'
        }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Official Bluesky Icon - always visible */}
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 64 64" 
          xmlns="http://www.w3.org/2000/svg"
          className="transition-opacity duration-300"
        >
          <path 
            fill="#0085ff" 
            d="M13.873 3.805C21.21 9.332 29.103 20.537 32 26.55v15.882c0-.338-.13.044-.41.867-1.512 4.456-7.418 21.847-20.923 7.944-7.111-7.32-3.819-14.64 9.125-16.85-7.405 1.264-15.73-.825-18.014-9.015C1.12 23.022 0 8.51 0 6.55 0-3.268 8.579-.182 13.873 3.805ZM50.127 3.805C42.79 9.332 34.897 20.537 32 26.55v15.882c0-.338.13.044.41.867 1.512 4.456 7.418 21.847 20.923 7.944 7.111-7.32 3.819-14.64-9.125-16.85 7.405 1.264 15.73-.825 18.014-9.015C62.88 23.022 64 8.51 64 6.55c0-9.818-8.578-6.732-13.873-2.745Z"
          />
        </svg>
        
        {/* Username text that appears after sparkles */}
        <span 
          className={cn(
            "absolute inset-0 flex items-center justify-center text-[var(--primary)] font-bold bluesky-username",
            "transition-all duration-500",
            showUsername ? "opacity-100 scale-100" : "opacity-0 scale-90"
          )}
        >
          @livada.bio
        </span>
      </div>
      <SparklesEffect isActive={showSparkles} iconRef={iconRef} />
    </>
  );
};

export default BlueskyFloatingIcon;