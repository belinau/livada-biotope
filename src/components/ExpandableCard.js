"use client";

import React, { useEffect, useRef, useCallback } from "react";
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

  useEffect(() => {
    if (isExpanded) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      // Prevent body scroll when expanded
      document.body.style.overflow = "hidden";
      // Adjust for scrollbar width
      document.documentElement.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      // Always reset body styles when component unmounts
      document.body.style.overflow = "";
      document.documentElement.style.paddingRight = "";
    };
  }, [isExpanded, handleKeyDown, handleClickOutside]);

  const onTouchStart = (e) => {
    setTouchEnd(null); // Reset touch end coordinates
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
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

              {/* Vsebina razširjene kartice */}
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