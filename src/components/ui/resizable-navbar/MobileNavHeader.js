"use client";
import React from "react";
import { cn } from "../../../lib/cn";

export const MobileNavHeader = ({ children, className }) => {
  return (
    <div className={cn("flex items-center justify-between w-full", className)}>
      {children}
    </div>
  );
};
