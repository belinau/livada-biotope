import React, { useState, useRef } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { cn } from '../lib/cn';
import SparklesEffect from './SparklesEffect';

const BlueskyMobileIcon = ({ className }) => {
  const { t } = useTranslation();
  const [showSparkles, setShowSparkles] = useState(false);
  const iconRef = useRef(null);

  const handleClick = (e) => {
    e.preventDefault();
    // Open Bluesky profile in new tab
    window.open('https://bsky.app/profile/livada.bio', '_blank');
  };

  const handleMouseEnter = () => {
    setShowSparkles(true);
  };

  const handleMouseLeave = () => {
    setShowSparkles(false);
  };

  return (
    <>
      <a
        ref={iconRef}
        href="https://bsky.app/profile/livada.bio"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center justify-center",
          "bg-gradient-to-b from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)]",
          "border border-[var(--glass-border)] backdrop-blur-sm",
          "rounded-full min-w-[180px] w-auto",
          "cursor-pointer transition-all duration-300 hover:scale-105",
          "text-text-main hover:text-primary",
          "px-4 py-3",
          className
        )}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center justify-center w-full">
          {/* Official Bluesky Butterfly Icon */}
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 64 64" 
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 flex-shrink-0"
          >
            <path 
              fill="#0085ff" 
              d="M13.873 3.805C21.21 9.332 29.103 20.537 32 26.55v15.882c0-.338-.13.044-.41.867-1.512 4.456-7.418 21.847-20.923 7.944-7.111-7.32-3.819-14.64 9.125-16.85-7.405 1.264-15.73-.825-18.014-9.015C1.12 23.022 0 8.51 0 6.55 0-3.268 8.579-.182 13.873 3.805ZM50.127 3.805C42.79 9.332 34.897 20.537 32 26.55v15.882c0-.338.13.044.41.867 1.512 4.456 7.418 21.847 20.923 7.944 7.111-7.32 3.819-14.64-9.125-16.85 7.405 1.264 15.73-.825 18.014-9.015C62.88 23.022 64 8.51 64 6.55c0-9.818-8.578-6.732-13.873-2.745Z"
            />
          </svg>
          <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">{t('followOnBluesky')}</span>
        </div>
      </a>
      <SparklesEffect isActive={showSparkles} iconRef={iconRef} />
    </>
  );
};

export default BlueskyMobileIcon;
