"use client";
import React, { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../../lib/cn";
import { useOutsideClick } from "../../../hooks/use-outside-click";
import { getGlassVariant } from "../../glass-theme";

export const MobileNavMenu = ({ isOpen, onClose, children, className }) => {
  const menuRef = useRef(null);
  
  // Custom outside click handler that doesn't interfere with toggle button
  const handleOutsideClick = (event) => {
    // Check if the click is on the toggle button or its children
    const toggleButton = document.querySelector('[aria-label="Toggle navigation"]');
    if (toggleButton && (event.target === toggleButton || toggleButton.contains(event.target))) {
      return; // Don't close the menu if clicking the toggle button
    }
    
    onClose();
  };
  
  useOutsideClick(menuRef, handleOutsideClick);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(getGlassVariant('navbar'), "md:hidden overflow-hidden z-[90] border-t border-glass-border/50 absolute top-full left-0 right-0 bg-gradient-to-b from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)]", className)}
        >
          <div className="flex flex-col px-4 pt-2 pb-4 space-y-2">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
