"use client";
import React from "react";
import { cn } from "../../../lib/cn";

export const Navbar = ({ children, className }) => {
  return (
    <nav className={cn("w-full relative z-50 bg-glass-bg-nav backdrop-blur-md border-b border-glass-border/50", className)}>
      {children}
    </nav>
  );
};
