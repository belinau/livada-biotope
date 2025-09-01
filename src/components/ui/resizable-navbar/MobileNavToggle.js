"use client";
import React from "react";
import { cn } from "../../../lib/cn";

export const MobileNavToggle = ({ isOpen, onClick, className }) => {
  return (
    <button 
      onClick={onClick} 
      className={cn("text-sage hover:text-primary focus:outline-none", className)}
      aria-label="Toggle navigation"
      aria-expanded={isOpen}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16"}></path>
      </svg>
    </button>
  );
};
