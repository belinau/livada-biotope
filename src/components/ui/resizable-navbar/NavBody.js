"use client";
import React from "react";
import { cn } from "../../../lib/cn";

export const NavBody = ({ children, className }) => {
  return (
    <div className={cn("container mx-auto px-4 py-3 flex justify-between items-center", className)}>
      {children}
    </div>
  );
};
