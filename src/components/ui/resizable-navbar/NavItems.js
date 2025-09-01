"use client";
import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../../../lib/cn";

export const NavItems = ({ items, className }) => {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {items.map((item) => (
        <motion.div key={item.path}>
          <NavLink to={item.path} className={({ isActive }) => `nav-text relative px-4 py-2 text-sage transition-all duration-300 group text-interactive ${isActive ? 'text-primary font-semibold' : 'hover:text-primary'}`}>
            {({ isActive }) => (<> {item.label} <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-primary-light transform transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100 rounded-full`}/> </>)}
          </NavLink>
        </motion.div>
      ))}
    </div>
  );
};
