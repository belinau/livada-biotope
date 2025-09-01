"use client";
import React, { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../../lib/cn";
import { useOutsideClick } from "../../../hooks/use-outside-click";

export const MobileNavMenu = ({ isOpen, onClose, children, className }) => {
  const menuRef = useRef(null);
  useOutsideClick(menuRef, onClose);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          className={cn("md:hidden bg-glass-bg-nav backdrop-blur-md overflow-hidden z-[90] border-t border-glass-border/50", className)}
        >
          <div className="flex flex-col px-4 pt-2 pb-4 space-y-2">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
