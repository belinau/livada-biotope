"use client";
import React from "react";
import { cn } from "../../../lib/cn";

export const MobileNav = ({ children, className }) => {
  return (
    <div className={cn("md:hidden flex items-center", className)}>
      {children}
    </div>
  );
};
