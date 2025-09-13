"use client";
import React from "react";
import { cn } from "../../../lib/cn";
import { getGlassVariant } from "../../glass-theme";

export const Navbar = ({ children, className }) => {
  return (
    <nav className={cn(getGlassVariant('navbar'), "w-full sticky top-0 z-50 border-b border-[var(--glass-border)] bg-gradient-to-b from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)]", className)}>
      {children}
    </nav>
  );
};
