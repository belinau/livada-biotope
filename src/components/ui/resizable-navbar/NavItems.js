"use client";
import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../../../lib/cn";

export const NavItems = ({ items, className }) => {
  // Filter out home page for desktop navbar since logo links to home
  const desktopItems = items.filter(item => item.path !== '/');
  
  return (
    <div className={cn("hidden md:flex items-center gap-1", className)}>
      {desktopItems.map((item) => (
        <motion.div key={item.path}>
          <NavLink 
            to={item.path} 
            className={({ isActive }) => cn(
              "nav-text relative px-4 py-2 text-sage transition-all duration-300 group text-interactive flex items-center",
              isActive ? "bg-gradient-to-r from-[var(--primary)] to-[var(--text-orange)] bg-clip-text text-transparent font-semibold" : "hover:bg-gradient-to-r from-[var(--primary)] to-[var(--text-orange)] hover:bg-clip-text hover:text-transparent"
            )}
          >
            {({ isActive }) => (
              <>
                <span className="inline-block min-h-[24px] flex items-center">{item.label}</span>
                <span className={cn(
                  "absolute bottom-0 left-0 w-full h-0.5",
                  "bg-gradient-to-r from-primary to-primary-light",
                  "transform transition-transform duration-300",
                  isActive ? "scale-x-100" : "scale-x-0",
                  "group-hover:scale-x-100 rounded-full"
                )}/>
              </>
            )}
          </NavLink>
        </motion.div>
      ))}
    </div>
  );
};
