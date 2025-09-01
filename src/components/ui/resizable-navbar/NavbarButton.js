"use client";
import React from "react";
import { cn } from "../../../lib/cn";

export const NavbarButton = ({ children, className, variant, ...props }) => {
  const baseClasses = "px-4 py-2 rounded-lg font-semibold transition-all duration-300";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark",
    secondary: "bg-transparent text-sage border border-primary hover:bg-primary/10 hover:text-primary",
  };

  return (
    <button className={cn(baseClasses, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};
