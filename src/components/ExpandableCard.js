"use client";

import React, { useRef, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Portal from "./Portal";

const ExpandableCard = ({
  children,
  expandedContent,
  isExpanded,
  onToggle,
  onClose,
  layoutId,
  className = "",
  expandedClassName = "",
  closeOnBackdropClick = true,
  closeOnEscape = true,
  disableBackdrop = false,
  disableOverlayClose = false,
  motionProps = {},
  backdropProps = {},
  onSwipeLeft,
  onSwipeRight,
  onArrowLeft,
  onArrowRight,
}) => {
  const expandedRef = useRef(null);
  const [touchStart, setTouchStart] = React.useState(null);
  const [touchEnd, setTouchEnd] = React.useState(null);
  const minSwipeDistance = 50;

  // Handle outside clicks
  const handleClickOutside = useCallback((event) => {
    if (expandedRef.current && !expandedRef.current.contains(event.target) && isExpanded && !disableOverlayClose) {
      onToggle(false);
      if (onClose) onClose();
    }
  }, [isExpanded, onToggle, onClose, disableOverlayClose]);

  // Handle escape key and arrow keys
  const handleKeyDown = useCallback((event) => {
    if (!isExpanded) return;
    
    switch (event.key) {
      case "Escape":
        if (closeOnEscape && !disableOverlayClose) {
          onToggle(false);
          if (onClose) onClose();
        }
        break;
      case "ArrowLeft":
        event.preventDefault();
        if (onArrowLeft) onArrowLeft();
        break;
      case "ArrowRight":
        event.preventDefault();
        if (onArrowRight) onArrowRight();
        break;
      default:
        break;
    }
  }, [isExpanded, closeOnEscape, disableOverlayClose, onToggle, onClose, onArrowLeft, onArrowRight]);

  // Add event listeners for outside clicks and keydown events
  useEffect(() => {
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded, handleClickOutside, handleKeyDown]);

  // Touch handlers for swipe gestures
  const onTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const onTouchMove = (e) => {
    const touch = e.touches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || !isExpanded) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;

    // Check if the swipe is primarily horizontal
    if (Math.abs(distanceX) > Math.abs(distanceY) && Math.abs(distanceX) > minSwipeDistance) {
      const isLeftSwipe = distanceX > 0;
      
      if (isLeftSwipe && onSwipeLeft) {
        onSwipeLeft();
      } else if (!isLeftSwipe && onSwipeRight) {
        onSwipeRight();
      }
    }
  };

  return (
    <>
      {/* Osnovna kartica */}
      <motion.div
        layoutId={layoutId}
        className={className}
        onClick={() => onToggle(true)}
        style={{ cursor: 'pointer' }}
        {...motionProps}
      >
        {children}
      </motion.div>

      {/* Razširjena kartica (modal/pop-out) */}
      <Portal>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {/* Ozadje */}
              {!disableBackdrop && (
                <motion.div
                  className="absolute inset-0 bg-black/20 h-full w-full z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                      if (closeOnBackdropClick && !disableOverlayClose) {
                          onToggle(false);
                          if (onClose) onClose();
                      }
                  }}
                  {...backdropProps}
                />
              )}

              {/* Vsebina razširjene kartice - let GalleryExpandedContent handle its own styling */}
              <motion.div
                ref={expandedRef}
                layoutId={layoutId}
                className={`relative z-20 w-full max-w-4xl mx-auto ${expandedClassName}`}
                initial={{ 
                  opacity: 0,
                  scale: 0.9,
                  y: 20
                }}
                animate={{ 
                  opacity: 1,
                  scale: 1,
                  y: 0
                }}
                exit={{ 
                  opacity: 0,
                  scale: 0.9,
                  y: 20,
                  transition: { duration: 0.2 }
                }}
                transition={{ 
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                  duration: 0.4
                }}
              >
                {expandedContent}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
};

export default ExpandableCard;